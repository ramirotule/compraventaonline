import { create } from 'zustand';

export type SnackbarType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info'
  | 'favorite-added'
  | 'favorite-removed'
  | 'product-shared'
  | 'report-sent';

export type ModalType = 'contact' | 'report' | 'auth' | null;

interface SnackbarState {
  isOpen: boolean;
  type: SnackbarType;
  customMessage?: string;
  customSubtitle?: string;
}

interface ModalState {
  type: ModalType;
  isOpen: boolean;
  authAction?: 'contact' | 'report';
  productTitle?: string;
  vendorName?: string;
}

interface UIState {
  // Snackbar state
  snackbar: SnackbarState;
  
  // Modal state
  modal: ModalState;
  
  // Loading states
  loading: {
    auth: boolean;
    products: boolean;
    favorites: boolean;
    general: boolean;
  };
  
  // Acciones para Snackbar
  showSnackbar: (type: SnackbarType, customMessage?: string, customSubtitle?: string) => void;
  hideSnackbar: () => void;
  
  // Acciones para Modal
  showModal: (type: Exclude<ModalType, null>, config?: Partial<ModalState>) => void;
  hideModal: () => void;
  
  // Acciones para Loading
  setLoading: (key: keyof UIState['loading'], value: boolean) => void;
  
  // Reset
  resetUI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Estado inicial
  snackbar: {
    isOpen: false,
    type: 'success',
  },
  
  modal: {
    type: null,
    isOpen: false,
  },
  
  loading: {
    auth: false,
    products: false,
    favorites: false,
    general: false,
  },

  // Acciones para Snackbar
  showSnackbar: (type, customMessage, customSubtitle) => {
    set({
      snackbar: {
        isOpen: true,
        type,
        customMessage,
        customSubtitle,
      }
    });
  },

  hideSnackbar: () => {
    set({
      snackbar: {
        isOpen: false,
        type: 'success',
        customMessage: undefined,
        customSubtitle: undefined,
      }
    });
  },

  // Acciones para Modal
  showModal: (type, config = {}) => {
    set({
      modal: {
        type,
        isOpen: true,
        ...config,
      }
    });
  },

  hideModal: () => {
    set({
      modal: {
        type: null,
        isOpen: false,
        authAction: undefined,
        productTitle: undefined,
        vendorName: undefined,
      }
    });
  },

  // Acciones para Loading
  setLoading: (key, value) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: value,
      }
    }));
  },

  // Reset
  resetUI: () => {
    set({
      snackbar: { isOpen: false, type: 'success' },
      modal: { type: null, isOpen: false },
      loading: {
        auth: false,
        products: false,
        favorites: false,
        general: false,
      },
    });
  },
}));