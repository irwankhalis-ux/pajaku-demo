# PaJaKu — TokoPaja, Konsol Pasar Jaya, MitraPaja, KulakanPaja & Command Center Paja

Satu kode, empat aplikasi Android untuk pilot migrasi e-SHPTU & e-SIPTU Pasar Johar Baru (629 TU, data contoh). Powered by PATROL · PT Patrol Indonesia Raya.

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

**KulakanPaja.apk — aplikasi pemasok B2B** (PIN `123456`)
- Akun contoh: Perumda Pasar Jaya · Direktorat Perkulakan dan Ritel (Jakgrosir Kramat Jati). Peran: Direktur (EIS), Sales Manager, Sales Agent per grup komoditas, Merchandising, Delivery, Collection, Finance, Admin PATROL.
- Pesanan dari toko TokoPaja (persona & ID kios sama dengan PaJaKu), katalog & harga bertingkat (sama dengan menu Kulakan di TokoPaja), pembiayaan DO Bank Jakarta 30/60/90 hari khusus Emerald, CRM & broadcast (setuju Sales Manager), gudang & delivery dengan QR serah terima, collection tempo, finance DO, penugasan Gubernur/TPID, organisasi & dasar hukum Perda 7/2018, konsol PATROL multi-pemasok.
- Sinkron: menu Kulakan di TokoPaja memakai katalog `src/lib/kulakan.ts`; Konsol Pasar Jaya punya menu Perkulakan (ringkasan direktorat, TPID, harga kulakan vs eceran harian).

**CommandCenterPaja.apk — Command Center TPID & War Room Direksi** (PIN `246810`)
- Peran: Gubernur DKI (HP + video wall Command Center DKI), 5 Direktur Pasar Jaya sesuai SK Direksi 172/2022 (EIS HP: Ringkas, Keputusan, Peringatan; Dirut bisa membuka EIS direktorat lain), Operator ruang Command Center.
- Video wall 1920×1080 diskalakan otomatis (TV, tablet, HP diputar), 4 layar + putar otomatis 20 detik: Command Center TPID DKI (5 kota, 156 pasar, keputusan Gubernur), War Room 1 (okupansi, BPP, CRM), War Room 2 (harga 14 komoditas TPID dari input juru tagih/AO, validasi anomali, ingatkan AO), War Room 3 (kios tutup, penegakan BPP Perda 7/2018 Pasal 20, revitalisasi).
- Sinkron: persetujuan Gubernur atas operasi pasar/KAD otomatis menjadi penugasan Direktur Perkulakan; rekomendasi War Room 3 memakai keputusan yang sama dengan EIS Direktur. Data di `src/lib/direksi.ts`, keputusan di `src/lib/cc.ts`.
- Konsol Pasar Jaya: menu **EIS 5 Direktur** dan **Input harga TPID** (juru tagih/AO, 14 komoditas × 3 responden, tanda >25% dari median; harga valid ikut memperbarui harga harian di TokoPaja).

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
Setiap push ke `main`, GitHub Actions membangun kelima APK dan menyimpannya di cabang `apk` (`PaJaKu.apk`, `Konsol-PasarJaya.apk`, `MitraPaja.apk`, `KulakanPaja.apk`, `CommandCenterPaja.apk`, `build.log`). Build lokal Konsol: `NEXT_PUBLIC_APP=konsol npm run build`, lalu `cap sync` dengan `capacitor.konsol.json` (proyek `android-konsol/`); MitraPaja: `NEXT_PUBLIC_APP=mitra`, `capacitor.mitra.json`, `android-mitra/`; KulakanPaja: `NEXT_PUBLIC_APP=kulakan`, `capacitor.kulakan.json`, `android-kulakan/`; Command Center Paja: `NEXT_PUBLIC_APP=cc`, `capacitor.cc.json`, `android-cc/`.

## Demo lama
`docs/index.html` = demo gabungan (Pedagang, Konsol Pasar Jaya, Konsol Mitra) untuk presentasi; bisa dibuka lewat GitHub Pages bila diaktifkan (Settings › Pages › main /docs).
