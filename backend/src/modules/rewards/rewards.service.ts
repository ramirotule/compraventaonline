import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RewardType, FeaturedPlan } from '@prisma/client';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async grantReward(sellerId: string, type: RewardType, durationDays = 30) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    return this.prisma.sellerReward.create({
      data: {
        sellerId,
        type,
        claimed: false,
        expiresAt,
      },
    });
  }

  async getSellerRewards(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new NotFoundException('Perfil de vendedor no encontrado');
    }

    return this.prisma.sellerReward.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async claimHighlightReward(userId: string, rewardId: string, listingId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new NotFoundException('Perfil de vendedor no encontrado');
    }

    const reward = await this.prisma.sellerReward.findFirst({
      where: { id: rewardId, sellerId: seller.id },
    });

    if (!reward) {
      throw new NotFoundException('Recompensa no encontrada o no pertenece a este vendedor');
    }

    if (reward.claimed) {
      throw new BadRequestException('Esta recompensa ya fue reclamada');
    }

    if (reward.expiresAt && reward.expiresAt < new Date()) {
      throw new BadRequestException('Esta recompensa ha expirado');
    }

    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (listing.sellerId !== seller.id) {
      throw new ForbiddenException('La publicación no pertenece a tu perfil de vendedor');
    }

    // Mapeo del tipo de recompensa a plan de destacado
    let featuredPlan: FeaturedPlan;
    if (reward.type === RewardType.FREE_FEATURED_HIGHLIGHT) {
      featuredPlan = FeaturedPlan.FEATURED;
    } else if (reward.type === RewardType.FREE_PREMIUM_HIGHLIGHT) {
      featuredPlan = FeaturedPlan.PREMIUM;
    } else {
      throw new BadRequestException('Este tipo de recompensa no se puede canjear como destacado');
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 días de duración

    return this.prisma.$transaction(async (tx) => {
      // 1. Marcar recompensa como reclamada
      const updatedReward = await tx.sellerReward.update({
        where: { id: rewardId },
        data: {
          claimed: true,
          claimedAt: now,
        },
      });

      // 2. Crear el destacado
      const highlight = await tx.highlightedProduct.create({
        data: {
          listingId,
          plan: featuredPlan,
          startDate: now,
          endDate: endDate,
        },
      });

      // 3. Actualizar el plan en la publicación principal
      await tx.listing.update({
        where: { id: listingId },
        data: {
          featuredPlan: featuredPlan,
        },
      });

      return {
        reward: updatedReward,
        highlight,
      };
    });
  }
}
