// Model data PaJaKu Tahap 1A (migrasi e-SHPTU & e-SIPTU) + data contoh pilot Pasar Johar Baru.
// Bentuk data ini menjadi kontrak API saat backend tersambung (lihat API.md).

export type Kategori = "E" | "P" | "G" | "B";
export type Jenis = "Toko" | "Kios" | "Counter" | "Lapak";
export type StatusTU = "arsip" | "didata" | "divalidasi" | "terbit" | "dikembalikan";
export type Peran = "pedagang" | "petugas" | "kepala" | "manager" | "kadiv" | "direksi";

export type Pedagang = { id: string; nama: string; hp: string; nik: string; aktif: boolean; daftar?: string };
export type Lapangan = {
  pemakaiNama: string; pemakaiNik: string; jenis: Jenis; dagangan: string; buka: boolean;
  foto: number; ownerOk: boolean; petugas: string; tgl: string;
};
export type TU = {
  id: string; noTU: string; jenis: Jenis; ukuran: string; luas: number; blok: string; lantai: string; zona: string;
  dagangan: string; pemilikId: string; pemakaiId: string; buka: boolean; status: StatusTU;
  masaHak: string; hptu: string; karyawan: string; lapangan?: Lapangan; catatan?: string;
};
export type Dokumen = {
  no: string; jenis: "e-SHPTU" | "e-SIPTU"; tuId: string; atasNamaId: string; berlaku: string;
  status: "menunggu" | "terbit" | "batal"; terbit?: string; keterangan: string;
};
export type Pesan = { dari: "p" | "s"; teks: string; t: string };
export type Tiket = {
  id: string; jenis: "koreksi" | "tanya" | "aktivasi"; pedagangId: string; tuId?: string; topik: string;
  bagian?: string[]; msgs: Pesan[]; status: "terbuka" | "disetujui" | "ditolak" | "dijawab" | "selesai"; dibuat: string;
};
export type Anomali = {
  id: string; tuId: string; jenis: string; temuan: string; tindak: string; pic: string; umur: number;
  status: "terbuka" | "selesai" | "eskalasi"; keputusan?: string;
};
export type Log = { t: string; siapa: string; apa: string; tuId?: string };
export type Staf = { id: string; nama: string; peran: Exclude<Peran, "pedagang">; jabatan: string };
export type Sesi = { peran: Peran; userId: string } | null;

export type State = {
  versi: number; pedagang: Pedagang[]; tu: TU[]; dok: Dokumen[]; tiket: Tiket[]; anomali: Anomali[];
  log: Log[]; sesi: Sesi; seq: number;
};

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

  const khusus: Record<string, Partial<TU> & { sh?: [string, string]; si?: [string, string] | null; siMenunggu?: boolean }> = {
    "JHB-A-L1-023": { jenis: "Kios", dagangan: "Pangan Kering", pemilikId: siti.id, pemakaiId: siti.id, masaHak: "2024–2044", hptu: "Lunas", karyawan: "1 · Ahmad Nurdin", sh: ["eSHPTU-JHB-2024-000123", "2024–2044"], si: ["eSIPTU-JHB-2026-000456", "s.d. 31 Des 2026"] },
    "JHB-A-L1-031": { jenis: "Lapak", dagangan: "Pangan Basah", pemilikId: siti.id, pemakaiId: siti.id, masaHak: "2024–2044", hptu: "Dicicil 24/36", karyawan: "—", sh: ["eSHPTU-JHB-2025-000208", "2024–2044"], si: ["eSIPTU-JHB-2026-000471", "s.d. 31 Des 2026"] },
    "JHB-B-L1-010": { jenis: "Counter", dagangan: "Pangan Basah", pemilikId: darmawan.id, pemakaiId: budi.id, masaHak: "2022–2042", hptu: "Lunas", karyawan: "—", sh: ["eSHPTU-JHB-2022-000310", "2022–2042"], si: ["eSIPTU-JHB-2026-000512", "s.d. 31 Des 2026"] },
    "JHB-B-L1-011": { jenis: "Lapak", dagangan: "Pangan Basah", pemilikId: darmawan.id, pemakaiId: budi.id, masaHak: "2022–2042", hptu: "Lunas", karyawan: "—", sh: ["eSHPTU-JHB-2022-000312", "2022–2042"], si: ["eSIPTU-JHB-2026-000514", "s.d. 31 Des 2026"] },
    "JHB-B-L2-009": { jenis: "Kios", dagangan: "Sandang", pemilikId: darmawan.id, pemakaiId: dewi.id, masaHak: "2022–2042", hptu: "Lunas", karyawan: "—", status: "divalidasi", sh: ["eSHPTU-JHB-2022-000311", "2022–2042"], si: ["eSIPTU-JHB-2026-000513", "s.d. 31 Des 2026"], siMenunggu: true },
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
      const kosong = !x && r() < 0.232; // ±146 TU kosong
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

  return { versi: 1, pedagang, tu, dok, tiket, anomali, log: [{ t: "6 Nov 08.00", siapa: "Sistem", apa: "Data contoh pilot Johar Baru dimuat" }], sesi: null, seq: 1 };
}
