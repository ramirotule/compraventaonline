import { IsString, IsNotEmpty, IsUUID, IsArray, IsOptional, IsObject } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El nombre del producto debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  name: string;

  @IsString({ message: 'La descripción del producto debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción del producto es requerida' })
  description: string;

  @IsString({ message: 'La marca debe ser un texto' })
  @IsNotEmpty({ message: 'La marca es requerida' })
  brand: string;

  @IsUUID('4', { message: 'El categoryId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  categoryId: string;

  @IsArray({ message: 'Las imágenes deben ser una lista de textos' })
  @IsOptional()
  images?: string[];

  @IsObject({ message: 'Los atributos deben ser un objeto JSON' })
  @IsOptional()
  attributes?: Record<string, any>;
}
