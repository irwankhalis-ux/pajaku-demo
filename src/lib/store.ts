"use client";

// Lapisan data aplikasi. Saat ini tersimpan di HP (localStorage) dengan data contoh;
// setiap fungsi aksi di bawah adalah titik sambung ke API backend nanti.
import { useSyncExternalStore } from "react";
import {
  seed, sekarang, STAF, PIN_DEMO, OTP_DEMO, VERSI, PEMASOK, PROGRAM,
  type State, type Kategori, type Lapangan, type Dokumen, type TU, type Peran, type Pedagang, type Tiket,
  type Produk, type Pesanan, type Pengajuan, type Notif, type Kulakan,
} from "./model";

const KEY = "pajaku-v2";
const listeners = new Set<() => void>();
let state: State | null = null;
const SERVER = seed();

export function load(): State {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = JSON.parse(raw) as State; if (s.versi === VERSI) return (state = s); }
  } catch {}
  return (state = seed());
}

function commit(next: State) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export function useData(): State {
  return useSyncExternalStore(subscribe, load, () => SERVER);
}
function update(fn: (s: State) => State) { commit(fn(load())); }
const log = (s: State, siapa: string, apa: string, tuId?: string) => [{ t: sekarang(), siapa, apa, tuId }, ...s.log].slice(0, 300);
const nama = (s: State, id: string) => s.pedagang.find((p) => p.id === id)?.nama ?? id;

// ---------- turunan ----------
export function kategoriOf(s: State, pid: string): Kategori {
  const milik = s.tu.filter((t) => t.pemilikId === pid);
  if (milik.some((t) => t.pemakaiId === pid && t.buka)) return "E";
  if (milik.length) return "P";
  if (s.tu.some((t) => t.pemakaiId === pid)) return "G";
  return "B";
}
export const tuOf = (s: State, pid: string) => s.tu.filter((t) => t.pemilikId === pid || t.pemakaiId === pid);
export const dokOf = (s: State, pid: string) => s.dok.filter((d) => d.atasNamaId === pid && d.status !== "batal");
export const dokTU = (s: State, tuId: string) => s.dok.filter((d) => d.tuId === tuId && d.status !== "batal");
export const pedagangById = (s: State, id: string) => s.pedagang.find((p) => p.id === id);
export const tuById = (s: State, id: string) => s.tu.find((t) => t.id === id);
export function statistik(s: State) {
  const n = (st: TU["status"][]) => s.tu.filter((t) => st.includes(t.status)).length;
  const terbitSh = s.dok.filter((d) => d.jenis === "e-SHPTU" && d.status === "terbit").length;
  const terbitSi = s.dok.filter((d) => d.jenis === "e-SIPTU" && d.status === "terbit").length;
  const menunggu = s.dok.filter((d) => d.status === "menunggu");
  const pemakai = new Set(s.tu.filter((t) => t.buka).map((t) => t.pemakaiId));
  return {
    total: s.tu.length, terisi: s.tu.filter((t) => t.buka).length,
    didata: n(["didata", "divalidasi", "terbit"]), validasi: n(["didata"]), divalidasi: n(["divalidasi", "terbit"]),
    belum: n(["arsip", "dikembalikan"]), terbitSh, terbitSi, menunggu,
    aktif: s.pedagang.filter((p) => p.aktif && pemakai.has(p.id)).length, pemakai: pemakai.size,
    anomali: s.anomali.filter((a) => a.status !== "selesai").length, tiket: s.tiket.filter((t) => t.status === "terbuka").length,
  };
}
export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

// ---------- sesi ----------
export function cariHp(hp: string): Pedagang | undefined {
  const d = hp.replace(/\D/g, "");
  return load().pedagang.find((p) => p.hp === d);
}
export function masukPedagang(hp: string, otp: string): string | null {
  if (otp !== OTP_DEMO) return "Kode OTP salah.";
  const p = cariHp(hp);
  if (!p) return "Nomor HP belum terdaftar. Daftar sebagai anggota baru.";
  update((s) => ({ ...s, sesi: { peran: "pedagang", userId: p.id }, pedagang: s.pedagang.map((x) => (x.id === p.id ? { ...x, aktif: true } : x)), log: p.aktif ? s.log : log(s, p.nama, "aktivasi akun PaJaKu") }));
  return null;
}
export function daftarAnggota(namaBaru: string, hp: string, nik: string): string | null {
  const d = hp.replace(/\D/g, "");
  if (namaBaru.trim().length < 3) return "Isi nama lengkap sesuai KTP.";
  if (!/^08\d{8,11}$/.test(d)) return "Nomor HP tidak valid (contoh 0812…).";
  if (!/^\d{16}$/.test(nik.replace(/\D/g, ""))) return "NIK harus 16 angka.";
  if (cariHp(d)) return "Nomor HP sudah terdaftar. Silakan masuk.";
  update((s) => {
    const id = `PJK-${String(140000 + s.seq).padStart(7, "0")}`;
    const p: Pedagang = { id, nama: namaBaru.trim(), hp: d, nik: nik.replace(/\D/g, ""), aktif: true, daftar: sekarang() };
    return { ...s, seq: s.seq + 1, pedagang: [...s.pedagang, p], sesi: { peran: "pedagang", userId: id }, log: log(s, p.nama, "mendaftar sebagai anggota (Blue)") };
  });
  return null;
}
export function masukStaf(stafId: string, pin: string): string | null {
  const st = STAF.find((x) => x.id === stafId);
  if (!st) return "Pilih akun.";
  if (pin !== PIN_DEMO) return "PIN salah.";
  update((s) => ({ ...s, sesi: { peran: st.peran, userId: st.id } }));
  return null;
}
export const keluar = () => update((s) => ({ ...s, sesi: null }));
export const aturUlang = () => commit(seed());
export const stafById = (id: string) => STAF.find((x) => x.id === id);
export const peranHome: Record<Peran, string> = { pedagang: "/beranda/", petugas: "/petugas/", kepala: "/kepala/", manager: "/manager/", kadiv: "/kadiv/", direksi: "/direksi/", crm: "/bo/crm/", kasir: "/bo/tagihan/" };

