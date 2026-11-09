"use client";

// KulakanPaja — aplikasi PEMASOK (B2B) untuk memasok toko TokoPaja (pedagang ber-e-SIPTU) di pasar Pasar Jaya.
// Akun contoh: Perumda Pasar Jaya · Direktorat Perkulakan dan Ritel (Jakgrosir Kramat Jati).
// Katalog & harga di sini SAMA dengan yang tampil di menu Kulakan aplikasi TokoPaja dan ringkasan Perkulakan di Konsol Pasar Jaya.
// Semua nama & angka ilustrasi (kanvas "KulakanPaja — UI HP & Desktop").
import { useSyncExternalStore } from "react";

export type Grup = "Minyak & Lemak" | "Gula, Tepung & Bahan kue" | "Telur & Susu";
export type SKU = { id: string; nama: string; grup: Grup; satuan: string; isi: string; tiers: [number, number][]; het: number; perUnit: string; stok: number; minPesan: number; zona: string[]; doOk: boolean; tayang: boolean; tpid?: boolean };
export type Toko = { id: string; nama: string; pedagang: string; kat: "E" | "P" | "G" | "B"; pasar: string; kios: string; grup: Grup[]; belanja30: number; sinyal: "restok" | "menurun" | "baru" | "normal"; pesanan: number; sejak: string };
export type Bayar = "qris" | "va" | "do30" | "do60" | "do90" | "tempo14";
export type ItemP = { sku: string; qty: number; harga: number };
export type Pesanan = {
  id: string; tokoId: string; items: ItemP[]; bayar: Bayar; status: "baru" | "dikonfirmasi" | "dikirim" | "diterima" | "ditolak";
  hub: string; slot: string; agent: string; t: string; doStatus?: "diajukan" | "disetujui" | "dibayar" | "melebihi plafon"; lunas: boolean; umur: number;
};
export type Broadcast = { id: string; grup: Grup; judul: string; isi: string; target: number; status: "menunggu" | "disetujui" | "terkirim"; oleh: string; t: string };
export type Tugas = { id: string; komoditas: string; sku: string; volume: number; satuan: string; realisasi: number; hargaJual: number; acuan: number; sebelum: number; sesudah: number; pasar: number; status: "berjalan" | "pasokan kurang" | "selesai" };
export type Staf = { id: string; nama: string; peran: "direktur" | "salesmgr" | "agent" | "merch" | "delivery" | "collection" | "finance" | "patrol"; jabatan: string; grup?: Grup };
export type KState = { versi: number; sesi: { stafId: string } | null; seq: number; sku: SKU[]; toko: Toko[]; pesanan: Pesanan[]; broadcast: Broadcast[]; tugas: Tugas[]; log: { t: string; siapa: string; apa: string }[] };

export const PEMASOK = { nama: "Perumda Pasar Jaya", unit: "Direktorat Perkulakan dan Ritel", gudang: "Jakgrosir Kramat Jati" };
export const PIN = "123456";
export const BANK = "Bank Jakarta";
export const BAYAR: Record<Bayar, string> = { qris: "QRIS", va: "VA Bank Jakarta", do30: "Pembiayaan DO · 30 hari", do60: "Pembiayaan DO · 60 hari", do90: "Pembiayaan DO · 90 hari", tempo14: "Tempo sendiri 14 hari" };
export const isDO = (b: Bayar) => b.startsWith("do");
export const STAF: Staf[] = [
  { id: "K-DIR", nama: "Direktur Perkulakan dan Ritel", peran: "direktur", jabatan: "L1 · Direktur (EIS)" },
  { id: "K-SM", nama: "Hendra Wijaya", peran: "salesmgr", jabatan: "L2 · Sales Manager" },
  { id: "K-AG1", nama: "Rina", peran: "agent", jabatan: "L3 · Sales Agent Minyak & Lemak", grup: "Minyak & Lemak" },
  { id: "K-AG2", nama: "Fajar", peran: "agent", jabatan: "L3 · Sales Agent Gula, Tepung & Bahan kue", grup: "Gula, Tepung & Bahan kue" },
  { id: "K-AG3", nama: "Dewi", peran: "agent", jabatan: "L3 · Sales Agent Telur & Susu", grup: "Telur & Susu" },
  { id: "K-MER", nama: "Nadia Kusuma", peran: "merch", jabatan: "Merchandising · harga & PSO/TPID" },
  { id: "K-DEL", nama: "Joko Purnomo", peran: "delivery", jabatan: "L4 · Delivery Hub Johar Baru" },
  { id: "K-COL", nama: "Asep Sunarya", peran: "collection", jabatan: "L4 · Collection" },
  { id: "K-FIN", nama: "Lusi Hartati", peran: "finance", jabatan: "Finance & Accounting" },
  { id: "K-PTR", nama: "Admin PATROL", peran: "patrol", jabatan: "Konsol PATROL · multi-pemasok" },
];
export const HOME: Record<Staf["peran"], string> = { direktur: "/kp/eis/", salesmgr: "/kp/beranda/", agent: "/kp/beranda/", merch: "/kp/katalog/", delivery: "/kp/gudang/", collection: "/kp/tagihan/", finance: "/kp/keuangan/", patrol: "/kp/patrol/" };

