import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import productos from '../data/productos.json';
import UniversalModal from '../components/Modal/UniversalModal';
import UniversalSnackbar, { type SnackbarType } from '../components/Snackbar/UniversalSnackbar';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Estado unificado para snackbars
  const [snackbarState, setSnackbarState] = useState<{
    isOpen: boolean;
    type: SnackbarType;
    customMessage?: string;
    customSubtitle?: string;
  }>({
    isOpen: false,
    type: 'success'
  });
  
  // Estado unificado para modales
  const [modalState, setModalState] = useState<{
    type: 'contact' | 'report' | 'auth' | null;
    isOpen: boolean;
    authAction?: 'contact' | 'report';
  }>({
    type: null,
    isOpen: false
  });
  
  // Simular estado de autenticación (false = no logueado, true = logueado)
  // En una aplicación real esto vendría del contexto de autenticación
  const [estaLogueado, setEstaLogueado] = useState(false);

  // Buscar el producto por ID
  const producto = productos.find(p => p.id === Number(id));

  // Cargar estado de favoritos al montar el componente
  useEffect(() => {
    if (producto) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(producto.id));
    }
  }, [producto]);

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
    if (!estaLogueado) {
      setModalState({
        type: 'auth',
        isOpen: true,
        authAction: 'contact'
      });
      return;
    }
    setModalState({
      type: 'contact',
      isOpen: true
    });
  };

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const productId = producto.id;
    
    if (isFavorite) {
      // Remover de favoritos
      const newFavorites = favorites.filter((id: number) => id !== productId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      
      // Mostrar snackbar de eliminado
      setSnackbarState({
        isOpen: true,
        type: 'favorite-removed'
      });
    } else {
      // Agregar a favoritos
      const newFavorites = [...favorites, productId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(true);
      
      // Mostrar snackbar de agregado
      setSnackbarState({
        isOpen: true,
        type: 'favorite-added'
      });
    }
  };

  const handleShare = () => {
    const message = `¡Mira este producto! ${producto.titulo} - ${formatPrice(producto.precio)}`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${message}\n\n${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReport = () => {
    if (!estaLogueado) {
      setModalState({
        type: 'auth',
        isOpen: true,
        authAction: 'report'
      });
      return;
    }
    setModalState({
      type: 'report',
      isOpen: true
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
    
    // Mostrar snackbar de éxito
    setSnackbarState({
      isOpen: true,
      type: 'success',
      customMessage: '¡Reporte enviado exitosamente!',
      customSubtitle: 'Nuestro equipo revisará el contenido dentro de 24 horas'
    });
    setModalState({ type: null, isOpen: false });
  };

  const generateWhatsAppMessage = () => {
    const message = `Hola! Me interesa tu producto: ${producto.titulo} - ${formatPrice(producto.precio)}. ¿Podrías darme más información?`;
    return `https://wa.me/5491123456789?text=${encodeURIComponent(message)}`;
  };

  // Función para simular login (solo para desarrollo)
  const handleLogin = () => {
    setEstaLogueado(true);
    const currentAuthAction = modalState.authAction;
    setModalState({ type: null, isOpen: false });
    
    // Ejecutar la acción que el usuario quería hacer
    setTimeout(() => {
      if (currentAuthAction === 'contact') {
        setModalState({ type: 'contact', isOpen: true });
      } else if (currentAuthAction === 'report') {
        setModalState({ type: 'report', isOpen: true });
      }
    }, 100);
  };

  // Función para cerrar modal
  const handleModalClose = () => {
    setModalState({ type: null, isOpen: false });
  };

  // Función para cerrar snackbar
  const handleSnackbarClose = () => {
    setSnackbarState(prev => ({ ...prev, isOpen: false }));
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

      {/* Botón de simulación de autenticación (solo para desarrollo) */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            🧪 <strong>Modo de pruebas:</strong> Estado actual - {estaLogueado ? '✅ Logueado' : '❌ No logueado'}
          </span>
          <button
            onClick={() => setEstaLogueado(!estaLogueado)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              estaLogueado 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {estaLogueado ? 'Simular Logout' : 'Simular Login'}
          </button>
        </div>
      </div>

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
                  isFavorite 
                    ? 'border-red-400 text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isFavorite ? 'En Favoritos' : 'Favorito'}</span>
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
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        type={modalState.type || 'contact'}
        productTitle={producto.titulo}
        vendorName={producto.vendedor.nombre}
        authAction={modalState.authAction}
        onReportSubmit={handleReportSubmit}
        onLogin={handleLogin}
        whatsappUrl={generateWhatsAppMessage()}
      />

      {/* Snackbar Universal */}
      <UniversalSnackbar
        isOpen={snackbarState.isOpen}
        onClose={handleSnackbarClose}
        type={snackbarState.type}
        customMessage={snackbarState.customMessage}
        customSubtitle={snackbarState.customSubtitle}
      />
    </div>
  );
};

export default ProductDetail;