// ---------- alur migrasi ----------
export function kirimPendataan(tuId: string, lap: Omit<Lapangan, "tgl">) {
  update((s) => ({
    ...s,
    tu: s.tu.map((t) => (t.id === tuId ? { ...t, status: "didata", lapangan: { ...lap, tgl: sekarang() }, catatan: undefined } : t)),
    log: log(s, lap.petugas, "pendataan lapangan dikirim ke Kepala Pasar", tuId),
  }));
}

export function validasi(tuId: string, setuju: boolean, catatan: string, oleh: string) {
  update((s) => {
    const t = s.tu.find((x) => x.id === tuId)!;
    if (!setuju) return { ...s, tu: s.tu.map((x) => (x.id === tuId ? { ...x, status: "dikembalikan", catatan } : x)), log: log(s, oleh, `dikembalikan ke petugas: ${catatan}`, tuId) };
    const lap = t.lapangan;
    let pedagang = s.pedagang, pemakaiId = t.pemakaiId, seq = s.seq;
    // pemakai di lapangan berbeda dari arsip & disetujui Pemilik → jadi Pengelola (Gold) di e-SIPTU
    if (lap && lap.pemakaiNama && lap.ownerOk && lap.pemakaiNama !== nama(s, t.pemakaiId)) {
      const ada = s.pedagang.find((p) => p.nama === lap.pemakaiNama && p.nik === lap.pemakaiNik);
      if (ada) pemakaiId = ada.id;
      else {
        pemakaiId = `PJK-${String(140000 + seq).padStart(7, "0")}`; seq++;
        pedagang = [...pedagang, { id: pemakaiId, nama: lap.pemakaiNama, hp: `0813${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`, nik: lap.pemakaiNik, aktif: false }];
      }
    }
    const nt: TU = { ...t, status: "divalidasi", pemakaiId, jenis: lap?.jenis ?? t.jenis, dagangan: lap?.dagangan ?? t.dagangan, buka: lap?.buka ?? t.buka, catatan: undefined };
    const baru: Dokumen[] = [];
    const ada = s.dok.filter((d) => d.tuId === tuId && d.status !== "batal");
    if (!ada.some((d) => d.jenis === "e-SHPTU")) baru.push({ no: `eSHPTU-JHB-${t.masaHak.slice(0, 4)}-${String(3000 + seq).padStart(6, "0")}`, jenis: "e-SHPTU", tuId, atasNamaId: t.pemilikId, berlaku: t.masaHak, status: "menunggu", keterangan: `Hak pemakaian ${nt.jenis} ${t.luas} m² · HPTU ${t.hptu.toLowerCase()}` });
    if (!ada.some((d) => d.jenis === "e-SIPTU")) baru.push({ no: `eSIPTU-JHB-2026-${String(3000 + seq + 1).padStart(6, "0")}`, jenis: "e-SIPTU", tuId, atasNamaId: pemakaiId, berlaku: "s.d. 31 Des 2026", status: "menunggu", keterangan: `Pemakai · ${nt.buka ? nt.dagangan : "TU kosong (BPP ditanggung Pemilik)"}` });
    const pengajuan = s.pengajuan.map((p) => (p.jenis === "migrasi" && p.tuId === tuId && p.status === "proses" && p.tahap < 3 ? { ...p, tahap: 3, riwayat: [...p.riwayat, { t: sekarang(), apa: `Diverifikasi ${oleh} · menunggu tanda tangan Direksi` }] } : p));
    return { ...s, seq: seq + 2, pedagang, pengajuan, tu: s.tu.map((x) => (x.id === tuId ? nt : x)), dok: [...s.dok, ...baru], log: log(s, oleh, "divalidasi, dokumen masuk antrean TTE", tuId) };
  });
}

