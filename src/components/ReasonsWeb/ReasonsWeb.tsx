
const ReasonsWeb = () => {
  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold mb-2">Fácil de Comprar</h3>
          <p className="text-gray-600">Encuentra productos únicos con búsqueda avanzada y filtros inteligentes</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold mb-2">Vende Rápido</h3>
          <p className="text-gray-600">Publica tus productos en minutos y llega a miles de compradores</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
          <p className="text-gray-600">Transacciones protegidas y sistema de calificaciones confiable</p>
        </div>
      </div>
  )
}

export default ReasonsWeb
