import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import productos from '../data/productos.json';
import UniversalModal from '../components/Modal/UniversalModal';
import UniversalSnackbar from '../components/Snackbar/UniversalSnackbar';

// Importar stores de Zustand
import { useAuthStore } from '../stores/authStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useUIStore } from '../stores/uiStore';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Zustand stores
  const { user, profile } = useAuthStore();
  const { 
    isFavorite, 
    toggleFavorite 
  } = useFavoritesStore();
  const {
    snackbar,
    modal,
    showSnackbar,
    hideSnackbar,
    showModal,
    hideModal
  } = useUIStore();

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user;

  // Buscar el producto por ID
  const producto = productos.find(p => p.id === Number(id));
  
  // Verificar si es favorito
  const isProductFavorite = isFavorite(Number(id));

  // Si no se encuentra el producto, redirigir a productos
  if (!producto) {
    return <Navigate to="/productos" replace />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      showModal('auth', {
        authAction: 'contact',
        productTitle: producto.titulo,
        vendorName: producto.vendedor.nombre
      });
      return;
    }
    showModal('contact', {
      productTitle: producto.titulo,
      vendorName: producto.vendedor.nombre
    });
  };

  const handleToggleFavorite = async () => {
    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    // Toggle favorito usando el store
    await toggleFavorite(producto.id);
    
    // Mostrar snackbar apropiado
    if (isProductFavorite) {
      showSnackbar('favorite-removed');
    } else {
      showSnackbar('favorite-added');
    }
  };

  const handleShare = () => {
    const message = `¡Mira este producto! ${producto.titulo} - ${formatPrice(producto.precio)}`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${message}\n\n${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      showModal('auth', {
        authAction: 'report',
        productTitle: producto.titulo,
        vendorName: producto.vendedor.nombre
      });
      return;
    }
    showModal('report', {
      productTitle: producto.titulo,
      vendorName: producto.vendedor.nombre
    });
  };

  const handleReportSubmit = (reason: string, details: string) => {
    // En una aplicación real, aquí enviarías la denuncia al backend
    console.log('Denuncia enviada:', {
      productId: producto.id,
      productTitle: producto.titulo,
      reason,
      details,
      timestamp: new Date().toISOString()
    });
    
    hideModal();
    showSnackbar('success', '¡Reporte enviado exitosamente!', 'Nuestro equipo revisará el contenido dentro de 24 horas');
  };

  const generateWhatsAppMessage = () => {
    const message = `Hola! Me interesa tu producto: ${producto.titulo} - ${formatPrice(producto.precio)}. ¿Podrías darme más información?`;
    return `https://wa.me/5491123456789?text=${encodeURIComponent(message)}`;
  };

  // Función para cerrar modal
  const handleModalClose = () => {
    hideModal();
  };

  // Función para cerrar snackbar
  const handleSnackbarClose = () => {
    hideSnackbar();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-amber-400 hover:text-amber-500">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link to="/productos" className="text-amber-400 hover:text-amber-500">
              Productos
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-600">{producto.categoria}</li>
        </ol>
      </nav>

      {/* Estado de autenticación - Solo visible si está autenticado */}
      {isAuthenticated && profile && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              Conectado como <strong>{profile.nombre || user?.email}</strong>
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de Imágenes */}
        <div className="space-y-4">
          {/* Imagen Principal */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={producto.imagenes[selectedImage]}
              alt={producto.titulo}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Miniaturas */}
          {producto.imagenes.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {producto.imagenes.map((imagen, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-amber-400'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imagen}
                    alt={`${producto.titulo} - Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del Producto */}
        <div className="space-y-6">
          {/* Título y Precio */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {producto.titulo}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl font-bold text-amber-400">
                {formatPrice(producto.precio)}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                Disponible
              </span>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-center space-x-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{producto.ubicacion}</span>
          </div>

          {/* Descripción */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Descripción
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {producto.descripcion}
            </p>
          </div>

          {/* Información del Vendedor */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Información del Vendedor
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                  {producto.vendedor.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {producto.vendedor.nombre}
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(producto.vendedor.rating)
                              ? 'text-amber-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({producto.vendedor.rating})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-3">
            <button
              onClick={handleContactSeller}
              className="w-full bg-amber-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-500 transition-colors"
            >
              💬 Contactar Vendedor
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleToggleFavorite}
                className={`border py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  isProductFavorite 
                    ? 'border-green-400 text-green-600 bg-green-50 hover:bg-green-100' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                title={!isAuthenticated ? 'Inicia sesión para agregar a favoritos' : (isProductFavorite ? 'Remover de favoritos' : 'Agregar a favoritos')}
              >
                <svg className="w-5 h-5" fill={isProductFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>
                  {!isAuthenticated ? 'Favorito' : (isProductFavorite ? 'En Favoritos' : 'Favorito')}
                </span>
              </button>
              
              <button 
                onClick={handleShare}
                className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Botón de Denuncia */}
            <button 
              onClick={handleReport}
              className="w-full border border-red-300 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>🚩 Denunciar por contenido ofensivo o prohibido</span>
            </button>
          </div>

          {/* Información Adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              💡 Consejos de Seguridad
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Revisa el producto antes de pagar</li>
              <li>• Encuentra un lugar público y seguro</li>
              <li>• No transfieras dinero sin ver el producto</li>
              <li>• Verifica la identidad del vendedor</li>
            </ul>
          </div>
        </div>
      </div>

      <UniversalModal
        isOpen={modal.isOpen}
        onClose={handleModalClose}
        type={modal.type || 'contact'}
        productTitle={producto.titulo}
        vendorName={producto.vendedor.nombre}
        authAction={modal.authAction}
        onReportSubmit={handleReportSubmit}
        whatsappUrl={generateWhatsAppMessage()}
      />

      {/* Snackbar Universal */}
      <UniversalSnackbar
        isOpen={snackbar.isOpen}
        onClose={handleSnackbarClose}
        type={snackbar.type}
        customMessage={snackbar.customMessage}
        customSubtitle={snackbar.customSubtitle}
      />
    </div>
  );
};

export default ProductDetail;