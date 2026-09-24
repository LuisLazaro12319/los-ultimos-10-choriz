"use client";

import { useMemo, useState } from "react";
import { useTienda } from "@/context/TiendaContext";
import { precio } from "@/lib/formato";
import { CartBox } from "@/components/CartBox";

export function MenuSection() {
  const { categorias, productos, agregar } = useTienda();
  const [filtro, setFiltro] = useState<string>("TODO");

  const visibles = useMemo(() => {
    if (filtro === "TODO") return productos;
    return productos.filter((p) => p.categoriaId === filtro);
  }, [productos, filtro]);

  return (
    <div className="wrap">
      <div className="cats-bar" id="menu">
        <button className={`cat-btn ${filtro === "TODO" ? "active" : ""}`} onClick={() => setFiltro("TODO")}>
          TODO
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`cat-btn ${filtro === cat.id ? "active" : ""}`}
            onClick={() => setFiltro(cat.id)}
          >
            {cat.nombre.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="menu-layout">
        <div className="menu-grid">
          {visibles.map((item) => (
            <div className="food-card" key={item.id}>
              <div className="card-img-wrap">
                <img src={item.imagen} alt={item.nombre} />
              </div>
              <div className="card-body">
                <div>
                  <h3 className="disp card-title">{item.nombre}</h3>
                  <p className="card-desc">{item.descripcion}</p>
                </div>
                <div className="card-foot">
                  <span className="card-price">{precio(item.precio)}</span>
                  <button type="button" className="btn-add" onClick={() => agregar(item.id)}>
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {visibles.length === 0 && (
            <p style={{ color: "var(--fg-soft)", fontSize: ".85rem" }}>Todavía no hay productos en esta categoría.</p>
          )}
        </div>

        <CartBox />
      </div>
    </div>
  );
}
