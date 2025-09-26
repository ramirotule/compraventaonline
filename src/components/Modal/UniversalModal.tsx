import { useState } from 'react';
import { Link } from 'react-router-dom';

interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'contact' | 'report' | 'auth';
  // Props específicas para cada tipo
  productTitle?: string;
  vendorName?: string;
  authAction?: 'contact' | 'report';
  onReportSubmit?: (reason: string, details: string) => void;
  onLogin?: () => void;
  whatsappUrl?: string;
}

const UniversalModal: React.FC<UniversalModalProps> = ({
  isOpen,
  onClose,
  type,
  productTitle,
  vendorName,
  authAction,
  onReportSubmit,
  onLogin,
  whatsappUrl
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const reportReasons = [
    'Contenido ofensivo o inapropiado',
    'Producto falsificado o engañoso',
    'Contenido para adultos',
    'Violación de derechos de autor',
    'Spam o contenido repetitivo',
    'Producto ilegal o prohibido',
    'Información personal expuesta',
    'Otro motivo'
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      alert('Por favor selecciona un motivo de denuncia');
      return;
    }
    onReportSubmit?.(selectedReason, details);
    setSelectedReason('');
    setDetails('');
  };

  const renderContactContent = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Contactar Vendedor
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-700">
          ¿Cómo te gustaría contactar a <strong>{vendorName}</strong>?
        </p>
        
        <div className="space-y-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-center"
          >
            📱 WhatsApp
          </a>
          
          <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            📧 Email
          </button>
        </div>
      </div>
    </>
  );

  const renderReportContent = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-red-600 flex items-center space-x-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Denunciar Producto</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleReportSubmit} className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">
            <strong>Producto:</strong> {productTitle}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Tu denuncia será revisada por nuestro equipo dentro de 24 horas.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo de la denuncia *
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            required
          >
            <option value="">Selecciona un motivo</option>
            {reportReasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detalles adicionales (opcional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            placeholder="Proporciona más información sobre el problema..."
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <strong>Importante:</strong> Las denuncias falsas pueden resultar en la suspensión de tu cuenta. 
            Solo reporta contenido que realmente viole nuestras políticas de comunidad.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            🚩 Enviar Denuncia
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );

  const renderAuthContent = () => (
    <>
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Inicia Sesión Requerido
        </h3>
        <p className="text-gray-600">
          {authAction === 'contact' 
            ? 'Para contactar al vendedor necesitas estar registrado en nuestra plataforma.'
            : 'Para reportar contenido necesitas estar registrado en nuestra plataforma.'
          }
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>¿Por qué necesito registrarme?</strong><br/>
              • Verificamos la identidad para mayor seguridad<br/>
              • Prevenimos spam y contactos maliciosos<br/>
              • Mantienes un historial de tus interacciones
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          to="/registrate"
          onClick={onClose}
          className="w-full bg-amber-400 text-white py-3 px-6 rounded-lg hover:bg-amber-500 transition-colors inline-block text-center text-lg font-semibold"
        >
          Registrarse Gratis
        </Link>
        
        <Link
          to="/login"
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors inline-block text-center font-semibold"
        >
          Ya tengo cuenta - Iniciar Sesión
        </Link>

        <div className="pt-4 border-t">
          <button
            onClick={onLogin}
            className="w-full text-sm bg-green-100 px-4 py-2 rounded text-green-700 hover:bg-green-200 transition-colors"
          >
            🧪 Simular Login (Solo para pruebas)
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
        >
          Cancelar
        </button>
      </div>
    </>
  );

  const renderContent = () => {
    switch (type) {
      case 'contact':
        return renderContactContent();
      case 'report':
        return renderReportContent();
      case 'auth':
        return renderAuthContent();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default UniversalModal;