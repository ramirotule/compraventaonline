import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SellerTier } from '@prisma/client';

@Injectable()
export class ReputationService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.seller.update({
      where: { id: sellerId },
      data: {
        score: newScore,
        tier: newTier,
      },
    });
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
