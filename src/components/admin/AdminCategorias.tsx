"use client";

import { useState } from "react";
import { useTienda } from "@/context/TiendaContext";
import { addCategoria, deleteCategoria, updateCategoria } from "@/lib/data";

export function AdminCategorias() {
  const { categorias, productos } = useTienda();
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombreEdit, setNombreEdit] = useState("");

  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    await addCategoria(nombre.trim(), categorias.length);
    setNombre("");
  }

  async function guardarEdicion(id: string) {
    if (!nombreEdit.trim()) return;
    await updateCategoria(id, { nombre: nombreEdit.trim() });
    setEditandoId(null);
  }

  async function eliminar(id: string) {
    const enUso = productos.some((p) => p.categoriaId === id);
    if (enUso && !confirm("Hay productos usando esta categoría, van a quedar sin categoría. ¿Eliminar igual?")) return;
    await deleteCategoria(id);
  }

  return (
    <div>
      <form className="admin-card" onSubmit={agregar} style={{ display: "flex", gap: ".6rem", alignItems: "flex-end" }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
          <label>Nueva categoría</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Postres" />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary">
          Agregar
        </button>
      </form>

      <div className="admin-card">
        <h3 className="disp" style={{ fontSize: "1.1rem", marginBottom: ".5rem" }}>
          Categorías ({categorias.length})
        </h3>
        {categorias.map((c) => (
          <div className="admin-list-row" key={c.id}>
            {editandoId === c.id ? (
              <input
                value={nombreEdit}
                onChange={(e) => setNombreEdit(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  padding: ".4rem .6rem",
                  border: "1px solid var(--line)",
                  borderRadius: ".5rem",
                  background: "var(--bg)",
                  color: "var(--fg)",
                }}
              />
            ) : (
              <span>
                {c.nombre}{" "}
                <span style={{ fontSize: ".75rem", color: "var(--fg-soft)" }}>
                  ({productos.filter((p) => p.categoriaId === c.id).length} productos)
                </span>
              </span>
            )}
            <div style={{ display: "flex", gap: ".5rem", flexShrink: 0 }}>
              {editandoId === c.id ? (
                <button className="admin-btn admin-btn-primary" onClick={() => guardarEdicion(c.id)}>
                  Guardar
                </button>
              ) : (
                <button
                  className="admin-btn admin-btn-ghost"
                  onClick={() => {
                    setEditandoId(c.id);
                    setNombreEdit(c.nombre);
                  }}
                >
                  Editar
                </button>
              )}
              <button className="admin-btn admin-btn-danger" onClick={() => eliminar(c.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {categorias.length === 0 && <p className="admin-hint">Todavía no hay categorías.</p>}
      </div>
    </div>
  );
}
