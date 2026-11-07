import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PasarJayaKu",
  description: "e-SHPTU, e-SIPTU dan data tempat usaha Anda di Pasar Jaya, dalam satu aplikasi.",
  appleWebApp: { capable: true, title: "PaJaKu", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#0F5A40", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="antialiased">
      <body className="font-sans">
        {/* Bingkai HP: penuh di ponsel, 430px di layar lebar */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-paper shadow-xl">{children}</div>
      </body>
    </html>
  );
}
