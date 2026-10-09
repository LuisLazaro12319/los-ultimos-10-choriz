"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { cargarCatalogo, seedIfEmpty } from "@/lib/data";
import { useTienda } from "@/context/TiendaContext";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminProductos } from "@/components/admin/AdminProductos";
import { AdminCategorias } from "@/components/admin/AdminCategorias";
import { AdminPromo } from "@/components/admin/AdminPromo";
import { AdminVisitas } from "@/components/admin/AdminVisitas";

type Tab = "productos" | "categorias" | "promo";

export default function AdminPage() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [errorConfig, setErrorConfig] = useState(false);
  const [tab, setTab] = useState<Tab>("productos");
  const [sembrando, setSembrando] = useState(false);
  const [errorDatos, setErrorDatos] = useState("");
  const { aplicarCatalogo } = useTienda();

  // El admin siempre trabaja sobre el menu real de la base, no sobre la copia guardada en el navegador.
  useEffect(() => {
    if (!usuario) return;
    cargarCatalogo(true)
      .then(aplicarCatalogo)
      .catch(() => setErrorDatos("No se pudo leer el menú. Revisá tu conexión y recargá la página."));
  }, [usuario, aplicarCatalogo]);

  useEffect(() => {
    try {
      return onAuthStateChanged(getFirebaseAuth(), (u) => {
        setUsuario(u);
        setCargandoAuth(false);
      });
    } catch {
      setErrorConfig(true);
      setCargandoAuth(false);
    }
  }, []);

  if (cargandoAuth) return null;
  if (errorConfig) {
    return (
      <div className="admin-shell">
        <div className="admin-login-box">
          <h1 className="disp" style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>
            Panel admin no configurado
          </h1>
          <p className="admin-hint">
            Todavía falta cargar la configuración de Firebase para este sitio. La tienda pública funciona igual,
            este mensaje solo aparece acá en /admin.
          </p>
        </div>
      </div>
    );
  }
  if (!usuario) return <AdminLogin />;

  async function cargarDatosIniciales() {
    setSembrando(true);
    setErrorDatos("");
    try {
      aplicarCatalogo(await seedIfEmpty());
    } catch (err) {
      setErrorDatos(err instanceof Error ? err.message : "No se pudieron cargar los datos de ejemplo.");
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
            <button className="admin-btn admin-btn-ghost" onClick={() => signOut(getFirebaseAuth())}>
              Salir
            </button>
          </div>
        </div>

        {errorDatos && (
          <p className="admin-hint" role="alert" style={{ color: "#ff6b6b", marginBottom: ".8rem" }}>
            {errorDatos}
          </p>
        )}

        <AdminVisitas />

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
