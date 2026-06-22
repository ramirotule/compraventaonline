import { Controller, Post, Get, Patch, Delete, Body, Query, Param, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: UserPayload, @Body() dto: CreateListingDto) {
    return this.listingsService.create(user.sub, dto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadBulk(
    @CurrentUser() user: UserPayload,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere subir un archivo CSV válido en el campo "file".');
    }
    return this.listingsService.bulkUpload(user.sub, file.buffer);
  }

  @Get()
  async getListings(
    @Query('product_id') productId?: string,
    @Query('min_price') minPrice?: string,
    @Query('max_price') maxPrice?: string,
    @Query('condition') condition?: 'NEW' | 'USED',
    @Query('q') q?: string,
    @Query('sort') sort?: 'price_asc' | 'price_desc' | 'relevance',
    @Query('seller_id') sellerId?: string,
  ) {
    return this.listingsService.findListings({
      productId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      condition,
      q,
      sort,
      sellerId,
    });
  }

  @Get('currencies')
  async getCurrencies() {
    return this.listingsService.findAllCurrencies();
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.listingsService.deleteListing(user.sub, id);
  }

  @Post(':id/clone')
  @UseGuards(JwtAuthGuard)
  async clone(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.listingsService.cloneListing(user.sub, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() body: {
      price?: number;
      stock?: number;
      condition?: any;
      name?: string;
      brand?: string;
      description?: string;
      categoryId?: string;
      featuredPlan?: any;
      currencyId?: string;
      images?: string[];
      attributes?: Record<string, any>;
      status?: any;
    },
  ) {
    return this.listingsService.updateListing(user.sub, id, body);
  }
}
