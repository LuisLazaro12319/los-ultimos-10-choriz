"use client";

import { useCallback, useEffect, useState } from "react";
import { cargarVisitas } from "@/lib/visitas";
import type { ResumenVisitas } from "@/lib/visitasUtils";

export function AdminVisitas() {
  const [datos, setDatos] = useState<ResumenVisitas | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setDatos(await cargarVisitas());
    } catch {
      setError("No se pudieron leer las visitas. Revisá tu conexión y tocá Actualizar.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <h3 className="disp" style={{ fontSize: "1.1rem" }}>
          Visitas a la página
        </h3>
        <button className="admin-btn admin-btn-ghost" onClick={cargar} disabled={cargando}>
          {cargando ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <p className="admin-hint" role="alert" style={{ color: "#ff6b6b" }}>
          {error}
        </p>
      )}

      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-lbl">Hoy</span>
          <span className="stat-num mono">{datos ? datos.hoy : "–"}</span>
        </div>
        <div className="stat-box">
          <span className="stat-lbl">Total</span>
          <span className="stat-num mono">{datos ? datos.total : "–"}</span>
        </div>
      </div>

      <p className="admin-hint">
        Cuenta una visita por celular o computadora cada día (si alguien recarga la página, no suma de nuevo).
      </p>
    </div>
  );
}
