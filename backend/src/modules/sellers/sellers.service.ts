import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellerTier } from '@prisma/client';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSellerDto) {
    // RN-01: Validar aceptación de términos
    const termsAcceptance = await this.prisma.termsAcceptance.findFirst({
      where: { userId },
      orderBy: { acceptedDate: 'desc' },
    });

    if (!termsAcceptance || !termsAcceptance.acceptedTerms) {
      throw new ForbiddenException('Debes aceptar los términos y condiciones antes de registrarte como vendedor');
    }

    // Validar si ya tiene un perfil de vendedor
    const existing = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Este usuario ya tiene un perfil de vendedor registrado');
    }

    return this.prisma.seller.create({
      data: {
        userId,
        type: dto.type,
        name: dto.name,
        documentNumber: dto.documentNumber,
        score: 100,
        tier: SellerTier.BRONCE,
      },
    });
  }

  async getReputation(sellerId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    // Devolver reputación. Como el módulo de transacciones es para expansión futura,
    // devolvemos contadores básicos simulados derivados del score actual.
    const isPremium = seller.tier === SellerTier.PREMIUM;
    return {
      seller_id: seller.id,
      name: seller.name,
      score: seller.score,
      tier: seller.tier,
      completed_sales: isPremium ? 50 : 5,
      positive_ratings: isPremium ? 48 : 4,
      negative_ratings: isPremium ? 2 : 1,
      badges: isPremium ? ['VENDEDOR_VERIFICADO', 'ENVIO_RAPIDO'] : ['VENDEDOR_VERIFICADO'],
    };
  }

  async findByUserId(userId: string) {
    return this.prisma.seller.findUnique({
      where: { userId },
    });
  }
}
