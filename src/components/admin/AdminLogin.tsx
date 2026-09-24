"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Email o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin-login-box">
        <h1 className="disp" style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>
          Panel Admin
        </h1>
        <form onSubmit={handleSubmit} className="admin-card">
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: "100%" }} disabled={cargando}>
            {cargando ? "Entrando..." : "Entrar"}
          </button>
          {error && <p className="admin-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
