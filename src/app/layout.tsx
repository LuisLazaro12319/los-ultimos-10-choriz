import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TiendaProvider } from "@/context/TiendaContext";

// Las tipografias salen de paquetes @fontsource (dentro del proyecto) en vez de bajarse de Google Fonts
// al compilar: asi el build en Cloudflare no depende de internet y no falla por cortes de red.
// (next/font exige rutas escritas literalmente, por eso no se arman con un bucle.)
const anton = localFont({
  src: [
    { path: "../../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-anton",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://losultimos10choriz.com.ar"),
  alternates: { canonical: "/" },
  title: "Los Últimos 10 Choriz | Parrilla & Choripanes",
  description:
    "Los Últimos 10 Choriz — Parrilla familiar: choripán, bondiola, vacío, mixtos y platos con guarniciones. Pedí por WhatsApp con delivery o retiro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <TiendaProvider>{children}</TiendaProvider>
      </body>
    </html>
  );
}
