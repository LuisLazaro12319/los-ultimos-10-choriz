import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TiendaProvider } from "@/context/TiendaContext";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Los Últimos 10 Choriz | Parrilla & Choripanes",
  description:
    "Los Últimos 10 Choriz — Parrilla al paso y choripanes artesanales. Pedí el tuyo por WhatsApp con delivery o retiro.",
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
