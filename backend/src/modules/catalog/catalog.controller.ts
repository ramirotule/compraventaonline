import { Controller, Post, Get, Body, Query, Param, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  async getCategories() {
    return this.catalogService.findAllCategories();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateProductDto) {
    return this.catalogService.create(dto);
  }

  @Get()
  async getProducts(
    @Query('q') query?: string,
    @Query('category_id') categoryId?: string,
  ) {
    return this.catalogService.findProducts(query, categoryId);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.catalogService.findProductById(id);
  }
}
