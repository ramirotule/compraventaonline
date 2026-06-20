import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { LegalService } from './legal.service';
import { AcceptTermsDto } from './dto/accept-terms.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';

@Controller('legal')
@UseGuards(JwtAuthGuard)
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Post('accept')
  async acceptTerms(@CurrentUser() user: UserPayload, @Body() dto: AcceptTermsDto) {
    return this.legalService.acceptTerms(user.sub, dto);
  }

  @Get('status')
  async getStatus(@CurrentUser() user: UserPayload) {
    const latest = await this.legalService.getLatestAcceptance(user.sub);
    return {
      accepted: !!latest,
      latestAcceptance: latest,
    };
  }
}
