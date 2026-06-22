import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingStatus, FeaturedPlan, Condition } from '@prisma/client';
import { ModerationService } from '../moderation/moderation.service';
import { parseCsv, CsvRow } from './utils/csv-parser';

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private moderationService: ModerationService,
  ) {}

  async create(userId: string, dto: CreateListingDto) {
    // Verificar si el usuario es vendedor
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new ForbiddenException('Debes registrarte como vendedor antes de publicar un artículo');
    }

    // Verificar si el producto existe en el catálogo global
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('El producto del catálogo especificado no existe');
    }

    // RN-02: Control de límites de publicaciones activas
    const activeCount = await this.prisma.listing.count({
      where: {
        sellerId: seller.id,
        status: { in: [ListingStatus.APPROVED, ListingStatus.REVIEW_REQUIRED] },
      },
    });

    if (seller.type === 'PERSONAL_SELLER' && activeCount >= 5) {
      throw new BadRequestException('Límite alcanzado: Los vendedores particulares solo pueden tener hasta 5 publicaciones activas de forma simultánea.');
    }

    // Moderación automática (RN-03 preventiva) utilizando ModerationService
    const status = await this.moderationService.moderateText(product.name, product.description);

    let currencyId = dto.currencyId;
    if (!currencyId) {
      const defaultCurrency = await this.prisma.currency.findUnique({
        where: { code: 'ARS' },
      });
      if (defaultCurrency) {
        currencyId = defaultCurrency.id;
      }
    }

    return this.prisma.listing.create({
      data: {
        productId: dto.productId,
        sellerId: seller.id,
        price: dto.price,
        condition: dto.condition,
        stock: dto.stock,
        status,
        featuredPlan: dto.featuredPlan || FeaturedPlan.FREE,
        images: dto.images || [],
        currencyId,
      },
      include: {
        product: {
          include: { category: true },
        },
        seller: true,
        currency: true,
      },
    });
  }

  async findListings(filters: {
    productId?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: 'NEW' | 'USED';
    q?: string;
    sort?: 'price_asc' | 'price_desc' | 'relevance';
    sellerId?: string;
  }) {
    const whereClause: any = {
      status: ListingStatus.APPROVED,
    };

    if (filters.productId) {
      whereClause.productId = filters.productId;
    }

    if (filters.condition) {
      whereClause.condition = filters.condition;
    }

    if (filters.sellerId) {
      whereClause.sellerId = filters.sellerId;
      // Los vendedores pueden ver sus publicaciones en cualquier estado (aprobadas, pendientes, etc.)
      delete whereClause.status;
    }

    if (filters.minPrice || filters.maxPrice) {
      whereClause.price = {};
      if (filters.minPrice) {
        whereClause.price.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        whereClause.price.lte = filters.maxPrice;
      }
    }

    if (filters.q) {
      whereClause.product = {
        OR: [
          { name: { contains: filters.q, mode: 'insensitive' } },
          { brand: { contains: filters.q, mode: 'insensitive' } },
        ],
      };
    }

    let orderBy: any = { createdAt: 'desc' }; // Por defecto ordenar por fecha
    if (filters.sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (filters.sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (filters.sort === 'relevance') {
      // Relevancia: primero las Premium y Featured, luego por score de vendedor
      orderBy = [
        { featuredPlan: 'desc' },
        { seller: { score: 'desc' } },
      ];
    }

    return this.prisma.listing.findMany({
      where: whereClause,
      include: {
        product: {
          include: { category: true },
        },
        seller: true,
        currency: true,
      },
      orderBy,
    });
  }

  async findListingById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        product: {
          include: { category: true },
        },
        seller: true,
        currency: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return listing;
  }

  async updateListingStock(userId: string, id: string, stock: number) {
    const listing = await this.findListingById(id);
    
    if (listing.seller.userId !== userId) {
      throw new ForbiddenException('No tenés permisos para modificar esta publicación');
    }

    if (stock < 0) {
      throw new BadRequestException('El stock no puede ser negativo');
    }

    return this.prisma.listing.update({
      where: { id },
      data: { stock },
    });
  }

  async bulkUpload(userId: string, fileBuffer: Buffer) {
    // 1. Verificar si el usuario es vendedor
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new ForbiddenException('Debes registrarte como vendedor antes de publicar artículos');
    }

    // 2. Parsear el CSV
    const csvText = fileBuffer.toString('utf-8');
    let rows: CsvRow[];
    try {
      rows = parseCsv(csvText);
    } catch (err) {
      throw new BadRequestException('Error al parsear el archivo CSV. Asegúrate de que tenga un formato válido.');
    }

    if (rows.length === 0) {
      throw new BadRequestException('El archivo CSV está vacío o no contiene filas de datos.');
    }

    // 3. RN-02: Control de límites de publicaciones activas para vendedores particulares
    const activeCount = await this.prisma.listing.count({
      where: {
        sellerId: seller.id,
        status: { in: [ListingStatus.APPROVED, ListingStatus.REVIEW_REQUIRED] },
      },
    });

    if (seller.type === 'PERSONAL_SELLER' && activeCount + rows.length > 5) {
      throw new BadRequestException(
        `Límite de publicaciones superado. Los vendedores particulares solo pueden tener hasta 5 publicaciones activas. ` +
        `Actualmente tenés ${activeCount} activas y estás intentando subir ${rows.length} nuevas (Total: ${activeCount + rows.length}).`
      );
    }

    // 4. Validar fila por fila
    const errors: string[] = [];
    const validatedData: Array<{
      productData: any;
      listingData: any;
    }> = [];

    // Cargar todas las categorías de una vez para optimizar búsquedas
    const dbCategories = await this.prisma.category.findMany();
    const categoriesMap = new Map(dbCategories.map(c => [c.slug.toLowerCase(), c]));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // Fila 1 es el header, por lo que la primera de datos es la fila 2

      const rowErrors: string[] = [];

      // Validar campos obligatorios
      if (!row.name) rowErrors.push(`El nombre del producto ('name') es obligatorio.`);
      if (!row.brand) rowErrors.push(`La marca ('brand') es obligatoria.`);
      if (!row.description) rowErrors.push(`La descripción ('description') es obligatoria.`);
      if (!row.category_slug) rowErrors.push(`El slug de la categoría ('category_slug') es obligatorio.`);
      if (!row.price) rowErrors.push(`El precio ('price') es obligatorio.`);
      if (!row.condition) rowErrors.push(`La condición ('condition') es obligatoria.`);
      if (!row.stock) rowErrors.push(`El stock ('stock') es obligatorio.`);

      if (rowErrors.length > 0) {
        errors.push(`Fila ${rowNum}: ${rowErrors.join(' ')}`);
        continue;
      }

      // Validar tipos
      const price = parseFloat(row.price || '');
      if (isNaN(price) || price <= 0) {
        rowErrors.push(`El precio debe ser un número positivo (recibido: '${row.price}').`);
      }

      const stock = parseInt(row.stock || '', 10);
      if (isNaN(stock) || stock < 1) {
        rowErrors.push(`El stock debe ser un número entero mayor o igual a 1 (recibido: '${row.stock}').`);
      }

      const cond = (row.condition || '').toUpperCase();
      if (cond !== 'NEW' && cond !== 'USED') {
        rowErrors.push(`La condición debe ser 'NEW' o 'USED' (recibido: '${row.condition}').`);
      }

      // Validar categoría
      const category = categoriesMap.get((row.category_slug || '').toLowerCase());
      if (!category) {
        rowErrors.push(`La categoría con slug '${row.category_slug}' no existe.`);
      }

      // Validar atributos de categoría si existe y tiene schema
      let parsedAttributes: Record<string, any> = {};
      if (category) {
        // Parsear atributos
        if (row.attributes) {
          try {
            const pairs = row.attributes.split(';');
            pairs.forEach(pair => {
              const eqIdx = pair.indexOf('=');
              if (eqIdx !== -1) {
                const k = pair.substring(0, eqIdx).trim();
                const v = pair.substring(eqIdx + 1).trim();
                if (k) parsedAttributes[k] = v;
              }
            });
          } catch (e) {
            rowErrors.push(`Formato de atributos inválido. Debe ser 'clave=valor;clave=valor'.`);
          }
        }

        // Sincronizar brand de primer nivel con los atributos de categoría
        if (row.brand && !parsedAttributes.brand) {
          parsedAttributes.brand = row.brand;
        }

        if (category.attributesSchema && typeof category.attributesSchema === 'object') {
          const schema = category.attributesSchema as any;
          if (schema.required && Array.isArray(schema.required)) {
            for (const reqField of schema.required) {
              const val = parsedAttributes[reqField];
              if (val === undefined || val === null || val === '') {
                rowErrors.push(`El atributo '${reqField}' es obligatorio para productos en la categoría '${category.name}'.`);
              } else {
                const propSchema = schema.properties?.[reqField];
                if (propSchema?.enum && Array.isArray(propSchema.enum)) {
                  // Si el valor debe ser un número en el esquema (ej. autos year), lo casteamos antes de validar enum o rango
                  const expectedType = propSchema.type;
                  let typedVal: any = val;
                  if (expectedType === 'number') {
                    typedVal = Number(val);
                    if (isNaN(typedVal)) {
                      rowErrors.push(`El atributo '${reqField}' debe ser un número válido.`);
                      continue;
                    }
                  }

                  if (propSchema.enum.includes(typedVal)) {
                    parsedAttributes[reqField] = typedVal; // guardar con tipo correcto
                  } else {
                    rowErrors.push(`El valor '${val}' para el atributo '${reqField}' no es válido. Opciones permitidas: ${propSchema.enum.join(', ')}.`);
                  }
                } else {
                  // Si no hay enum pero hay tipo number y/o límites
                  const expectedType = schema.properties?.[reqField]?.type;
                  if (expectedType === 'number') {
                    const numVal = Number(val);
                    if (isNaN(numVal)) {
                      rowErrors.push(`El atributo '${reqField}' debe ser un número válido.`);
                    } else {
                      parsedAttributes[reqField] = numVal;
                      const min = schema.properties?.[reqField]?.minimum;
                      const max = schema.properties?.[reqField]?.maximum;
                      if (min !== undefined && numVal < min) {
                        rowErrors.push(`El atributo '${reqField}' debe ser mayor o igual a ${min}.`);
                      }
                      if (max !== undefined && numVal > max) {
                        rowErrors.push(`El atributo '${reqField}' debe ser menor o igual a ${max}.`);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (rowErrors.length > 0) {
        errors.push(`Fila ${rowNum}: ${rowErrors.join(' ')}`);
        continue;
      }

      // Procesar imágenes
      let imagesArray: string[] = [];
      if (row.images) {
        imagesArray = row.images.split(';').map(url => url.trim()).filter(url => url !== '');
      }
      if (imagesArray.length === 0) {
        imagesArray = ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop'];
      }

      validatedData.push({
        productData: {
          name: row.name,
          description: row.description,
          brand: row.brand,
          categoryId: category!.id,
          images: imagesArray,
          attributes: parsedAttributes,
        },
        listingData: {
          price,
          condition: cond as Condition,
          stock,
          images: imagesArray,
          status: ListingStatus.REVIEW_REQUIRED,
        }
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Se encontraron errores de validación en el archivo CSV.',
        errors,
      });
    }

    // 5. Moderación e inserción en transacción
    const createdListings: any[] = [];
    
    await this.prisma.$transaction(async (tx) => {
      for (const item of validatedData) {
        const status = await this.moderationService.moderateText(item.productData.name, item.productData.description);
        
        const product = await tx.product.create({
          data: item.productData,
        });

        const listing = await tx.listing.create({
          data: {
            ...item.listingData,
            productId: product.id,
            sellerId: seller.id,
            status,
          },
          include: {
            product: {
              include: { category: true }
            }
          }
        });

        createdListings.push(listing);
      }
    });

    return {
      success: true,
      message: `Se crearon con éxito ${createdListings.length} publicaciones.`,
      count: createdListings.length,
      listings: createdListings,
    };
  }

  async deleteListing(userId: string, id: string) {
    const listing = await this.findListingById(id);
    if (listing.seller.userId !== userId) {
      throw new ForbiddenException('No tenés permisos para eliminar esta publicación');
    }
    return this.prisma.listing.delete({
      where: { id },
    });
  }

  async cloneListing(userId: string, id: string) {
    const original = await this.prisma.listing.findUnique({
      where: { id },
      include: { product: true, seller: true }
    });
    if (!original) {
      throw new NotFoundException('Publicación no encontrada');
    }
    if (original.seller.userId !== userId) {
      throw new ForbiddenException('No tenés permisos para clonar esta publicación');
    }

    // Crear un nuevo producto clonado
    const newProduct = await this.prisma.product.create({
      data: {
        name: `${original.product.name} (Copia)`,
        description: original.product.description,
        brand: original.product.brand,
        categoryId: original.product.categoryId,
        images: original.product.images,
        attributes: original.product.attributes ?? {},
      }
    });

    // Crear la publicación clonada
    return this.prisma.listing.create({
      data: {
        productId: newProduct.id,
        sellerId: original.sellerId,
        price: original.price,
        condition: original.condition,
        stock: original.stock,
        status: original.status,
        featuredPlan: original.featuredPlan,
        images: original.images,
      },
      include: {
        product: {
          include: { category: true }
        },
        seller: true
      }
    });
  }

  async updateListing(userId: string, id: string, data: {
    price?: number;
    stock?: number;
    condition?: Condition;
    name?: string;
    brand?: string;
    description?: string;
    categoryId?: string;
    featuredPlan?: FeaturedPlan;
    currencyId?: string;
    images?: string[];
    attributes?: Record<string, any>;
    status?: ListingStatus;
  }) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { product: true, seller: true }
    });
    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }
    if (listing.seller.userId !== userId) {
      throw new ForbiddenException('No tenés permisos para modificar esta publicación');
    }

    // Si hay datos del producto a actualizar
    if (data.name || data.brand || data.description || data.categoryId || data.images || data.attributes) {
      await this.prisma.product.update({
        where: { id: listing.productId },
        data: {
          name: data.name ?? undefined,
          brand: data.brand ?? undefined,
          description: data.description ?? undefined,
          categoryId: data.categoryId ?? undefined,
          images: data.images ?? undefined,
          attributes: data.attributes ?? undefined,
        }
      });
    }

    // Actualizar campos de la publicación
    return this.prisma.listing.update({
      where: { id },
      data: {
        price: data.price !== undefined ? data.price : undefined,
        stock: data.stock !== undefined ? data.stock : undefined,
        condition: data.condition ?? undefined,
        featuredPlan: data.featuredPlan ?? undefined,
        currencyId: data.currencyId ?? undefined,
        images: data.images ?? undefined,
        status: data.status ?? undefined,
      },
      include: {
        product: {
          include: { category: true }
        },
        seller: true,
        currency: true
      }
    });
  }

  async findAllCurrencies() {
    return this.prisma.currency.findMany();
  }
}

