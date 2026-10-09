"use client";

import { useEffect } from "react";
import { registrarVisita } from "@/lib/visitas";

/** No dibuja nada: solo registra la visita del dia cuando se abre la pagina publica. */
export function ContadorVisitas() {
  useEffect(() => {
    registrarVisita();
  }, []);
  return null;
}
