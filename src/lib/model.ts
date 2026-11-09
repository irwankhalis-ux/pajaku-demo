// Model data PaJaKu Tahap 1A (migrasi e-SHPTU & e-SIPTU) + data contoh pilot Pasar Johar Baru.
// Bentuk data ini menjadi kontrak API saat backend tersambung (lihat API.md).

export type Kategori = "E" | "P" | "G" | "B";
export type Jenis = "Toko" | "Kios" | "Counter" | "Lapak";
export type StatusTU = "arsip" | "didata" | "divalidasi" | "terbit" | "dikembalikan";
export type Peran = "pedagang" | "petugas" | "kepala" | "manager" | "kadiv" | "direksi" | "crm" | "kasir";

export type Pedagang = { id: string; nama: string; hp: string; nik: string; aktif: boolean; daftar?: string };
export type Lapangan = {
  pemakaiNama: string; pemakaiNik: string; jenis: Jenis; dagangan: string; buka: boolean;
  foto: number; ownerOk: boolean; petugas: string; tgl: string;
};
export type TU = {
  id: string; noTU: string; jenis: Jenis; ukuran: string; luas: number; blok: string; lantai: string; zona: string;
  dagangan: string; pemilikId: string; pemakaiId: string; buka: boolean; status: StatusTU;
  masaHak: string; hptu: string; karyawan: string; lapangan?: Lapangan; catatan?: string;
  /** bulan tunggakan BPP: 0 lancar · 1 DPK · 2 waspada · ≥3 macet */
  tunggakan: number; mandiri?: boolean;
};
export type Dokumen = {
  no: string; jenis: "e-SHPTU" | "e-SIPTU"; tuId: string; atasNamaId: string; berlaku: string;
  status: "menunggu" | "terbit" | "batal"; terbit?: string; keterangan: string;
};
export type Pesan = { dari: "p" | "s"; teks: string; t: string };
export type Tiket = {
  id: string; jenis: "koreksi" | "tanya" | "aktivasi" | "aduan"; pedagangId: string; tuId?: string; topik: string;
  bagian?: string[]; msgs: Pesan[]; status: "terbuka" | "disetujui" | "ditolak" | "dijawab" | "selesai"; dibuat: string;
};
export type Anomali = {
  id: string; tuId: string; jenis: string; temuan: string; tindak: string; pic: string; umur: number;
  status: "terbuka" | "selesai" | "eskalasi"; keputusan?: string;
};
export type Log = { t: string; siapa: string; apa: string; tuId?: string };
export type Staf = { id: string; nama: string; peran: Exclude<Peran, "pedagang">; jabatan: string };
export type Sesi = { peran: Peran; userId: string } | null;

// ---------- TokoPaja (toko online pedagang) ----------
export type Toko = {
  id: string; pedagangId: string; tuId: string; siptu: string; nama: string;
  ambil: boolean; antar: boolean; kulakan: boolean; buka: boolean; dibuat: string; omzet: number; transaksi: number;
};
export type Produk = {
  id: string; tokoId: string; nama: string; satuan: string; mode: "tetap" | "rentang";
  hMin: number; hMax: number; grosir: boolean; stok: boolean;
};
export type ItemPesanan = { nama: string; qty: number; sat: string; hMin: number; hMax: number; harga: number; ada: boolean };
export type Pesanan = {
  id: string; tokoId: string; pembeli: string; hpPembeli: string; kirim: "ambil" | "antar"; alamat?: string;
  items: ItemPesanan[]; ongkir: number; tahap: number; batal?: boolean; jam: string;
  chat: { who: "p" | "t" | "s"; text: string }[]; nilai?: number; ulasan?: string;
};
export type Kulakan = {
  id: string; tokoId: string; pemasok: string; items: { nama: string; qty: number; sat: string; harga: number }[];
  bayar: "tunai" | "tempo" | "qris" | "do30" | "do60" | "do90"; status: "dipesan" | "dikonfirmasi" | "dikirim" | "diterima"; tgl: string;
};
// ---------- keuangan, pengajuan, CRM ----------
export type Tagihan = {
  id: string; pedagangId: string; tuId: string; jenis: "BPP" | "HPTU" | "Perpanjangan e-SIPTU"; periode: string;
  jumlah: number; jatuhTempo: string; status: "belum" | "lunas" | "terlambat"; bayar?: { metode: string; tgl: string };
};
export type Pengajuan = {
  id: string; jenis: "migrasi" | "pengelola" | "perpanjangan" | "program"; pedagangId: string; tuId?: string;
  judul: string; data: Record<string, string>; tahap: number; status: "proses" | "disetujui" | "ditolak";
  dibuat: string; riwayat: { t: string; apa: string }[];
};
export type Notif = { id: string; pedagangId: string; judul: string; isi: string; t: string; baca: boolean; href?: string };
export type Interaksi = { t: string; pedagangId: string; kanal: string; catatan: string; oleh: string };
export type Pengumuman = { id: string; judul: string; isi: string; sasaran: string; t: string; oleh: string; terkirim: number };
/** Input harga TPID juru tagih/AO: 3 responden per komoditas; dikirim ke War Room & Command Center Gubernur. */
export type EntriTPID = { id: string; pasar: string; tgl: string; t: string; oleh: string; baris: { komoditas: string; harga: [number, number, number]; median: number; acuan: number; tanda: boolean; foto: boolean }[] };
export type Harga = { komoditas: string; satuan: string; kelompok: string; hariIni: number; kemarin: number; t: string };

