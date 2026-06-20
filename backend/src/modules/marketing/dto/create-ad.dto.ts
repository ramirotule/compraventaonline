import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateAdDto {
  @IsString({ message: 'El nombre del anunciante debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del anunciante es requerido' })
  advertiserName: string;

  @IsString({ message: 'El tipo debe ser un texto' })
  @IsNotEmpty({ message: 'El tipo es requerido (ej: BANNER, SPONSORED_CARD)' })
  type: string;

  @IsString({ message: 'La URL de la imagen debe ser un texto' })
  @IsNotEmpty({ message: 'La URL de la imagen es requerida' })
  imageUrl: string;

  @IsString({ message: 'La URL de destino debe ser un texto' })
  @IsNotEmpty({ message: 'La URL de destino es requerida' })
  targetUrl: string;

  @IsInt({ message: 'La duración debe ser un número entero de días' })
  @Min(1, { message: 'La duración mínima es de 1 día' })
  @IsNotEmpty({ message: 'La duración en días es requerida' })
  durationDays: number;
}
