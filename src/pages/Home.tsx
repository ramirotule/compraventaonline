import { Link } from 'react-router-dom'
import FeaturesProducts from '../components/FeaturedProducts/FeaturesProducts'
import ReasonsWeb from '../components/ReasonsWeb/ReasonsWeb'

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          <span className="text-amber-400">COMPRA</span> Y <span className="text-amber-400">VENTA</span> ONLINE
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          La plataforma más segura y fácil para comprar y vender productos
        </p>
        <div className="space-x-4">
          <Link 
            to="/productos" 
            className="bg-amber-400 text-white px-8 py-3 rounded-lg hover:bg-amber-500 transition-colors inline-block"
          >
            Ver Productos
          </Link>
          <Link 
            to="/vender" 
            className="bg-amber-400 text-white px-8 py-3 rounded-lg hover:bg-amber-500 transition-colors inline-block"
          >
            Vender Producto
          </Link>
        </div>
      </div>
      <ReasonsWeb />
      <FeaturesProducts />
 

      {/* Call to Action */}
      {/* <div className="bg-amber-50 rounded-lg p-8 text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          ¿Listo parFa empezar?
        </h2>
        <p className="text-gray-600 mb-6">
          Únete a nuestra comunidad de compradores y vendedores
        </p>
        <Link 
          to="/login" 
          className="bg-amber-400 text-white px-8 py-3 rounded-lg hover:bg-amber-500 transition-colors inline-block"
        >
          Crear Cuenta Gratis
        </Link>
      </div> */}

   
    </div>
  )
}

export default Home