/** Katalog Pasar Jaya Perkulakan — juga dipakai menu Kulakan di TokoPaja. Harga per satuan jual, bertingkat. */
export const KATALOG: SKU[] = [
  { id: "MG1", nama: "Minyak goreng 1 L", grup: "Minyak & Lemak", satuan: "dus", isi: "12 × 1 L", tiers: [[1, 174000], [10, 171600], [50, 169200]], het: 15700, perUnit: "L", stok: 1020, minPesan: 1, zona: ["Jakpus", "Jaktim", "Jakut"], doOk: true, tayang: true },
  { id: "MGR", nama: "Minyak goreng rakyat 1 L (penugasan TPID)", grup: "Minyak & Lemak", satuan: "dus", isi: "12 × 1 L", tiers: [[1, 170400]], het: 15700, perUnit: "L", stok: 760, minPesan: 1, zona: ["Jakpus", "Jaktim", "Jakut", "Jaksel", "Jakbar"], doOk: true, tayang: true, tpid: true },
  { id: "MT2", nama: "Mentega 200 g", grup: "Minyak & Lemak", satuan: "dus", isi: "24 × 200 g", tiers: [[1, 168000], [10, 165000]], het: 0, perUnit: "pak", stok: 210, minPesan: 1, zona: ["Jakpus", "Jaktim"], doOk: true, tayang: true },
  { id: "GP1", nama: "Gula pasir 1 kg", grup: "Gula, Tepung & Bahan kue", satuan: "bal", isi: "20 × 1 kg", tiers: [[1, 334000], [10, 330000]], het: 17500, perUnit: "kg", stok: 540, minPesan: 1, zona: ["Jakpus", "Jaktim", "Jakut"], doOk: true, tayang: true, tpid: true },
  { id: "TT1", nama: "Tepung terigu 25 kg", grup: "Gula, Tepung & Bahan kue", satuan: "sak", isi: "25 kg", tiers: [[1, 205000], [10, 201000]], het: 0, perUnit: "kg", stok: 380, minPesan: 1, zona: ["Jakpus", "Jaktim"], doOk: true, tayang: true },
  { id: "BR5", nama: "Beras medium 5 kg (titip jual Food Station)", grup: "Gula, Tepung & Bahan kue", satuan: "karung", isi: "5 kg", tiers: [[1, 64500], [20, 63500]], het: 13500, perUnit: "kg", stok: 900, minPesan: 2, zona: ["Jakpus", "Jaktim", "Jakut", "Jaksel"], doOk: true, tayang: true },
  { id: "TA1", nama: "Telur ayam ras", grup: "Telur & Susu", satuan: "peti", isi: "15 kg", tiers: [[1, 397500], [5, 393000]], het: 30000, perUnit: "kg", stok: 120, minPesan: 1, zona: ["Jakpus", "Jaktim", "Jakut"], doOk: true, tayang: true, tpid: true },
  { id: "SU1", nama: "Susu UHT 1 L", grup: "Telur & Susu", satuan: "dus", isi: "12 × 1 L", tiers: [[1, 216000], [10, 212000]], het: 0, perUnit: "L", stok: 260, minPesan: 1, zona: ["Jakpus", "Jaktim"], doOk: true, tayang: true },
];
export const hargaTier = (s: SKU, qty: number) => [...s.tiers].reverse().find(([min]) => qty >= min)?.[1] ?? s.tiers[0][1];
export const perUnit = (s: SKU, harga: number) => Math.round(harga / (parseFloat(s.isi) || 1));

