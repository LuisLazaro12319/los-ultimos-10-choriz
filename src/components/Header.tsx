"use client";

import { useTienda } from "@/context/TiendaContext";

export function Header() {
  const { unidades } = useTienda();

  return (
    <nav>
      <div className="wrap nav-inner">
        <a href="#inicio" className="brand-logo-box">
          <img src="/img/logo.png" alt="Los Últimos 10 Choriz" className="brand-logo" />
          <span className="brand-name disp">Los Últimos 10 Choriz</span>
        </a>

        <div className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#menu">Menú</a>
        </div>

        <div className="nav-actions">
          <a href="#pedido" className="cart-btn" aria-label="Ver Carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="9.5" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            <span className="cart-badge">{unidades}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
