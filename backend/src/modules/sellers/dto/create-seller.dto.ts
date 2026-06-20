import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SellerType } from '@prisma/client';

export class CreateSellerDto {
  @IsEnum(SellerType, { message: 'El tipo de vendedor debe ser PERSONAL_SELLER o BUSINESS_SELLER' })
  @IsNotEmpty({ message: 'El tipo de vendedor es requerido' })
  type: SellerType;

  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsString({ message: 'El número de documento debe ser un texto' })
  @IsNotEmpty({ message: 'El número de documento es requerido' })
  documentNumber: string;
}
