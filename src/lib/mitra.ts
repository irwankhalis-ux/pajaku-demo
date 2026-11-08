"use client";

// MitraPaja — konsol Mitra Pengembang revitalisasi Pasar Pramuka bersama Perumda Pasar Jaya.
// Model + data contoh + aksi. Tersimpan di HP (localStorage); setiap aksi = titik sambung API nanti.
// Semua nama & angka ilustrasi (kanvas "Konsol Mitra Pengembang PaJaKu").
import { useSyncExternalStore } from "react";

export type Jalur = "eks" | "gold" | "biru";
export type Kat = "E" | "P" | "G" | "B";
export type Unit = { code: string; fk: string; blok: string; no: string; m2: number; jenis: string; alokasi: Jalur; status: "tersedia" | "ditahan" | "dipesan" | "terjual" | "alokasi"; pelangganId?: string };
export type Pelanggan = {
  id: string; nama: string; kat: Kat; hp: string; tahap: number; // tahap per jalur (lihat TAHAP)
  asal?: string; pic?: string; tuLama?: string; zona?: string; catatan?: string;
};
export type ESPTU = {
  no: string; pelangganId: string; unit: string; jalur: Jalur; harga: number; skema: "tunai" | "cicilan" | "kpr";
  bank?: string; status: "draf" | "ttd-pedagang" | "tte-pj" | "sah"; tgl: string; dibayar: number; lunas: boolean; telat: number;
};
export type Kredit = { id: string; pelangganId: string; unit: string; bank: string; plafon: number; tahap: number; catatan: string; umur: number };
export type Pesan = { dari: "p" | "a" | "s"; teks: string; t: string };
export type Chat = { id: string; pelangganId: string; peran: "Sales" | "Collection" | "Customer relation"; kategori: string; msgs: Pesan[]; unread: number; tiket?: { id: string; sla: number; status: "terbuka" | "selesai" } };
export type Progres = { t: string; persen: number; catatan: string; oleh: string };
export type Konten = { id: string; jenis: string; judul: string; t: string; kanal: string; status: "terbit" | "draf" };
export type Termin = { id: string; ket: string; jumlah: number; status: "diajukan" | "disetujui" | "cair"; t: string };
export type Undian = { id: string; zona: string; peserta: number; status: "dijadwalkan" | "diimpor" | "disahkan"; t: string };
export type Log = { t: string; siapa: string; apa: string };
export type Staf = { id: string; nama: string; peran: "direksi" | "salesmgr" | "sales" | "collection" | "cr" | "keuangan" | "pj"; jabatan: string };
export type MState = {
  versi: number; sesi: { stafId: string } | null; seq: number; units: Unit[]; pelanggan: Pelanggan[]; esptu: ESPTU[]; kredit: Kredit[];
  chat: Chat[]; progres: Progres[]; rencana: number; konten: Konten[]; termin: Termin[]; undian: Undian[]; log: Log[]; harga: Record<string, [number, number, number]>;
};

