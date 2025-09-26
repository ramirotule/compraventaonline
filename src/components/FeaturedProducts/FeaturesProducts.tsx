import { formatearPrecio } from '../../utils/formatearPrecio'
import productos from '../../data/productos.json'
import { Link } from 'react-router-dom'


const FeaturesProducts = () => {
  return (
     <div>
        <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.slice(0, 3).map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagen del producto */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={producto.imagenes[0]}
                  alt={producto.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    ⭐ DESTACADO
                  </span>
                </div>
              </div>
              
              {/* Contenido del producto */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{producto.titulo}</h3>
                <p className="text-gray-600 mb-3 text-sm">{producto.descripcion.substring(0, 100)}...</p>
                
                <div className="text-2xl font-bold text-amber-400 mb-2">
                  {formatearPrecio(producto.precio)}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>📍 {producto.ubicacion}</span>
                  <span>⭐ {producto.vendedor.rating}</span>
                </div>
                
                <div className="mb-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {producto.categoria}
                  </span>
                </div>
                
                <Link 
                  to={`/productos/${producto.id}`}
                  className="block w-full bg-amber-400 text-white py-2 rounded hover:bg-amber-500 transition-colors text-center font-medium"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default FeaturesProducts
