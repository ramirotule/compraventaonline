import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async ask(
    @CurrentUser() user: UserPayload,
    @Body() body: { listingId: string; question: string },
  ) {
    return this.questionsService.create(user.sub, body.listingId, body.question);
  }

  @Get('received')
  @UseGuards(JwtAuthGuard)
  async getReceived(@CurrentUser() user: UserPayload) {
    return this.questionsService.getReceivedQuestions(user.sub);
  }

  @Get('listing/:listingId')
  async getListingQuestions(@Param('listingId') listingId: string) {
    return this.questionsService.getListingQuestions(listingId);
  }

  @Patch(':id/answer')
  @UseGuards(JwtAuthGuard)
  async answer(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() body: { answer: string },
  ) {
    return this.questionsService.answerQuestion(user.sub, id, body.answer);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  async getUnreadCount(@CurrentUser() user: UserPayload) {
    return this.questionsService.getUnreadCount(user.sub);
  }

  @Post('mark-read')
  @UseGuards(JwtAuthGuard)
  async markRead(
    @CurrentUser() user: UserPayload,
    @Body() body: { role: 'seller' | 'buyer' },
  ) {
    return this.questionsService.markAllAsRead(user.sub, body.role);
  }
}
