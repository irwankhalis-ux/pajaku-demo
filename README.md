# PaJaKu — TokoPaja (pedagang), Konsol Pasar Jaya & MitraPaja

Satu kode, tiga aplikasi Android untuk pilot migrasi e-SHPTU & e-SIPTU Pasar Johar Baru (629 TU, data contoh). Powered by PATROL · PT Patrol Indonesia Raya.

**PaJaKu.apk — TokoPaja (aplikasi pedagang)**
- Registrasi: data diri → OTP (simulasi `481275`) → foto KTP & swafoto → pilih jalur (pemilik SHPTU kertas / Pengelola-penyewa / calon pedagang).
- Migrasi digital SHPTU mandiri: pilih kios → identitas → foto SHPTU/SIPTU kertas & kwitansi → pindai QR + GPS kios → kirim dengan PIN (`123456`) → lacak sampai e-SHPTU & e-SIPTU terbit.
- Registrasi Pengelola + persetujuan Pemilik dengan PIN; perpanjangan e-SIPTU kilat; Dompet Dokumen ber-QR; Keuangan (BPP/HPTU, bayar QRIS/VA, poin); Info harga; Kredit & program; Layanan (pertanyaan, pengaduan, darurat); Pesan.
- Buka Toko digital (TokoPaja): aktivasi dari e-SIPTU → e-Katalog (harga tetap/rentang, grosir, stok) → pesanan pembeli (konfirmasi harga → QRIS → kirim → selesai) → pelanggan → kulakan B2B (Food Station, pasar induk, koperasi; tempo SCF).
- HP contoh: Siti `081234564471` (Emerald), H. Darmawan `081398762290` (Platinum, ada persetujuan Pengelola), Budi `085711221180` (Gold, toko aktif), Andi `082133443307` (Blue), Sutrisno `081310026620` (SHPTU kertas), Rudi `081377120044` (calon Pengelola).

**Konsol-PasarJaya.apk — back office, EIS Direksi, CRM** (PIN `123456`)
- EIS Direksi, Migrasi & TTE (pengajuan dari aplikasi, corong, anomali), CRM Tenant 360 (profil, tiket, pengumuman, aktivasi), Tagihan BPP & HPTU, Operasi & harga harian, monitoring TokoPaja, Dokumen, Audit.
- HP per jenjang: Direksi (TTE batch), Kadiv, Manager Area, Kepala Pasar, Tim CRM, Petugas Pendataan, Kasir.

**MitraPaja.apk — Mitra Pengembang revitalisasi Pasar Pramuka** (PIN `123456`)
- Bermitra dengan Perumda Pasar Jaya (logo resmi di setiap layar). Akun: Direksi Mitra (EIS HP 5 tab), Sales & Marketing Manager, Sales, Collection, Customer Relation, Keuangan, dan Pengawas Pasar Jaya.
- Dashboard & denah 620 unit, inventori & harga 3 jalur (eksisting dikunci Pasar Jaya), hak eksisting & undian zoning (impor CSV → disahkan Pasar Jaya → e-SPTU otomatis), prospek Biru, pemesanan & e-SPTU (TTD pedagang → TTE Pasar Jaya), pembiayaan bank + simulasi angsuran, tagihan 5 status peringatan dini, escrow & termin pencairan, progres konstruksi (kurva S), CRM chat PaJaKu + tiket SLA + update media sosial, tata kelola, pratinjau menu Revitalisasi di HP pedagang, audit.

Data tersimpan di HP masing-masing (tanpa server). Di aplikasi pedagang ada tombol "Simulasikan proses kantor & TTE" agar alur bisa didemokan di satu HP. Kontrak backend: `API.md`.

## Kode
Next.js 16 (ekspor statis ke `out/`) + Capacitor 8 (Android). `src/lib/model.ts` model & data contoh, `src/lib/store.ts` lapisan data & aksi, `src/app/*` layar.

```bash
npm install
npm run dev            # coba di browser: http://localhost:3000
npm run apk:sync       # build web + salin ke proyek Android
cd android && ./gradlew assembleDebug   # APK di android/app/build/outputs/apk/debug/
```

## Build otomatis
Setiap push ke `main`, GitHub Actions membangun kedua APK dan menyimpannya di cabang `apk` (`PaJaKu.apk`, `Konsol-PasarJaya.apk`, `MitraPaja.apk`, `build.log`). Build lokal Konsol: `NEXT_PUBLIC_APP=konsol npm run build`, lalu `cap sync` dengan `capacitor.konsol.json` (proyek `android-konsol/`); MitraPaja: `NEXT_PUBLIC_APP=mitra`, `capacitor.mitra.json`, `android-mitra/`.

## Demo lama
`docs/index.html` = demo gabungan (Pedagang, Konsol Pasar Jaya, Konsol Mitra) untuk presentasi; bisa dibuka lewat GitHub Pages bila diaktifkan (Settings › Pages › main /docs).
