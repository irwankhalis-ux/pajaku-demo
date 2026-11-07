# Kontrak API PaJaKu Tahap 1A (rancangan)

Saat ini semua data ada di HP (`src/lib/store.ts`, localStorage) dengan data contoh 629 TU pilot Pasar Johar Baru. Setiap fungsi aksi di `store.ts` dipetakan ke satu endpoint di bawah. Mengganti isi fungsi dengan `fetch` ke server = aplikasi tersambung ke backend, tanpa mengubah layar.

| Fungsi di store.ts | Endpoint usulan | Siapa | Catatan |
|---|---|---|---|
| `masukPedagang(hp, otp)` | `POST /auth/otp/request`, `POST /auth/otp/verify` | Pedagang | OTP SMS (penyedia SMS); sekarang simulasi `481275` |
| `daftarAnggota(nama, hp, nik)` | `POST /pedagang` | Pedagang baru | Cek NIK ke Dukcapil |
| `masukStaf(id, pin)` | `POST /auth/staf` | Staf L1–L5 | SSO/akun Pasar Jaya; sekarang PIN `123456` |
| `useData()` (baca) | `GET /me`, `GET /tu?pasar=JHB`, `GET /dokumen?pemilik=…` | Semua | Dibatasi sesuai peran |
| `kirimPendataan(tuId, lapangan)` | `POST /tu/{id}/pendataan` | Petugas (L5) | Foto ke object storage; OTP persetujuan Pemilik |
| `validasi(tuId, setuju, catatan)` | `POST /tu/{id}/validasi` | Kepala Pasar (L4) | Setuju → dokumen `menunggu` |
| `tandaTangan()` | `POST /dokumen/tte-batch` | Direksi (L1) | Integrasi PSrE (TTE tersertifikasi) |
| `ajukanKoreksi(...)`, `tanya(...)` | `POST /tiket` | Pedagang | |
| `balasTiket(id, teks, dari)` | `POST /tiket/{id}/pesan` | Pedagang, Kepala Pasar | |
| `putuskanKoreksi(id, setuju)` | `POST /tiket/{id}/keputusan` | Kepala Pasar | Setuju → dokumen revisi `-R1` menunggu TTE |
| `anomaliSelesai`, `eskalasi` | `PATCH /anomali/{id}` | Manager Area (L3) | |
| `putuskanEskalasi(id, keputusan)` | `POST /anomali/{id}/keputusan` | Kadiv (L2) | |
| (portal) | `GET /verifikasi/{noDokumen}` | Publik (bank, notaris) | Data disamarkan; QR berisi `PASARJAYA-DOK:{no}` |

Model data: lihat tipe di `src/lib/model.ts` (Pedagang, TU, Dokumen, Tiket, Anomali, Log).
Kategori pedagang (Emerald/Platinum/Gold/Blue) dihitung dari kepemilikan e-SHPTU dan pemakaian e-SIPTU, tidak disimpan.