export const PROYEK = { nama: "Revitalisasi Pasar Pramuka", mitra: "PT Mitra Bangun Pramuka", lokasi: "Jl. Pramuka, Jakarta Timur", tu: 620, mulai: "Jun 2026", selesai: "Des 2027", targetUnit: 70, targetSales: 40_000, targetKas: 19_500 };
export const PIN = "123456";
export const LANTAI: Record<string, { nama: string; zona: string; m2: number; n: number }> = {
  D: { nama: "Lantai Dasar", zona: "Kering", m2: 4, n: 140 },
  L1: { nama: "Lantai 1", zona: "Basah", m2: 2.25, n: 180 },
  L2: { nama: "Lantai 2", zona: "Kering", m2: 4, n: 170 },
  L3: { nama: "Lantai 3", zona: "Semi basah", m2: 4, n: 130 },
};
// harga per m² (juta) [eksisting (dikunci Pasar Jaya), Gold (kebijakan Mitra), Biru (harga umum)]
const HARGA0: Record<string, [number, number, number]> = { D: [22, 30, 38], L1: [18, 26, 32], L2: [16, 24, 28], L3: [14, 20, 24] };
export const KAT: Record<Kat, { nama: string; warna: string; tone: string; jalur: Jalur }> = {
  E: { nama: "Emerald", warna: "#2E8B57", tone: "bg-[#DCEFEA] text-[#0A5249]", jalur: "eks" },
  P: { nama: "Platinum", warna: "#7A818A", tone: "bg-[#E9EEF1] text-[#3E5260]", jalur: "eks" },
  G: { nama: "Gold", warna: "#A88A1E", tone: "bg-[#FBF3D9] text-[#4A3A05]", jalur: "gold" },
  B: { nama: "Biru", warna: "#2D4B8E", tone: "bg-[#E1E8F6] text-[#233C73]", jalur: "biru" },
};
export const JALUR: Record<Jalur, string> = { eks: "Eksisting", gold: "Gold", biru: "Biru" };
export const TAHAP: Record<Jalur, string[]> = {
  eks: ["Registrasi PaJaKu", "e-SHPTU & e-SIPTU terverifikasi", "Undian sesuai zoning", "e-SPTU terbit", "Bayar masa konstruksi", "Kredit bank (opsional)", "Serah terima & serah kelola"],
  gold: ["Diundang via PaJaKu", "Konfirmasi minat", "Pilih unit alokasi Gold", "e-SPTU terbit", "Bayar masa konstruksi", "Kredit bank (opsional)", "Serah terima"],
  biru: ["Prospek", "Kunjungan / presentasi", "Booking fee", "e-SPTU terbit", "Bayar masa konstruksi", "Kredit bank (opsional)", "Serah terima"],
};
export const BANK = [
  { nama: "Bank Jakarta", rate: 8.5, maxT: 84, dpMin: 20, sla: 10 },
  { nama: "BSI", rate: 9.5, maxT: 84, dpMin: 20, sla: 12 },
  { nama: "BRI", rate: 9.0, maxT: 60, dpMin: 20, sla: 14 },
  { nama: "Bank Mandiri", rate: 9.25, maxT: 60, dpMin: 25, sla: 14 },
];
export const KREDIT_TAHAP = ["Pengajuan", "Kelengkapan", "Analisa", "Disetujui", "Akad", "Cair ke escrow"];
export const EWS = [
  { l: "Lancar", c: "#0E6E63", f: (h: number) => h === 0, r: "tepat waktu" },
  { l: "Perhatian", c: "#F2B872", f: (h: number) => h > 0 && h <= 30, r: "1–30 hari" },
  { l: "Waspada", c: "#DE9E52", f: (h: number) => h > 30 && h <= 60, r: "31–60 hari" },
  { l: "Kritis", c: "#A8322A", f: (h: number) => h > 60 && h <= 90, r: "61–90 hari" },
  { l: "Macet", c: "#1B1F24", f: (h: number) => h > 90, r: "> 90 hari" },
];
export const STAF: Staf[] = [
  { id: "M-DIR", nama: "Direktur Utama Mitra", peran: "direksi", jabatan: "Direksi Mitra · EIS" },
  { id: "M-SM", nama: "Rizky Pratama", peran: "salesmgr", jabatan: "Sales & Marketing Manager" },
  { id: "M-SLS", nama: "Dini Anggraini", peran: "sales", jabatan: "Sales" },
  { id: "M-COL", nama: "Hadi Susanto", peran: "collection", jabatan: "Collection" },
  { id: "M-CR", nama: "Laras Wulandari", peran: "cr", jabatan: "Customer Relation" },
  { id: "M-KEU", nama: "Andreas Wijaya", peran: "keuangan", jabatan: "Keuangan Mitra" },
  { id: "PJ-PGW", nama: "Tim Pengawas Revitalisasi", peran: "pj", jabatan: "Perumda Pasar Jaya · pengawas" },
];
export const HOME: Record<Staf["peran"], string> = { direksi: "/m/eis/", salesmgr: "/m/dashboard/", sales: "/m/pesanan/", collection: "/m/tagihan/", cr: "/m/crm/", keuangan: "/m/tagihan/", pj: "/m/pengawas/" };

// ---------- util ----------
const pad = (n: number, w: number) => String(n).padStart(w, "0");
export const jt = (v: number) => (v >= 1000 ? `Rp${(v / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M` : `Rp${(Math.round(v * 10) / 10).toLocaleString("id-ID")} jt`);
export const rp = (v: number) => "Rp" + Math.round(v).toLocaleString("id-ID");
const now = () => new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
export const hargaUnit = (s: MState, u: Unit, j: Jalur) => Math.round(s.harga[u.fk][{ eks: 0, gold: 1, biru: 2 }[j]] * u.m2 * 10) / 10;

// ---------- data contoh ----------
const DEPAN = ["Siti", "Ahmad", "Budi", "Dewi", "Rudi", "Sri", "Agus", "Nur", "Hendra", "Yuni", "Joko", "Lina", "Eko", "Wati", "Asep", "Rina", "Dedi", "Ani", "Bayu", "Fitri", "Imam", "Ratna", "Slamet", "Tuti", "Wahyu", "Yanti", "Hasan", "Maya", "Iwan", "Sari", "Endang", "Gita"];
const BELAKANG = ["Hidayat", "Saputra", "Lestari", "Wijaya", "Kurniawan", "Rahayu", "Santoso", "Pratama", "Hartono", "Susanti", "Nugroho", "Setiawan", "Fauzi", "Wulandari", "Gunawan", "Rohmah", "Anjani", "Siregar"];

