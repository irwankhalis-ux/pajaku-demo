// Satu kode, empat aplikasi (NEXT_PUBLIC_APP):
//   pedagang (bawaan) → APK PaJaKu (TokoPaja) · konsol → APK Konsol Pasar Jaya · mitra → APK MitraPaja · kulakan → APK KulakanPaja (pemasok)
const A = process.env.NEXT_PUBLIC_APP;
export const APP: "pedagang" | "konsol" | "mitra" | "kulakan" = A === "konsol" ? "konsol" : A === "mitra" ? "mitra" : A === "kulakan" ? "kulakan" : "pedagang";
export const IS_KONSOL = APP === "konsol";
export const IS_MITRA = APP === "mitra";
export const IS_KULAKAN = APP === "kulakan";
