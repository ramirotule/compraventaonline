import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AcceptTermsDto } from './dto/accept-terms.dto';

@Injectable()
export class LegalService {
  constructor(private prisma: PrismaService) {}

  async acceptTerms(userId: string, dto: AcceptTermsDto) {
    return this.prisma.termsAcceptance.create({
      data: {
        userId,
        acceptedTerms: dto.acceptedTerms,
        version: dto.version,
      },
    });
  }

  async getLatestAcceptance(userId: string) {
    return this.prisma.termsAcceptance.findFirst({
      where: { userId },
      orderBy: { acceptedDate: 'desc' },
    });
  }
}
