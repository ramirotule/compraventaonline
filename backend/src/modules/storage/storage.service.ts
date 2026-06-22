import { Injectable } from '@nestjs/common';
import { StorageProvider } from './interfaces/storage-provider.interface';

@Injectable()
export class StorageService {
  constructor(private readonly storageProvider: StorageProvider) {}

  async upload(file: any): Promise<string> {
    return this.storageProvider.uploadFile(file);
  }
}
