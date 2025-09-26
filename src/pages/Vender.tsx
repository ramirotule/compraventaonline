import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContentValidation } from '../hooks/useContentValidation';
import ValidationWarningModal from '../components/Modal/ValidationWarningModal';
import { getProvincias, getCiudadesByProvincia, type Ciudad } from '../data/argentinaData';

const Vender = () => {
  // Hook de validación de contenido
  const { validateProductContent, validateText, validateImage, isValidating } = useContentValidation();
  
  // Simular estado de autenticación (false = no logueado, true = logueado)
  // En una aplicación real esto vendría del contexto de autenticación
  const [estaLogueado, setEstaLogueado] = useState(true);
  
  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [showValidationResults, setShowValidationResults] = useState(false);
  
  // Estado para el modal de advertencias
  const [showWarningModal, setShowWarningModal] = useState(false);
  
  // Estado para el formulario
  const [producto, setProducto] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    estado: '',
    provincia: '',
    ciudad: '',
    codigoPostal: '',
    ubicacion: '', // Mantenemos para compatibilidad, se llenará automáticamente
    fotos: [] as File[]
  });

  // Estados para la ubicación
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<Ciudad[]>([]);
  
  // Obtener listas de provincias
  const provincias = getProvincias();

  // Función helper para generar ubicación completa
  const generarUbicacionCompleta = (ciudadId: string, provinciaId: string, codigoPostal: string) => {
    if (!ciudadId || !provinciaId) return '';
    
    const ciudad = ciudadesDisponibles.find(c => c.id === parseInt(ciudadId));
    const provincia = provincias.find(p => p.id === parseInt(provinciaId));
    
    if (ciudad && provincia) {
      let ubicacion = `${ciudad.nombre}, ${provincia.nombre}`;
      if (codigoPostal.trim()) {
        ubicacion += ` (CP: ${codigoPostal})`;
      }
      return ubicacion;
    }
    return '';
  };

  // Estado para validaciones en tiempo real
  const [fieldValidations, setFieldValidations] = useState<{
    titulo: { isValid: boolean; message?: string };
    descripcion: { isValid: boolean; message?: string };
  }>({
    titulo: { isValid: true },
    descripcion: { isValid: true }
  });

  // Lista de categorías disponibles
  const categorias = [
    'Electrónica',
    'Vehículos', 
    'Hogar',
    'Deportes',
    'Moda',
    'Libros',
    'Música',
    'Otros'
  ];

  // Estados del producto
  const estados = [
    'Nuevo',
    'Como nuevo',
    'Muy bueno', 
    'Bueno',
    'Regular'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Actualizar el valor del campo
    setProducto(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Lógica especial para provincia
    if (name === 'provincia') {
      const provinciaId = parseInt(value);
      if (provinciaId) {
        const ciudades = getCiudadesByProvincia(provinciaId);
        setCiudadesDisponibles(ciudades);
        // Resetear ciudad y código postal cuando cambia la provincia
        setProducto(prev => ({
          ...prev,
          provincia: value,
          ciudad: '',
          codigoPostal: '',
          ubicacion: ''
        }));
      } else {
        setCiudadesDisponibles([]);
        setProducto(prev => ({
          ...prev,
          provincia: '',
          ciudad: '',
          codigoPostal: '',
          ubicacion: ''
        }));
      }
      return;
    }
    
    // Lógica especial para ciudad
    if (name === 'ciudad') {
      const ciudadId = parseInt(value);
      if (ciudadId) {
        const ciudad = ciudadesDisponibles.find(c => c.id === ciudadId);
        const provincia = provincias.find(p => p.id === parseInt(producto.provincia));
        
        if (ciudad && provincia) {
          // Si la ciudad tiene código postal cargado, usarlo; sino dejar vacío
          const codigoPostalAutomatico = ciudad.codigoPostal || '';
          const ubicacionCompleta = generarUbicacionCompleta(value, producto.provincia, codigoPostalAutomatico);
          
          setProducto(prev => ({
            ...prev,
            ciudad: value,
            codigoPostal: codigoPostalAutomatico,
            ubicacion: ubicacionCompleta
          }));
        }
      } else {
        setProducto(prev => ({
          ...prev,
          ciudad: '',
          codigoPostal: '',
          ubicacion: ''
        }));
      }
      return;
    }

    // Lógica especial para código postal
    if (name === 'codigoPostal') {
      const ubicacionCompleta = generarUbicacionCompleta(producto.ciudad, producto.provincia, value);
      setProducto(prev => ({
        ...prev,
        codigoPostal: value,
        ubicacion: ubicacionCompleta
      }));
      return;
    }
    
    // Validar texto en tiempo real para título y descripción
    if (name === 'titulo' || name === 'descripcion') {
      const validation = validateText(value);
      
      // Actualizar validación del campo
      setFieldValidations(prev => ({
        ...prev,
        [name]: {
          isValid: validation.isValid,
          message: validation.message
        }
      }));
      
      // Si hay problemas, mostrar en consola también (para debug)
      if (!validation.isValid && validation.message) {
        console.warn(`⚠️ Contenido problemático en ${name}: ${validation.message}`);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validar cada imagen
      const validationPromises = files.map(async (file, index) => {
        const validation = await validateImage(file);
        if (!validation.isValid) {
          alert(`Error en imagen ${index + 1}: ${validation.message}`);
          return null;
        }
        return file;
      });
      
      const validatedFiles = await Promise.all(validationPromises);
      const validFiles = validatedFiles.filter(file => file !== null) as File[];
      
      setProducto(prev => ({
        ...prev,
        fotos: validFiles
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar mensajes anteriores
    setValidationErrors([]);
    setValidationWarnings([]);
    setShowValidationResults(false);

    try {
      // Validar contenido del producto
      const validation = await validateProductContent({
        titulo: producto.titulo,
        descripcion: producto.descripcion,
        fotos: producto.fotos
      });

      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);
      setShowValidationResults(true);

      if (!validation.isValid) {
        // Si hay errores, no enviar el formulario
        alert('Por favor, corrige los errores antes de publicar el producto.');
        return;
      }

      // Si hay advertencias pero no errores, mostrar modal
      if (validation.warnings.length > 0) {
        setShowWarningModal(true);
        return;
      }

      // Si no hay errores ni advertencias, proceder con la publicación
      proceedWithSubmit();

    } catch (error) {
      console.error('Error al validar contenido:', error);
      alert('Error al validar el contenido. Por favor, intenta de nuevo.');
    }
  };

  // Función para proceder con el envío después de confirmar advertencias
  const proceedWithSubmit = () => {
    // Aquí iría la lógica para enviar el producto al backend
    console.log('Producto a publicar:', producto);
    alert('¡Producto publicado exitosamente!');
    
    // Resetear formulario
    setProducto({
      titulo: '',
      descripcion: '',
      precio: '',
      categoria: '',
      estado: '',
      provincia: '',
      ciudad: '',
      codigoPostal: '',
      ubicacion: '',
      fotos: []
    });
    
    setCiudadesDisponibles([]);
    setValidationErrors([]);
    setValidationWarnings([]);
    setShowValidationResults(false);
  };

  // Handlers para el modal de advertencias
  const handleWarningModalContinue = () => {
    setShowWarningModal(false);
    proceedWithSubmit();
  };

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
  };

  // Botón para simular login/logout (solo para pruebas)
  const toggleLogin = () => {
    setEstaLogueado(!estaLogueado);
  };

  if (!estaLogueado) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Inicia Sesión para Vender
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Para poder publicar y vender tus productos necesitas estar registrado en nuestra plataforma.
          </p>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-amber-700">
                  <strong>¿Por qué necesito registrarme?</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
                  <li>Verificamos la identidad de nuestros vendedores</li>
                  <li>Garantizamos transacciones seguras</li>
                  <li>Mantienes un historial de tus ventas</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/registrate"
              className="w-full bg-amber-400 text-white py-3 px-6 rounded-lg hover:bg-amber-500 transition-colors inline-block text-lg font-semibold"
            >
              Registrarse Gratis
            </Link>
            
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-500 font-semibold">
                Inicia Sesión
              </Link>
            </p>

            {/* Botón temporal para simular login (solo para desarrollo) */}
            <div className="pt-4 border-t">
              <button
                onClick={toggleLogin}
                className="text-sm bg-gray-200 px-4 py-2 rounded text-gray-600 hover:bg-gray-300"
              >
                🧪 Simular Login (Solo para pruebas)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Publicar Producto
          </h1>
          {/* Botón temporal para simular logout */}
          <button
            onClick={toggleLogin}
            className="text-sm bg-red-100 px-4 py-2 rounded text-red-600 hover:bg-red-200"
          >
            🧪 Simular Logout
          </button>
        </div>

        {/* Información sobre políticas de contenido */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🛡️ Políticas de Contenido
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Para mantener una comunidad segura, nuestro sistema automáticamente verifica:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Lenguaje ofensivo o inapropiado en títulos y descripciones</li>
              <li>Imágenes con formato y tamaño adecuado</li>
              <li>Contenido que cumpla con nuestras normas de comunidad</li>
            </ul>
            <p className="mt-3">
              <strong>Contenido prohibido:</strong> Productos ilegales, armas, drogas, contenido para adultos, 
              productos falsificados, o cualquier material que viole nuestros términos de servicio.
            </p>
        
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* === SECCIÓN DE VALIDACIÓN === */}
          
          {/* Indicador de validación en progreso */}
          {isValidating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin text-blue-500 text-xl">⏳</div>
                <p className="text-sm font-medium text-blue-700">
                  Validando contenido del producto...
                </p>
              </div>
            </div>
          )}

          {/* Resultados de Validación */}
          {showValidationResults && (validationErrors.length > 0 || validationWarnings.length > 0) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center space-x-2">
                  <span className="text-2xl">🔍</span>
                  <span>Resultados de la Validación</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Revisión automática de contenido completada
                </p>
              </div>

              <div className="space-y-4">
                {/* Errores críticos */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-lg">⚠️</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-800 mb-2">
                          ❌ Errores que requieren corrección:
                        </h4>
                        <div className="bg-white rounded-md p-3 border border-red-200">
                          <ul className="space-y-2">
                            {validationErrors.map((error, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-500 text-xs mt-1">●</span>
                                <span className="text-sm text-red-700 leading-relaxed">{error}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-xs text-red-600 mt-2 font-medium">
                          💡 Estos errores deben solucionarse antes de publicar el producto
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Título del producto */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título del producto *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={producto.titulo}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                !fieldValidations.titulo.isValid 
                  ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' 
                  : 'border-gray-300 focus:ring-amber-400 focus:border-transparent'
              }`}
              placeholder="Ej: iPhone 13 Pro Max 256GB"
            />
            {!fieldValidations.titulo.isValid && fieldValidations.titulo.message && (
              <div className="mt-2 flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Advertencia de contenido</p>
                  <p className="text-sm text-red-700">{fieldValidations.titulo.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={producto.descripcion}
              onChange={handleInputChange}
              required
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                !fieldValidations.descripcion.isValid 
                  ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' 
                  : 'border-gray-300 focus:ring-amber-400 focus:border-transparent'
              }`}
              placeholder="Describe tu producto: características, condición, razón de venta..."
            />
            {!fieldValidations.descripcion.isValid && fieldValidations.descripcion.message && (
              <div className="mt-2 flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Advertencia de contenido</p>
                  <p className="text-sm text-red-700">{fieldValidations.descripcion.message}</p>
                  <p className="text-sm text-red-600 mt-1">
                    💡 <strong>Sugerencia:</strong> Evita lenguaje ofensivo o inapropiado. Esto ayuda a mantener una comunidad segura.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Precio y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                Precio (ARS) *
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={producto.precio}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={producto.categoria}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado y Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                Estado del producto *
              </label>
              <select
                id="estado"
                name="estado"
                value={producto.estado}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                <option value="">Seleccionar estado</option>
                {estados.map(est => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="provincia" className="block text-sm font-medium text-gray-700 mb-2">
                Provincia *
              </label>
              <select
                id="provincia"
                name="provincia"
                value={producto.provincia}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                <option value="">Selecciona una provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <select
                id="ciudad"
                name="ciudad"
                value={producto.ciudad}
                onChange={handleInputChange}
                required
                disabled={!producto.provincia}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!producto.provincia ? "Primero selecciona una provincia" : "Selecciona una ciudad"}
                </option>
                {ciudadesDisponibles.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-2">
                Código Postal
              </label>
              <input
                type="text"
                id="codigoPostal"
                name="codigoPostal"
                value={producto.codigoPostal}
                onChange={handleInputChange}
                disabled={!producto.ciudad}
                placeholder="Ej: 1000"
                pattern="[0-9]{4,8}"
                title="Ingresa un código postal válido (4 a 8 dígitos)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {!producto.ciudad ? "Selecciona una ciudad primero" : "Ingresa el código postal de la zona"}
              </p>
            </div>
          </div>

          {/* Ubicación completa (solo lectura) */}
          {producto.ubicacion && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">📍 Ubicación del producto:</p>
                  <p className="text-lg font-semibold text-gray-800">{producto.ubicacion}</p>
                  {producto.codigoPostal && (
                    <p className="text-sm text-gray-600 mt-1">
                      Esta información aparecerá en tu publicación para que los compradores sepan la ubicación exacta.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
          </div>

          {/* Fotos */}
          <div>
            <label htmlFor="fotos" className="block text-sm font-medium text-gray-700 mb-2">
              Fotos del producto
            </label>
            <input
              type="file"
              id="fotos"
              name="fotos"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Puedes subir múltiples fotos. Formatos admitidos: JPG, PNG, WebP
            </p>
            {producto.fotos.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                {producto.fotos.length} archivo(s) seleccionado(s)
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-amber-400 text-white py-3 px-6 rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors font-semibold"
            >
              Publicar Producto
            </button>
            
            <Link
              to="/"
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors text-center font-semibold"
            >
              Cancelar
            </Link>
          </div>
        </form>

        {/* Modal de advertencias */}
        <ValidationWarningModal
          isOpen={showWarningModal}
          onClose={handleWarningModalClose}
          onContinue={handleWarningModalContinue}
          warnings={validationWarnings}
        />
      </div>
    </div>
  );
};

export default Vender;