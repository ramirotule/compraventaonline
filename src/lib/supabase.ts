import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas.');
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Tipos de base de datos (se actualizarán cuando creemos las tablas)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nombre: string;
          apellido: string;
          dni: string;
          telefono: string;
          fecha_nacimiento: string;
          direccion: string;
          ciudad: string;
          provincia: string;
          codigo_postal: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nombre: string;
          apellido: string;
          dni: string;
          telefono: string;
          fecha_nacimiento: string;
          direccion: string;
          ciudad: string;
          provincia: string;
          codigo_postal: string;
        };
        Update: {
          id?: string;
          email?: string;
          nombre?: string;
          apellido?: string;
          dni?: string;
          telefono?: string;
          fecha_nacimiento?: string;
          direccion?: string;
          ciudad?: string;
          provincia?: string;
          codigo_postal?: string;
        };
      };
      productos: {
        Row: {
          id: string;
          titulo: string;
          descripcion: string;
          precio: number;
          categoria: string;
          estado: string;
          provincia: string;
          ciudad: string;
          codigo_postal: string;
          ubicacion: string;
          user_id: string;
          imagenes: string[];
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          titulo: string;
          descripcion: string;
          precio: number;
          categoria: string;
          estado: string;
          provincia: string;
          ciudad: string;
          codigo_postal: string;
          ubicacion: string;
          user_id: string;
          imagenes?: string[];
          activo?: boolean;
        };
        Update: {
          id?: string;
          titulo?: string;
          descripcion?: string;
          precio?: number;
          categoria?: string;
          estado?: string;
          provincia?: string;
          ciudad?: string;
          codigo_postal?: string;
          ubicacion?: string;
          imagenes?: string[];
          activo?: boolean;
        };
      };
      favoritos: {
        Row: {
          id: string;
          user_id: string;
          producto_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          producto_id: string;
        };
        Update: {
          user_id?: string;
          producto_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}