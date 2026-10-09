export type DocVisitas = {
  total?: number;
  dias?: Record<string, number>;
};

export type ResumenVisitas = {
  hoy: number;
  total: number;
};

/** Fecha (AAAA-MM-DD) en horario de Argentina, para que "el dia" no dependa de la zona del visitante. */
export function fechaArgentina(fecha: Date = new Date()): string {
  return fecha.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

/** Una visita por navegador y por dia: solo cuenta si hoy todavia no se registro desde este navegador. */
export function debeContar(ultimoDiaRegistrado: string | null, hoy: string): boolean {
  return ultimoDiaRegistrado !== hoy;
}

export function resumir(doc: DocVisitas | undefined, hoy: string): ResumenVisitas {
  return { hoy: doc?.dias?.[hoy] ?? 0, total: doc?.total ?? 0 };
}