const PASAR = ["Pasar Johar Baru", "Pasar Kramat Jati", "Pasar Senen", "Pasar Cempaka Putih", "Pasar Rawamangun", "Pasar Jatinegara", "Pasar Koja Baru", "Pasar Minggu"];
const KODE: Record<string, string> = { "Pasar Johar Baru": "JHB", "Pasar Kramat Jati": "KRJ", "Pasar Senen": "SNN", "Pasar Cempaka Putih": "CPT", "Pasar Rawamangun": "RWM", "Pasar Jatinegara": "JTN", "Pasar Koja Baru": "KJB", "Pasar Minggu": "PMG" };
const NAMA = ["Barokah", "Sumber Rejeki", "Berkah Jaya", "Maju Lancar", "Sinar Abadi", "Rizki", "Amanah", "Sejahtera", "Mandiri", "Harapan", "Makmur", "Sentosa", "Bu Yati", "Pak Darto", "Mbak Sri", "Cak Imin", "Koh Ahan", "Bang Udin"];
export const HUB: Record<string, string> = { JHB: "Hub Johar Baru", KRJ: "Jakgrosir Kramat Jati", SNN: "Hub Senen", CPT: "Hub Johar Baru", RWM: "Hub Rawamangun", JTN: "Hub Rawamangun", KJB: "Hub Koja", PMG: "Mini DC Pasar Minggu" };

