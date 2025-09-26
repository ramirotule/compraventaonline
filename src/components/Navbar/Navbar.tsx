import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { HeartIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  
  if (!auth) {
    throw new Error('Navbar must be used within an AuthProvider');
  }
  
  const { user, profile, signOut } = auth;

  const handleSignOut = async () => {
    try {
      console.log('Iniciando cierre de sesión...');
      const { error } = await signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Intenta de nuevo.');
      } else {
        console.log('Sesión cerrada exitosamente');
        // Redireccionar a la página de inicio
        navigate('/');
      }
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
      alert('Error inesperado. Intenta de nuevo.');
    }
  };
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo size="xl" showText={true} className="hidden sm:flex" />
            <Logo size="md" showText={false} className="sm:hidden" />
          </Link>
          
          {/* Enlaces de navegación principales - Izquierda */}
          <div className="hidden md:flex space-x-6">

              <Link
              to="/"
              className="text-gray-700 hover:text-amber-400 transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="text-gray-700 hover:text-amber-400 transition-colors font-medium"
            >
              Comprar
            </Link>
            <Link
              to="/vender"
              className="text-gray-700 hover:text-amber-400 transition-colors font-medium"
            >
              Vender
            </Link>
            <Link
              to="/terminos"
              className="text-gray-700 hover:text-amber-400 transition-colors font-medium"
            >
              Términos y Condiciones
            </Link>
          </div>

          {/* Enlaces de autenticación - Derecha */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Usuario autenticado
              <>
                <span className="text-gray-700 font-medium">
                  Bienvenido, {profile?.nombre || user.email}
                </span>
                <Link
                  to="/favoritos"
                  className="text-gray-700 hover:text-red-500 transition-colors p-2"
                  title="Favoritos"
                >
                  <HeartIcon className="h-6 w-6" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors border border-red-600 px-4 py-2 rounded hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              // Usuario no autenticado
              <>
                <Link
                  to="/login"
                  className="text-amber-400 border border-amber-400 px-4 py-2 rounded hover:bg-amber-400 hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registrate"
                  className="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition-colors"
                >
                  Regístrate
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className="text-gray-700 hover:text-amber-400 transition-colors font-medium py-2"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="text-gray-700 hover:text-amber-400 transition-colors font-medium py-2"
            >
              Comprar
            </Link>
            <Link
              to="/vender"
              className="text-gray-700 hover:text-amber-400 transition-colors font-medium py-2"
            >
              Vender
            </Link>
            <Link
              to="/terminos"
              className="text-gray-700 hover:text-amber-400 transition-colors font-medium py-2"
            >
              Términos y Condiciones
            </Link>
            
            {/* Enlaces de autenticación móvil */}
            <div className="border-t pt-2 mt-2">
              {user ? (
                // Usuario autenticado - móvil
                <>
                  <div className="text-gray-700 font-medium py-2">
                    Bienvenido, {profile?.nombre || user.email}
                  </div>
                  <Link
                    to="/favoritos"
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-500 transition-colors py-2"
                  >
                    <HeartIcon className="h-5 w-5" />
                    <span>Favoritos</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors py-2"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                // Usuario no autenticado - móvil
                <>
                  <Link
                    to="/login"
                    className="block text-amber-400 hover:text-amber-500 transition-colors font-medium py-2"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registrate"
                    className="block text-amber-400 hover:text-amber-500 transition-colors font-medium py-2"
                  >
                    Regístrate
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
