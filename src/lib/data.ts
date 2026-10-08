import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  CATALOGO_VACIO,
  LIMITE_BYTES,
  agregarCategoria,
  agregarProducto,
  bytesDe,
  cacheVigente,
  estaVacio,
  fijarPromo,
  limpiar,
  normalizar,
  quitarCategoria,
  quitarProducto,
  renombrarCategoria,
  reemplazarProducto,
  type CacheCatalogo,
} from "@/lib/catalogoUtils";
import type { Catalogo, Producto, Promo } from "@/lib/types";

/**
 * Todo el menu vive en UN solo documento (catalogo/principal: categorias, productos y promo).
 * Asi cada visita a la tienda cuesta 1 lectura de Firestore sin importar cuantos productos haya
 * (plan gratis: 50.000 lecturas por dia).
 */
const CACHE_KEY = "l10c-catalogo-v1";
const catalogoRef = () => doc(db, "catalogo", "principal");

function leerCache(): CacheCatalogo | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CacheCatalogo) : null;
  } catch {
    return null;
  }
}

function guardarCache(catalogo: Catalogo) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), catalogo }));
  } catch {
    // sin espacio o modo privado: simplemente no se guarda
  }
}

/** Lo ultimo que este navegador conoce (puede estar vencido), para pintar la tienda al instante. */
export function catalogoEnCache(): Catalogo | null {
  const cache = leerCache();
  return cache ? normalizar(cache.catalogo) : null;
}

/**
 * Devuelve el menu. Si el navegador ya lo leyo hace menos de 5 minutos no toca la base (0 lecturas).
 * Si la base falla (sin internet o sin cuota), devuelve lo ultimo guardado en vez de dejar la tienda vacia.
 */
export async function cargarCatalogo(forzar = false): Promise<Catalogo> {
  const cache = leerCache();
  if (!forzar && cache && cacheVigente(cache)) return normalizar(cache.catalogo);

  try {
    const snap = await getDoc(catalogoRef());
    const catalogo = snap.exists() ? normalizar(snap.data() as Partial<Catalogo>) : CATALOGO_VACIO;
    guardarCache(catalogo);
    return catalogo;
  } catch (err) {
    if (cache) return normalizar(cache.catalogo);
    throw err;
  }
}

/** Lee, modifica y escribe el documento dentro de una transaccion (1 lectura + 1 escritura). */
async function modificar(cambiar: (actual: Catalogo) => Catalogo): Promise<Catalogo> {
  const resultado = await runTransaction(db, async (tx) => {
    const snap = await tx.get(catalogoRef());
    const actual = snap.exists() ? normalizar(snap.data() as Partial<Catalogo>) : CATALOGO_VACIO;
    const siguiente = limpiar(cambiar(actual));
    if (bytesDe(siguiente) > LIMITE_BYTES) {
      throw new Error("El menú llegó al límite de tamaño. Eliminá algún producto antes de agregar más.");
    }
    tx.set(catalogoRef(), siguiente);
    return siguiente;
  });
  guardarCache(resultado);
  return resultado;
}

export const addCategoria = (nombre: string) => modificar((c) => agregarCategoria(c, nombre));

export const updateCategoria = (id: string, nombre: string) => modificar((c) => renombrarCategoria(c, id, nombre));

export const deleteCategoria = (id: string) => modificar((c) => quitarCategoria(c, id));

export const addProducto = (datos: Omit<Producto, "id" | "orden">) => modificar((c) => agregarProducto(c, datos));

export const updateProducto = (id: string, datos: Omit<Producto, "id" | "orden">) =>
  modificar((c) => reemplazarProducto(c, id, datos));

export const deleteProducto = (id: string) => modificar((c) => quitarProducto(c, id));

export const setPromo = (promo: Promo) => modificar((c) => fijarPromo(c, promo));

function ejemplos(): Catalogo {
  const categorias = [
    { id: "cat-choripanes", nombre: "Choripanes", orden: 0 },
    { id: "cat-parrilla", nombre: "Parrilla", orden: 1 },
    { id: "cat-bebidas", nombre: "Bebidas", orden: 2 },
  ];
  const productos: Producto[] = [
    {
      id: "prod-clasico",
      nombre: "Choripán Clásico",
      descripcion: "Chorizo a la parrilla, pan casero y chimichurri de la casa.",
      precio: 4500,
      categoriaId: "cat-choripanes",
      imagen: "/img/hero_choripan_apple_pro_1790258477411.jpg",
      orden: 0,
    },
    {
      id: "prod-completo",
      nombre: "Choripán Completo",
      descripcion: "Chorizo, provoleta grillada, morrón asado y chimichurri.",
      precio: 5800,
      categoriaId: "cat-choripanes",
      imagen: "/img/choripan_completo_provoleta_1790258486039.jpg",
      orden: 1,
    },
    {
      id: "prod-picante",
      nombre: "Choripán Picante",
      descripcion: "Chorizo parrillero con salsa criolla picante de la casa.",
      precio: 5000,
      categoriaId: "cat-choripanes",
      imagen: "/img/chori-picante.jpg",
      orden: 2,
    },
    {
      id: "prod-bondiola",
      nombre: "Bondiola al Pan",
      descripcion: "Bondiola de cerdo a la parrilla, pan casero y salsa criolla.",
      precio: 6500,
      categoriaId: "cat-parrilla",
      imagen: "/img/bondiola_gourmet_sandwich_1790258505659.jpg",
      orden: 3,
    },
    {
      id: "prod-vacio",
      nombre: "Vacío al Pan",
      descripcion: "Corte de vacío a la parrilla, jugoso, con chimichurri.",
      precio: 7000,
      categoriaId: "cat-parrilla",
      imagen: "/img/vacio.jpg",
      orden: 4,
    },
    {
      id: "prod-papas",
      nombre: "Papas Fritas",
      descripcion: "Porción grande de papas fritas bien crocantes.",
      precio: 3500,
      categoriaId: "cat-parrilla",
      imagen: "/img/promo.jpg",
      orden: 5,
    },
    {
      id: "prod-gaseosa",
      nombre: "Gaseosa / Agua",
      descripcion: "Línea Coca-Cola o agua mineral, bien fría.",
      precio: 2500,
      categoriaId: "cat-bebidas",
      imagen: "/img/promo.jpg",
      orden: 6,
    },
  ];
  const promo: Promo = {
    activa: true,
    titulo: "2 CHORIPANES AL PRECIO DE 1",
    descripcion: "Solo por hoy: 2 choripanes clásicos por $4.500. Tocá acá para agregarlo al carrito.",
    precio: 4500,
  };
  return { categorias, productos, promo };
}

/** Carga el menu de ejemplo, solo si todavia no hay nada guardado. Devuelve el menu resultante. */
export async function seedIfEmpty(): Promise<Catalogo> {
  const actual = await cargarCatalogo(true);
  if (!estaVacio(actual)) return actual;
  return modificar((enBase) => (estaVacio(enBase) ? ejemplos() : enBase));
}
