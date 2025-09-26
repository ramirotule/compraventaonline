import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  provincia: string;
  ciudad: string;
  codigo_postal: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  // Estado
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  
  // Acciones
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  fetchProfile: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      profile: null,
      session: null,
      loading: true,

      // Setters
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),

      // Función para registrar usuario
      signUp: async (email, password, userData) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData
            }
          });

          if (error) return { error };

          // El perfil se creará automáticamente por el trigger en la base de datos
          return { error: null };
        } catch (error) {
          return { error };
        }
      },

      // Función para iniciar sesión
      signIn: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) return { error };

          return { error: null };
        } catch (error) {
          return { error };
        }
      },

      // Función para cerrar sesión
      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          
          // Limpiar estado local
          set({
            user: null,
            profile: null,
            session: null,
          });

          return { error };
        } catch (error) {
          return { error };
        }
      },

      // Función para actualizar perfil
      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return { error: 'No user logged in' };

        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          if (error) return { error };

          // Actualizar estado local
          const { profile } = get();
          if (profile) {
            set({
              profile: { ...profile, ...updates }
            });
          }

          return { error: null };
        } catch (error) {
          return { error };
        }
      },

      // Función para obtener perfil
      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!error && profile) {
            set({ profile });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },

      // Función para resetear estado
      reset: () => set({
        user: null,
        profile: null,
        session: null,
        loading: false,
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        profile: state.profile,
        session: state.session 
      }),
    }
  )
);