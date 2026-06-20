import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ListingStatus, ReportStatus } from '@prisma/client';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  /**
   * RN-03: Moderación automática basada en reglas de palabras clave
   */
  async moderateText(title: string, description: string): Promise<ListingStatus> {
    const textToCheck = `${title} ${description}`.toLowerCase();

    // Palabras prohibidas severas -> BLOCKED inmediatamente
    const blockedKeywords = [
      'droga', 'cocaína', 'marihuana', 'paco', 'arma', 'pistola',
      'revólver', 'munición', 'explotación', 'ilegal', 'falso', 'réplica'
    ];

    for (const word of blockedKeywords) {
      if (textToCheck.includes(word)) {
        return ListingStatus.BLOCKED;
      }
    }

    // Palabras sospechosas -> REVIEW_REQUIRED (moderación manual)
    const reviewKeywords = [
      'transferencia externa', 'por fuera', 'seña', 'anticipo',
      'enviar por whatsapp', 'cbu por privado', 'depósito previo'
    ];

    for (const word of reviewKeywords) {
      if (textToCheck.includes(word)) {
        return ListingStatus.REVIEW_REQUIRED;
      }
    }

    return ListingStatus.APPROVED;
  }

  async createReport(reporterUserId: string, dto: CreateReportDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });

    if (!listing) {
      throw new NotFoundException('La publicación a reportar no existe');
    }

    const report = await this.prisma.productReport.create({
      data: {
        reporterUserId,
        listingId: dto.listingId,
        reason: dto.reason,
        description: dto.description,
        status: ReportStatus.PENDING,
      },
    });

    // Si una publicación acumula 3 o más reportes pendientes, se oculta temporalmente
    const activeReports = await this.prisma.productReport.count({
      where: {
        listingId: dto.listingId,
        status: ReportStatus.PENDING,
      },
    });

    if (activeReports >= 3) {
      await this.prisma.listing.update({
        where: { id: dto.listingId },
        data: { status: ListingStatus.REVIEW_REQUIRED },
      });
    }

    return report;
  }

  async getPendingReports() {
    return this.prisma.productReport.findMany({
      where: { status: ReportStatus.PENDING },
      include: {
        listing: {
          include: { product: true },
        },
        user: true,
      },
    });
  }

  async resolveReport(reportId: string, action: 'APPROVE' | 'BLOCK') {
    const report = await this.prisma.productReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }

    const reportStatus = action === 'BLOCK' ? ReportStatus.RESOLVED_BLOCKED : ReportStatus.RESOLVED_APPROVED;
    
    await this.prisma.productReport.update({
      where: { id: reportId },
      data: { status: reportStatus },
    });

    // Si se decide bloquear, la publicación pasa a BLOCKED
    if (action === 'BLOCK') {
      await this.prisma.listing.update({
        where: { id: report.listingId },
        data: { status: ListingStatus.BLOCKED },
      });
    } else {
      // Si se aprueba (se descarta la denuncia), volvemos la publicación a APPROVED si no estaba bloqueada por otra cosa
      const activeReports = await this.prisma.productReport.count({
        where: {
          listingId: report.listingId,
          status: ReportStatus.PENDING,
        },
      });

      if (activeReports === 0) {
        await this.prisma.listing.update({
          where: { id: report.listingId },
          data: { status: ListingStatus.APPROVED },
        });
      }
    }

    return { success: true };
  }
}
