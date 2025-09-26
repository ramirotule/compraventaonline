import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";

const Navbar = () => {
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
