import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface FavoritesState {
  // Estado
  favorites: number[];
  loading: boolean;
  
  // Acciones
  addFavorite: (productId: number) => Promise<void>;
  removeFavorite: (productId: number) => Promise<void>;
  toggleFavorite: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  loadFavorites: () => Promise<void>;
  clearFavorites: () => void;
  setLoading: (loading: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      favorites: [],
      loading: false,

      // Verificar si un producto es favorito
      isFavorite: (productId) => {
        const { favorites } = get();
        return favorites.includes(productId);
      },

      // Agregar a favoritos
      addFavorite: async (productId) => {
        const { favorites } = get();
        
        if (favorites.includes(productId)) return;

        const newFavorites = [...favorites, productId];
        
        // Actualizar estado local inmediatamente (optimistic update)
        set({ favorites: newFavorites });
        
        // Sincronizar con localStorage
        localStorage.setItem('favorites', JSON.stringify(newFavorites));

        // TODO: Sincronizar con Supabase cuando el usuario esté autenticado
        try {
          // Aquí iría la lógica para guardar en Supabase
          // const { error } = await supabase
          //   .from('favoritos')
          //   .insert({ user_id: userId, product_id: productId });
        } catch (error) {
          // Si falla, revertir el cambio
          set({ favorites: favorites.filter(id => id !== productId) });
          localStorage.setItem('favorites', JSON.stringify(favorites));
          console.error('Error adding favorite:', error);
        }
      },

      // Remover de favoritos
      removeFavorite: async (productId) => {
        const { favorites } = get();
        
        const newFavorites = favorites.filter(id => id !== productId);
        
        // Actualizar estado local inmediatamente
        set({ favorites: newFavorites });
        
        // Sincronizar con localStorage
        localStorage.setItem('favorites', JSON.stringify(newFavorites));

        // TODO: Sincronizar con Supabase
        try {
          // Aquí iría la lógica para eliminar de Supabase
          // const { error } = await supabase
          //   .from('favoritos')
          //   .delete()
          //   .match({ user_id: userId, product_id: productId });
        } catch (error) {
          // Si falla, revertir el cambio
          set({ favorites: [...favorites, productId] });
          localStorage.setItem('favorites', JSON.stringify([...favorites, productId]));
          console.error('Error removing favorite:', error);
        }
      },

      // Toggle favorito (agregar o quitar)
      toggleFavorite: async (productId) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        
        if (isFavorite(productId)) {
          await removeFavorite(productId);
        } else {
          await addFavorite(productId);
        }
      },

      // Cargar favoritos desde Supabase
      loadFavorites: async () => {
        set({ loading: true });
        
        try {
          // Por ahora cargar desde localStorage hasta implementar Supabase
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            const parsedFavorites = JSON.parse(storedFavorites);
            set({ favorites: parsedFavorites });
          }
          
          // TODO: Implementar cuando tengamos autenticación
          // const { data, error } = await supabase
          //   .from('favoritos')
          //   .select('product_id')
          //   .eq('user_id', userId);
          
          // if (!error && data) {
          //   set({ favorites: data.map(f => f.product_id) });
          // }
        } catch (error) {
          console.error('Error loading favorites:', error);
        } finally {
          set({ loading: false });
        }
      },

      // Limpiar favoritos
      clearFavorites: () => {
        set({ favorites: [] });
      },

      // Setters
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);