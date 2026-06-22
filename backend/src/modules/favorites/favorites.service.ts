import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavorite(userId: string, listingId: string) {
    // 1. Fetch listing details to cache
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        product: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const cachedTitle = listing.product.name;
    const cachedImage = listing.images[0] || listing.product.images[0] || null;

    // 2. Create or find favorite
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        listingId,
        cachedTitle,
        cachedImage,
      },
    });
  }

  async removeFavoriteByListingId(userId: string, listingId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Favorito no encontrado');
    }

    return this.prisma.favorite.delete({
      where: {
        id: existing.id,
      },
    });
  }

  async removeFavoriteById(userId: string, id: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Favorito no encontrado');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('No tenés permisos para eliminar este favorito');
    }

    return this.prisma.favorite.delete({
      where: { id },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
            seller: true,
            currency: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async isFavorite(userId: string, listingId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });
    return !!favorite;
  }
}
