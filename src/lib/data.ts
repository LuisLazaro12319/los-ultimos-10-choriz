import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Categoria, Producto, Promo } from "@/lib/types";

const categoriasRef = collection(db, "categorias");
const productosRef = collection(db, "productos");
const promoDocRef = doc(db, "config", "promo");

export function subscribeCategorias(cb: (categorias: Categoria[]) => void) {
  const q = query(categoriasRef, orderBy("orden", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Categoria, "id">) })));
  });
}

export function subscribeProductos(cb: (productos: Producto[]) => void) {
  const q = query(productosRef, orderBy("orden", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Producto, "id">) })));
  });
}

export function subscribePromo(cb: (promo: Promo | null) => void) {
  return onSnapshot(promoDocRef, (snap) => {
    cb(snap.exists() ? (snap.data() as Promo) : null);
  });
}

export async function addCategoria(nombre: string, orden: number) {
  await addDoc(categoriasRef, { nombre, orden });
}

export async function updateCategoria(id: string, data: Partial<Omit<Categoria, "id">>) {
  await updateDoc(doc(db, "categorias", id), data);
}

export async function deleteCategoria(id: string) {
  await deleteDoc(doc(db, "categorias", id));
}

export async function addProducto(data: Omit<Producto, "id">) {
  await addDoc(productosRef, data);
}

export async function updateProducto(id: string, data: Partial<Omit<Producto, "id">>) {
  await updateDoc(doc(db, "productos", id), data);
}

export async function deleteProducto(id: string) {
  await deleteDoc(doc(db, "productos", id));
}

export async function setPromo(data: Promo) {
  await setDoc(promoDocRef, data);
}

/** Carga los datos originales de ejemplo, solo si Firestore todavia esta vacio. */
export async function seedIfEmpty() {
  const [catsSnap, prodsSnap, promoSnap] = await Promise.all([
    getDocs(categoriasRef),
    getDocs(productosRef),
    getDoc(promoDocRef),
  ]);

  if (catsSnap.empty) {
    const categoriasIniciales = [
      { nombre: "Choripanes", orden: 0 },
      { nombre: "Parrilla", orden: 1 },
      { nombre: "Bebidas", orden: 2 },
    ];
    for (const cat of categoriasIniciales) {
      await addDoc(categoriasRef, cat);
    }
  }

  if (prodsSnap.empty) {
    const catsActuales = await getDocs(categoriasRef);
    const idPorNombre = new Map(catsActuales.docs.map((d) => [d.data().nombre, d.id]));

    const productosIniciales: Omit<Producto, "id">[] = [
      {
        nombre: "Choripán Clásico",
        descripcion: "Chorizo a la parrilla, pan casero y chimichurri de la casa.",
        precio: 4500,
        categoriaId: idPorNombre.get("Choripanes") ?? "",
        imagen: "/img/hero_choripan_apple_pro_1790258477411.jpg",
        orden: 0,
      },
      {
        nombre: "Choripán Completo",
        descripcion: "Chorizo, provoleta grillada, morrón asado y chimichurri.",
        precio: 5800,
        categoriaId: idPorNombre.get("Choripanes") ?? "",
        imagen: "/img/choripan_completo_provoleta_1790258486039.jpg",
        orden: 1,
      },
      {
        nombre: "Choripán Picante",
        descripcion: "Chorizo parrillero con salsa criolla picante de la casa.",
        precio: 5000,
        categoriaId: idPorNombre.get("Choripanes") ?? "",
        imagen: "/img/chori-picante.jpg",
        orden: 2,
      },
      {
        nombre: "Bondiola al Pan",
        descripcion: "Bondiola de cerdo a la parrilla, pan casero y salsa criolla.",
        precio: 6500,
        categoriaId: idPorNombre.get("Parrilla") ?? "",
        imagen: "/img/bondiola_gourmet_sandwich_1790258505659.jpg",
        orden: 3,
      },
      {
        nombre: "Vacío al Pan",
        descripcion: "Corte de vacío a la parrilla, jugoso, con chimichurri.",
        precio: 7000,
        categoriaId: idPorNombre.get("Parrilla") ?? "",
        imagen: "/img/vacio.jpg",
        orden: 4,
      },
      {
        nombre: "Papas Fritas",
        descripcion: "Porción grande de papas fritas bien crocantes.",
        precio: 3500,
        categoriaId: idPorNombre.get("Parrilla") ?? "",
        imagen: "/img/promo.jpg",
        orden: 5,
      },
      {
        nombre: "Gaseosa / Agua",
        descripcion: "Línea Coca-Cola o agua mineral, bien fría.",
        precio: 2500,
        categoriaId: idPorNombre.get("Bebidas") ?? "",
        imagen: "/img/promo.jpg",
        orden: 6,
      },
    ];
    for (const prod of productosIniciales) {
      await addDoc(productosRef, prod);
    }
  }

  if (!promoSnap.exists()) {
    await setDoc(promoDocRef, {
      activa: true,
      titulo: "2 CHORIPANES AL PRECIO DE 1",
      descripcion: "Solo por hoy: 2 choripanes clásicos por $4.500. Tocá acá para agregarlo al carrito.",
      precio: 4500,
    } satisfies Promo);
  }
}
