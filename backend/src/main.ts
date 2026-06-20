import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para que el frontend pueda consultar la API
  app.enableCors();
  
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