export function seed(): MState {
  let x = 20261108;
  const r = () => ((x = (x * 16807) % 2147483647) / 2147483647);
  const units: Unit[] = [];
  for (const fk of Object.keys(LANTAI)) {
    const L = LANTAI[fk];
    for (let i = 0; i < L.n; i++) {
      const blok = String.fromCharCode(65 + Math.floor(i / 30)), no = pad((i % 30) + 1, 2);
      const toko = fk === "D" && blok === "A" && i < 10;
      units.push({ code: `PRM-${fk}-${blok}-${no}`, fk, blok, no, m2: toko ? 12 : L.m2, jenis: toko ? "Toko" : fk === "L1" ? "Los" : "Kios", alokasi: "biru", status: "tersedia" });
    }
  }
  // alokasi: eksisting 401 · Gold 90 · Biru 129 (acak per lantai, toko tetap Biru)
  const idx = units.map((_, i) => i).filter((i) => units[i].jenis !== "Toko");
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  idx.slice(0, 401).forEach((i) => (units[i].alokasi = "eks"));
  idx.slice(401, 491).forEach((i) => (units[i].alokasi = "gold"));

  const pelanggan: Pelanggan[] = [];
  const esptu: ESPTU[] = [];
  let pid = 45300, no = 1;
  const nama = () => `${DEPAN[Math.floor(r() * DEPAN.length)]} ${BELAKANG[Math.floor(r() * BELAKANG.length)]}`;
  const tambah = (p: Omit<Pelanggan, "id" | "hp"> & { id?: string; hp?: string }) => { const q: Pelanggan = { ...p, id: p.id ?? `PJK-${pad(pid++, 7)}`, hp: p.hp ?? `08${pad(Math.floor(r() * 1e10), 10)}` }; pelanggan.push(q); return q; };
  const jual = (p: Pelanggan, u: Unit, j: Jalur, status: ESPTU["status"] = "sah") => {
    u.status = status === "sah" ? "terjual" : "dipesan"; u.pelangganId = p.id;
    const harga = Math.round(HARGA0[u.fk][{ eks: 0, gold: 1, biru: 2 }[j]] * u.m2 * 10) / 10;
    const lunas = r() < 0.36;
    const q = r();
    esptu.push({ no: `eSPTU-PRM-2026-${pad(no++, 5)}`, pelangganId: p.id, unit: u.code, jalur: j, harga, skema: lunas ? "tunai" : r() < 0.3 ? "kpr" : "cicilan", status, tgl: `${1 + Math.floor(r() * 28)} ${["Agu", "Sep", "Okt"][Math.floor(r() * 3)]} 2026`, dibayar: lunas ? harga : Math.round(harga * (0.1 + r() * 0.4) * 10) / 10, lunas, telat: lunas ? 0 : q < 0.8 ? 0 : q < 0.92 ? 1 + Math.floor(r() * 30) : q < 0.97 ? 31 + Math.floor(r() * 30) : 61 + Math.floor(r() * 30) });
  };

  // persona tetap
  const yuli = tambah({ id: "PJK-0045310", nama: "Yuliana S.", kat: "E", hp: "081290045310", tahap: 4, tuLama: "Kios B-087 · 4 m²", zona: "Kering" });
  const darm = tambah({ id: "PJK-0045118", nama: "H. Darmawan", kat: "P", hp: "081398762290", tahap: 4, tuLama: "Kios B-014 · 4 m²", zona: "Kering" });
  const joko = tambah({ id: "PJK-0045677", nama: "Joko Santoso", kat: "P", hp: "081377845677", tahap: 3, tuLama: "Kios B-112 · 4 m²", zona: "Kering" });
  const budi = tambah({ id: "PJK-0047731", nama: "Budi S.", kat: "G", hp: "085711227731", tahap: 2, zona: "Kering" });
  const wulan = tambah({ id: "PJK-0051207", nama: "Wulan Sari", kat: "B", hp: "081311051207", tahap: 3, asal: "Instagram", pic: "Dini Anggraini" });
  const medika = tambah({ id: "PJK-0050911", nama: "PT Medika Jaya", kat: "B", hp: "02180050911", tahap: 4, asal: "Referensi", pic: "Dini Anggraini" });
  const ambil = (fk: string, j: Jalur) => units.find((u) => u.fk === fk && u.alokasi === j && u.status === "tersedia" && (j !== "biru" || u.jenis !== "Toko"))!;
  jual(yuli, ambil("L2", "eks"), "eks");
  jual(darm, ambil("L2", "eks"), "eks");
  jual(joko, ambil("L2", "eks"), "eks", "ttd-pedagang");
  jual(wulan, ambil("L2", "biru"), "biru", "tte-pj");
  jual(medika, units.find((u) => u.code === "PRM-D-A-01")!, "biru");
  esptu[0].lunas = false; esptu[0].dibayar = 21.3; esptu[0].telat = 0; esptu[0].skema = "cicilan";
  esptu[1].lunas = false; esptu[1].dibayar = 12.8; esptu[1].telat = 9; esptu[1].skema = "cicilan";

  // eksisting: 401 pemilik (247 Emerald, 154 Platinum) — 298 sudah e-SPTU
  const eksUnits = units.filter((u) => u.alokasi === "eks" && u.status === "tersedia");
  let e = 0;
  for (let i = 0; i < 401 - 3; i++) {
    const kat: Kat = i < 245 ? "E" : "P";
    const sudah = e < 298 - 3; // sudah e-SPTU
    const tahap = sudah ? 4 : i % 5 === 0 ? 0 : i % 5 === 1 ? 1 : 2;
    const p = tambah({ nama: nama(), kat, tahap, tuLama: `${["Kios", "Los", "Toko"][Math.floor(r() * 3)]} ${String.fromCharCode(65 + Math.floor(r() * 5))}-${pad(1 + Math.floor(r() * 150), 3)}`, zona: ["Kering", "Basah", "Semi basah"][Math.floor(r() * 3)] });
    if (sudah) { jual(p, eksUnits[e], "eks"); e++; }
  }
  eksUnits.slice(e).forEach((u) => (u.status = "alokasi"));
  // Gold: 140 diundang · 34 e-SPTU · sisanya bertahap
  const goldU = units.filter((u) => u.alokasi === "gold" && u.status === "tersedia");
  for (let i = 0; i < 139; i++) {
    const p = tambah({ nama: nama(), kat: "G", tahap: i < 33 ? 4 : i < 47 ? 2 : i < 58 ? 1 : 0, zona: ["Kering", "Basah", "Semi basah"][i % 3] });
    if (i < 33) jual(p, goldU[i], "gold");
  }
  budi.tahap = 2;
  const bu = goldU.find((u) => u.status === "tersedia")!; bu.status = "ditahan"; bu.pelangganId = budi.id;
  // Biru: 62 e-SPTU + prospek
  const biruU = units.filter((u) => u.alokasi === "biru" && u.status === "tersedia" && u.jenis !== "Toko");
  const ASAL = ["Instagram", "TikTok", "Walk-in", "Referensi", "Pameran"];
  for (let i = 0; i < 60; i++) { const p = tambah({ nama: nama(), kat: "B", tahap: 4, asal: ASAL[Math.floor(r() * 5)], pic: i % 2 ? "Dini Anggraini" : "Rizky Pratama" }); jual(p, biruU[i], "biru"); }
  for (let i = 0; i < 36; i++) tambah({ nama: nama(), kat: "B", tahap: i < 18 ? 0 : i < 30 ? 1 : 2, asal: ASAL[Math.floor(r() * 5)], pic: i % 2 ? "Dini Anggraini" : "Rizky Pratama" });

  const kredit: Kredit[] = [
    ["Fransiska T.", "PRM-D-A-03", "Bank Jakarta", 364.8, 1, "Kurang NIB & rekening koran 6 bulan", 3],
    ["Ismail R.", "PRM-L2-E-09", "BSI", 89.6, 2, "Analisa — e-SHPTU terverifikasi di portal", 6],
    ["Sutrisno W.", "PRM-D-B-07", "Bank Jakarta", 70.4, 5, "Pencairan tahap 1 (30%) ke escrow", 12],
    ["PT Medika Jaya", "PRM-D-A-01", "Bank Mandiri", 342, 4, "Akad kredit dijadwalkan · blokir agunan disiapkan", 15],
    ["Joko Santoso", esptu[2].unit, "Bank Jakarta", 51.2, 3, "Disetujui · menunggu TTE e-SPTU", 18],
    ["Rahmat H.", "PRM-L3-A-11", "BRI", 76.8, 2, "Melewati SLA 14 hari — eskalasi ke RM bank", 21],
  ].map(([n, u, b, pl, t, c, a], i) => ({ id: `KR-${pad(233 - i * 4, 4)}`, pelangganId: (pelanggan.find((p) => p.nama === n) ?? tambah({ nama: n as string, kat: "B", tahap: 4 })).id, unit: u as string, bank: b as string, plafon: pl as number, tahap: t as number, catatan: c as string, umur: a as number }));

  const chat: Chat[] = [
    { id: "C1", pelangganId: yuli.id, peran: "Customer relation", kategori: "Konstruksi", unread: 1, msgs: [{ dari: "p", teks: "Foto progres lantai 2 sudah ada?", t: "07.40" }] },
    { id: "C2", pelangganId: darm.id, peran: "Collection", kategori: "Penjadwalan ulang", unread: 0, msgs: [{ dari: "p", teks: "Angsuran bulan ini bisa mundur seminggu? Dana masuk tgl 12.", t: "Kemarin" }, { dari: "a", teks: "Baik Pak, kami ajukan ke Keuangan dan kabari di sini hari ini.", t: "Kemarin" }], tiket: { id: "TK-0412", sla: 24, status: "terbuka" } },
    { id: "C3", pelangganId: budi.id, peran: "Sales", kategori: "Pilih unit Gold", unread: 1, msgs: [{ dari: "p", teks: "Unit yang ditahan untuk saya sampai kapan?", t: "08.05" }] },
    { id: "C4", pelangganId: wulan.id, peran: "Sales", kategori: "Dokumen e-SPTU", unread: 0, msgs: [{ dari: "p", teks: "e-SPTU saya kapan sah?", t: "Kemarin" }, { dari: "a", teks: "Sudah Ibu tanda tangani; tinggal TTE Pasar Jaya.", t: "Kemarin" }] },
    { id: "C5", pelangganId: joko.id, peran: "Sales", kategori: "TTE e-SPTU", unread: 1, msgs: [{ dari: "p", teks: "Saya di luar kota, bisa tanda tangan e-SPTU dari HP?", t: "09.12" }] },
  ];
  return {
    versi: 1, sesi: null, seq: 1, units, pelanggan, esptu, kredit, chat,
    progres: [
      { t: "1 Nov 2026", persen: 36, catatan: "Struktur lantai 2 berjalan, pengecoran kolom Blok D", oleh: "Manajemen Konstruksi" },
      { t: "1 Okt 2026", persen: 28, catatan: "Struktur lantai dasar & 1", oleh: "Manajemen Konstruksi" },
      { t: "1 Sep 2026", persen: 20, catatan: "Pondasi selesai", oleh: "Manajemen Konstruksi" },
    ],
    rencana: 38,
    konten: [
      { id: "K1", jenis: "Progres fisik", judul: "Pengecoran kolom lantai 2", t: "1 Nov", kanal: "Instagram · PaJaKu", status: "terbit" },
      { id: "K2", jenis: "Promo", judul: "Bonus November untuk Gold & Biru", t: "3 Nov", kanal: "Instagram · TikTok", status: "draf" },
      { id: "K3", jenis: "Pembiayaan", judul: "Simulasi KPR kios Bank Jakarta 8,5%", t: "28 Okt", kanal: "PaJaKu", status: "terbit" },
    ],
    termin: [
      { id: "TM-1", ket: "Termin 1 · pondasi selesai (20%)", jumlah: 3000, status: "cair", t: "Sep 2026" },
      { id: "TM-2", ket: "Termin 2 · struktur lt dasar & 1 (28%)", jumlah: 3400, status: "cair", t: "Okt 2026" },
    ],
    undian: [
      { id: "UN-4", zona: "Basah (Lt 1)", peserta: 112, status: "disahkan", t: "24 Okt" },
      { id: "UN-5", zona: "Semi basah (Lt 3)", peserta: 38, status: "dijadwalkan", t: "15 Nov" },
    ],
    log: [{ t: "8 Nov 06.00", siapa: "Sistem", apa: "Data contoh Pasar Pramuka dimuat" }],
    harga: JSON.parse(JSON.stringify(HARGA0)),
  };
}

