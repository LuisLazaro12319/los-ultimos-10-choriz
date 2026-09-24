"use client";

import { useRef, useState } from "react";
import { useTienda } from "@/context/TiendaContext";
import { precio, OWNER_WHATSAPP, BRAND } from "@/lib/formato";

export function CartBox() {
  const { lineas, unidades, total, modificar, vaciar } = useTienda();
  const [nombre, setNombre] = useState("");
  const [modo, setModo] = useState<"Delivery" | "Retiro">("Delivery");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [ubicacionNota, setUbicacionNota] = useState("");
  const gpsLinkRef = useRef("");

  const vacio = lineas.length === 0;

  function usarGPS() {
    if (!navigator.geolocation) return;
    setUbicacionNota("Buscando coordenadas GPS...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        gpsLinkRef.current = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        setUbicacionNota("✓ Ubicación GPS fijada correctamente.");
        setDireccion((prev) => prev || `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => setUbicacionNota("No se pudo obtener la ubicación automáticamente.")
    );
  }

  function enviarPedido(e: React.FormEvent) {
    e.preventDefault();
    if (vacio) return;

    const lines = lineas.map((l) => `• ${l.cantidad}x ${l.nombre} — ${precio(l.subtotal)}`).join("\n");

    let entrega = "Modalidad: Retiro en el local";
    if (modo === "Delivery") {
      entrega = gpsLinkRef.current
        ? `Modalidad: Delivery\nGPS: ${gpsLinkRef.current}\nDirección: ${direccion || "-"}`
        : `Modalidad: Delivery\nDirección: ${direccion || "-"}`;
    }

    const text = [
      `*NUEVO PEDIDO — ${BRAND}*`,
      "",
      lines,
      "",
      `*TOTAL: ${precio(total)}*`,
      "",
      `Nombre: ${nombre || "Cliente"}`,
      entrega,
      notas ? `Notas: ${notas}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  }

  function descargarTicket() {
    if (vacio) return;
    const canvas = document.createElement("canvas");
    const width = 450;
    const height = 180 + lineas.length * 28 + 120;
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);

    ctx.fillStyle = "#fdfcf0";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ff4d00";
    ctx.fillRect(0, 0, width, 6);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LOS ÚLTIMOS 10 CHORIZ", width / 2, 40);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "rgba(26,26,26,0.6)";
    ctx.fillText("Parrilla al paso · CABA", width / 2, 60);

    let y = 100;
    ctx.font = "13px monospace";
    lineas.forEach((l) => {
      ctx.textAlign = "left";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(`${l.cantidad}x ${l.nombre}`, 25, y);
      ctx.textAlign = "right";
      ctx.fillText(precio(l.subtotal), width - 25, y);
      y += 28;
    });

    y += 10;
    ctx.fillStyle = "#ff4d00";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("TOTAL", 25, y);
    ctx.textAlign = "right";
    ctx.fillText(precio(total), width - 25, y);

    y += 30;
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Cliente: ${nombre || "Cliente"} · ${modo}`, 25, y);

    y += 30;
    ctx.textAlign = "center";
    ctx.font = "italic 11px sans-serif";
    ctx.fillStyle = "rgba(26,26,26,0.5)";
    ctx.fillText('"El chori que se agota primero."', width / 2, y);

    const a = document.createElement("a");
    a.download = `ticket-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  return (
    <aside className="cart-box" id="pedido">
      <h2 className="disp" style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>
        Tu Pedido {unidades > 0 && `(${unidades})`}
      </h2>

      {vacio ? (
        <p className="cart-empty">Todavía no agregaste nada. Elegí del menú.</p>
      ) : (
        <div>
          {lineas.map((l) => (
            <div className="cart-line" key={l.id}>
              <div>
                <strong>{l.nombre}</strong>
                <br />
                <small className="mono">
                  {precio(l.precio)} x {l.cantidad}
                </small>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <button
                  type="button"
                  onClick={() => modificar(l.id, -1)}
                  style={{ padding: ".2rem .5rem", border: "1px solid var(--line)", borderRadius: 4 }}
                >
                  -
                </button>
                <span className="mono">
                  <strong>{l.cantidad}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => modificar(l.id, 1)}
                  style={{ padding: ".2rem .5rem", border: "1px solid var(--line)", borderRadius: 4 }}
                >
                  +
                </button>
                <span className="mono" style={{ color: "var(--primary)", fontWeight: 700, marginLeft: ".4rem" }}>
                  {precio(l.subtotal)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-total">
        <span>TOTAL</span>
        <span className="mono" style={{ color: "var(--primary)" }}>
          {precio(total)}
        </span>
      </div>

      <form onSubmit={enviarPedido}>
        <div className="field">
          <label>Tu Nombre *</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Juan Pérez" />
        </div>

        <div className="field">
          <label>Modalidad</label>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                name="modo"
                checked={modo === "Delivery"}
                onChange={() => setModo("Delivery")}
              />{" "}
              🛵 Delivery
            </label>
            <label>
              <input type="radio" name="modo" checked={modo === "Retiro"} onChange={() => setModo("Retiro")} /> 🏪
              Retiro
            </label>
          </div>
        </div>

        <div className="field">
          <div className="gps-row">
            <label>Dirección</label>
            <button type="button" className="gps-btn" onClick={usarGPS}>
              📍 Usar mi GPS
            </button>
          </div>
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle, número, piso" />
          {ubicacionNota && <p className="gps-note">{ubicacionNota}</p>}
        </div>

        <div className="field">
          <label>Notas</label>
          <input value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Sin cebolla, timbre roto..." />
        </div>

        <button type="submit" className="btn-submit" disabled={vacio}>
          Enviar por WhatsApp
        </button>
        <button type="button" className="btn-ticket" disabled={vacio} onClick={descargarTicket}>
          🧾 Descargar ticket PNG
        </button>
        {!vacio && (
          <button
            type="button"
            onClick={vaciar}
            style={{ width: "100%", marginTop: ".6rem", fontSize: ".72rem", color: "var(--fg-soft)" }}
          >
            Vaciar pedido
          </button>
        )}
      </form>
    </aside>
  );
}
