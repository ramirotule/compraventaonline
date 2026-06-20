import { Controller, Post, Get, Patch, Body, Query, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: UserPayload, @Body() dto: CreateListingDto) {
    return this.listingsService.create(user.sub, dto);
  }

  @Get()
  async getListings(
    @Query('product_id') productId?: string,
    @Query('min_price') minPrice?: string,
    @Query('max_price') maxPrice?: string,
    @Query('condition') condition?: 'NEW' | 'USED',
    @Query('q') q?: string,
    @Query('sort') sort?: 'price_asc' | 'price_desc' | 'relevance',
  ) {
    return this.listingsService.findListings({
      productId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      condition,
      q,
      sort,
    });
  }

  @Get(':id')
  async getListing(@Param('id') id: string) {
    return this.listingsService.findListingById(id);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard)
  async updateStock(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body('stock', ParseIntPipe) stock: number,
  ) {
    return this.listingsService.updateListingStock(user.sub, id, stock);
  }
}