// ---------- store ----------
const KEY = "mitrapaja-v1";
const ls = new Set<() => void>();
let st: MState | null = null;
const SERVER = seed();
export function mload(): MState {
  if (st) return st;
  try { const raw = localStorage.getItem(KEY); if (raw) { const v = JSON.parse(raw) as MState; if (v.versi === 1) return (st = v); } } catch {}
  return (st = seed());
}
function commit(n: MState) { st = n; try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} ls.forEach((l) => l()); }
const up = (fn: (s: MState) => MState) => commit(fn(mload()));
export const useM = () => useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l); }, mload, () => SERVER);
const lg = (s: MState, siapa: string, apa: string) => [{ t: now(), siapa, apa }, ...s.log].slice(0, 300);
export const stafM = (id?: string) => STAF.find((x) => x.id === id);
export const plg = (s: MState, id: string) => s.pelanggan.find((p) => p.id === id);
export const unitBy = (s: MState, code: string) => s.units.find((u) => u.code === code);

// ---------- turunan ----------
export function ringkas(s: MState) {
  const sah = s.esptu.filter((e) => e.status === "sah");
  const by = (j: Jalur) => s.esptu.filter((e) => e.jalur === j && e.status !== "draf");
  const nilai = s.esptu.filter((e) => e.status !== "draf").reduce((n, e) => n + e.harga, 0);
  const kas = s.esptu.reduce((n, e) => n + e.dibayar, 0);
  const cair = s.termin.filter((t) => t.status === "cair").reduce((n, t) => n + t.jumlah, 0);
  const terjual = s.esptu.filter((e) => e.status !== "draf").length;
  return {
    terjual, sah: sah.length, eks: by("eks").length, gold: by("gold").length, biru: by("biru").length, nilai, kas, cair, saldo: kas * 1 - cair / 1,
    progres: s.progres[0].persen, tersedia: s.units.filter((u) => u.status === "tersedia" && u.alokasi !== "eks").length,
    lunas: s.esptu.filter((e) => e.lunas).length, menungguPJ: s.esptu.filter((e) => e.status === "tte-pj").length,
  };
}

