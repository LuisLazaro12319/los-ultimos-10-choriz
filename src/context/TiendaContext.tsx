"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { subscribeCategorias, subscribeProductos, subscribePromo } from "@/lib/data";
import type { Categoria, Producto, Promo } from "@/lib/types";

export const PROMO_ID = "__promo__";

type LineaCarrito = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
};

type TiendaContextType = {
  categorias: Categoria[];
  productos: Producto[];
  promo: Promo | null;
  cargando: boolean;
  carrito: Record<string, number>;
  lineas: LineaCarrito[];
  unidades: number;
  total: number;
  agregar: (productoId: string) => void;
  modificar: (productoId: string, delta: number) => void;
  vaciar: () => void;
};

const TiendaContext = createContext<TiendaContextType | null>(null);

const CARRITO_KEY = "l10c-carrito";

export function TiendaProvider({ children }: { children: React.ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [promo, setPromoState] = useState<Promo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CARRITO_KEY);
      if (guardado) setCarrito(JSON.parse(guardado));
    } catch {}
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    } catch {}
  }, [carrito, listo]);

  useEffect(() => {
    const unsubCat = subscribeCategorias(setCategorias);
    const unsubProd = subscribeProductos((data) => {
      setProductos(data);
      setCargando(false);
    });
    const unsubPromo = subscribePromo(setPromoState);
    return () => {
      unsubCat();
      unsubProd();
      unsubPromo();
    };
  }, []);

  const agregar = useCallback((productoId: string) => {
    setCarrito((prev) => ({ ...prev, [productoId]: (prev[productoId] ?? 0) + 1 }));
  }, []);

  const modificar = useCallback((productoId: string, delta: number) => {
    setCarrito((prev) => {
      const nueva = { ...prev };
      const cant = (nueva[productoId] ?? 0) + delta;
      if (cant <= 0) delete nueva[productoId];
      else nueva[productoId] = cant;
      return nueva;
    });
  }, []);

  const vaciar = useCallback(() => setCarrito({}), []);

  const lineas = useMemo<LineaCarrito[]>(() => {
    return Object.entries(carrito)
      .map(([id, cantidad]) => {
        if (id === PROMO_ID) {
          if (!promo) return null;
          return { id, nombre: promo.titulo, precio: promo.precio, cantidad, subtotal: promo.precio * cantidad };
        }
        const producto = productos.find((p) => p.id === id);
        if (!producto) return null;
        return { id, nombre: producto.nombre, precio: producto.precio, cantidad, subtotal: producto.precio * cantidad };
      })
      .filter((l): l is LineaCarrito => l !== null);
  }, [carrito, productos, promo]);

  const unidades = useMemo(() => lineas.reduce((acc, l) => acc + l.cantidad, 0), [lineas]);
  const total = useMemo(() => lineas.reduce((acc, l) => acc + l.subtotal, 0), [lineas]);

  return (
    <TiendaContext.Provider
      value={{ categorias, productos, promo, cargando, carrito, lineas, unidades, total, agregar, modificar, vaciar }}
    >
      {children}
    </TiendaContext.Provider>
  );
}

export function useTienda() {
  const ctx = useContext(TiendaContext);
  if (!ctx) throw new Error("useTienda debe usarse dentro de TiendaProvider");
  return ctx;
}
