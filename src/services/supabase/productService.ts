// productService.ts - Servicios para gestión de productos con Supabase

import { supabase } from '../../lib/supabase';

export interface ProductData {
  id?: string;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  estado: string;
  provincia: string;
  ciudad: string;
  codigo_postal: string;
  contacto: string;
  user_id?: string;
  imagenes?: string[];
  activo?: boolean;
  destacado?: boolean;
  visitas?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilters {
  categoria?: string;
  provincia?: string;
  ciudad?: string;
  precioMin?: number;
  precioMax?: number;
  estado?: string;
  busqueda?: string;
}

export interface ProductsResponse {
  productos: ProductData[];
  total: number;
  error?: string;
}

// ========================================
// CRUD DE PRODUCTOS
// ========================================

/**
 * Crear un nuevo producto
 */
export const createProduct = async (productData: Omit<ProductData, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ProductData | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .insert({
        ...productData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select(`
        *,
        profiles:user_id (
          nombre,
          apellido,
          email,
          telefono,
          verificado
        )
      `)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error creating product:', error);
    return { data: null, error };
  }
};

/**
 * Obtener productos con filtros y paginación
 */
export const getProducts = async (
  filters: ProductFilters = {},
  page: number = 1,
  limit: number = 12
): Promise<ProductsResponse> => {
  try {
    let query = supabase
      .from('productos')
      .select(`
        *,
        profiles:user_id (
          nombre,
          apellido,
          email,
          telefono,
          verificado
        )
      `, { count: 'exact' })
      .eq('activo', true)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters.categoria) {
      query = query.eq('categoria', filters.categoria);
    }

    if (filters.provincia) {
      query = query.eq('provincia', filters.provincia);
    }

    if (filters.ciudad) {
      query = query.eq('ciudad', filters.ciudad);
    }

    if (filters.estado) {
      query = query.eq('estado', filters.estado);
    }

    if (filters.precioMin !== undefined) {
      query = query.gte('precio', filters.precioMin);
    }

    if (filters.precioMax !== undefined) {
      query = query.lte('precio', filters.precioMax);
    }

    if (filters.busqueda) {
      query = query.or(`titulo.ilike.%${filters.busqueda}%,descripcion.ilike.%${filters.busqueda}%`);
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return { productos: [], total: 0, error: error.message };
    }

    return {
      productos: data || [],
      total: count || 0
    };

  } catch (error) {
    console.error('Error fetching products:', error);
    return { productos: [], total: 0, error: 'Error al cargar productos' };
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id: string): Promise<{ data: ProductData | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        profiles:user_id (
          nombre,
          apellido,
          email,
          telefono,
          verificado,
          avatar_url
        )
      `)
      .eq('id', id)
      .eq('activo', true)
      .single();

    // Incrementar visitas
    if (data) {
      await supabase
        .from('productos')
        .update({ visitas: (data.visitas || 0) + 1 })
        .eq('id', id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { data: null, error };
  }
};

/**
 * Obtener productos del usuario actual
 */
export const getUserProducts = async (): Promise<{ data: ProductData[]; error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: [], error: 'Usuario no autenticado' };
    }

    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  } catch (error) {
    console.error('Error fetching user products:', error);
    return { data: [], error };
  }
};

/**
 * Actualizar un producto
 */
export const updateProduct = async (id: string, updates: Partial<ProductData>): Promise<{ data: ProductData | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error updating product:', error);
    return { data: null, error };
  }
};

/**
 * Eliminar un producto (soft delete)
 */
export const deleteProduct = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('productos')
      .update({ activo: false })
      .eq('id', id);

    return { error };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error };
  }
};

// ========================================
// FAVORITOS
// ========================================

/**
 * Agregar/quitar producto de favoritos
 */
export const toggleFavorite = async (productId: string): Promise<{ isFavorite: boolean; error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isFavorite: false, error: 'Usuario no autenticado' };
    }

    // Verificar si ya está en favoritos
    const { data: existing } = await supabase
      .from('favoritos')
      .select('id')
      .eq('user_id', user.id)
      .eq('producto_id', productId)
      .single();

    if (existing) {
      // Eliminar de favoritos
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', user.id)
        .eq('producto_id', productId);

      return { isFavorite: false, error };
    } else {
      // Agregar a favoritos
      const { error } = await supabase
        .from('favoritos')
        .insert({
          user_id: user.id,
          producto_id: productId
        });

      return { isFavorite: true, error };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { isFavorite: false, error };
  }
};

/**
 * Obtener favoritos del usuario
 */
export const getUserFavorites = async (): Promise<{ data: ProductData[]; error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: [], error: 'Usuario no autenticado' };
    }

    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        productos:producto_id (
          *,
          profiles:user_id (
            nombre,
            apellido,
            email,
            telefono,
            verificado
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const productos = (data?.map(item => item.productos).filter(Boolean) || []) as unknown as ProductData[];
    
    return { data: productos, error };
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return { data: [], error };
  }
};

/**
 * Verificar si un producto está en favoritos
 */
export const isProductFavorite = async (productId: string): Promise<{ isFavorite: boolean; error: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isFavorite: false, error: null };
    }

    const { data } = await supabase
      .from('favoritos')
      .select('id')
      .eq('user_id', user.id)
      .eq('producto_id', productId)
      .single();

    return { isFavorite: !!data, error: null };
  } catch {
    return { isFavorite: false, error: null };
  }
};

// ========================================
// BÚSQUEDA Y FILTROS
// ========================================

/**
 * Buscar productos por texto
 */
export const searchProducts = async (searchTerm: string, limit: number = 10): Promise<{ data: ProductData[]; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        profiles:user_id (
          nombre,
          apellido,
          verificado
        )
      `)
      .eq('activo', true)
      .or(`titulo.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
      .limit(limit)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  } catch (error) {
    console.error('Error searching products:', error);
    return { data: [], error };
  }
};

/**
 * Obtener productos destacados
 */
export const getFeaturedProducts = async (limit: number = 8): Promise<{ data: ProductData[]; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        profiles:user_id (
          nombre,
          apellido,
          verificado
        )
      `)
      .eq('activo', true)
      .eq('destacado', true)
      .limit(limit)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return { data: [], error };
  }
};

/**
 * Obtener estadísticas de productos
 */
export const getProductStats = async (): Promise<{ 
  totalProducts: number; 
  totalCategories: number; 
  avgPrice: number; 
  error: any 
}> => {
  try {
    const [
      { count: totalProducts },
      { data: categoriesData },
      { data: avgPriceData }
    ] = await Promise.all([
      supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('activo', true),
      supabase
        .from('productos')
        .select('categoria')
        .eq('activo', true),
      supabase
        .rpc('avg_price')
    ]);

    const uniqueCategories = new Set(categoriesData?.map(item => item.categoria));
    const avgPrice = avgPriceData?.[0]?.avg || 0;

    return {
      totalProducts: totalProducts || 0,
      totalCategories: uniqueCategories.size,
      avgPrice: Math.round(avgPrice),
      error: null
    };
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return {
      totalProducts: 0,
      totalCategories: 0,
      avgPrice: 0,
      error
    };
  }
};