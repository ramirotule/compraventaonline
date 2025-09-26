import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { HeartIcon } from '@heroicons/react/24/outline';

const Favoritos = () => {
  const auth = useContext(AuthContext);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth?.user;

  useEffect(() => {
    // Aquí se cargarían los favoritos del usuario desde Supabase
    // Por ahora solo simulamos la carga
    setTimeout(() => {
      setFavoritos([]);
      setLoading(false);
    }, 1000);
  }, [user]);

  if (!auth) {
    return <div>Error: Componente debe estar dentro de AuthProvider</div>;
  }

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
      </div>

      {favoritos.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No tienes favoritos aún
          </h2>
          <p className="text-gray-500">
            Explora productos y marca tus favoritos para verlos aquí
          </p>
          <a 
            href="/productos" 
            className="inline-block mt-4 bg-amber-400 text-white px-6 py-3 rounded-lg hover:bg-amber-500 transition-colors"
          >
            Ver Productos
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((producto: any) => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md p-4">
              {/* Aquí irían los detalles del producto favorito */}
              <p>Producto favorito</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;