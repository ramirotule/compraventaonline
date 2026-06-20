import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post()
  async createReport(@CurrentUser() user: UserPayload, @Body() dto: CreateReportDto) {
    return this.moderationService.createReport(user.sub, dto);
  }

  @Get('pending')
  async getPending() {
    return this.moderationService.getPendingReports();
  }

  @Post(':id/resolve')
  async resolveReport(
    @Param('id') id: string,
    @Body('action') action: 'APPROVE' | 'BLOCK',
  ) {
    return this.moderationService.resolveReport(id, action);
  }
}