// ---------- sesi ----------
export function masuk(id: string, pin: string): string | null {
  if (pin !== PIN) return "PIN salah.";
  if (!stafM(id)) return "Pilih akun.";
  up((s) => ({ ...s, sesi: { stafId: id } }));
  return null;
}
export const keluarM = () => up((s) => ({ ...s, sesi: null }));
export const resetM = () => commit(seed());

// ---------- unit & harga ----------
export function ubahHarga(fk: string, i: 1 | 2, v: number, oleh: string) {
  up((s) => ({ ...s, harga: { ...s.harga, [fk]: s.harga[fk].map((x, k) => (k === i ? v : x)) as [number, number, number] }, log: lg(s, oleh, `harga ${JALUR[i === 1 ? "gold" : "biru"]} ${fk} → Rp${v} jt/m²`) }));
}

// ---------- pemesanan & e-SPTU ----------
export function buatPesanan(pelangganId: string, unit: string, skema: ESPTU["skema"], bank: string | undefined, oleh: string): string | null {
  const s0 = mload();
  const p = plg(s0, pelangganId), u = unitBy(s0, unit);
  if (!p || !u) return "Pilih pelanggan dan unit.";
  const j = KAT[p.kat].jalur;
  if (u.alokasi !== j) return `Unit ini alokasi ${JALUR[u.alokasi]}; pelanggan jalur ${JALUR[j]}.`;
  if (!(u.status === "tersedia" || u.status === "alokasi" || (u.status === "ditahan" && u.pelangganId === p.id))) return "Unit sudah dipesan.";
  let no = "";
  up((s) => {
    no = `eSPTU-PRM-2026-${pad(500 + s.seq, 5)}`;
    const harga = hargaUnit(s, u, j);
    const e: ESPTU = { no, pelangganId, unit, jalur: j, harga, skema, bank: skema === "kpr" ? bank : undefined, status: "draf", tgl: now(), dibayar: j === "biru" ? 5 : 0, lunas: false, telat: 0 };
    return { ...s, seq: s.seq + 1, esptu: [e, ...s.esptu], units: s.units.map((x) => (x.code === unit ? { ...x, status: "dipesan", pelangganId } : x)), pelanggan: s.pelanggan.map((x) => (x.id === pelangganId ? { ...x, tahap: Math.max(x.tahap, 3) } : x)), log: lg(s, oleh, `pesanan ${unit} untuk ${p.nama} (${JALUR[j]}, ${rp(harga * 1e6)})`) };
  });
  return no;
}
/** draf → dikirim ke pedagang (tanda tangan di PaJaKu) → TTE Pasar Jaya → sah */
export function majukanESPTU(no: string, oleh: string) {
  up((s) => {
    const e = s.esptu.find((x) => x.no === no)!;
    const nx: ESPTU["status"] = e.status === "draf" ? "ttd-pedagang" : e.status === "ttd-pedagang" ? "tte-pj" : "sah";
    const label = { "ttd-pedagang": "dikirim ke aplikasi pedagang untuk ditandatangani", "tte-pj": "ditandatangani pedagang · menunggu TTE Pasar Jaya", sah: "ditandatangani elektronik Pasar Jaya · sah" }[nx];
    const chat = s.chat.map((c) => (c.pelangganId === e.pelangganId ? { ...c, msgs: [...c.msgs, { dari: "s" as const, teks: `e-SPTU ${no} ${label}`, t: now() }] } : c));
    return { ...s, esptu: s.esptu.map((x) => (x.no === no ? { ...x, status: nx } : x)), units: nx === "sah" ? s.units.map((u) => (u.code === e.unit ? { ...u, status: "terjual" } : u)) : s.units, pelanggan: nx === "sah" ? s.pelanggan.map((p) => (p.id === e.pelangganId ? { ...p, tahap: 4 } : p)) : s.pelanggan, chat, log: lg(s, oleh, `${no} ${label}`) };
  });
}
export function batalESPTU(no: string, oleh: string) {
  up((s) => {
    const e = s.esptu.find((x) => x.no === no)!;
    return { ...s, esptu: s.esptu.filter((x) => x.no !== no), units: s.units.map((u) => (u.code === e.unit ? { ...u, status: u.alokasi === "eks" ? "alokasi" : "tersedia", pelangganId: undefined } : u)), log: lg(s, oleh, `${no} dibatalkan, unit dilepas`) };
  });
}

