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

/** Todo lo que muestra la tienda, guardado en UN solo documento de Firestore (catalogo/principal). */
export type Catalogo = {
  categorias: Categoria[];
  productos: Producto[];
  promo: Promo | null;
};

export type ItemCarrito = {
  productoId: string;
  cantidad: number;
};
