import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SellerTier, RewardType } from '@prisma/client';
import { RewardsService } from '../rewards/rewards.service';

@Injectable()
export class ReputationService {
  constructor(
    private prisma: PrismaService,
    private rewardsService: RewardsService,
  ) {}

  async adjustScore(sellerId: string, points: number) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    // Calcular nuevo score acotado entre 0 y 100
    let newScore = seller.score + points;
    if (newScore > 100) newScore = 100;
    if (newScore < 0) newScore = 0;

    // Calcular nuevo tier según escala
    let newTier: SellerTier = SellerTier.BRONCE;
    if (newScore >= 90) {
      newTier = SellerTier.PREMIUM;
    } else if (newScore >= 70) {
      newTier = SellerTier.ORO;
    } else if (newScore >= 40) {
      newTier = SellerTier.PLATA;
    }

    const updatedSeller = await this.prisma.seller.update({
      where: { id: sellerId },
      data: {
        score: newScore,
        tier: newTier,
      },
    });

    // Validar si hay ascenso de nivel para otorgar premios
    const tierLevels = {
      [SellerTier.BRONCE]: 1,
      [SellerTier.PLATA]: 2,
      [SellerTier.ORO]: 3,
      [SellerTier.PREMIUM]: 4,
    };

    if (tierLevels[newTier] > tierLevels[seller.tier]) {
      if (newTier === SellerTier.PLATA) {
        await this.rewardsService.grantReward(sellerId, RewardType.FREE_FEATURED_HIGHLIGHT);
        await this.rewardsService.grantReward(sellerId, RewardType.COMMISSION_DISCOUNT_5);
      } else if (newTier === SellerTier.ORO) {
        await this.rewardsService.grantReward(sellerId, RewardType.FREE_FEATURED_HIGHLIGHT);
        await this.rewardsService.grantReward(sellerId, RewardType.COMMISSION_DISCOUNT_10);
      } else if (newTier === SellerTier.PREMIUM) {
        await this.rewardsService.grantReward(sellerId, RewardType.FREE_PREMIUM_HIGHLIGHT);
        await this.rewardsService.grantReward(sellerId, RewardType.COMMISSION_DISCOUNT_10);
      }
    }

    return updatedSeller;
  }

  async recordCompletedSale(sellerId: string) {
    return this.adjustScore(sellerId, 10);
  }

  async recordPositiveRating(sellerId: string) {
    return this.adjustScore(sellerId, 5);
  }

  async recordNegativeRating(sellerId: string) {
    return this.adjustScore(sellerId, -15);
  }

  async applyFraudPenalization(sellerId: string) {
    // Penalización total: score a 0 y degradación a BRONCE
    return this.prisma.seller.update({
      where: { id: sellerId },
      data: {
        score: 0,
        tier: SellerTier.BRONCE,
      },
    });
  }
}
