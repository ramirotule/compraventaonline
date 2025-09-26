import React from 'react';

export type SnackbarType = 'success' | 'favorite-added' | 'favorite-removed' | 'error' | 'warning' | 'info';

interface UniversalSnackbarProps {
  isOpen: boolean;
  onClose: () => void;
  type: SnackbarType;
  customMessage?: string;
  customSubtitle?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const UniversalSnackbar: React.FC<UniversalSnackbarProps> = ({
  isOpen,
  onClose,
  type,
  customMessage,
  customSubtitle,
  autoClose = true,
  autoCloseDelay = 4000
}) => {
  // Auto-close functionality
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  // Configuration for different snackbar types
  const getSnackbarConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          borderColor: 'border-green-400',
          iconBgColor: 'bg-green-400',
          textColor: 'text-green-200',
          hoverColor: 'hover:bg-green-600',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ),
          title: customMessage || '¡Operación exitosa!',
          subtitle: customSubtitle || 'La acción se completó correctamente'
        };

      case 'favorite-added':
        return {
          bgColor: 'bg-amber-500',
          borderColor: 'border-amber-400',
          iconBgColor: 'bg-amber-400',
          textColor: 'text-amber-200',
          hoverColor: 'hover:bg-amber-600',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ),
          title: customMessage || '¡Agregado a favoritos!',
          subtitle: customSubtitle || 'Podrás encontrarlo en tu sección de favoritos'
        };

      case 'favorite-removed':
        return {
          bgColor: 'bg-red-500',
          borderColor: 'border-red-400',
          iconBgColor: 'bg-red-400',
          textColor: 'text-red-200',
          hoverColor: 'hover:bg-red-600',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ),
          title: customMessage || 'Eliminado de favoritos',
          subtitle: customSubtitle || 'El producto ya no está en tus favoritos'
        };

      case 'error':
        return {
          bgColor: 'bg-red-500',
          borderColor: 'border-red-400',
          iconBgColor: 'bg-red-400',
          textColor: 'text-red-200',
          hoverColor: 'hover:bg-red-600',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          title: customMessage || '❌ Error',
          subtitle: customSubtitle || 'Ha ocurrido un error inesperado'
        };

      case 'warning':
        return {
          bgColor: 'bg-yellow-500',
          borderColor: 'border-yellow-400',
          iconBgColor: 'bg-yellow-400',
          textColor: 'text-yellow-200',
          hoverColor: 'hover:bg-yellow-600',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          title: customMessage || '⚠️ Advertencia',
          subtitle: customSubtitle || 'Por favor revisa la información'
        };

      case 'info':
        return {
          bgColor: 'bg-blue-500',
          borderColor: 'border-blue-400',
          iconBgColor: 'bg-blue-400',
          textColor: 'text-blue-200',
          hoverColor: 'hover:bg-blue-600',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
          title: customMessage || 'ℹ️ Información',
          subtitle: customSubtitle || 'Ten en cuenta esta información'
        };

      default:
        return {
          bgColor: 'bg-gray-500',
          borderColor: 'border-gray-400',
          iconBgColor: 'bg-gray-400',
          textColor: 'text-gray-200',
          hoverColor: 'hover:bg-gray-600',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
          title: customMessage || 'Notificación',
          subtitle: customSubtitle || 'Nueva notificación disponible'
        };
    }
  };

  const config = getSnackbarConfig();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
      <div className={`
        text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 
        max-w-md border-l-4 pointer-events-auto transition-all duration-300 ease-in-out
        transform animate-in slide-in-from-top-5 fade-in
        ${config.bgColor} ${config.borderColor}
      `}>
        {/* Icon */}
        <div className={`rounded-full p-1 flex-shrink-0 ${config.iconBgColor}`}>
          {config.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <p className="font-semibold text-lg">
            {config.title}
          </p>
          <p className={`text-sm mt-1 ${config.textColor}`}>
            {config.subtitle}
          </p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`
            transition-colors p-1 rounded
            ${config.textColor} hover:text-white ${config.hoverColor}
          `}
          aria-label="Cerrar notificación"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UniversalSnackbar;