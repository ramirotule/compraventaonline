import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, listingId: string, questionText: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (listing.seller.userId === userId) {
      throw new ForbiddenException('No podés hacerte una pregunta a vos mismo');
    }

    return this.prisma.question.create({
      data: {
        listingId,
        buyerId: userId,
        question: questionText,
        isReadBySeller: false,
      },
      include: {
        buyer: { select: { fullName: true, email: true } },
        listing: { include: { product: true } },
      },
    });
  }

  async getReceivedQuestions(userId: string) {
    // Buscar el perfil de vendedor del usuario
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return [];
    }

    // Buscar preguntas de las publicaciones de este vendedor
    return this.prisma.question.findMany({
      where: {
        listing: {
          sellerId: seller.id,
        },
      },
      include: {
        buyer: { select: { id: true, fullName: true, email: true } },
        listing: { 
          include: { 
            product: true 
          } 
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getListingQuestions(listingId: string) {
    return this.prisma.question.findMany({
      where: { listingId },
      include: {
        buyer: { select: { fullName: true } },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async answerQuestion(userId: string, questionId: string, answerText: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        listing: {
          include: { seller: true },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    if (question.listing.seller.userId !== userId) {
      throw new ForbiddenException('No tenés permisos para responder esta pregunta');
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: {
        answer: answerText,
        answeredAt: new Date(),
        isReadBySeller: true, // Marcar como leída al responder
        isReadByBuyer: false, // Nueva notificación para el comprador
      },
    });
  }

  async getUnreadCount(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    let sellerUnread = 0;
    if (seller) {
      sellerUnread = await this.prisma.question.count({
        where: {
          listing: {
            sellerId: seller.id,
          },
          isReadBySeller: false,
        },
      });
    }

    // Comprador: respuestas no leídas
    const buyerUnread = await this.prisma.question.count({
      where: {
        buyerId: userId,
        answer: { not: null },
        isReadByBuyer: false,
      },
    });

    return {
      sellerUnread,
      buyerUnread,
      totalUnread: sellerUnread + buyerUnread,
    };
  }

  async markAllAsRead(userId: string, role: 'seller' | 'buyer') {
    if (role === 'seller') {
      const seller = await this.prisma.seller.findUnique({
        where: { userId },
      });
      if (seller) {
        await this.prisma.question.updateMany({
          where: {
            listing: { sellerId: seller.id },
            isReadBySeller: false,
          },
          data: { isReadBySeller: true },
        });
      }
    } else {
      await this.prisma.question.updateMany({
        where: {
          buyerId: userId,
          isReadByBuyer: false,
        },
        data: { isReadByBuyer: true },
      });
    }
    return { success: true };
  }
}
