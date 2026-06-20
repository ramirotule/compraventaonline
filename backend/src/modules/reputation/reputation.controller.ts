import { Controller, Post, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reputation')
@UseGuards(JwtAuthGuard)
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @Post(':sellerId/adjust')
  async adjustScore(
    @Param('sellerId') sellerId: string,
    @Body('points', ParseIntPipe) points: number,
  ) {
    return this.reputationService.adjustScore(sellerId, points);
  }

  @Post(':sellerId/sale-completed')
  async recordSale(@Param('sellerId') sellerId: string) {
    return this.reputationService.recordCompletedSale(sellerId);
  }

  @Post(':sellerId/positive')
  async recordPositive(@Param('sellerId') sellerId: string) {
    return this.reputationService.recordPositiveRating(sellerId);
  }

  @Post(':sellerId/negative')
  async recordNegative(@Param('sellerId') sellerId: string) {
    return this.reputationService.recordNegativeRating(sellerId);
  }
}
