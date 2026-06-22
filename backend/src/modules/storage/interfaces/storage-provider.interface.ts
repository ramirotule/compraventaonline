export abstract class StorageProvider {
  abstract uploadFile(file: any): Promise<string>;
}