const pad = (n: number, w: number) => String(n).padStart(w, "0");
export const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
export const m = (n: number) => (n >= 1e9 ? `Rp${(n / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M` : n >= 1e6 ? `Rp${Math.round(n / 1e6).toLocaleString("id-ID")} jt` : rp(n));
const now = () => new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export function seed(): KState {
  let x = 31102026;
  const r = () => ((x = (x * 16807) % 2147483647) / 2147483647);
  const GR: Grup[] = ["Minyak & Lemak", "Gula, Tepung & Bahan kue", "Telur & Susu"];
  // toko TokoPaja — persona sama dengan aplikasi pedagang (PaJaKu)
  const toko: Toko[] = [
    { id: "TP-JHB-A-L1-023", nama: "Toko Siti Sembako", pedagang: "Siti Rahmawati", kat: "E", pasar: "Pasar Johar Baru", kios: "JHB-A-L1-023", grup: GR, belanja30: 9_400_000, sinyal: "restok", pesanan: 18, sejak: "Jul 2026" },
    { id: "TP-JHB-B-L1-010", nama: "Budi Sayur Segar", pedagang: "Budi Darmawan", kat: "G", pasar: "Pasar Johar Baru", kios: "JHB-B-L1-010", grup: ["Minyak & Lemak", "Telur & Susu"], belanja30: 2_100_000, sinyal: "normal", pesanan: 6, sejak: "Okt 2026" },
  ];
  for (let i = 0; i < 118; i++) {
    const ps = PASAR[Math.floor(r() * PASAR.length)], k = KODE[ps];
    const q = r();
    toko.push({ id: `TP-${k}-${"ABC"[Math.floor(r() * 3)]}-L${1 + Math.floor(r() * 2)}-${pad(1 + Math.floor(r() * 90), 3)}`, nama: `${r() < 0.5 ? "Toko" : "UD"} ${NAMA[Math.floor(r() * NAMA.length)]}`, pedagang: "—", kat: (["E", "E", "E", "P", "G", "G", "B"] as const)[Math.floor(r() * 7)], pasar: ps, kios: "", grup: GR.filter(() => r() < 0.7).length ? GR.filter(() => r() < 0.7) : [GR[0]], belanja30: Math.round(r() * 30) * 500_000 + 500_000, sinyal: q < 0.3 ? "restok" : q < 0.38 ? "menurun" : q < 0.45 ? "baru" : "normal", pesanan: Math.floor(r() * 30), sejak: ["Jul", "Agu", "Sep", "Okt"][Math.floor(r() * 4)] + " 2026" });
  }
  toko.forEach((t) => { if (!t.kios) t.kios = t.id.slice(3); if (t.sinyal === "baru") { t.pesanan = 0; t.belanja30 = 0; } });
  const sku = KATALOG.map((s) => ({ ...s, zona: [...s.zona], tiers: s.tiers.map((t) => [...t] as [number, number]) }));
  const agentOf = (g: Grup) => STAF.find((s) => s.grup === g)!.nama;
  const pesanan: Pesanan[] = [];
  const mk = (tokoId: string, items: [string, number][], bayar: Bayar, status: Pesanan["status"], umur = 0) => {
    const t = toko.find((y) => y.id === tokoId)!;
    const its = items.map(([s, q]) => ({ sku: s, qty: q, harga: hargaTier(sku.find((z) => z.id === s)!, q) }));
    const g = sku.find((z) => z.id === items[0][0])!.grup;
    pesanan.push({ id: `KP-2611-${pad(482 - pesanan.length * 3, 5)}`, tokoId, items: its, bayar, status, hub: HUB[t.id.split("-")[1]], slot: "Kamis 05.00–07.00", agent: agentOf(g), t: status === "baru" ? "Hari ini" : `${1 + Math.floor(r() * 7)} Nov`, doStatus: isDO(bayar) ? (status === "diterima" ? "dibayar" : status === "baru" ? "diajukan" : "disetujui") : undefined, lunas: status === "diterima" && bayar !== "tempo14", umur });
  };
  mk("TP-JHB-A-L1-023", [["MG1", 3]], "do60", "baru");
  mk("TP-JHB-B-L1-010", [["TA1", 1], ["MG1", 1]], "qris", "baru");
  for (let i = 0; i < 22; i++) {
    const t = toko[2 + Math.floor(r() * 100)];
    const s = sku[Math.floor(r() * sku.length)];
    const st = (["baru", "baru", "dikonfirmasi", "dikonfirmasi", "dikirim", "diterima", "diterima", "diterima"] as const)[Math.floor(r() * 8)];
    const b = t.kat === "E" && r() < 0.4 ? (["do30", "do60", "do90"] as const)[Math.floor(r() * 3)] : (["qris", "va", "tempo14", "qris"] as const)[Math.floor(r() * 4)];
    mk(t.id, [[s.id, 1 + Math.floor(r() * 12)]], b, st, b === "tempo14" && st === "diterima" ? Math.floor(r() * 45) : 0);
  }
  mk("TP-JHB-A-L1-023", [["GP1", 2], ["TA1", 1]], "do30", "diterima");
  return {
    versi: 1, sesi: null, seq: 1, sku, toko, pesanan,
    broadcast: [{ id: "BC-031", grup: "Gula, Tepung & Bahan kue", judul: "Promo tepung 25 kg minggu ini", isi: "Beli ≥10 sak harga Rp201.000/sak, kirim Kamis.", target: 212, status: "terkirim", oleh: "Fajar", t: "4 Nov" }],
    tugas: [
      { id: "TPID-1", komoditas: "Minyak goreng rakyat 1 L", sku: "MGR", volume: 40000, satuan: "L", realisasi: 31200, hargaJual: 14200, acuan: 15700, sebelum: 16400, sesudah: 15600, pasar: 24, status: "berjalan" },
      { id: "TPID-2", komoditas: "Telur ayam ras", sku: "TA1", volume: 60, satuan: "ton", realisasi: 38, hargaJual: 26500, acuan: 30000, sebelum: 32000, sesudah: 30800, pasar: 31, status: "pasokan kurang" },
      { id: "TPID-3", komoditas: "Gula pasir", sku: "GP1", volume: 30, satuan: "ton", realisasi: 30, hargaJual: 16200, acuan: 17500, sebelum: 18300, sesudah: 17400, pasar: 18, status: "selesai" },
    ],
    log: [{ t: "8 Nov 05.00", siapa: "Sistem", apa: "Data contoh KulakanPaja dimuat" }],
  };
}