export function tandaTangan(oleh: string, hanyaTU?: string[]): number {
  let n = 0;
  update((s) => {
    const tgl = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const ikut = (d: Dokumen) => d.status === "menunggu" && (!hanyaTU || hanyaTU.includes(d.tuId));
    // dokumen baru menggantikan dokumen terbit lama berjenis sama di TU yang sama (revisi, pengalihan, perpanjangan)
    const ganti = new Set(s.dok.filter(ikut).map((d) => `${d.tuId}|${d.jenis}`));
    const dok = s.dok.map((d) => {
      if (ikut(d)) { n++; return { ...d, status: "terbit" as const, terbit: tgl }; }
      if (d.status === "terbit" && ganti.has(`${d.tuId}|${d.jenis}`)) return { ...d, status: "batal" as const };
      return d;
    });
    const tu = s.tu.map((t) => (t.status === "divalidasi" && dok.filter((d) => d.tuId === t.id && d.status !== "batal").every((d) => d.status === "terbit") ? { ...t, status: "terbit" as const } : t));
    const tuSelesai = new Set(s.dok.filter(ikut).map((d) => d.tuId));
    const pengajuan = s.pengajuan.map((p) => (p.tuId && tuSelesai.has(p.tuId) && p.status === "proses" && p.tahap >= 2 ? { ...p, tahap: 4, status: "disetujui" as const, riwayat: [...p.riwayat, { t: sekarang(), apa: "Dokumen ditandatangani elektronik Direksi dan terbit" }] } : p));
    const notif = [...s.notif];
    for (const d of s.dok.filter(ikut)) notif.unshift(nt(s, d.atasNamaId, `${d.jenis} ${d.tuId} terbit`, `Dokumen ${d.no} sudah ditandatangani elektronik dan ada di Dompet Dokumen.`, `/dokumen/?no=${d.no}`, notif.length));
    return { ...s, dok, tu, pengajuan, notif: notif.slice(0, 400), log: log(s, oleh, `TTE ${hanyaTU ? "" : "batch "}${n} dokumen`) };
  });
  return n;
}
const nt = (s: State, pedagangId: string, judul: string, isi: string, href?: string, k = 0): Notif => ({ id: `NT-${s.seq}-${k}-${Math.random().toString(36).slice(2, 6)}`, pedagangId, judul, isi, t: sekarang(), baca: false, href });

// ---------- layanan pedagang ----------
export function ajukanKoreksi(pid: string, tuId: string, bagian: string[], teks: string, foto: boolean): string {
  let id = "";
  update((s) => {
    id = `KRS-JHB-26-${String(150 + s.seq).padStart(4, "0")}`;
    const t: Tiket = { id, jenis: "koreksi", pedagangId: pid, tuId, topik: `${bagian.join(", ")}: ${teks}`, bagian, msgs: [{ dari: "p", teks: teks + (foto ? " (1 foto terlampir)" : ""), t: sekarang() }], status: "terbuka", dibuat: sekarang() };
    return { ...s, seq: s.seq + 1, tiket: [t, ...s.tiket], log: log(s, nama(s, pid), "mengajukan koreksi data", tuId) };
  });
  return id;
}
export function tanya(pid: string, teks: string) {
  update((s) => {
    const t: Tiket = { id: `TKT-JHB-26-${String(400 + s.seq).padStart(4, "0")}`, jenis: "tanya", pedagangId: pid, topik: teks.slice(0, 80), msgs: [{ dari: "p", teks, t: sekarang() }], status: "terbuka", dibuat: sekarang() };
    return { ...s, seq: s.seq + 1, tiket: [t, ...s.tiket] };
  });
}
export function balasTiket(id: string, teks: string, dari: "p" | "s") {
  update((s) => ({ ...s, tiket: s.tiket.map((t) => (t.id === id ? { ...t, msgs: [...t.msgs, { dari, teks, t: sekarang() }], status: dari === "s" && t.jenis === "tanya" ? "dijawab" : t.status } : t)) }));
}
export function putuskanKoreksi(id: string, setuju: boolean, oleh: string) {
  update((s) => {
    const t = s.tiket.find((x) => x.id === id)!;
    let dok = s.dok;
    const msg = setuju ? "Koreksi disetujui. Dokumen versi baru menunggu tanda tangan Direksi dan akan muncul di aplikasi Anda." : "Koreksi belum bisa disetujui. Mohon bawa bukti ke kantor pasar; petugas siap membantu.";
    if (setuju && t.tuId) {
      const si = s.dok.find((d) => d.tuId === t.tuId && d.jenis === "e-SIPTU" && d.status === "terbit");
      if (si && !s.dok.some((d) => d.no === si.no + "-R1")) dok = [...dok, { ...si, no: si.no + "-R1", status: "menunggu", terbit: undefined, keterangan: si.keterangan + " · revisi koreksi " + id }];
    }
    return { ...s, dok, tiket: s.tiket.map((x) => (x.id === id ? { ...x, status: setuju ? "disetujui" : "ditolak", msgs: [...x.msgs, { dari: "s", teks: msg, t: sekarang() }] } : x)), log: log(s, oleh, `koreksi ${id} ${setuju ? "disetujui" : "ditolak"}`, t.tuId) };
  });
}

// ---------- anomali & eskalasi ----------
export function anomaliSelesai(id: string, oleh: string) {
  update((s) => ({ ...s, anomali: s.anomali.map((a) => (a.id === id ? { ...a, status: "selesai" } : a)), log: log(s, oleh, `anomali ${id} selesai`) }));
}
export function eskalasi(id: string, oleh: string) {
  update((s) => ({ ...s, anomali: s.anomali.map((a) => (a.id === id ? { ...a, status: "eskalasi" } : a)), log: log(s, oleh, `anomali ${id} dieskalasi ke Kadiv`) }));
}
export function putuskanEskalasi(id: string, keputusan: string, oleh: string) {
  update((s) => ({ ...s, anomali: s.anomali.map((a) => (a.id === id ? { ...a, keputusan, status: keputusan.startsWith("Teruskan") ? "eskalasi" : "selesai" } : a)), log: log(s, oleh, `keputusan anomali ${id}: ${keputusan}`) }));
}

// ---------- util ----------
export const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
export const rentang = (a: number, b: number) => (a === b ? rp(a) : `${rp(a)}–${Math.round(b).toLocaleString("id-ID")}`);

