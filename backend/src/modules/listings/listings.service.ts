import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingStatus, FeaturedPlan } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

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

    // Moderación básica (RN-03 preventiva)
    let status: ListingStatus = ListingStatus.APPROVED;
    const forbiddenWords = ['droga', 'arma', 'cocaína', 'pistola', 'marihuana', 'falso'];
    const textToCheck = `${product.name} ${product.brand}`.toLowerCase();
    
    for (const word of forbiddenWords) {
      if (textToCheck.includes(word)) {
        status = ListingStatus.BLOCKED;
        break;
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
      },
      include: {
        product: {
          include: { category: true },
        },
        seller: true,
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

    return this.prisma.listing.update({
      where: { id },
      data: { stock },
    });
  }
}
