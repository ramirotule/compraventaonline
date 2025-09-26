// Exportar todos los stores para fácil importación
export { useAuthStore } from './authStore';
export { useFavoritesStore } from './favoritesStore';
export { useProductsStore } from './productsStore';
export { useUIStore } from './uiStore';

// Re-exportar tipos importantes
export type { Profile } from './authStore';
export type { Product } from './productsStore';
export type { SnackbarType, ModalType } from './uiStore';