import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async register(@CurrentUser() user: UserPayload, @Body() dto: CreateSellerDto) {
    return this.sellersService.create(user.sub, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: UserPayload) {
    return this.sellersService.findByUserId(user.sub);
  }

  @Get(':id/reputation')
  async getReputation(@Param('id') id: string) {
    return this.sellersService.getReputation(id);
  }
}