export type State = {
  versi: number; pedagang: Pedagang[]; tu: TU[]; dok: Dokumen[]; tiket: Tiket[]; anomali: Anomali[];
  log: Log[]; sesi: Sesi; seq: number;
  toko: Toko[]; produk: Produk[]; pesanan: Pesanan[]; kulakan: Kulakan[]; tagihan: Tagihan[];
  pengajuan: Pengajuan[]; notif: Notif[]; interaksi: Interaksi[]; pengumuman: Pengumuman[]; harga: Harga[]; poin: Record<string, number>; tpid?: EntriTPID[];
};
export const VERSI = 2;

export const PIN_DEMO = "123456";
export const OTP_DEMO = "481275";
export const PASAR = "Pasar Johar Baru";
export const TOTAL_TU = 629;

export const STAF: Staf[] = [
  { id: "S-PTG-01", nama: "Rina Marlina", peran: "petugas", jabatan: "Petugas Pendataan" },
  { id: "S-KPS-01", nama: "Bambang Sutejo", peran: "kepala", jabatan: "Kepala Pasar Johar Baru" },
  { id: "S-MGR-01", nama: "Ratna Kusuma", peran: "manager", jabatan: "Manager Area Jakarta Pusat" },
  { id: "S-KDV-01", nama: "Agus Prasetyo", peran: "kadiv", jabatan: "Kadiv Operasional Pasar I" },
  { id: "S-DIR-01", nama: "Direktur Properti dan Perpasaran", peran: "direksi", jabatan: "Direksi" },
  { id: "S-CRM-01", nama: "Maya Permata", peran: "crm", jabatan: "Tim CRM Kantor Pasar Johar Baru" },
  { id: "S-KSR-01", nama: "Iwan Gunawan", peran: "kasir", jabatan: "Kasir / Juru Tagih Johar Baru" },
];

/** Komoditas per kelompok dagangan e-SIPTU (produk toko hanya dari kelompok yang tercatat). */
export const KOMODITAS: Record<string, [string, string, number, number][]> = {
  "Pangan Kering": [["Beras Medium", "kg", 12800, 13700], ["Beras Premium", "kg", 15000, 16000], ["Gula Pasir", "kg", 17300, 18700], ["Minyak Goreng", "liter", 15700, 17500], ["Telur Ayam Ras", "kg", 27500, 30500], ["Tepung Terigu", "kg", 11500, 13000]],
  "Pangan Basah": [["Cabai Merah Keriting", "kg", 42000, 48000], ["Bawang Merah", "kg", 38000, 44000], ["Tomat", "kg", 10000, 13000], ["Bayam", "ikat", 4000, 5500], ["Ayam Potong", "kg", 34000, 38000], ["Ikan Kembung", "kg", 36000, 42000]],
  "Sayur & Buah": [["Wortel", "kg", 12000, 15000], ["Kentang", "kg", 16000, 19000], ["Jeruk Medan", "kg", 22000, 28000], ["Pisang Ambon", "sisir", 18000, 25000]],
  "Makanan Olahan": [["Kue Basah", "pcs", 2500, 4000], ["Tempe", "papan", 5000, 7000], ["Tahu Putih", "pak", 6000, 8000]],
  "Kelontong": [["Sabun Cuci", "pcs", 4000, 6000], ["Kopi Sachet", "renceng", 12000, 15000], ["Air Mineral", "dus", 38000, 45000]],
  "Sandang": [["Kemeja Batik", "pcs", 85000, 150000], ["Daster", "pcs", 45000, 70000], ["Kerudung", "pcs", 35000, 60000]],
  "Jasa": [["Jahit / Permak", "pcs", 15000, 35000]],
};

