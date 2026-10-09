export type DocVisitas = {
  total?: number;
  dias?: Record<string, number>;
};

export type ResumenVisitas = {
  hoy: number;
  total: number;
  ultimosDias: { fecha: string; visitas: number }[];
};

/** Fecha (AAAA-MM-DD) en horario de Argentina, para que "el dia" no dependa de la zona del visitante. */
export function fechaArgentina(fecha: Date = new Date()): string {
  return fecha.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

/** Una visita por navegador y por dia: solo cuenta si hoy todavia no se registro desde este navegador. */
export function debeContar(ultimoDiaRegistrado: string | null, hoy: string): boolean {
  return ultimoDiaRegistrado !== hoy;
}

/** Resta `dias` a una fecha AAAA-MM-DD sin depender de la zona horaria de quien la calcula. */
export function restarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - dias);
  return d.toISOString().slice(0, 10);
}

export function resumir(doc: DocVisitas | undefined, hoy: string, cantidadDias = 7): ResumenVisitas {
  const dias = doc?.dias ?? {};
  const ultimosDias = Array.from({ length: cantidadDias }, (_, i) => {
    const fecha = restarDias(hoy, i);
    return { fecha, visitas: dias[fecha] ?? 0 };
  });
  return { hoy: dias[hoy] ?? 0, total: doc?.total ?? 0, ultimosDias };
}
