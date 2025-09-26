export interface Producto {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  moneda: string;
  categoria: string;
  ubicacion: string;
  imagenes: string[];
  vendedor: {
    nombre: string;
    rating: number;
  };
}

export interface Vendedor {
    nombre: string;
    email: string;
    telefono: string;
    rating: number;
}