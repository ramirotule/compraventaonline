
import { useState, useMemo } from "react";
import productos from "../data/productos.json";
import { Link } from "react-router-dom";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceOrder, setPriceOrder] = useState<"" | "asc" | "desc">("");

  // Obtener categorías únicas
  const categorias = useMemo(() => {
    const cats = productos.map(p => p.categoria);
    return [...new Set(cats)].sort();
  }, []);

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Filtrar y buscar productos
  const filteredProducts = useMemo(() => {
    let filtered = productos;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto => 
        producto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter(producto => producto.categoria === selectedCategory);
    }

    // Ordenar por precio
    if (priceOrder === "asc") {
      filtered = [...filtered].sort((a, b) => a.precio - b.precio);
    } else if (priceOrder === "desc") {
      filtered = [...filtered].sort((a, b) => b.precio - a.precio);
    }

    return filtered;
  }, [searchTerm, selectedCategory, priceOrder]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceOrder("");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Buscador y Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Buscador */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos, descripciones, ubicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filtro por Categoría */}
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por Precio */}
          <div className="lg:w-48">
            <select
              value={priceOrder}
              onChange={(e) => setPriceOrder(e.target.value as "" | "asc" | "desc")}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="">Ordenar precio</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </select>
          </div>

          {/* Botón Limpiar Filtros */}
          {(searchTerm || selectedCategory || priceOrder) && (
            <button
              onClick={clearFilters}
              className="lg:w-auto w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Estadísticas de búsqueda */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>
            Mostrando <strong>{filteredProducts.length}</strong> de <strong>{productos.length}</strong> productos
          </span>
          
          {searchTerm && (
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
              Búsqueda: "{searchTerm}"
            </span>
          )}
          
          {selectedCategory && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Categoría: {selectedCategory}
            </span>
          )}
          
          {priceOrder && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Precio: {priceOrder === "asc" ? "Menor a mayor" : "Mayor a menor"}
            </span>
          )}
        </div>
      </div>

      {/* Resultados */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-4">
            Intenta cambiar los filtros de búsqueda o usar términos diferentes.
          </p>
          <button
            onClick={clearFilters}
            className="bg-amber-400 text-white px-6 py-2 rounded-lg hover:bg-amber-500 transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={producto.imagenes[0]}
                  alt={producto.titulo}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {/* Badge de categoría */}
                <span className="absolute top-2 left-2 bg-amber-400 text-white text-xs px-2 py-1 rounded">
                  {producto.categoria}
                </span>
              </div>
              
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                  {producto.titulo}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {producto.descripcion}
                </p>
                
                {/* Ubicación */}
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {producto.ubicacion}
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-amber-400">
                    {formatPrice(producto.precio)}
                  </p>
                  <Link
                    to={`/productos/${producto.id}`}
                    className="bg-amber-400 text-white px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors text-sm font-semibold"
                  >
                    Ver más
                  </Link>
                </div>
                
                {/* Vendedor */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {producto.vendedor.nombre}
                    </span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-amber-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {producto.vendedor.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
