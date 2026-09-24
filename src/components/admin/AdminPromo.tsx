"use client";

import { useEffect, useState } from "react";
import { useTienda } from "@/context/TiendaContext";
import { setPromo } from "@/lib/data";

export function AdminPromo() {
  const { promo } = useTienda();
  const [activa, setActiva] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!promo) return;
    setActiva(promo.activa);
    setTitulo(promo.titulo);
    setDescripcion(promo.descripcion);
    setPrecio(String(promo.precio));
  }, [promo]);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      await setPromo({ activa, titulo: titulo.trim(), descripcion: descripcion.trim(), precio: Number(precio) || 0 });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 1500);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="admin-card" onSubmit={guardar}>
      <h3 className="disp" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
        Promo del día
      </h3>

      <label className="admin-toggle-row">
        <input type="checkbox" checked={activa} onChange={(e) => setActiva(e.target.checked)} />
        Mostrar banner de promo en la página
      </label>

      <div className="field">
        <label>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="2 CHORIPANES AL PRECIO DE 1" />
      </div>
      <div className="field">
        <label>Descripción</label>
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Solo por hoy: 2 choripanes clásicos por $4.500."
        />
      </div>
      <div className="field">
        <label>Precio</label>
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
      </div>

      <button type="submit" className="admin-btn admin-btn-primary" disabled={guardando}>
        {guardado ? "¡Guardado!" : guardando ? "Guardando..." : "Guardar promo"}
      </button>
    </form>
  );
}
