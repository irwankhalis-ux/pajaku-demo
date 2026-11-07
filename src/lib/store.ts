"use client";

// Lapisan data aplikasi. Saat ini tersimpan di HP (localStorage) dengan data contoh;
// setiap fungsi aksi di bawah adalah titik sambung ke API backend nanti.
import { useSyncExternalStore } from "react";
import {
  seed, sekarang, STAF, PIN_DEMO, OTP_DEMO,
  type State, type Kategori, type Lapangan, type Dokumen, type TU, type Peran, type Pedagang, type Tiket,
} from "./model";

const KEY = "pajaku-v1";
const listeners = new Set<() => void>();
let state: State | null = null;
const SERVER = seed();

function load(): State {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = JSON.parse(raw) as State; if (s.versi === 1) return (state = s); }
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
export const peranHome: Record<Peran, string> = { pedagang: "/beranda/", petugas: "/petugas/", kepala: "/kepala/", manager: "/manager/", kadiv: "/kadiv/", direksi: "/direksi/" };

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
    return { ...s, seq: seq + 2, pedagang, tu: s.tu.map((x) => (x.id === tuId ? nt : x)), dok: [...s.dok, ...baru], log: log(s, oleh, "divalidasi, dokumen masuk antrean TTE", tuId) };
  });
}

export function tandaTangan(oleh: string): number {
  let n = 0;
  update((s) => {
    const tgl = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const batal = new Set(s.dok.filter((d) => d.status === "menunggu" && d.no.endsWith("-R1")).map((d) => d.no.slice(0, -3)));
    const dok = s.dok.map((d) => {
      if (d.status === "menunggu") { n++; return { ...d, status: "terbit" as const, terbit: tgl }; }
      if (batal.has(d.no)) return { ...d, status: "batal" as const };
      return d;
    });
    const tu = s.tu.map((t) => (t.status === "divalidasi" && dok.filter((d) => d.tuId === t.id && d.status !== "batal").every((d) => d.status === "terbit") ? { ...t, status: "terbit" as const } : t));
    return { ...s, dok, tu, log: log(s, oleh, `TTE batch ${n} dokumen`) };
  });
  return n;
}

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
