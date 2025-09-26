    import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import productos from '../data/productos.json';

const Favoritos = () => {
  const { user } = useAuthStore();
  const { favorites, loading, loadFavorites, removeFavorite } = useFavoritesStore();

  // Cargar favoritos cuando el componente se monta
  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  // Obtener productos favoritos desde los datos
  const favoriteProducts = productos.filter(producto => favorites.includes(producto.id));

  // Función para manejar eliminar de favoritos
  const handleRemoveFavorite = (e: React.MouseEvent, productId: number) => {
    e.preventDefault(); // Evita que se active el Link
    e.stopPropagation(); // Evita propagación del evento
    removeFavorite(productId);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Acceso requerido
          </h1>
          <p className="text-gray-600">
            Debes iniciar sesión para ver tus favoritos.
          </p>
          <Link 
            to="/login" 
            className="inline-block mt-4 bg-amber-400 text-white px-6 py-3 rounded-lg hover:bg-amber-500 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Mis Favoritos</h1>
        <span className="ml-3 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
          {favoriteProducts.length}
        </span>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No tienes favoritos aún
          </h2>
          <p className="text-gray-500">
            Explora productos y marca tus favoritos para verlos aquí
          </p>
          <Link 
            to="/productos" 
            className="inline-block mt-4 bg-amber-400 text-white px-6 py-3 rounded-lg hover:bg-amber-500 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
              <Link to={`/productos/${producto.id}`}>
                <img
                  src={producto.imagenes[0]}
                  alt={producto.titulo}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {producto.titulo}
                  </h3>
                  <p className="text-2xl font-bold text-amber-400 mb-2">
                    {new Intl.NumberFormat('es-AR', {
                      style: 'currency',
                      currency: 'ARS'
                    }).format(producto.precio)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {producto.ubicacion}
                  </p>
                </div>
              </Link>
              
              {/* Botón eliminar de favoritos */}
              <button
                onClick={(e) => handleRemoveFavorite(e, producto.id)}
                className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors group"
                title="Eliminar de favoritos"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Eliminar de favoritos
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;