// ---------- eksisting & undian ----------
export function majukanPelanggan(id: string, oleh: string) {
  up((s) => {
    const p = plg(s, id)!;
    return { ...s, pelanggan: s.pelanggan.map((x) => (x.id === id ? { ...x, tahap: Math.min(x.tahap + 1, 3) } : x)), log: lg(s, oleh, `${p.nama}: ${TAHAP[KAT[p.kat].jalur][Math.min(p.tahap + 1, 3)]}`) };
  });
}
/** Impor hasil undian (CSV) satu zona: peserta eksisting terverifikasi mendapat unit alokasi eksisting di zona itu. */
export function imporUndian(id: string, oleh: string): number {
  let n = 0;
  up((s) => {
    const un = s.undian.find((x) => x.id === id)!;
    const zona = un.zona.split(" (")[0];
    const peserta = s.pelanggan.filter((p) => (p.kat === "E" || p.kat === "P") && p.tahap === 2 && p.zona === zona);
    const free = s.units.filter((u) => u.alokasi === "eks" && u.status === "alokasi" && LANTAI[u.fk].zona === zona && !u.pelangganId);
    const units = s.units.map((u) => ({ ...u }));
    peserta.slice(0, free.length).forEach((p, i) => { const u = units.find((x) => x.code === free[i].code)!; u.pelangganId = p.id; n++; });
    return { ...s, units, undian: s.undian.map((x) => (x.id === id ? { ...x, status: "diimpor", peserta: n } : x)), log: lg(s, oleh, `hasil undian ${un.zona} diimpor: ${n} pemenang · menunggu pengesahan Pasar Jaya`) };
  });
  return n;
}
export function jadwalUndian(zona: string, oleh: string) {
  up((s) => ({ ...s, seq: s.seq + 1, undian: [{ id: `UN-${s.seq + 5}`, zona, peserta: s.pelanggan.filter((p) => (p.kat === "E" || p.kat === "P") && p.tahap === 2 && `${p.zona}` === zona.split(" (")[0]).length, status: "dijadwalkan", t: "Minggu depan" }, ...s.undian], log: lg(s, oleh, `undian ${zona} dijadwalkan`) }));
}
/** Pasar Jaya mengesahkan hasil undian → e-SPTU draf otomatis untuk tiap pemenang. */
export function sahkanUndian(id: string, oleh: string) {
  up((s) => {
    const un = s.undian.find((x) => x.id === id)!;
    const zona = un.zona.split(" (")[0];
    const menang = s.units.filter((u) => u.alokasi === "eks" && u.status === "alokasi" && u.pelangganId && LANTAI[u.fk].zona === zona);
    let seq = s.seq;
    const baru: ESPTU[] = menang.map((u) => ({ no: `eSPTU-PRM-2026-${pad(500 + seq++, 5)}`, pelangganId: u.pelangganId!, unit: u.code, jalur: "eks", harga: hargaUnit(s, u, "eks"), skema: "cicilan", status: "ttd-pedagang", tgl: now(), dibayar: 0, lunas: false, telat: 0 }));
    const ids = new Set(menang.map((u) => u.pelangganId));
    return { ...s, seq, esptu: [...baru, ...s.esptu], units: s.units.map((u) => (menang.some((m) => m.code === u.code) ? { ...u, status: "dipesan" } : u)), pelanggan: s.pelanggan.map((p) => (ids.has(p.id) ? { ...p, tahap: 3 } : p)), undian: s.undian.map((x) => (x.id === id ? { ...x, status: "disahkan" } : x)), log: lg(s, oleh, `hasil undian ${un.zona} disahkan · ${baru.length} e-SPTU dikirim ke aplikasi pedagang`) };
  });
}

