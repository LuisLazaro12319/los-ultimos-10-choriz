"use client";

import { useState } from "react";
import { useTienda } from "@/context/TiendaContext";
import { addProducto, updateProducto, deleteProducto } from "@/lib/data";
import { precio } from "@/lib/formato";
import type { Producto } from "@/lib/types";

const VACIO = { nombre: "", descripcion: "", precio: "", categoriaId: "", imagen: "" };

export function AdminProductos() {
  const { productos, categorias } = useTienda();
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  function editar(p: Producto) {
    setEditandoId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: String(p.precio),
      categoriaId: p.categoriaId,
      imagen: p.imagen,
    });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(VACIO);
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.precio) return;
    setGuardando(true);
    const data = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      categoriaId: form.categoriaId,
      imagen: form.imagen.trim() || "/img/promo.jpg",
      orden: editandoId ? (productos.find((p) => p.id === editandoId)?.orden ?? productos.length) : productos.length,
    };
    try {
      if (editandoId) await updateProducto(editandoId, data);
      else await addProducto(data);
      cancelar();
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await deleteProducto(id);
  }

  return (
    <div>
      <form className="admin-card" onSubmit={guardar}>
        <h3 className="disp" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          {editandoId ? "Editar producto" : "Nuevo producto"}
        </h3>
        <div className="admin-form-grid">
          <div className="field">
            <label>Nombre *</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="field">
            <label>Precio *</label>
            <input
              type="number"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
            />
          </div>
          <div className="field field-wide">
            <label>Descripción</label>
            <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div className="field">
            <label>Categoría</label>
            <select
              value={form.categoriaId}
              onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
              style={{
                width: "100%",
                padding: ".6rem",
                border: "1px solid var(--line)",
                borderRadius: ".6rem",
                background: "var(--bg)",
                color: "var(--fg)",
              }}
            >
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>URL de imagen</label>
            <input
              value={form.imagen}
              onChange={(e) => setForm({ ...form, imagen: e.target.value })}
              placeholder="/img/promo.jpg o https://..."
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: ".6rem" }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={guardando}>
            {editandoId ? "Guardar cambios" : "Agregar producto"}
          </button>
          {editandoId && (
            <button type="button" className="admin-btn admin-btn-ghost" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="admin-card">
        <h3 className="disp" style={{ fontSize: "1.1rem", marginBottom: ".5rem" }}>
          Productos ({productos.length})
        </h3>
        {productos.map((p) => (
          <div className="admin-list-row" key={p.id}>
            <div>
              <strong>{p.nombre}</strong> — <span className="mono">{precio(p.precio)}</span>
              <br />
              <span style={{ fontSize: ".75rem", color: "var(--fg-soft)" }}>
                {categorias.find((c) => c.id === p.categoriaId)?.nombre ?? "Sin categoría"}
              </span>
            </div>
            <div style={{ display: "flex", gap: ".5rem", flexShrink: 0 }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => editar(p)}>
                Editar
              </button>
              <button className="admin-btn admin-btn-danger" onClick={() => eliminar(p.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {productos.length === 0 && <p className="admin-hint">Todavía no hay productos cargados.</p>}
      </div>
    </div>
  );
}