// ---------- notifikasi ----------
export function notifOf(s: State, pid: string): Notif[] {
  const kat = kategoriOf(s, pid);
  const blok = new Set(tuOf(s, pid).map((t) => `Blok ${t.blok}`));
  const umum = s.pengumuman.filter((g) => g.sasaran === "Semua pedagang" || blok.has(g.sasaran) || g.sasaran.startsWith(KATEGORI_NAMA[kat]))
    .map((g) => ({ id: g.id, pedagangId: pid, judul: `📢 ${g.judul}`, isi: g.isi, t: g.t, baca: true }));
  return [...s.notif.filter((n) => n.pedagangId === pid), ...umum];
}
const KATEGORI_NAMA: Record<Kategori, string> = { E: "Emerald", P: "Platinum", G: "Gold", B: "Blue" };
export const bacaNotif = (pid: string) => update((s) => ({ ...s, notif: s.notif.map((n) => (n.pedagangId === pid ? { ...n, baca: true } : n)) }));

// ---------- registrasi ----------
export function daftarLengkap(d: { nama: string; hp: string; nik: string }): string | null {
  const e = daftarAnggota(d.nama, d.hp, d.nik);
  return e;
}

/** Registrasi Pengelola (penyewa/keluarga) atas TU milik orang lain: butuh persetujuan Pemilik (PIN) lalu verifikasi kantor pasar. */
export function ajukanPengelola(pid: string, tuId: string, periode: string, dagangan: string): string | null {
  const s0 = load();
  const t = tuById(s0, tuId.trim().toUpperCase());
  if (!t) return "ID Kios tidak ditemukan di Pasar Johar Baru.";
  if (t.pemilikId === pid) return "Anda tercatat sebagai Pemilik TU ini.";
  if (t.buka && t.pemakaiId !== t.pemilikId) return "TU ini sudah punya Pengelola aktif.";
  if (s0.pengajuan.some((p) => p.jenis === "pengelola" && p.tuId === t.id && p.status === "proses")) return "Sudah ada pengajuan Pengelola untuk TU ini.";
  update((s) => {
    const id = `RPS-JHB-26-${String(400 + s.seq).padStart(4, "0")}`;
    const p: Pengajuan = { id, jenis: "pengelola", pedagangId: pid, tuId: t.id, judul: `Registrasi Pengelola ${t.id}`, data: { periode, dagangan, pemilik: t.pemilikId }, tahap: 1, status: "proses", dibuat: sekarang(), riwayat: [{ t: sekarang(), apa: "Pengajuan terkirim, menunggu persetujuan Pemilik" }] };
    return { ...s, seq: s.seq + 1, pengajuan: [p, ...s.pengajuan], notif: [nt(s, t.pemilikId, `Permintaan Pengelola untuk ${t.id}`, `${nama(s, pid)} ingin menjadi Pengelola TU Anda. Tinjau dan setujui dengan PIN.`, `/persetujuan/?id=${id}`), ...s.notif], log: log(s, nama(s, pid), "mengajukan diri sebagai Pengelola", t.id) };
  });
  return null;
}

/** Pemilik menyetujui/menolak Pengelola (PIN). */
export function putuskanPengelolaPemilik(id: string, setuju: boolean, pin: string): string | null {
  if (setuju && pin !== PIN_DEMO) return "PIN salah.";
  update((s) => {
    const p = s.pengajuan.find((x) => x.id === id)!;
    const np: Pengajuan = setuju
      ? { ...p, tahap: 2, riwayat: [...p.riwayat, { t: sekarang(), apa: "Disetujui Pemilik dengan PIN · diteruskan ke Kepala Pasar" }] }
      : { ...p, status: "ditolak", riwayat: [...p.riwayat, { t: sekarang(), apa: "Ditolak Pemilik" }] };
    return { ...s, pengajuan: s.pengajuan.map((x) => (x.id === id ? np : x)), notif: [nt(s, p.pedagangId, setuju ? "Pemilik menyetujui pengajuan Anda" : "Pengajuan Pengelola ditolak Pemilik", setuju ? "Kepala Pasar akan memverifikasi, lalu e-SIPTU terbit atas nama Anda." : "Hubungi Pemilik TU atau kantor pasar.", `/pengajuan/?id=${id}`), ...s.notif], log: log(s, nama(s, p.data.pemilik), `${setuju ? "menyetujui" : "menolak"} Pengelola ${nama(s, p.pedagangId)}`, p.tuId) };
  });
  return null;
}

