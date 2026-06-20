import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('La categoría especificada no existe');
    }

    // Validar esquema de atributos de la categoría
    if (category.attributesSchema && typeof category.attributesSchema === 'object') {
      const schema = category.attributesSchema as any;
      if (schema.required && Array.isArray(schema.required)) {
        const attrs = dto.attributes || {};
        for (const reqField of schema.required) {
          if (attrs[reqField] === undefined || attrs[reqField] === null || attrs[reqField] === '') {
            throw new BadRequestException(
              `El atributo '${reqField}' es obligatorio para productos en la categoría '${category.name}'`
            );
          }
          // Si el esquema define opciones permitidas (enum), validarlas
          const propSchema = schema.properties?.[reqField];
          if (propSchema?.enum && Array.isArray(propSchema.enum)) {
            if (!propSchema.enum.includes(attrs[reqField])) {
              throw new BadRequestException(
                `El valor '${attrs[reqField]}' para el atributo '${reqField}' no es válido. Opciones permitidas: ${propSchema.enum.join(', ')}`
              );
            }
          }
        }
      }
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        brand: dto.brand,
        categoryId: dto.categoryId,
        images: dto.images || [],
        attributes: dto.attributes || {},
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: { subCategories: true },
    });
  }

  async findProducts(query?: string, categoryId?: string) {
    const whereClause: any = {};

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where: whereClause,
      include: { category: true },
    });
  }

  async findProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado en el catálogo');
    }

    return product;
  }
}
