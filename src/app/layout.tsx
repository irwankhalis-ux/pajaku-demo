import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";
import { IS_KONSOL, IS_KULAKAN, IS_MITRA } from "@/lib/app";

export const metadata: Metadata = {
  title: IS_KONSOL ? "Konsol Pasar Jaya" : IS_MITRA ? "MitraPaja" : IS_KULAKAN ? "KulakanPatrol" : "TokoPaja · PaJaKu",
  description: "e-SHPTU, e-SIPTU dan data tempat usaha Anda di Pasar Jaya, dalam satu aplikasi.",
  appleWebApp: { capable: true, title: "PaJaKu", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#0F5A40", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="antialiased">
      <body className="font-sans">
        {/* Bingkai: penuh di ponsel; 430px (PaJaKu) / 1024px (Konsol, tablet) di layar lebar */}
        <div className={`mx-auto flex min-h-dvh w-full ${IS_KONSOL || IS_MITRA || IS_KULAKAN ? "max-w-[1024px]" : "max-w-[430px]"} flex-col bg-paper shadow-xl`}>{children}</div>
      </body>
    </html>
  );
}
