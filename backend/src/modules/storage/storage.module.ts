import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { StorageProvider } from './interfaces/storage-provider.interface';
import { LocalStorageProvider } from './providers/local-storage.provider';
// import { SupabaseStorageProvider } from './providers/supabase-storage.provider';

@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: StorageProvider, // Usamos la clase abstracta directamente como token
      useClass: LocalStorageProvider, // En producción cambias a SupabaseStorageProvider!
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
