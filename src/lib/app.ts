// Satu kode, lima aplikasi (NEXT_PUBLIC_APP):
//   pedagang (bawaan) → APK PaJaKu (TokoPaja) · konsol → APK Konsol Pasar Jaya · mitra → APK MitraPaja · kulakan → APK KulakanPaja (pemasok) · cc → APK Command Center Paja (Gubernur & Direksi, TPID)
const A = process.env.NEXT_PUBLIC_APP;
export const APP: "pedagang" | "konsol" | "mitra" | "kulakan" | "cc" = A === "konsol" ? "konsol" : A === "mitra" ? "mitra" : A === "kulakan" ? "kulakan" : A === "cc" ? "cc" : "pedagang";
export const IS_KONSOL = APP === "konsol";
export const IS_MITRA = APP === "mitra";
export const IS_KULAKAN = APP === "kulakan";
export const IS_CC = APP === "cc";
