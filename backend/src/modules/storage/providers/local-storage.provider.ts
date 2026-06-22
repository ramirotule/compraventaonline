import { Injectable } from '@nestjs/common';
import { StorageProvider } from '../interfaces/storage-provider.interface';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class LocalStorageProvider extends StorageProvider {
  async uploadFile(file: any): Promise<string> {
    const uploadDir = join(process.cwd(), 'uploads');
    
    // Crear el directorio 'uploads' si no existe en el root del backend
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Crear un nombre único de archivo conservando su extensión original
    const uniqueFilename = `${randomUUID()}${extname(file.originalname)}`;
    const filePath = join(uploadDir, uniqueFilename);

    // Escribir el buffer del archivo en disco
    writeFileSync(filePath, file.buffer);

    // Retornar la URL estática del servidor
    const appUrl = process.env.APP_URL || 'http://localhost:3001';
    return `${appUrl}/uploads/${uniqueFilename}`;
  }
}
