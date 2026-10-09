"use client";

import { useCallback, useEffect, useState } from "react";
import { cargarVisitas } from "@/lib/visitas";
import type { ResumenVisitas } from "@/lib/visitasUtils";

function formatearDia(fecha: string) {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

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

      {datos && (
        <div style={{ marginTop: ".8rem" }}>
          {datos.ultimosDias.map((d) => (
            <div className="admin-list-row" key={d.fecha} style={{ padding: ".4rem 0" }}>
              <span style={{ fontSize: ".8rem", color: "var(--fg-soft)" }}>{formatearDia(d.fecha)}</span>
              <span className="mono">{d.visitas}</span>
            </div>
          ))}
        </div>
      )}

      <p className="admin-hint">
        Cuenta una visita por celular o computadora cada día (si alguien recarga la página, no suma de nuevo). Los
        números empiezan desde que se activó el contador.
      </p>
    </div>
  );
}