// ---------- angka EIS (Okt 2026, ilustrasi kanvas) ----------
export const EIS = {
  bulan: [["Jul", 9.8, 11.0], ["Agu", 12.1, 13.0], ["Sep", 14.2, 15.5], ["Okt", 15.6, 17.8], ["Nov", 3.9, 18.5]] as [string, number, number][],
  komposisi: [["Minyak goreng", "Minyak & Lemak · Rina", 6.0, 5.8, 5.1, "#14532D"], ["Gula pasir", "Gula, Tepung & Bahan kue · Fajar", 3.7, 4.5, 6.4, "#4D9A6A"], ["Telur ayam ras", "Telur & Susu · Dewi", 2.4, 3.0, 4.2, "#C2410C"], ["Tepung terigu", "Gula, Tepung & Bahan kue · Fajar", 2.0, 2.5, 8.9, "#A7D3B5"], ["Susu UHT & kental manis", "Telur & Susu · Dewi", 0.9, 1.2, 9.6, "#FDBA74"], ["Beras (titip jual Food Station)", "Gula, Tepung & Bahan kue · Fajar", 0.6, 0.8, 2.0, "#64748B"]] as [string, string, number, number, number, string][],
  tagihan: { cair: 13.9, doProses: 1.06, tempo: 0.64, belumJT: 498, h30: 94, lebih30: 48 },
  doBank: { dibiayai: 4.82, cair: 3.76, pakai: 612, emerald: 1940, akad: [34, 46, 20] },
  pemasok: [["Perumda Pasar Jaya · Perkulakan dan Ritel", "Pro", 15.6, 1240], ["PT Food Station Tjipinang Jaya", "Basic", 6.2, 610], ["Perumda Dharma Jaya", "Basic", 2.8, 280]] as [string, string, number, number][],
};

// ---------- store ----------
const KEY = "kulakanpaja-v1";
const ls = new Set<() => void>();
let st: KState | null = null;
const SERVER = seed();
export function kload(): KState {
  if (st) return st;
  try { const raw = localStorage.getItem(KEY); if (raw) { const v = JSON.parse(raw) as KState; if (v.versi === 1) return (st = v); } } catch {}
  return (st = seed());
}
function commit(n: KState) { st = n; try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} ls.forEach((l) => l()); }
const up = (fn: (s: KState) => KState) => commit(fn(kload()));
export const useK = () => useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l); }, kload, () => SERVER);
const lg = (s: KState, siapa: string, apa: string) => [{ t: now(), siapa, apa }, ...s.log].slice(0, 300);
export const stafK = (id?: string) => STAF.find((x) => x.id === id);
export const tokoBy = (s: KState, id: string) => s.toko.find((t) => t.id === id);
export const skuBy = (s: KState, id: string) => s.sku.find((x) => x.id === id);
export const totalP = (p: Pesanan) => p.items.reduce((n, i) => n + i.qty * i.harga, 0);

export function masuk(id: string, pin: string): string | null { if (pin !== PIN) return "PIN salah."; up((s) => ({ ...s, sesi: { stafId: id } })); return null; }
export const keluarK = () => up((s) => ({ ...s, sesi: null }));
export const resetK = () => commit(seed());

