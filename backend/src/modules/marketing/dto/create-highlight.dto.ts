import { IsUUID, IsNotEmpty, IsEnum, IsInt, Min } from 'class-validator';
import { FeaturedPlan } from '@prisma/client';

export class CreateHighlightDto {
  @IsUUID('4', { message: 'El listingId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La publicación es requerida' })
  listingId: string;

  @IsEnum(FeaturedPlan, { message: 'El plan debe ser FREE, FEATURED o PREMIUM' })
  @IsNotEmpty({ message: 'El plan destacado es requerido' })
  plan: FeaturedPlan;

  @IsInt({ message: 'La duración debe ser un número entero de días' })
  @Min(1, { message: 'La duración mínima es de 1 día' })
  @IsNotEmpty({ message: 'La duración en días es requerida' })
  durationDays: number;
}