/** Migrasi digital SHPTU kertas → e-SHPTU & e-SIPTU secara mandiri dari aplikasi. */
export function migrasiMandiri(pid: string, tuId: string, d: { shptu: string; foto: number; dagangan: string; buka: boolean; pengelola?: string; pengelolaNik?: string }): string | null {
  const s0 = load();
  const t = tuById(s0, tuId.trim().toUpperCase());
  if (!t) return "ID Kios tidak ditemukan.";
  if (t.status !== "arsip" && t.status !== "dikembalikan") return "TU ini sudah didata. Lihat statusnya di Beranda.";
  if (d.shptu.trim().length < 5) return "Isi nomor SHPTU kertas.";
  if (d.foto < 2) return "Foto SHPTU kertas dan kwitansi BPP terakhir wajib.";
  const klaim = t.pemilikId !== pid;
  update((s) => {
    const id = `MIG-JHB-26-${String(200 + s.seq).padStart(4, "0")}`;
    const lap: Lapangan = { pemakaiNama: d.pengelola ?? "", pemakaiNik: d.pengelolaNik ?? "", jenis: t.jenis, dagangan: d.dagangan, buka: d.buka, foto: d.foto, ownerOk: true, petugas: "Mandiri via aplikasi", tgl: sekarang() };
    const p: Pengajuan = { id, jenis: "migrasi", pedagangId: pid, tuId: t.id, judul: `Migrasi digital SHPTU ${t.id}`, data: { shptu: d.shptu, cara: "Mandiri via aplikasi", ...(klaim ? { klaim: "Pemohon belum tercatat sebagai Pemilik di arsip — kantor pasar mencocokkan dengan SHPTU kertas" } : {}) }, tahap: 2, status: "proses", dibuat: sekarang(), riwayat: [{ t: sekarang(), apa: `Data, ${d.foto} foto & lokasi kios dikirim dari aplikasi` }] };
    return { ...s, seq: s.seq + 1, pengajuan: [p, ...s.pengajuan], tu: s.tu.map((x) => (x.id === t.id ? { ...x, status: "didata", mandiri: true, lapangan: lap, catatan: undefined } : x)), log: log(s, nama(s, pid), "migrasi mandiri dikirim dari aplikasi", t.id) };
  });
  return null;
}

/** Kepala Pasar menyetujui pengajuan (pengelola/migrasi mandiri) → dokumen masuk antrean TTE Direksi. */
export function setujuiPengajuan(id: string, oleh: string) {
  const p = load().pengajuan.find((x) => x.id === id);
  if (!p?.tuId) return;
  if (p.jenis === "migrasi") {
    if (p.data.klaim) update((s) => ({ ...s, tu: s.tu.map((t) => (t.id === p.tuId ? { ...t, pemakaiId: t.pemakaiId === t.pemilikId ? p.pedagangId : t.pemakaiId, pemilikId: p.pedagangId } : t)) }));
    validasi(p.tuId, true, "", oleh);
  } else if (p.jenis === "pengelola") {
    update((s) => {
      const t = tuById(s, p.tuId!)!;
      const no = `eSIPTU-JHB-2026-${String(5000 + s.seq).padStart(6, "0")}`;
      const dok: Dokumen = { no, jenis: "e-SIPTU", tuId: t.id, atasNamaId: p.pedagangId, berlaku: "s.d. 31 Des 2026", status: "menunggu", keterangan: `Pengelola (sewa) · ${p.data.dagangan} · dialihkan dari Pemilik` };
      return { ...s, seq: s.seq + 1, dok: [...s.dok, dok], tu: s.tu.map((x) => (x.id === t.id ? { ...x, pemakaiId: p.pedagangId, buka: true, dagangan: p.data.dagangan.split(" · ")[0], status: "divalidasi" } : x)), log: log(s, oleh, `Pengelola ${nama(s, p.pedagangId)} diverifikasi`, t.id) };
    });
  }
  update((s) => ({ ...s, pengajuan: s.pengajuan.map((x) => (x.id === id ? { ...x, tahap: 3, riwayat: [...x.riwayat, { t: sekarang(), apa: `Diverifikasi ${oleh} · menunggu tanda tangan Direksi` }] } : x)), notif: [nt(s, p.pedagangId, "Pengajuan diverifikasi kantor pasar", "Dokumen Anda tinggal menunggu tanda tangan elektronik Direksi.", `/pengajuan/?id=${id}`), ...s.notif] }));
}
export function tolakPengajuan(id: string, alasan: string, oleh: string) {
  update((s) => {
    const p = s.pengajuan.find((x) => x.id === id)!;
    return { ...s, pengajuan: s.pengajuan.map((x) => (x.id === id ? { ...x, status: "ditolak", riwayat: [...x.riwayat, { t: sekarang(), apa: `Dikembalikan ${oleh}: ${alasan}` }] } : x)), tu: p.jenis === "migrasi" ? s.tu.map((t) => (t.id === p.tuId ? { ...t, status: "dikembalikan", catatan: alasan } : t)) : s.tu, notif: [nt(s, p.pedagangId, "Pengajuan perlu dilengkapi", alasan, `/pengajuan/?id=${id}`), ...s.notif] };
  });
}
/** Hanya untuk aplikasi pedagang yang berdiri sendiri (tanpa server): jalankan proses kantor & TTE untuk satu pengajuan. */
export function simulasiProsesKantor(id: string) {
  const p = load().pengajuan.find((x) => x.id === id);
  if (!p || p.status !== "proses") return;
  if (p.jenis === "pengelola" && p.tahap < 2) putuskanPengelolaPemilik(id, true, PIN_DEMO);
  if (load().pengajuan.find((x) => x.id === id)!.tahap < 3) setujuiPengajuan(id, "Kepala Pasar (simulasi)");
  if (p.tuId) tandaTangan("Direksi (simulasi)", [p.tuId]);
}