// ---------- pesanan ----------
export function ubahQty(id: string, sku: string, qty: number) {
  up((s) => ({ ...s, pesanan: s.pesanan.map((p) => (p.id !== id ? p : { ...p, items: p.items.map((i) => (i.sku === sku ? { ...i, qty: Math.max(1, qty), harga: hargaTier(skuBy(s, sku)!, Math.max(1, qty)) } : i)) })) }));
}
/** Konfirmasi: stok dikurangi, masuk rute hub; DO → bank menyetujui (simulasi). */
export function konfirmasi(id: string, oleh: string) {
  up((s) => {
    const p = s.pesanan.find((x) => x.id === id)!;
    const t = tokoBy(s, p.tokoId)!;
    const doS = isDO(p.bayar) ? (t.kat === "E" ? (totalP(p) > 25_000_000 ? "melebihi plafon" : "disetujui") : undefined) : p.doStatus;
    return { ...s, pesanan: s.pesanan.map((x) => (x.id === id ? { ...x, status: doS === "melebihi plafon" ? "baru" : "dikonfirmasi", doStatus: doS } : x)), sku: doS === "melebihi plafon" ? s.sku : s.sku.map((k) => { const it = p.items.find((i) => i.sku === k.id); return it ? { ...k, stok: k.stok - it.qty } : k; }), log: lg(s, oleh, `${id} ${doS === "melebihi plafon" ? "ditahan: melebihi plafon DO" : `dikonfirmasi · rute ${p.hub}`}`) };
  });
}
export const tolak = (id: string, oleh: string) => up((s) => ({ ...s, pesanan: s.pesanan.map((x) => (x.id === id ? { ...x, status: "ditolak" } : x)), log: lg(s, oleh, `${id} ditolak`) }));
export const berangkat = (ids: string[], oleh: string) => up((s) => ({ ...s, pesanan: s.pesanan.map((x) => (ids.includes(x.id) ? { ...x, status: "dikirim" } : x)), log: lg(s, oleh, `${ids.length} kiriman berangkat`) }));
/** Serah terima QR di kios: DO diterima → bank membayar Pasar Jaya H+1; QRIS/VA lunas; tempo mulai berjalan. */
export function serahTerima(id: string, oleh: string) {
  up((s) => ({ ...s, pesanan: s.pesanan.map((x) => (x.id === id ? { ...x, status: "diterima", lunas: x.bayar !== "tempo14", doStatus: isDO(x.bayar) ? "dibayar" : x.doStatus } : x)), toko: s.toko.map((t) => { const p = s.pesanan.find((x) => x.id === id)!; return t.id === p.tokoId ? { ...t, belanja30: t.belanja30 + totalP(p), pesanan: t.pesanan + 1, sinyal: "normal" } : t; }), log: lg(s, oleh, `${id} diterima kios (QR serah terima)`) }));
}
export const lunasTempo = (id: string, oleh: string) => up((s) => ({ ...s, pesanan: s.pesanan.map((x) => (x.id === id ? { ...x, lunas: true, umur: 0 } : x)), log: lg(s, oleh, `${id} piutang tempo dilunasi`) }));
/** Simulasi: toko TokoPaja kulakan (pengganti sambungan server dari aplikasi pedagang). */
export function simulasiPesanan(): string {
  let id = "";
  up((s) => {
    const t = s.toko[2 + (s.seq * 7) % 100];
    const k = s.sku[(s.seq * 3) % s.sku.length];
    const qty = 2 + (s.seq % 5);
    id = `KP-2611-${pad(600 + s.seq, 5)}`;
    const bayar: Bayar = t.kat === "E" ? "do30" : "qris";
    return { ...s, seq: s.seq + 1, pesanan: [{ id, tokoId: t.id, items: [{ sku: k.id, qty, harga: hargaTier(k, qty) }], bayar, status: "baru", hub: HUB[t.id.split("-")[1]], slot: "Jumat 05.00–07.00", agent: STAF.find((x) => x.grup === k.grup)!.nama, t: "Baru saja", doStatus: isDO(bayar) ? "diajukan" : undefined, lunas: false, umur: 0 }, ...s.pesanan] };
  });
  return id;
}

// ---------- katalog ----------
export function simpanSKU(id: string, patch: Partial<SKU>, oleh: string) {
  up((s) => ({ ...s, sku: s.sku.map((k) => (k.id === id ? { ...k, ...patch } : k)), log: lg(s, oleh, `katalog ${id} diperbarui${patch.tiers ? ` · harga ${patch.tiers.map((t) => rp(t[1])).join("/")}` : ""}`) }));
}

// ---------- CRM & broadcast ----------
export function buatBroadcast(grup: Grup, judul: string, isi: string, target: number, oleh: string) {
  up((s) => ({ ...s, seq: s.seq + 1, broadcast: [{ id: `BC-${pad(40 + s.seq, 3)}`, grup, judul, isi, target, status: "menunggu", oleh, t: now() }, ...s.broadcast], log: lg(s, oleh, `broadcast "${judul}" diajukan ke Sales Manager`) }));
}
export const setujuiBroadcast = (id: string, oleh: string) => up((s) => ({ ...s, broadcast: s.broadcast.map((b) => (b.id === id ? { ...b, status: b.status === "menunggu" ? "disetujui" : "terkirim" } : b)), log: lg(s, oleh, `broadcast ${id} ${s.broadcast.find((b) => b.id === id)?.status === "menunggu" ? "disetujui" : "terkirim ke notifikasi TokoPaja"}`) }));

// ---------- TPID ----------
export function realisasiTPID(id: string, tambah: number, oleh: string) {
  up((s) => ({ ...s, tugas: s.tugas.map((t) => { if (t.id !== id) return t; const r = Math.min(t.volume, t.realisasi + tambah); return { ...t, realisasi: r, status: r >= t.volume ? "selesai" : t.status }; }), log: lg(s, oleh, `realisasi penugasan TPID ${id} +${tambah}`) }));
}
export const laporTPID = (oleh: string) => up((s) => ({ ...s, log: lg(s, oleh, "laporan penugasan dikirim ke TPID DKI Jakarta") }));