// ---------- prospek Biru ----------
export function tambahProspek(nama: string, hp: string, asal: string, oleh: string) {
  up((s) => ({ ...s, seq: s.seq + 1, pelanggan: [{ id: `PJK-${pad(52000 + s.seq, 7)}`, nama, hp, kat: "B", tahap: 0, asal, pic: oleh }, ...s.pelanggan], log: lg(s, oleh, `prospek baru ${nama} (${asal})`) }));
}

// ---------- tagihan & kredit & escrow ----------
export function catatBayar(no: string, jumlah: number, metode: string, oleh: string) {
  up((s) => ({ ...s, esptu: s.esptu.map((e) => { if (e.no !== no) return e; const d = Math.min(e.harga, e.dibayar + jumlah); return { ...e, dibayar: Math.round(d * 10) / 10, telat: 0, lunas: d >= e.harga }; }), log: lg(s, oleh, `${no}: bayar ${jt(jumlah)} via ${metode}`) }));
}
export function ingatkan(no: string, oleh: string) {
  up((s) => {
    const e = s.esptu.find((x) => x.no === no)!;
    let chat = s.chat;
    const ada = chat.find((c) => c.pelangganId === e.pelangganId);
    const m = { dari: "a" as const, teks: `Pengingat: angsuran unit ${e.unit} sudah lewat ${e.telat} hari. Bayar lewat VA/QRIS di menu Revitalisasi.`, t: now() };
    chat = ada ? chat.map((c) => (c === ada ? { ...c, msgs: [...c.msgs, m] } : c)) : [{ id: `C${s.seq + 10}`, pelangganId: e.pelangganId, peran: "Collection", kategori: "Pengingat bayar", unread: 0, msgs: [m] }, ...chat];
    return { ...s, seq: s.seq + 1, chat, log: lg(s, oleh, `pengingat collection ${e.unit}`) };
  });
}
export const majukanKredit = (id: string, oleh: string) => up((s) => ({ ...s, kredit: s.kredit.map((k) => (k.id === id ? { ...k, tahap: Math.min(5, k.tahap + 1), catatan: KREDIT_TAHAP[Math.min(5, k.tahap + 1)], umur: 0 } : k)), log: lg(s, oleh, `kredit ${id} → ${KREDIT_TAHAP[Math.min(5, (s.kredit.find((k) => k.id === id)?.tahap ?? 0) + 1)]}`) }));
export function ajukanKredit(no: string, bank: string, plafon: number, oleh: string) {
  up((s) => { const e = s.esptu.find((x) => x.no === no)!; return { ...s, seq: s.seq + 1, kredit: [{ id: `KR-${pad(300 + s.seq, 4)}`, pelangganId: e.pelangganId, unit: e.unit, bank, plafon, tahap: 0, catatan: "Pengajuan dikirim ke bank", umur: 0 }, ...s.kredit], esptu: s.esptu.map((x) => (x.no === no ? { ...x, skema: "kpr", bank } : x)), log: lg(s, oleh, `pengajuan kredit ${bank} ${jt(plafon)} untuk ${e.unit}`) }; });
}
/** Batas pencairan kumulatif dari escrow: kas masuk × (progres fisik + 10%) — rumus contoh, disepakati dalam PKS. */
export const batasCair = (kas: number, progres: number) => (kas * Math.min(100, progres + 10)) / 100;
export function ajukanTermin(ket: string, jumlah: number, oleh: string) {
  up((s) => ({ ...s, seq: s.seq + 1, termin: [...s.termin, { id: `TM-${s.termin.length + 1}`, ket, jumlah, status: "diajukan", t: now() }], log: lg(s, oleh, `ajukan pencairan escrow ${jt(jumlah)}: ${ket}`) }));
}
export const setujuiTermin = (id: string, oleh: string) => up((s) => ({ ...s, termin: s.termin.map((t) => (t.id === id ? { ...t, status: t.status === "diajukan" ? "disetujui" : "cair" } : t)), log: lg(s, oleh, `termin ${id} ${s.termin.find((t) => t.id === id)?.status === "diajukan" ? "disetujui Pasar Jaya" : "dicairkan bank escrow"}`) }));

