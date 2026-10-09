import { doc, getDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { debeContar, fechaArgentina, resumir, type DocVisitas, type ResumenVisitas } from "@/lib/visitasUtils";

/**
 * Contador de visitas en UN solo documento (stats/visitas): { total, dias: { "AAAA-MM-DD": n } }.
 * Cuesta 1 escritura por visitante nuevo del dia (plan gratis: 20.000 escrituras por dia) y el admin
 * lo lee con 1 lectura.
 */
const CLAVE_DIA = "l10c-visita-dia";
const visitasRef = () => doc(db, "stats", "visitas");

function esDesarrollo(host: string) {
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
}

/** Suma una visita por navegador y por dia. Nunca rompe la tienda: si algo falla, no pasa nada. */
export async function registrarVisita(): Promise<void> {
  try {
    if (esDesarrollo(window.location.hostname)) return;
    const hoy = fechaArgentina();
    // Sin localStorage no podemos saber si ya contamos a este visitante: mejor no contar que contar de mas.
    if (!debeContar(localStorage.getItem(CLAVE_DIA), hoy)) return;
    await setDoc(visitasRef(), { total: increment(1), dias: { [hoy]: increment(1) } }, { merge: true });
    // Se marca recien cuando la visita se guardo: si falla, se vuelve a intentar en la proxima carga.
    localStorage.setItem(CLAVE_DIA, hoy);
  } catch {
    // las estadisticas son secundarias
  }
}

export async function cargarVisitas(): Promise<ResumenVisitas> {
  const snap = await getDoc(visitasRef());
  return resumir(snap.exists() ? (snap.data() as DocVisitas) : undefined, fechaArgentina());
}