export const PEMASOK = [
  { id: "FS", nama: "Food Station Tjipinang Jaya", ket: "BUMD pangan DKI · antar H+1 · bayar saat terima", items: [["Beras Medium", "karung 25 kg", 318000], ["Beras Premium", "karung 25 kg", 372000], ["Gula Pasir", "karung 50 kg", 845000], ["Minyak Goreng", "dus 12 L", 186000]] as [string, string, number][] },
  { id: "KJ", nama: "Mitra Sayur Pasar Induk Kramat Jati", ket: "Antar subuh · minimal Rp500.000", items: [["Cabai Merah Keriting", "kg", 39000], ["Bawang Merah", "kg", 35000], ["Tomat", "kg", 8500], ["Kentang", "kg", 14000]] as [string, string, number][] },
  { id: "KOP", nama: "Koperasi Pedagang Johar Baru", ket: "Ambil di kantor pasar · anggota dapat SHU", items: [["Kopi Sachet", "renceng", 10500], ["Sabun Cuci", "lusin", 42000], ["Air Mineral", "dus", 35000]] as [string, string, number][] },
];

export const PROGRAM = [
  { id: "KMK", judul: "Kredit modal kerja Bank Jakarta", ket: "Agunan e-SHPTU · s.d. Rp50 juta · bunga KUR", untuk: ["E", "P"] },
  { id: "KUR", judul: "KUR Mikro tanpa agunan", ket: "e-SIPTU sebagai bukti usaha · s.d. Rp10 juta", untuk: ["E", "G"] },
  { id: "LAT", judul: "Pelatihan & sarana Pemprov DKI", ket: "Timbangan digital, etalase, literasi QRIS", untuk: ["E", "P", "G", "B"] },
  { id: "JKS", judul: "Sewa TU kosong lewat JaKios", ket: "Pilih kios kosong di 156 pasar Pasar Jaya", untuk: ["B", "G"] },
];

export const KATEGORI: Record<Kategori, { nama: string; id: string; peran: string; warna: string; chip: string; grad: string; desc: string }> = {
  E: { nama: "Emerald", id: "Zamrud", peran: "Pemilik & pedagang", warna: "#04503A", chip: "#7FF0C2", grad: "linear-gradient(150deg,#04503A,#0E9F6E)", desc: "Pemilik TU yang berdagang langsung: nama di e-SHPTU dan e-SIPTU." },
  P: { nama: "Platinum", id: "Platina", peran: "Pemilik", warna: "#2E3F49", chip: "#DDE6EA", grad: "linear-gradient(150deg,#2E3F49,#6E8794)", desc: "Pemilik TU yang tidak berdagang sendiri; e-SIPTU dipegang Pengelola, atau kembali ke Pemilik saat TU kosong." },
  G: { nama: "Gold", id: "Emas", peran: "Pengelola", warna: "#6E4F0C", chip: "#F6D77A", grad: "linear-gradient(150deg,#6E4F0C,#B8861F)", desc: "Keluarga Pemilik atau penyewa, setara. Nama di e-SIPTU atas persetujuan Pemilik." },
  B: { nama: "Blue", id: "Biru", peran: "Anggota", warna: "#1E4FA8", chip: "#BFD7FF", grad: "linear-gradient(150deg,#1E4FA8,#3B82F6)", desc: "Sudah mendaftar, belum tercatat di TU mana pun." },
};

export const DAGANGAN = ["Pangan Kering", "Pangan Basah", "Makanan Olahan", "Sandang", "Sayur & Buah", "Kelontong", "Jasa"];

// ---------- data contoh (deterministik) ----------
const DEPAN = ["Siti", "Ahmad", "Budi", "Dewi", "Rudi", "Sri", "Agus", "Nur", "Hendra", "Yuni", "Joko", "Lina", "Eko", "Wati", "Asep", "Rina", "Dedi", "Ani", "Bayu", "Fitri", "Imam", "Ratna", "Slamet", "Tuti", "Wahyu", "Yanti", "Hasan", "Maya", "Iwan", "Sari"];
const BELAKANG = ["Hidayat", "Saputra", "Lestari", "Wijaya", "Kurniawan", "Rahayu", "Santoso", "Pratama", "Hartono", "Susanti", "Nugroho", "Setiawan", "Fauzi", "Wulandari", "Gunawan", "Hakim", "Permata", "Siregar", "Harahap", "Purnama"];
const BLOK: [string, string, number, string][] = [
  ["A", "L1", 156, "Pangan Kering"], ["A", "L2", 148, "Sandang"], ["B", "L1", 132, "Pangan Basah"], ["B", "L2", 105, "Kelontong"], ["C", "B", 88, "Pangan Basah"],
];

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
const pad = (n: number, w: number) => String(n).padStart(w, "0");
export const sekarang = () => new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const UKURAN: Record<Jenis, [string, number]> = { Toko: ["3 × 3 m", 9], Kios: ["2 × 2 m", 4], Counter: ["2 × 3 m", 6], Lapak: ["2 × 3 m", 6] };

