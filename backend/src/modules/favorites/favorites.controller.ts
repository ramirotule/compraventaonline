import { Controller, Post, Delete, Get, Body, Param, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(@CurrentUser() user: UserPayload, @Body() dto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(user.sub, dto.listingId);
  }

  @Delete('listing/:listingId')
  async removeFavoriteByListingId(@CurrentUser() user: UserPayload, @Param('listingId') listingId: string) {
    return this.favoritesService.removeFavoriteByListingId(user.sub, listingId);
  }

  @Delete(':id')
  async removeFavoriteById(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.favoritesService.removeFavoriteById(user.sub, id);
  }

  @Get()
  async getFavorites(@CurrentUser() user: UserPayload) {
    return this.favoritesService.getFavorites(user.sub);
  }

  @Get('listing/:listingId/status')
  async checkFavoriteStatus(@CurrentUser() user: UserPayload, @Param('listingId') listingId: string) {
    const isFav = await this.favoritesService.isFavorite(user.sub, listingId);
    return { isFavorite: isFav };
  }
}