// ---------- progres, chat, konten ----------
export function kirimProgres(persen: number, catatan: string, oleh: string) {
  up((s) => ({ ...s, progres: [{ t: now(), persen, catatan, oleh }, ...s.progres], rencana: Math.max(s.rencana, persen + 2), log: lg(s, oleh, `update progres ${persen}% dikirim ke ${s.esptu.length} pemesan`) }));
}
export function balasChat(id: string, teks: string, dari: "a" | "p", oleh: string) {
  up((s) => ({ ...s, chat: s.chat.map((c) => (c.id === id ? { ...c, unread: dari === "a" ? 0 : c.unread + 1, msgs: [...c.msgs, { dari, teks, t: now() }] } : c)), log: dari === "a" ? lg(s, oleh, `balas chat ${id}`) : s.log }));
}
export const bacaChat = (id: string) => up((s) => ({ ...s, chat: s.chat.map((c) => (c.id === id ? { ...c, unread: 0 } : c)) }));
export function jadikanTiket(id: string, oleh: string) {
  up((s) => ({ ...s, seq: s.seq + 1, chat: s.chat.map((c) => (c.id === id ? { ...c, tiket: { id: `TK-${pad(420 + s.seq, 4)}`, sla: c.peran === "Collection" ? 24 : 8, status: "terbuka" } } : c)), log: lg(s, oleh, `chat ${id} dijadikan tiket`) }));
}
export const tutupTiket = (id: string, oleh: string) => up((s) => ({ ...s, chat: s.chat.map((c) => (c.id === id && c.tiket ? { ...c, tiket: { ...c.tiket, status: "selesai" } } : c)), log: lg(s, oleh, `tiket chat ${id} selesai`) }));
export const alihkanChat = (id: string, peran: Chat["peran"], oleh: string) => up((s) => ({ ...s, chat: s.chat.map((c) => (c.id === id ? { ...c, peran } : c)), log: lg(s, oleh, `chat ${id} dialihkan ke ${peran}`) }));
export function tambahKonten(jenis: string, judul: string, kanal: string, oleh: string) {
  up((s) => ({ ...s, seq: s.seq + 1, konten: [{ id: `K${s.seq + 10}`, jenis, judul, t: now(), kanal, status: "terbit" }, ...s.konten], log: lg(s, oleh, `update ${jenis}: ${judul}`) }));
}
/** Simulasi sisi pedagang (pratinjau HP PaJaKu menu Revitalisasi). */
export function pedagangTtd(no: string) { majukanESPTU(no, "Pedagang via PaJaKu"); }
export function pedagangBayar(no: string, jumlah: number) { catatBayar(no, jumlah, "QRIS PaJaKu", "Pedagang via PaJaKu"); }
