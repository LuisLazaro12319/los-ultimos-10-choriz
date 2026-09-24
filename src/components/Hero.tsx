"use client";

import { useState } from "react";
import { useTienda } from "@/context/TiendaContext";
import { precio } from "@/lib/formato";

const HERO_PRODUCTO_NOMBRE = "Choripán Clásico";

export function Hero() {
  const { productos, agregar } = useTienda();
  const [agregado, setAgregado] = useState(false);

  const producto = productos.find((p) => p.nombre === HERO_PRODUCTO_NOMBRE) ?? productos[0];

  function handleAgregar() {
    if (!producto) return;
    agregar(producto.id);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  return (
    <section className="apple-hero" id="inicio">
      <div className="wrap">
        <div className="hero-topbar">
          <div>🔥 &quot;Los últimos 10 de cada tanda se agotan volando&quot;</div>
        </div>

        <div className="hero-grid">
          <div>
            <p className="hero-eyebrow">🔥 EDICIÓN DEFINITIVA</p>
            <h1 className="hero-title disp">
              Choripán de <span>verdad.</span>
            </h1>
            <p className="hero-desc">
              Chorizo 100% puro cerdo seleccionado, dorado a fuego lento sobre brasas de quebracho blanco y servido en
              pan crocante con chimichurri casero emulsionado 48hs.
            </p>

            <div className="hero-specs">
              <div className="spec-item">
                <span className="spec-lbl">Carne</span>
                <span className="spec-val">100% Cerdo</span>
                <span className="spec-det">Parrillero de pura tripa</span>
              </div>
              <div className="spec-item">
                <span className="spec-lbl">Fuego</span>
                <span className="spec-val">Quebracho</span>
                <span className="spec-det">Brasas vivas a 320°C</span>
              </div>
            </div>

            <div className="hero-actions">
              <button type="button" className="btn-hero-primary" onClick={handleAgregar}>
                {agregado ? "¡Agregado al pedido!" : (
                  <>Pedir este chori · <span>{producto ? precio(producto.precio) : "$4.500"}</span></>
                )}
              </button>
              <a href="#menu" className="btn-hero-secondary">
                Ver todo el menú
              </a>
            </div>
          </div>

          <div className="hero-stage">
            <div className="stage-img-wrap">
              <img src="/img/hero_choripan_apple_pro_1790258477411.jpg" alt="Choripán Pro" />
              <div className="stage-badge-price">{producto ? precio(producto.precio) : "$4.500"}</div>
              <div className="stage-hotspots">
                <div className="hotspot-pill">
                  <span>●</span> Brasa de Quebracho 320°C
                </div>
                <div className="hotspot-pill">
                  <span>●</span> Pan de Masa Madre Crocante
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
