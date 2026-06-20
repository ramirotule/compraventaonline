import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { LegalModule } from './modules/legal/legal.module';
import { SellersModule } from './modules/sellers/sellers.module';

@Module({
  imports: [PrismaModule, AuthModule, LegalModule, SellersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
