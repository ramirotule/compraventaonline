import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-amber-400 text-white py-2 px-4 rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registrate" className="text-amber-400 hover:text-amber-500">
              Regístrate aquí
            </Link>
          </p>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 mt-2 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