export function perpanjangSiptu(pid: string, tuId: string): string | null {
  const s0 = load();
  const si = s0.dok.find((d) => d.tuId === tuId && d.jenis === "e-SIPTU" && d.status === "terbit" && d.atasNamaId === pid);
  if (!si) return "e-SIPTU aktif atas nama Anda tidak ditemukan.";
  if (s0.dok.some((d) => d.tuId === tuId && d.jenis === "e-SIPTU" && d.status === "menunggu")) return "Perpanjangan sedang diproses.";
  const t = tuById(s0, tuId)!;
  if (t.tunggakan > 0) return "Lunasi tunggakan BPP dulu agar bisa perpanjang kilat.";
  update((s) => {
    const id = `PPJ-JHB-26-${String(300 + s.seq).padStart(4, "0")}`;
    const baru: Dokumen = { ...si, no: si.no.replace(/-P\d+$/, "") + "-P27", status: "menunggu", terbit: undefined, berlaku: "s.d. 31 Des 2027", keterangan: si.keterangan.split(" · revisi")[0] + " · perpanjangan 2027" };
    const p: Pengajuan = { id, jenis: "perpanjangan", pedagangId: pid, tuId, judul: `Perpanjangan e-SIPTU ${tuId} s.d. 2027`, data: { lama: si.no }, tahap: 3, status: "proses", dibuat: sekarang(), riwayat: [{ t: sekarang(), apa: "Syarat terpenuhi otomatis (BPP lancar, NIK terverifikasi) · menunggu TTE Direksi" }] };
    return { ...s, seq: s.seq + 1, dok: [...s.dok, baru], pengajuan: [p, ...s.pengajuan], notif: s.notif.map((n) => (n.href === `/perpanjang/?tu=${tuId}` ? { ...n, baca: true } : n)), log: log(s, nama(s, pid), "perpanjangan e-SIPTU kilat", tuId) };
  });
  return null;
}

export function ajukanProgram(pid: string, programId: string) {
  const pr = PROGRAM.find((x) => x.id === programId)!;
  update((s) => {
    if (s.pengajuan.some((p) => p.jenis === "program" && p.pedagangId === pid && p.data.program === programId)) return s;
    const p: Pengajuan = { id: `PRG-${String(500 + s.seq).padStart(4, "0")}`, jenis: "program", pedagangId: pid, judul: pr.judul, data: { program: programId }, tahap: 1, status: "proses", dibuat: sekarang(), riwayat: [{ t: sekarang(), apa: "Minat terkirim · mitra akan menghubungi lewat aplikasi" }] };
    return { ...s, seq: s.seq + 1, pengajuan: [p, ...s.pengajuan] };
  });
}

// ---------- keuangan ----------
export function bayarTagihan(id: string, metode: string, oleh?: string) {
  update((s) => {
    const tg = s.tagihan.find((x) => x.id === id)!;
    const sisa = s.tagihan.filter((x) => x.tuId === tg.tuId && x.jenis === "BPP" && x.status !== "lunas" && x.id !== id).length;
    return {
      ...s, tagihan: s.tagihan.map((x) => (x.id === id ? { ...x, status: "lunas", bayar: { metode, tgl: sekarang() } } : x)),
      tu: tg.jenis === "BPP" ? s.tu.map((t) => (t.id === tg.tuId ? { ...t, tunggakan: Math.min(t.tunggakan, sisa) } : t)) : s.tu,
      poin: { ...s.poin, [tg.pedagangId]: (s.poin[tg.pedagangId] ?? 0) + (tg.status === "terlambat" ? 0 : 20) },
      log: log(s, oleh ?? nama(s, tg.pedagangId), `bayar ${tg.jenis} ${tg.periode} ${rp(tg.jumlah)} via ${metode}`, tg.tuId),
    };
  });
}
/** Kasir mencatat pelunasan tunggakan TU (di luar tagihan persona). */
export function lunasiTunggakan(tuId: string, oleh: string) {
  update((s) => {
    const t = tuById(s, tuId)!;
    return { ...s, tu: s.tu.map((x) => (x.id === tuId ? { ...x, tunggakan: 0 } : x)), tagihan: s.tagihan.map((x) => (x.tuId === tuId && x.status === "terlambat" ? { ...x, status: "lunas", bayar: { metode: "Tunai di loket", tgl: sekarang() } } : x)), log: log(s, oleh, `tunggakan ${t.tunggakan} bulan BPP dilunasi di loket`, tuId) };
  });
}
export function ingatkanTagihan(tuId: string, oleh: string) {
  update((s) => {
    const t = tuById(s, tuId)!;
    const pid = t.buka ? t.pemakaiId : t.pemilikId;
    return { ...s, notif: [nt(s, pid, "Pengingat BPP", `Tunggakan BPP ${t.id} ${t.tunggakan} bulan. Bayar lewat aplikasi (QRIS/VA) atau loket kasir.`, "/keuangan/"), ...s.notif], interaksi: [{ t: sekarang(), pedagangId: pid, kanal: "Notifikasi aplikasi", catatan: `Pengingat tunggakan BPP ${t.tunggakan} bulan (${t.id})`, oleh }, ...s.interaksi] };
  });
}

// ---------- layanan ----------
export function aduan(pid: string, kategori: string, teks: string, tuId?: string): string {
  let id = "";
  update((s) => {
    id = `ADU-JHB-26-${String(600 + s.seq).padStart(4, "0")}`;
    const t: Tiket = { id, jenis: "aduan", pedagangId: pid, tuId, topik: `${kategori}: ${teks.slice(0, 60)}`, bagian: [kategori], msgs: [{ dari: "p", teks, t: sekarang() }], status: "terbuka", dibuat: sekarang() };
    return { ...s, seq: s.seq + 1, tiket: [t, ...s.tiket] };
  });
  return id;
}
export function selesaikanTiket(id: string, teks: string, oleh: string) {
  update((s) => {
    const t = s.tiket.find((x) => x.id === id)!;
    return { ...s, tiket: s.tiket.map((x) => (x.id === id ? { ...x, status: "selesai", msgs: [...x.msgs, { dari: "s", teks, t: sekarang() }] } : x)), notif: [nt(s, t.pedagangId, `Tiket ${id} selesai`, teks, "/layanan/"), ...s.notif], log: log(s, oleh, `tiket ${id} diselesaikan`, t.tuId) };
  });
}

