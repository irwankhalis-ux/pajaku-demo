import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PasarJayaKu",
    short_name: "PaJaKu",
    description: "e-SHPTU, e-SIPTU dan data tempat usaha Anda di Pasar Jaya.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F5A40",
    theme_color: "#0F5A40",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
