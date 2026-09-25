"use client";

import { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTienda } from "@/context/TiendaContext";
import { addProducto, updateProducto, deleteProducto } from "@/lib/data";
import { precio } from "@/lib/formato";
import { storage } from "@/lib/firebase";
import { ImageCropModal } from "./ImageCropModal";
import type { Producto } from "@/lib/types";

const VACIO = { nombre: "", descripcion: "", precio: "", categoriaId: "", imagen: "" };

// Misma proporcion que el recuadro de foto en el menu (.card-img-wrap { aspect-ratio: 16 / 10 })
const ASPECTO_FOTO = 16 / 10;
const ANCHO_SALIDA = 960;
const ALTO_SALIDA = 600;

export function AdminProductos() {
  const { productos, categorias } = useTienda();
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [fotoParaRecortar, setFotoParaRecortar] = useState<string | null>(null);
  const inputArchivoRef = useRef<HTMLInputElement>(null);

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

  function onArchivoElegido(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const lector = new FileReader();
    lector.onload = () => setFotoParaRecortar(lector.result as string);
    lector.readAsDataURL(file);
  }

  async function onRecorteConfirmado(blob: Blob) {
    setFotoParaRecortar(null);
    setSubiendo(true);
    try {
      const nombreArchivo = `productos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const storageRef = ref(storage, nombreArchivo);
      await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, imagen: url }));
    } catch {
      alert("No se pudo subir la foto. Probá de nuevo.");
    } finally {
      setSubiendo(false);
    }
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
          <div className="field field-wide">
            <label>Foto del producto</label>
            <div className="admin-image-field">
              <div className={`admin-image-preview${form.imagen ? "" : " is-empty"}`}>
                {form.imagen ? <img src={form.imagen} alt="Vista previa" /> : "Sin foto"}
              </div>
              <div>
                <input
                  ref={inputArchivoRef}
                  type="file"
                  accept="image/*"
                  onChange={onArchivoElegido}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => inputArchivoRef.current?.click()}
                  disabled={subiendo}
                >
                  {subiendo ? "Subiendo..." : "Subir foto desde mi dispositivo"}
                </button>
                <p className="admin-hint" style={{ marginBottom: 0 }}>
                  Vas a poder mover y ajustar el zoom antes de guardarla.
                </p>
              </div>
            </div>
            <input
              value={form.imagen}
              onChange={(e) => setForm({ ...form, imagen: e.target.value })}
              placeholder="o pegá una URL: /img/promo.jpg o https://..."
              style={{ marginTop: ".6rem" }}
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

      {fotoParaRecortar && (
        <ImageCropModal
          imageSrc={fotoParaRecortar}
          aspect={ASPECTO_FOTO}
          outputWidth={ANCHO_SALIDA}
          outputHeight={ALTO_SALIDA}
          onCancel={() => setFotoParaRecortar(null)}
          onConfirm={onRecorteConfirmado}
        />
      )}
    </div>
  );
}
