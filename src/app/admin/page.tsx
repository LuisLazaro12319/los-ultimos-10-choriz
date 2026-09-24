"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { seedIfEmpty } from "@/lib/data";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminProductos } from "@/components/admin/AdminProductos";
import { AdminCategorias } from "@/components/admin/AdminCategorias";
import { AdminPromo } from "@/components/admin/AdminPromo";

type Tab = "productos" | "categorias" | "promo";

export default function AdminPage() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [tab, setTab] = useState<Tab>("productos");
  const [sembrando, setSembrando] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCargandoAuth(false);
    });
  }, []);

  if (cargandoAuth) return null;
  if (!usuario) return <AdminLogin />;

  async function cargarDatosIniciales() {
    setSembrando(true);
    try {
      await seedIfEmpty();
    } finally {
      setSembrando(false);
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin-wrap">
        <div className="admin-header">
          <h1 className="disp" style={{ fontSize: "1.8rem" }}>
            Panel Admin
          </h1>
          <div style={{ display: "flex", gap: ".6rem" }}>
            <button className="admin-btn admin-btn-ghost" onClick={cargarDatosIniciales} disabled={sembrando}>
              {sembrando ? "Cargando..." : "Cargar datos de ejemplo"}
            </button>
            <button className="admin-btn admin-btn-ghost" onClick={() => signOut(auth)}>
              Salir
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === "productos" ? "active" : ""}`} onClick={() => setTab("productos")}>
            Productos
          </button>
          <button className={`admin-tab ${tab === "categorias" ? "active" : ""}`} onClick={() => setTab("categorias")}>
            Categorías
          </button>
          <button className={`admin-tab ${tab === "promo" ? "active" : ""}`} onClick={() => setTab("promo")}>
            Promo del día
          </button>
        </div>

        {tab === "productos" && <AdminProductos />}
        {tab === "categorias" && <AdminCategorias />}
        {tab === "promo" && <AdminPromo />}
      </div>
    </div>
  );
}
