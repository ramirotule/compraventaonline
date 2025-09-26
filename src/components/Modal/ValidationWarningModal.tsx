import Modal from './Modal';

interface ValidationWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  warnings: string[];
}

const ValidationWarningModal: React.FC<ValidationWarningModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  warnings
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onContinue}
      onCancel={onClose}
      title="Sugerencias para mejorar tu publicación"
      type="warning"
      confirmText="Continuar de todos modos"
      cancelText="Revisar contenido"
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Se detectaron algunas sugerencias para mejorar tu publicación:
        </p>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">💡</span>
                <span className="text-yellow-800 text-sm">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">ℹ️</span>
            <div className="text-blue-800 text-sm">
              <p className="font-medium mb-1">¿Qué puedes hacer?</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Revisar y mejorar el contenido según las sugerencias</li>
                <li>O continuar con la publicación actual</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ValidationWarningModal;