export function seed(): State {
  const r = rng(20261107);
  const pedagang: Pedagang[] = [];
  const tu: TU[] = [];
  const dok: Dokumen[] = [];
  let pid = 46000, sSh = 1000, sSi = 1000;
  const orang = (nama: string, aktif = false, id?: string, hp?: string): Pedagang => {
    const p: Pedagang = { id: id ?? `PJK-${pad(pid++, 7)}`, nama, hp: hp ?? `08${pad(Math.floor(r() * 1e10), 10)}`, nik: `3171${pad(Math.floor(r() * 1e12), 12)}`, aktif };
    pedagang.push(p);
    return p;
  };

  // persona tetap (sama dengan demo)
  const siti = orang("Siti Rahmawati", true, "PJK-0045717", "081234564471");
  const darmawan = orang("H. Darmawan", true, "PJK-0045118", "081398762290");
  const budi = orang("Budi Darmawan", true, "PJK-0087120", "085711221180");
  const dewi = orang("Dewi Lestari", true, "PJK-0091544", "081855430937");
  orang("Andi Pratama", true, "PJK-0139502", "082133443307").daftar = "2 Nov 2026";
  const sutrisno = orang("Sutrisno", false, "PJK-0043990", "081310026620");
  const rudi = orang("Rudi Hartono", true, "PJK-0127448", "081377120044"); rudi.daftar = "1 Nov 2026";

  const khusus: Record<string, Partial<TU> & { sh?: [string, string]; si?: [string, string] | null; siMenunggu?: boolean }> = {
    "JHB-A-L1-023": { jenis: "Kios", dagangan: "Pangan Kering", pemilikId: siti.id, pemakaiId: siti.id, masaHak: "2024–2044", hptu: "Lunas", karyawan: "1 · Ahmad Nurdin", sh: ["eSHPTU-JHB-2024-000123", "2024–2044"], si: ["eSIPTU-JHB-2026-000456", "s.d. 31 Des 2026"] },
    "JHB-A-L1-031": { jenis: "Lapak", dagangan: "Pangan Basah", pemilikId: siti.id, pemakaiId: siti.id, masaHak: "2024–2044", hptu: "Dicicil 24/36", karyawan: "—", sh: ["eSHPTU-JHB-2025-000208", "2024–2044"], si: ["eSIPTU-JHB-2026-000471", "s.d. 31 Des 2026"] },
    "JHB-B-L1-010": { jenis: "Counter", dagangan: "Pangan Basah", pemilikId: darmawan.id, pemakaiId: budi.id, masaHak: "2022–2042", hptu: "Lunas", karyawan: "—", sh: ["eSHPTU-JHB-2022-000310", "2022–2042"], si: ["eSIPTU-JHB-2026-000512", "s.d. 31 Des 2026"] },
    "JHB-B-L1-011": { jenis: "Lapak", dagangan: "Pangan Basah", pemilikId: darmawan.id, pemakaiId: budi.id, masaHak: "2022–2042", hptu: "Lunas", karyawan: "—", sh: ["eSHPTU-JHB-2022-000312", "2022–2042"], si: ["eSIPTU-JHB-2026-000514", "s.d. 31 Des 2026"] },
    "JHB-B-L2-009": { jenis: "Kios", dagangan: "Sandang", pemilikId: darmawan.id, pemakaiId: dewi.id, masaHak: "2022–2042", hptu: "Lunas", karyawan: "—", status: "divalidasi", sh: ["eSHPTU-JHB-2022-000311", "2022–2042"], si: ["eSIPTU-JHB-2026-000513", "s.d. 31 Des 2026"], siMenunggu: true },
    "JHB-C-B-044": { jenis: "Lapak", dagangan: "—", pemilikId: darmawan.id, pemakaiId: darmawan.id, buka: false, masaHak: "2022–2042", hptu: "Lunas", karyawan: "—", status: "terbit", sh: ["eSHPTU-JHB-2022-000318", "2022–2042"], si: ["eSIPTU-JHB-2026-000530", "s.d. 31 Des 2026"] },
    "JHB-B-L2-045": { jenis: "Kios", dagangan: "Sandang", pemilikId: sutrisno.id, pemakaiId: sutrisno.id, masaHak: "2016–2036", hptu: "Lunas", karyawan: "—", status: "arsip", sh: undefined, si: undefined },
  };

  // status mengikuti angka pilot: 452 terbit · 45 divalidasi (antrean TTE) · 51 didata · 81 belum didata
  const order: StatusTU[] = [];
  for (let i = 0; i < TOTAL_TU; i++) order.push(i < 452 ? "terbit" : i < 497 ? "divalidasi" : i < 548 ? "didata" : "arsip");
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }

  let k = 0;
  for (const [blok, lantai, n, dag] of BLOK) {
    for (let i = 1; i <= n; i++, k++) {
      const id = `JHB-${blok}-${lantai}-${pad(i, 3)}`;
      const x = khusus[id];
      const jenis: Jenis = x?.jenis ?? (r() < 0.06 ? "Toko" : r() < 0.18 ? "Counter" : blok === "C" || r() < 0.2 ? "Lapak" : "Kios");
      const kosong = x ? x.buka === false : r() < 0.232; // ±146 TU kosong
      let pemilikId = x?.pemilikId, pemakaiId = x?.pemakaiId;
      if (!pemilikId) {
        const pem = orang(`${DEPAN[Math.floor(r() * DEPAN.length)]} ${BELAKANG[Math.floor(r() * BELAKANG.length)]}`, r() < 0.7);
        pemilikId = pem.id;
        pemakaiId = kosong || r() < 0.65 ? pem.id : orang(`${DEPAN[Math.floor(r() * DEPAN.length)]} ${BELAKANG[Math.floor(r() * BELAKANG.length)]}`, r() < 0.7).id;
      }
      const tahun = 2016 + Math.floor(r() * 9);
      const status = x?.status ?? order[k];
      const t: TU = {
        id, noTU: `TU-JHB-${blok}-${pad(i, 4)}`, jenis, ukuran: UKURAN[jenis][0], luas: UKURAN[jenis][1], blok, lantai,
        zona: `${blok}${lantai === "L2" ? "2" : "1"}`, dagangan: x?.dagangan ?? (kosong ? "—" : r() < 0.7 ? dag : DAGANGAN[Math.floor(r() * DAGANGAN.length)]),
        pemilikId: pemilikId!, pemakaiId: pemakaiId!, buka: !kosong, status, masaHak: x?.masaHak ?? `${tahun}–${tahun + 20}`,
        hptu: x?.hptu ?? (r() < 0.8 ? "Lunas" : "Dicicil"), karyawan: x?.karyawan ?? "—",
        tunggakan: x ? (id === "JHB-B-L2-009" ? 1 : 0) : ((q) => (q < 0.78 ? 0 : q < 0.88 ? 1 : q < 0.94 ? 2 : 3 + Math.floor(r() * 4)))(r()),
      };
      if (status !== "arsip" && status !== "dikembalikan") {
        t.lapangan = { pemakaiNama: "", pemakaiNik: "", jenis, dagangan: t.dagangan, buka: !kosong, foto: 3, ownerOk: true, petugas: "Rina Marlina", tgl: "Okt 2026" };
      }
      tu.push(t);
      if (status === "terbit" || status === "divalidasi") {
        const sh = x?.sh ?? [`eSHPTU-JHB-${tahun}-${pad(sSh++, 6)}`, t.masaHak];
        const si = x?.si ?? [`eSIPTU-JHB-2026-${pad(sSi++, 6)}`, "s.d. 31 Des 2026"];
        const terbit = status === "terbit";
        dok.push({ no: sh[0], jenis: "e-SHPTU", tuId: id, atasNamaId: t.pemilikId, berlaku: sh[1], status: terbit || x?.siMenunggu ? "terbit" : "menunggu", terbit: terbit || x?.siMenunggu ? "14 Okt 2026" : undefined, keterangan: `Hak pemakaian ${jenis} ${t.luas} m² · HPTU ${t.hptu.toLowerCase()}` });
        if (si) dok.push({ no: si[0], jenis: "e-SIPTU", tuId: id, atasNamaId: t.pemakaiId, berlaku: si[1], status: terbit ? "terbit" : "menunggu", terbit: terbit ? "14 Okt 2026" : undefined, keterangan: `Pemakai · ${t.dagangan}${t.karyawan !== "—" ? " · karyawan " + t.karyawan : ""}` });
      }
    }
  }

  const tiket: Tiket[] = [
    { id: "TKT-JHB-26-0311", jenis: "tanya", pedagangId: "PJK-0139502", topik: "Cara mendapat TU kosong lewat JaKios", msgs: [{ dari: "p", teks: "Saya mau berdagang di Johar Baru. TU kosong bisa dipesan di mana?", t: "6 Nov 09.12" }], status: "terbuka", dibuat: "6 Nov 2026" },
    { id: "TKT-JHB-26-0308", jenis: "tanya", pedagangId: darmawan.id, tuId: "JHB-B-L2-009", topik: "Ganti Pengelola bila sewa Dewi berakhir", msgs: [{ dari: "p", teks: "Kalau sewa Dewi selesai Maret, bagaimana mengganti Pengelola?", t: "6 Nov 08.40" }], status: "terbuka", dibuat: "6 Nov 2026" },
  ];
  const tuArsip = tu.filter((t) => t.status === "arsip");
  const anomali: Anomali[] = [
    ["NIK tidak cocok Dukcapil", "NIK di arsip berbeda dengan KTP di lapangan", "Minta salinan KTP & surat keterangan", "Petugas Rina", 3],
    ["Masa hak SHPTU habis", "Masa hak SHPTU berakhir 12 Mei 2025", "Ajukan kebijakan ke Direksi", "AM Usaha", 9],
    ["Dua SHPTU satu TU", "Dua SHPTU terbit untuk satu TU (2009 dan 2014)", "Klarifikasi kedua pemegang", "AM Usaha", 11],
    ["Dagangan tak sesuai zona", "Berjualan sandang di zona Pangan Kering", "Ajukan perubahan jenis dagangan", "Petugas Dodi", 4],
    ["Melebihi batas TU", "Satu pemakai tercatat di 6 TU dalam pasar ini", "Ajukan arahan Direksi", "AM Usaha", 6],
    ["NIK tidak cocok Dukcapil", "NIK pemakai tidak ditemukan di Dukcapil", "Jadwalkan klarifikasi di kantor pasar", "Petugas Dodi", 7],
  ].map(([jenis, temuan, tindak, pic, umur], i) => ({ id: `ANM-${pad(i + 1, 3)}`, tuId: tuArsip[i * 7 + 3].id, jenis: jenis as string, temuan: temuan as string, tindak: tindak as string, pic: pic as string, umur: umur as number, status: "terbuka" as const }));

  // ---- TokoPaja: toko contoh Budi + toko lain (ringkas) untuk EIS
  const toko: Toko[] = [{ id: "TP-JHB-B-L1-010", pedagangId: budi.id, tuId: "JHB-B-L1-010", siptu: "eSIPTU-JHB-2026-000512", nama: "Budi Sayur Segar", ambil: true, antar: true, kulakan: true, buka: true, dibuat: "20 Okt 2026", omzet: 4_870_000, transaksi: 61 }];
  const terbuka = tu.filter((t) => t.buka && t.status === "terbit" && !khusus[t.id]);
  for (let i = 0; i < 46; i++) {
    const t = terbuka[Math.floor(r() * terbuka.length)];
    if (toko.some((x) => x.tuId === t.id)) continue;
    const p = pedagang.find((x) => x.id === t.pemakaiId)!;
    toko.push({ id: `TP-${t.id}`, pedagangId: p.id, tuId: t.id, siptu: "", nama: `Toko ${p.nama.split(" ")[0]} ${t.dagangan.split(" ")[0]}`, ambil: true, antar: r() < 0.6, kulakan: r() < 0.5, buka: true, dibuat: "Okt 2026", omzet: Math.round(r() * 60) * 100_000 + 300_000, transaksi: Math.floor(r() * 50) + 3 });
  }
  const produk: Produk[] = [
    ["Cabai Merah Keriting", "kg", "rentang", 44000, 47000], ["Bawang Merah", "kg", "tetap", 41000, 41000], ["Tomat", "kg", "tetap", 12000, 12000], ["Bayam", "ikat", "tetap", 5000, 5000], ["Ayam Potong", "kg", "rentang", 35000, 37000],
  ].map(([nama, satuan, mode, a, b], i) => ({ id: `PRD-${pad(i + 1, 4)}`, tokoId: "TP-JHB-B-L1-010", nama: nama as string, satuan: satuan as string, mode: mode as Produk["mode"], hMin: a as number, hMax: b as number, grosir: i < 2, stok: i !== 3 }));
  const it = (nama: string, qty: number, sat: string, a: number, b: number, harga = 0): ItemPesanan => ({ nama, qty, sat, hMin: a, hMax: b, harga: harga || b, ada: true });
  const pesanan: Pesanan[] = [
    { id: "PN-2611-0457", tokoId: "TP-JHB-B-L1-010", pembeli: "Bu Rina", hpPembeli: "0812••••3301", kirim: "antar", alamat: "Jl. Johar Baru V No. 12", items: [it("Cabai Merah Keriting", 1, "kg", 44000, 47000, 0), it("Bawang Merah", 2, "kg", 41000, 41000), it("Tomat", 1, "kg", 12000, 12000)], ongkir: 8000, tahap: 0, jam: "07.12", chat: [{ who: "p", text: "Pak, cabainya yang merah segar ya. Bawangnya yang kering." }, { who: "s", text: "Pesanan masuk 07.12 · menunggu konfirmasi toko" }] },
    { id: "PN-2611-0451", tokoId: "TP-JHB-B-L1-010", pembeli: "Bu Yati", hpPembeli: "0857••••1128", kirim: "antar", alamat: "Gg. Masjid No. 4", items: [it("Ayam Potong", 2, "kg", 35000, 37000, 36000), it("Bayam", 3, "ikat", 5000, 5000)], ongkir: 8000, tahap: 2, jam: "06.48", chat: [{ who: "s", text: "Pembayaran QRIS diterima · dana ditahan bank mitra" }] },
    { id: "PN-2611-0449", tokoId: "TP-JHB-B-L1-010", pembeli: "Mas Dimas", hpPembeli: "0813••••7720", kirim: "ambil", items: [it("Tomat", 2, "kg", 12000, 12000)], ongkir: 0, tahap: 3, jam: "06.30", chat: [] },
    { id: "PN-2611-0440", tokoId: "TP-JHB-B-L1-010", pembeli: "Bu Lina", hpPembeli: "0821••••5512", kirim: "antar", alamat: "Jl. Tanah Tinggi I", items: [it("Cabai Merah Keriting", 1, "kg", 44000, 47000, 45000), it("Bawang Merah", 1, "kg", 41000, 41000)], ongkir: 8000, tahap: 4, jam: "Kemarin", chat: [], nilai: 5, ulasan: "Sayurnya segar, terima kasih Pak." },
    { id: "PN-2611-0436", tokoId: "TP-JHB-B-L1-010", pembeli: "Bu Rina", hpPembeli: "0812••••3301", kirim: "antar", alamat: "Jl. Johar Baru V No. 12", items: [it("Ayam Potong", 1, "kg", 35000, 37000, 36000)], ongkir: 8000, tahap: 4, jam: "5 Nov", chat: [], nilai: 5 },
  ];
  const kulakan: Kulakan[] = [{ id: "KL-2611-0021", tokoId: "TP-JHB-B-L1-010", pemasok: "Mitra Sayur Pasar Induk Kramat Jati", items: [{ nama: "Cabai Merah Keriting", qty: 10, sat: "kg", harga: 39000 }, { nama: "Bawang Merah", qty: 10, sat: "kg", harga: 35000 }], bayar: "tunai", status: "diterima", tgl: "6 Nov 2026" }];

  // ---- tagihan persona (BPP bulanan & HPTU cicilan)
  const bpp = (t: TU) => t.luas * 45_000;
  const tagihan: Tagihan[] = [];
  let tg = 1;
  for (const t of tu.filter((x) => khusus[x.id] && x.status !== "arsip")) {
    const payer = t.buka ? t.pemakaiId : t.pemilikId;
    tagihan.push({ id: `TG-${pad(tg++, 5)}`, pedagangId: payer, tuId: t.id, jenis: "BPP", periode: "Okt 2026", jumlah: bpp(t), jatuhTempo: "10 Okt 2026", status: t.id === "JHB-B-L2-009" ? "terlambat" : "lunas", bayar: t.id === "JHB-B-L2-009" ? undefined : { metode: "QRIS", tgl: "8 Okt 2026" } });
    tagihan.push({ id: `TG-${pad(tg++, 5)}`, pedagangId: payer, tuId: t.id, jenis: "BPP", periode: "Nov 2026", jumlah: bpp(t), jatuhTempo: "10 Nov 2026", status: "belum" });
  }
  tagihan.push({ id: `TG-${pad(tg++, 5)}`, pedagangId: siti.id, tuId: "JHB-A-L1-031", jenis: "HPTU", periode: "Cicilan 25/36", jumlah: 1_250_000, jatuhTempo: "15 Nov 2026", status: "belum" });

  const pengajuan: Pengajuan[] = [
    { id: "RPS-JHB-26-0318", jenis: "pengelola", pedagangId: rudi.id, tuId: "JHB-C-B-044", judul: "Registrasi Pengelola (sewa) JHB-C-B-044", data: { periode: "1 Des 2026 – 30 Nov 2027", dagangan: "Pangan Basah · sayur, bumbu dapur", pemilik: darmawan.id }, tahap: 1, status: "proses", dibuat: "6 Nov 2026", riwayat: [{ t: "6 Nov 10.20", apa: "Pengajuan terkirim, menunggu persetujuan Pemilik" }] },
  ];
  // satu pengajuan migrasi mandiri dari aplikasi (agar terlihat di Konsol)
  const arsipLain = tu.filter((t) => t.status === "arsip" && !khusus[t.id]);
  const mandiri = arsipLain[5];
  mandiri.status = "didata"; mandiri.mandiri = true;
  mandiri.lapangan = { pemakaiNama: "", pemakaiNik: "", jenis: mandiri.jenis, dagangan: mandiri.dagangan, buka: mandiri.buka, foto: 4, ownerOk: true, petugas: "Mandiri via aplikasi", tgl: "7 Nov 09.41" };
  pengajuan.push({ id: "MIG-JHB-26-0102", jenis: "migrasi", pedagangId: mandiri.pemilikId, tuId: mandiri.id, judul: `Migrasi digital SHPTU ${mandiri.id}`, data: { shptu: "SHPTU/JHB/2016/0" + mandiri.id.slice(-3), cara: "Mandiri via aplikasi" }, tahap: 2, status: "proses", dibuat: "7 Nov 2026", riwayat: [{ t: "7 Nov 09.41", apa: "Data, foto SHPTU kertas & lokasi kios dikirim dari aplikasi" }] });

  const notif: Notif[] = [
    { id: "NT-1", pedagangId: siti.id, judul: "e-SIPTU JHB-A-L1-023 berakhir 31 Des", isi: "Perpanjang kilat dari aplikasi, syarat Anda sudah terpenuhi.", t: "7 Nov", baca: false, href: "/perpanjang/?tu=JHB-A-L1-023" },
    { id: "NT-2", pedagangId: siti.id, judul: "Tagihan BPP November terbit", isi: "Bayar sebelum 10 Nov untuk menjaga poin tepat waktu.", t: "1 Nov", baca: false, href: "/keuangan/" },
    { id: "NT-3", pedagangId: darmawan.id, judul: "Permintaan Pengelola untuk JHB-C-B-044", isi: "Rudi Hartono ingin menyewa lapak Anda yang kosong. Tinjau dan setujui dengan PIN.", t: "6 Nov", baca: false, href: "/persetujuan/?id=RPS-JHB-26-0318" },
    { id: "NT-4", pedagangId: budi.id, judul: "Pesanan baru dari Bu Rina", isi: "3 barang · konfirmasi harga dalam 12 menit.", t: "07.12", baca: false, href: "/toko/pesanan/?id=PN-2611-0457" },
  ];
  const harga: Harga[] = [
    ["Beras Medium", "kg", "Pangan Kering", 13500, 13500], ["Beras Premium", "kg", "Pangan Kering", 15500, 15400], ["Gula Pasir", "kg", "Pangan Kering", 18000, 17800], ["Minyak Goreng", "liter", "Pangan Kering", 17500, 17200], ["Telur Ayam Ras", "kg", "Pangan Kering", 29000, 28500],
    ["Cabai Merah Keriting", "kg", "Pangan Basah", 46000, 48000], ["Bawang Merah", "kg", "Pangan Basah", 42000, 40500], ["Tomat", "kg", "Pangan Basah", 12000, 12000], ["Ayam Potong", "kg", "Pangan Basah", 36000, 36000], ["Bayam", "ikat", "Pangan Basah", 5000, 5000],
  ].map(([komoditas, satuan, kelompok, hariIni, kemarin]) => ({ komoditas: komoditas as string, satuan: satuan as string, kelompok: kelompok as string, hariIni: hariIni as number, kemarin: kemarin as number, t: "06.12" }));
  const interaksi: Interaksi[] = [
    { t: "6 Nov 10.05", pedagangId: darmawan.id, kanal: "WhatsApp", catatan: "Menanyakan cara mengganti Pengelola bila sewa Dewi selesai.", oleh: "Maya Permata" },
    { t: "2 Nov 13.30", pedagangId: dewi.id, kanal: "Kunjungan", catatan: "Pengingat BPP Oktober belum dibayar; janji bayar minggu depan.", oleh: "Iwan Gunawan" },
  ];
  const pengumuman: Pengumuman[] = [{ id: "PG-001", judul: "Jadwal pendataan ulang Blok B", isi: "Petugas datang ke TU Anda 10–14 Nov, 08.00–15.00. Siapkan KTP dan SHPTU/SIPTU kertas.", sasaran: "Blok B", t: "5 Nov", oleh: "Kepala Pasar", terkirim: 237 }];

  return {
    versi: VERSI, pedagang, tu, dok, tiket, anomali, log: [{ t: "6 Nov 08.00", siapa: "Sistem", apa: "Data contoh pilot Johar Baru dimuat" }], sesi: null, seq: 1,
    toko, produk, pesanan, kulakan, tagihan, pengajuan, notif, interaksi, pengumuman, harga, poin: { [siti.id]: 1240, [darmawan.id]: 860, [budi.id]: 410 },
  };
}
