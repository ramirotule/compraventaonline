import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  estado: string;
  imagenes: string[];
  vendedor: {
    id: string;
    nombre: string;
    rating: number;
    verificado: boolean;
  };
  ubicacion: {
    provincia: string;
    ciudad: string;
  };
  fechaPublicacion: string;
}

interface ProductsState {
  // Estado
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  searchTerm: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: 'recent' | 'price-asc' | 'price-desc' | 'title';
  loading: boolean;
  
  // Acciones
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  removeProduct: (id: number) => void;
  
  // Filtros y búsqueda
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: ProductsState['sortBy']) => void;
  
  // Utilidades
  getFilteredProducts: () => Product[];
  searchProducts: (query: string) => Product[];
  getProductById: (id: number) => Product | undefined;
  
  // Reset
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      products: [],
      currentProduct: null,
      categories: [
        'Electrónicos',
        'Hogar y Jardín',
        'Moda y Belleza',
        'Deportes',
        'Vehículos',
        'Libros y Música',
        'Juegos y Juguetes',
        'Otros'
      ],
      searchTerm: '',
      selectedCategory: '',
      priceRange: [0, 1000000],
      sortBy: 'recent',
      loading: false,

      // Setters básicos
      setProducts: (products) => set({ products }),
      setCurrentProduct: (product) => set({ currentProduct: product }),
      setLoading: (loading) => set({ loading }),

      // CRUD de productos
      addProduct: (product) => {
        const { products } = get();
        set({ products: [product, ...products] });
      },

      updateProduct: (id, updates) => {
        const { products } = get();
        const updatedProducts = products.map(product =>
          product.id === id ? { ...product, ...updates } : product
        );
        set({ products: updatedProducts });
      },

      removeProduct: (id) => {
        const { products } = get();
        set({ products: products.filter(product => product.id !== id) });
      },

      // Filtros
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setPriceRange: (range) => set({ priceRange: range }),
      setSortBy: (sort) => set({ sortBy: sort }),

      // Obtener productos filtrados
      getFilteredProducts: () => {
        const { 
          products, 
          searchTerm, 
          selectedCategory, 
          priceRange,
          sortBy 
        } = get();

        let filtered = [...products];

        // Filtro por búsqueda
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(product =>
            product.titulo.toLowerCase().includes(term) ||
            product.descripcion.toLowerCase().includes(term) ||
            product.categoria.toLowerCase().includes(term)
          );
        }

        // Filtro por categoría
        if (selectedCategory) {
          filtered = filtered.filter(product => 
            product.categoria === selectedCategory
          );
        }

        // Filtro por precio
        filtered = filtered.filter(product =>
          product.precio >= priceRange[0] && product.precio <= priceRange[1]
        );

        // Ordenamiento
        switch (sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => a.precio - b.precio);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.precio - a.precio);
            break;
          case 'title':
            filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
          case 'recent':
          default:
            filtered.sort((a, b) => 
              new Date(b.fechaPublicacion).getTime() - 
              new Date(a.fechaPublicacion).getTime()
            );
            break;
        }

        return filtered;
      },

      // Búsqueda de productos
      searchProducts: (query) => {
        const { products } = get();
        const term = query.toLowerCase();
        
        return products.filter(product =>
          product.titulo.toLowerCase().includes(term) ||
          product.descripcion.toLowerCase().includes(term) ||
          product.categoria.toLowerCase().includes(term) ||
          product.vendedor.nombre.toLowerCase().includes(term)
        );
      },

      // Obtener producto por ID
      getProductById: (id) => {
        const { products } = get();
        return products.find(product => product.id === id);
      },

      // Limpiar filtros
      clearFilters: () => {
        set({
          searchTerm: '',
          selectedCategory: '',
          priceRange: [0, 1000000],
          sortBy: 'recent',
        });
      },
    }),
    {
      name: 'products-storage',
      partialize: (state) => ({ 
        products: state.products,
        categories: state.categories,
      }),
    }
  )
);