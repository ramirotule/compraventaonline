import { IsUUID, IsNotEmpty, IsPositive, IsEnum, IsInt, Min, IsArray, IsOptional } from 'class-validator';
import { Condition, FeaturedPlan } from '@prisma/client';

export class CreateListingDto {
  @IsUUID('4', { message: 'El productId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El producto es requerido' })
  productId: string;

  @IsPositive({ message: 'El precio debe ser un número positivo' })
  @IsNotEmpty({ message: 'El precio es requerido' })
  price: number;

  @IsUUID('4', { message: 'El currencyId debe ser un UUID válido' })
  @IsOptional()
  currencyId?: string;

  @IsEnum(Condition, { message: 'La condición debe ser NEW o USED' })
  @IsNotEmpty({ message: 'La condición es requerida' })
  condition: Condition;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(1, { message: 'El stock mínimo es 1' })
  @IsNotEmpty({ message: 'El stock es requerido' })
  stock: number;

  @IsArray({ message: 'Las imágenes deben ser una lista de textos' })
  @IsOptional()
  images?: string[];

  @IsEnum(FeaturedPlan, { message: 'El plan destacado debe ser FREE, FEATURED o PREMIUM' })
  @IsOptional()
  featuredPlan?: FeaturedPlan;
}
