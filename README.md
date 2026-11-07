# PaJaKu — Aplikasi Tahap 1A (versi penuh, data contoh)

Aplikasi Android PasarJayaKu untuk pilot migrasi e-SHPTU & e-SIPTU Pasar Johar Baru. Satu aplikasi untuk pedagang dan staf Pasar Jaya L1–L5. Powered by PATROL · PT Patrol Indonesia Raya.

- **Pedagang**: masuk dengan no. HP + OTP (simulasi `481275`), Beranda kios, Detail TU, Ajukan koreksi, Dompet Dokumen ber-QR, Layanan (tiket & pertanyaan), Akun & kategori. Pendaftaran anggota baru (Blue).
- **Staf** (PIN uji coba `123456`): L5 Petugas Pendataan (5 langkah + OTP Pemilik), L4 Kepala Pasar (validasi, tiket), L3 Manager Area (anomali, eskalasi), L2 Kadiv (progres wilayah, keputusan eskalasi), L1 Direksi (ringkasan, TTE batch dengan PIN).
- **Data**: 629 TU contoh, tersimpan di HP (tidak hilang saat aplikasi ditutup). Kontrak backend: `API.md`.
- Nomor HP contoh: Siti `081234564471` (Emerald), H. Darmawan `081398762290` (Platinum), Budi `085711221180` (Gold), Andi `082133443307` (Blue), Sutrisno `081310026620`.

## Kode
Next.js 16 (ekspor statis ke `out/`) + Capacitor 8 (Android). `src/lib/model.ts` model & data contoh, `src/lib/store.ts` lapisan data & aksi, `src/app/*` layar.

```bash
npm install
npm run dev            # coba di browser: http://localhost:3000
npm run apk:sync       # build web + salin ke proyek Android
cd android && ./gradlew assembleDebug   # APK di android/app/build/outputs/apk/debug/
```

## Build otomatis
Setiap push ke `main`, GitHub Actions membangun APK dan menyimpannya di cabang `apk` (`PaJaKu.apk` + `build.log`).

## Demo lama
`docs/index.html` = demo gabungan (Pedagang, Konsol Pasar Jaya, Konsol Mitra) untuk presentasi; bisa dibuka lewat GitHub Pages bila diaktifkan (Settings › Pages › main /docs).
