// Satu kode, dua aplikasi: NEXT_PUBLIC_APP=konsol → APK Konsol Pasar Jaya; selain itu → APK PaJaKu (TokoPaja untuk pedagang).
export const APP: "pedagang" | "konsol" = process.env.NEXT_PUBLIC_APP === "konsol" ? "konsol" : "pedagang";
export const IS_KONSOL = APP === "konsol";
