import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

/**
 * Hook para inicializar y sincronizar los stores con Supabase
 * Este hook debe ser usado en el componente raíz de la aplicación
 */
export const useStoresInitialization = () => {
  const { 
    setUser, 
    setSession, 
    setLoading, 
    fetchProfile, 
    reset 
  } = useAuthStore();

  useEffect(() => {
    // Obtener sesión actual
    const getInitialSession = async () => {
      setLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (session) {
          setUser(session.user);
          setSession(session);
          await fetchProfile();
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        
        if (session) {
          setUser(session.user);
          setSession(session);
          await fetchProfile();
        } else {
          reset();
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setLoading, fetchProfile, reset]);
};