import { IsUUID, IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { ReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsUUID('4', { message: 'El listingId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La publicación es requerida' })
  listingId: string;

  @IsEnum(ReportReason, { message: 'El motivo del reporte debe ser FRAUD, ILLEGAL_PRODUCT, OFFENSIVE o OTHER' })
  @IsNotEmpty({ message: 'El motivo es requerido' })
  reason: ReportReason;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;
}
