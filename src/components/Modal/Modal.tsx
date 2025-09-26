interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
  showButtons?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  children,
  type = 'info',
  showButtons = true,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'warning':
        return { icon: '⚠️', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', titleColor: 'text-yellow-800' };
      case 'error':
        return { icon: '❌', bgColor: 'bg-red-50', borderColor: 'border-red-200', titleColor: 'text-red-800' };
      case 'success':
        return { icon: '✅', bgColor: 'bg-green-50', borderColor: 'border-green-200', titleColor: 'text-green-800' };
      default:
        return { icon: 'ℹ️', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', titleColor: 'text-blue-800' };
    }
  };

  const { icon, bgColor, borderColor, titleColor } = getIconAndColor();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${borderColor} border`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${bgColor} px-6 py-4 border-b ${borderColor} rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{icon}</span>
              <h3 className={`text-lg font-semibold ${titleColor}`}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>

        {/* Buttons */}
        {showButtons && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-500 transition-colors"
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;