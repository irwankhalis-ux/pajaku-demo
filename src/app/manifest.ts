import type { MetadataRoute } from "next";
import { APP } from "@/lib/app";

export const dynamic = "force-static";

// Nama per aplikasi: TokoPaja (pedagang, APK PaJaKu) · Konsol Pasar Jaya · MitraPaja · KulakanPaja
const INFO = {
  pedagang: ["PaJaKu · TokoPaja", "PaJaKu", "TokoPaja: e-SHPTU, e-SIPTU, toko online dan kulakan pedagang Pasar Jaya.", "#0F5A40"],
  konsol: ["Konsol Pasar Jaya", "Konsol PJ", "Back office, EIS Direksi dan CRM Perumda Pasar Jaya.", "#0F2A20"],
  mitra: ["MitraPaja", "MitraPaja", "Konsol Mitra Pengembang revitalisasi bersama Perumda Pasar Jaya.", "#12302B"],
  kulakan: ["KulakanPaja", "KulakanPaja", "Aplikasi pemasok B2B untuk toko TokoPaja di pasar Pasar Jaya.", "#1E293B"],
} as const;

export default function manifest(): MetadataRoute.Manifest {
  const [name, short_name, description, warna] = INFO[APP];
  return { name, short_name, description, start_url: "/", display: "standalone", background_color: warna, theme_color: warna, icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
