"use client";

import { useTienda, PROMO_ID } from "@/context/TiendaContext";
import { precio } from "@/lib/formato";

export function PromoBanner() {
  const { promo, agregar } = useTienda();

  if (!promo || !promo.activa) return null;

  return (
    <div className="promo-box" onClick={() => agregar(PROMO_ID)}>
      <div>
        <span className="promo-tag">PROMO DEL DÍA</span>
        <h3 className="disp promo-title">{promo.titulo}</h3>
        <p className="promo-desc">{promo.descripcion}</p>
      </div>
      <button type="button" className="promo-btn">
        Aprovechar Promo · {precio(promo.precio)}
      </button>
    </div>
  );
}
