import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { LegalModule } from './modules/legal/legal.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ListingsModule } from './modules/listings/listings.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { ReputationModule } from './modules/reputation/reputation.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LegalModule,
    SellersModule,
    CatalogModule,
    ListingsModule,
    ModerationModule,
    ReputationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
