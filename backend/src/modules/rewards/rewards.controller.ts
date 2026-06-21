import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';
import { IsUUID } from 'class-validator';

class ClaimRewardDto {
  @IsUUID()
  listingId: string;
}

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('my-rewards')
  async getMyRewards(@CurrentUser() user: UserPayload) {
    return this.rewardsService.getSellerRewards(user.sub);
  }

  @Post(':id/claim')
  async claimReward(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: ClaimRewardDto,
  ) {
    return this.rewardsService.claimHighlightReward(user.sub, id, dto.listingId);
  }
}
