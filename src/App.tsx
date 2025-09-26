import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Vender from "./pages/Vender";
import TerminosYCondiciones from "./pages/TerminosYCondiciones";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación */}
      <Navbar />

      {/* Contenido principal */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrate" element={<Register />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/vender" element={<Vender />} />
          <Route path="/terminos" element={<TerminosYCondiciones />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
