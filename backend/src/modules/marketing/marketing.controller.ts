import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { CreateAdDto } from './dto/create-ad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post('highlight')
  @UseGuards(JwtAuthGuard)
  async highlightListing(@Body() dto: CreateHighlightDto) {
    return this.marketingService.createHighlight(dto);
  }

  @Get('highlights')
  async getHighlights() {
    return this.marketingService.getHighlights();
  }

  @Post('ads')
  @UseGuards(JwtAuthGuard)
  async createAd(@Body() dto: CreateAdDto) {
    return this.marketingService.createAd(dto);
  }

  @Get('ads')
  async getActiveAds() {
    return this.marketingService.getActiveAds();
  }
}
