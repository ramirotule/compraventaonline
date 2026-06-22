import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Se requiere subir un archivo válido en el campo "file".');
    }
    
    // Validar tipo de archivo (solo imágenes)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Formato de archivo no válido. Solo se aceptan imágenes (JPEG, PNG, WEBP, GIF).');
    }

    // Validar tamaño máximo (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
    }

    const url = await this.storageService.upload(file);
    return { url };
  }
}