// ---------- TokoPaja ----------
export function siptuAktif(s: State, pid: string) {
  return s.dok.filter((d) => d.jenis === "e-SIPTU" && d.status === "terbit" && d.atasNamaId === pid && tuById(s, d.tuId)?.buka !== false);
}
export const tokoOf = (s: State, pid: string) => s.toko.filter((t) => t.pedagangId === pid);
export function aktivasiToko(pid: string, siptu: string, namaToko: string, opsi: { ambil: boolean; antar: boolean; kulakan: boolean }, pin: string): string | null {
  if (pin !== PIN_DEMO) return "PIN salah.";
  if (namaToko.trim().length < 3) return "Isi nama toko.";
  const s0 = load();
  const d = siptuAktif(s0, pid).find((x) => x.no === siptu.trim());
  if (!d) return "Nomor e-SIPTU tidak ditemukan atau bukan atas nama Anda.";
  if (s0.toko.some((t) => t.tuId === d.tuId)) return "Toko untuk e-SIPTU ini sudah aktif.";
  update((s) => ({ ...s, toko: [...s.toko, { id: `TP-${d.tuId}`, pedagangId: pid, tuId: d.tuId, siptu: d.no, nama: namaToko.trim(), ...opsi, buka: true, dibuat: sekarang(), omzet: 0, transaksi: 0 }], log: log(s, nama(s, pid), `membuka toko online "${namaToko.trim()}"`, d.tuId) }));
  return null;
}
export const aturToko = (id: string, patch: Partial<{ buka: boolean; ambil: boolean; antar: boolean; kulakan: boolean; nama: string }>) => update((s) => ({ ...s, toko: s.toko.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
export function simpanProduk(p: Omit<Produk, "id"> & { id?: string }) {
  update((s) => {
    if (p.id) return { ...s, produk: s.produk.map((x) => (x.id === p.id ? { ...x, ...p, id: x.id } : x)) };
    return { ...s, seq: s.seq + 1, produk: [...s.produk, { ...p, id: `PRD-${String(100 + s.seq).padStart(4, "0")}` }] };
  });
}
export const hapusProduk = (id: string) => update((s) => ({ ...s, produk: s.produk.filter((x) => x.id !== id) }));

/** Simulasi pembeli memesan dari e-Katalog toko (pengganti aplikasi pembeli). */
export function simulasiPesanan(tokoId: string): string | null {
  const s0 = load();
  const pr = s0.produk.filter((p) => p.tokoId === tokoId && p.stok);
  if (!pr.length) return "Tambahkan minimal satu produk yang tersedia dulu.";
  let id = "";
  update((s) => {
    const pembeli = ["Bu Rina", "Pak Hendra", "Bu Yati", "Mbak Sari", "Pak Joko"][s.seq % 5];
    id = `PN-2611-${String(500 + s.seq).padStart(4, "0")}`;
    const items = pr.slice(0, 3).map((p, i) => ({ nama: p.nama, qty: i === 0 ? 2 : 1, sat: p.satuan, hMin: p.hMin, hMax: p.hMax, harga: p.hMax, ada: true }));
    const antar = s.seq % 2 === 0;
    const ps: Pesanan = { id, tokoId, pembeli, hpPembeli: "0812••••" + String(1000 + s.seq).slice(-4), kirim: antar ? "antar" : "ambil", alamat: antar ? "Jl. Johar Baru Utara No. 7" : undefined, items, ongkir: antar ? 8000 : 0, tahap: 0, jam: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), chat: [{ who: "p", text: "Pesan ya, dipilihkan yang bagus." }, { who: "s", text: "Pesanan masuk · menunggu konfirmasi toko" }] };
    const tk = s.toko.find((t) => t.id === tokoId)!;
    return { ...s, seq: s.seq + 1, pesanan: [ps, ...s.pesanan], notif: [nt(s, tk.pedagangId, `Pesanan baru dari ${pembeli}`, `${items.length} barang · konfirmasi harga dalam 12 menit.`, `/toko/pesanan/?id=${id}`), ...s.notif] };
  });
  return id;
}
const PESAN_TAHAP = ["", "Toko mengonfirmasi harga · tagihan dikirim ke pembeli", "Pembayaran QRIS diterima · dana ditahan bank mitra", "Barang diserahkan", "Pembeli konfirmasi terima · dana diteruskan ke pedagang"];
export const totalPesanan = (p: Pesanan) => p.items.filter((i) => i.ada).reduce((n, i) => n + i.harga * i.qty, 0);
export function majukanPesanan(id: string, items?: Pesanan["items"]) {
  update((s) => {
    const p = s.pesanan.find((x) => x.id === id)!;
    if (p.tahap >= 4) return s;
    const tahap = p.tahap + 1;
    const np: Pesanan = { ...p, items: items ?? p.items, tahap, chat: [...p.chat, { who: "s", text: PESAN_TAHAP[tahap] }], ...(tahap === 4 ? { nilai: 5, ulasan: "Barangnya bagus, terima kasih." } : {}) };
    const toko = tahap === 4 ? s.toko.map((t) => (t.id === p.tokoId ? { ...t, omzet: t.omzet + totalPesanan(np), transaksi: t.transaksi + 1 } : t)) : s.toko;
    return { ...s, pesanan: s.pesanan.map((x) => (x.id === id ? np : x)), toko };
  });
}
export const batalPesanan = (id: string) => update((s) => ({ ...s, pesanan: s.pesanan.map((x) => (x.id === id ? { ...x, batal: true, chat: [...x.chat, { who: "s", text: "Pesanan dibatalkan toko (stok habis)" }] } : x)) }));
export const chatPesanan = (id: string, text: string) => update((s) => ({ ...s, pesanan: s.pesanan.map((x) => (x.id === id ? { ...x, chat: [...x.chat, { who: "t", text }] } : x)) }));

export function pesanKulakan(tokoId: string, pemasokId: string, qty: Record<string, number>, bayar: "tunai" | "tempo"): string | null {
  const pm = PEMASOK.find((x) => x.id === pemasokId)!;
  const items = pm.items.filter(([n]) => (qty[n] ?? 0) > 0).map(([n, sat, harga]) => ({ nama: n, qty: qty[n], sat, harga }));
  if (!items.length) return "Pilih minimal satu barang.";
  update((s) => ({ ...s, seq: s.seq + 1, kulakan: [{ id: `KL-2611-${String(40 + s.seq).padStart(4, "0")}`, tokoId, pemasok: pm.nama, items, bayar, status: "dipesan", tgl: sekarang() }, ...s.kulakan] }));
  return null;
}
export const majukanKulakan = (id: string) => update((s) => ({ ...s, kulakan: s.kulakan.map((k) => (k.id === id ? { ...k, status: k.status === "dipesan" ? "dikonfirmasi" : k.status === "dikonfirmasi" ? "dikirim" : "diterima" } : k)) }));
/** Kulakan ke Pasar Jaya Perkulakan (KulakanPaja): katalog & harga bertingkat yang sama; DO Bank Jakarta khusus Emerald. */
export function pesanKulakanPJ(tokoId: string, items: { nama: string; qty: number; sat: string; harga: number }[], bayar: Kulakan["bayar"]): string | null {
  if (!items.length) return "Pilih minimal satu barang.";
  const s0 = load();
  const tk = s0.toko.find((t) => t.id === tokoId)!;
  if (bayar.startsWith("do") && kategoriOf(s0, tk.pedagangId) !== "E") return "Pembiayaan DO Bank Jakarta khusus pedagang Emerald.";
  update((s) => ({ ...s, seq: s.seq + 1, kulakan: [{ id: `KP-2611-${String(700 + s.seq).padStart(5, "0")}`, tokoId, pemasok: "Pasar Jaya · Perkulakan dan Ritel (KulakanPaja)", items, bayar, status: "dipesan", tgl: sekarang() }, ...s.kulakan], log: log(s, nama(s, tk.pedagangId), `kulakan ke Pasar Jaya Perkulakan (${bayar})`, tk.tuId) }));
  return null;
}

// ---------- CRM & operasi (Konsol) ----------
export function catatInteraksi(pid: string, kanal: string, catatan: string, oleh: string) {
  update((s) => ({ ...s, interaksi: [{ t: sekarang(), pedagangId: pid, kanal, catatan, oleh }, ...s.interaksi] }));
}
export function kirimPesanKe(pid: string, judul: string, isi: string, oleh: string) {
  update((s) => ({ ...s, notif: [nt(s, pid, judul, isi), ...s.notif], interaksi: [{ t: sekarang(), pedagangId: pid, kanal: "Pesan aplikasi", catatan: `${judul}: ${isi}`, oleh }, ...s.interaksi] }));
}
export function sasaranPengumuman(s: State, sasaran: string) {
  const ids = new Set<string>();
  for (const t of s.tu) {
    if (sasaran === "Semua pedagang" || sasaran === `Blok ${t.blok}`) { ids.add(t.pemilikId); if (t.buka) ids.add(t.pemakaiId); }
  }
  if (["Emerald", "Platinum", "Gold", "Blue"].includes(sasaran)) {
    for (const p of s.pedagang) if (KATEGORI_NAMA[kategoriOf(s, p.id)] === sasaran) ids.add(p.id);
  }
  return ids.size;
}
export function kirimPengumuman(judul: string, isi: string, sasaran: string, oleh: string) {
  update((s) => ({ ...s, seq: s.seq + 1, pengumuman: [{ id: `PG-${String(s.seq).padStart(3, "0")}`, judul, isi, sasaran, t: sekarang(), oleh, terkirim: sasaranPengumuman(s, sasaran) }, ...s.pengumuman], log: log(s, oleh, `pengumuman "${judul}" ke ${sasaran}`) }));
}
export function kirimUlangOtp(pid: string, oleh: string) {
  update((s) => ({ ...s, interaksi: [{ t: sekarang(), pedagangId: pid, kanal: "SMS", catatan: "Kirim ulang tautan & OTP aktivasi PaJaKu", oleh }, ...s.interaksi] }));
}
export function ubahHarga(komoditas: string, harga: number, oleh: string) {
  update((s) => ({ ...s, harga: s.harga.map((h) => (h.komoditas === komoditas ? { ...h, kemarin: h.hariIni === harga ? h.kemarin : h.hariIni, hariIni: harga, t: sekarang() } : h)), log: log(s, oleh, `harga ${komoditas} ${rp(harga)}`) }));
}
export const pemasokById = (id: string) => PEMASOK.find((p) => p.id === id);
