import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static pool = new Pool({ connectionString: process.env.DATABASE_URL });
  private static adapter = new PrismaPg(PrismaService.pool);

  constructor() {
    super({
      adapter: PrismaService.adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await PrismaService.pool.end();
  }
}
