import type { NextConfig } from "next";

/**
 * Se hostea en Cloudflare Pages con dominio propio (losultimos10choriz.com.ar),
 * sirve desde la raiz, no como GitHub Pages con subcarpeta. Export estatico:
 * el panel admin usa el SDK de Firebase directo desde el navegador, no hace
 * falta servidor.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
