// Satu kode, tiga aplikasi (NEXT_PUBLIC_APP):
//   pedagang (bawaan) → APK PaJaKu (TokoPaja) · konsol → APK Konsol Pasar Jaya · mitra → APK MitraPaja (Mitra Pengembang)
const A = process.env.NEXT_PUBLIC_APP;
export const APP: "pedagang" | "konsol" | "mitra" = A === "konsol" ? "konsol" : A === "mitra" ? "mitra" : "pedagang";
export const IS_KONSOL = APP === "konsol";
export const IS_MITRA = APP === "mitra";
