import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Aumentar el límite del body parser para soportar imágenes en Base64
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Habilitar CORS para que el frontend pueda consultar la API
  app.enableCors();

  // Servir archivos estáticos subidos desde la carpeta /uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  
  // Establecer prefijo de la API
  app.setGlobalPrefix('api');

  // Habilitar validaciones globales en DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remueve campos que no estén en el DTO
      forbidNonWhitelisted: true, // arroja error si se envían campos extras
      transform: true, // transforma payloads a instancias de clases DTO
    }),
  );

  const port = process.env.PORT ?? 3001; // Usamos 3001 ya que el frontend de Next corre en 3000 por defecto
  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}/api`);
}
bootstrap();
