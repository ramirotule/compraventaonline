import { IsBoolean, IsNotEmpty, IsString, Equals } from 'class-validator';

export class AcceptTermsDto {
  @IsBoolean({ message: 'acceptedTerms debe ser un booleano' })
  @Equals(true, { message: 'Debes aceptar los términos y condiciones' })
  acceptedTerms: boolean;

  @IsString({ message: 'La versión debe ser un texto' })
  @IsNotEmpty({ message: 'La versión es requerida' })
  version: string;
}
