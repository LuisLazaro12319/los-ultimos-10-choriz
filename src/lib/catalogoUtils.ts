import type { Catalogo, Categoria, Producto, Promo } from "@/lib/types";

/** Firestore limita cada documento a 1 MiB; dejamos margen. */
export const LIMITE_BYTES = 900_000;

/** Tiempo que un visitante reutiliza el catalogo guardado antes de volver a leer la base. */
export const TTL_MS = 5 * 60 * 1000;

export const CATALOGO_VACIO: Catalogo = { categorias: [], productos: [], promo: null };

export interface CacheCatalogo {
  t: number;
  catalogo: Catalogo;
}

/** Firestore rechaza `undefined`; JSON lo descarta, que es justo lo que queremos. */
export function limpiar<T>(valor: T): T {
  return JSON.parse(JSON.stringify(valor)) as T;
}

export function bytesDe(catalogo: Catalogo): number {
  return new TextEncoder().encode(JSON.stringify(catalogo)).length;
}

export function nuevoId(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function cacheVigente(cache: CacheCatalogo | null, ahora: number = Date.now()): boolean {
  return !!cache && ahora - cache.t < TTL_MS;
}

/** Lo que llega de Firestore puede venir incompleto o en otro orden: lo dejamos siempre usable. */
export function normalizar(dato: Partial<Catalogo> | undefined): Catalogo {
  const categorias = [...(dato?.categorias ?? [])].sort((a, b) => a.orden - b.orden);
  const productos = [...(dato?.productos ?? [])].sort((a, b) => a.orden - b.orden);
  return { categorias, productos, promo: dato?.promo ?? null };
}

export function estaVacio(c: Catalogo): boolean {
  return c.categorias.length === 0 && c.productos.length === 0 && !c.promo;
}

export function agregarCategoria(c: Catalogo, nombre: string): Catalogo {
  const nueva: Categoria = { id: nuevoId("cat"), nombre, orden: c.categorias.length };
  return { ...c, categorias: [...c.categorias, nueva] };
}

export function renombrarCategoria(c: Catalogo, id: string, nombre: string): Catalogo {
  return { ...c, categorias: c.categorias.map((x) => (x.id === id ? { ...x, nombre } : x)) };
}

/** Al borrar una categoria sus productos quedan "sin categoria" (categoriaId vacio). */
export function quitarCategoria(c: Catalogo, id: string): Catalogo {
  return {
    ...c,
    categorias: c.categorias.filter((x) => x.id !== id),
    productos: c.productos.map((p) => (p.categoriaId === id ? { ...p, categoriaId: "" } : p)),
  };
}

export function agregarProducto(c: Catalogo, datos: Omit<Producto, "id" | "orden">): Catalogo {
  const orden = c.productos.reduce((max, p) => Math.max(max, p.orden), -1) + 1;
  return { ...c, productos: [...c.productos, { ...datos, id: nuevoId("prod"), orden }] };
}

/** Reemplaza los datos del producto conservando su id y su lugar en el menu. */
export function reemplazarProducto(c: Catalogo, id: string, datos: Omit<Producto, "id" | "orden">): Catalogo {
  return { ...c, productos: c.productos.map((p) => (p.id === id ? { ...datos, id, orden: p.orden } : p)) };
}

export function quitarProducto(c: Catalogo, id: string): Catalogo {
  return { ...c, productos: c.productos.filter((p) => p.id !== id) };
}

export function fijarPromo(c: Catalogo, promo: Promo | null): Catalogo {
  return { ...c, promo };
}
