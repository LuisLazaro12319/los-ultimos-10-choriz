export type Categoria = {
  id: string;
  nombre: string;
  orden: number;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaId: string;
  imagen: string;
  orden: number;
};

export type Promo = {
  activa: boolean;
  titulo: string;
  descripcion: string;
  precio: number;
};

export type ItemCarrito = {
  productoId: string;
  cantidad: number;
};
