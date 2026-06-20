import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { CreateAdDto } from './dto/create-ad.dto';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  async createHighlight(dto: CreateHighlightDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });

    if (!listing) {
      throw new NotFoundException('La publicación especificada no existe');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + dto.durationDays);

    const highlight = await this.prisma.highlightedProduct.create({
      data: {
        listingId: dto.listingId,
        plan: dto.plan,
        startDate,
        endDate,
      },
    });

    // Actualizar el plan destacado de la publicación
    await this.prisma.listing.update({
      where: { id: dto.listingId },
      data: { featuredPlan: dto.plan },
    });

    return highlight;
  }

  async getHighlights() {
    const now = new Date();
    return this.prisma.highlightedProduct.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        listing: {
          include: {
            product: {
              include: { category: true },
            },
            seller: true,
          },
        },
      },
    });
  }

  async createAd(dto: CreateAdDto) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + dto.durationDays);

    return this.prisma.advertisement.create({
      data: {
        advertiserName: dto.advertiserName,
        type: dto.type,
        imageUrl: dto.imageUrl,
        targetUrl: dto.targetUrl,
        active: true,
        startDate,
        endDate,
      },
    });
  }

  async getActiveAds() {
    const now = new Date();
    return this.prisma.advertisement.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
  }
}
