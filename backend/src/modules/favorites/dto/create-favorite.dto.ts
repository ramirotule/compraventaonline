import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsUUID('4', { message: 'El listingId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El listingId es requerido' })
  listingId: string;
}
