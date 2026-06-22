import { Injectable } from '@nestjs/common';
import { StorageProvider } from '../interfaces/storage-provider.interface';

@Injectable()
export class SupabaseStorageProvider extends StorageProvider {
  async uploadFile(file: any): Promise<string> {
    // Cuando quieras pasar a producción con Supabase, sólo tenés que:
    // 1. Instalar el SDK de Supabase: npm install @supabase/supabase-js
    // 2. Inicializar el cliente Supabase con la URL y API Key de tu panel de Supabase.
    // 3. Reemplazar esto con el código real de subida al bucket:
    //
    // const { data, error } = await this.supabaseClient.storage
    //   .from('nombre-de-tu-bucket')
    //   .upload(`listings/${Date.now()}-${file.originalname}`, file.buffer, {
    //     contentType: file.mimetype,
    //   });
    // if (error) throw error;
    // return this.supabaseClient.storage.from('nombre-de-tu-bucket').getPublicUrl(data.path).data.publicUrl;

    throw new Error(
      'SupabaseStorageProvider: No configurado todavía. Completá las credenciales del SDK de Supabase en este archivo.',
    );
  }
}
