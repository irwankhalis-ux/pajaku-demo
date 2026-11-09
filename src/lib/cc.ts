// Command Center Paja — sesi, keputusan Gubernur & Direksi, tindak lanjut War Room. Data contoh, tersimpan lokal.
import { useSyncExternalStore } from "react";
import { KEP_GUB } from "./direksi";

export type PeranCC = "gubernur" | "dirut" | "keuangan" | "properti" | "perkulakan" | "adum" | "operator";
export type StafCC = { id: string; nama: string; peran: PeranCC; jabatan: string };
export const PIN_CC = "246810";
export const STAF_CC: StafCC[] = [
  { id: "GUB", nama: "Gubernur DKI Jakarta", peran: "gubernur", jabatan: "Ketua TPID Provinsi DKI Jakarta" },
  { id: "DIR-UT", nama: "Direktur Utama", peran: "dirut", jabatan: "Perumda Pasar Jaya" },
  { id: "DIR-KEU", nama: "Direktur Keuangan", peran: "keuangan", jabatan: "Perumda Pasar Jaya" },
  { id: "DIR-PRO", nama: "Direktur Properti dan Perpasaran", peran: "properti", jabatan: "Perumda Pasar Jaya" },
  { id: "DIR-KUL", nama: "Direktur Perkulakan dan Retail", peran: "perkulakan", jabatan: "Perumda Pasar Jaya" },
  { id: "DIR-ADM", nama: "Direktur Administrasi dan Umum", peran: "adum", jabatan: "Perumda Pasar Jaya" },
  { id: "OPS", nama: "Operator Command Center", peran: "operator", jabatan: "Ruang Command Center & War Room" },
];
export const HOME_CC: Record<PeranCC, string> = { gubernur: "/cc/gubernur/", dirut: "/cc/eis/", keuangan: "/cc/eis/", properti: "/cc/eis/", perkulakan: "/cc/eis/", adum: "/cc/eis/", operator: "/cc/wall/" };

export type Status = "ok" | "rev" | "del" | "hold" | "redo";
export type CCState = { versi: 1; sesi: { stafId: string } | null; dec: Record<string, Status>; ingat: Record<string, true>; log: { t: string; siapa: string; apa: string }[] };

const KEY = "commandcenter-v1";
const seed = (): CCState => ({ versi: 1, sesi: null, dec: {}, ingat: {}, log: [] });
const SERVER = seed();
const ls = new Set<() => void>();
let st: CCState | null = null;
export function ccload(): CCState {
  if (st) return st;
  try { const raw = localStorage.getItem(KEY); if (raw) { const v = JSON.parse(raw) as CCState; if (v.versi === 1) return (st = v); } } catch {}
  return (st = seed());
}
function commit(n: CCState) { st = n; try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} ls.forEach((l) => l()); }
const up = (fn: (s: CCState) => CCState) => commit(fn(ccload()));
export const useCC = () => useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l); }, ccload, () => SERVER);
const jam = () => new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
const lg = (s: CCState, siapa: string, apa: string) => [{ t: jam(), siapa, apa }, ...s.log].slice(0, 200);

export const stafCC = (id?: string) => STAF_CC.find((x) => x.id === id);
export function masukCC(id: string, pin: string): string | null { if (pin !== PIN_CC) return "PIN salah."; up((s) => ({ ...s, sesi: { stafId: id } })); return null; }
export const keluarCC = () => up((s) => ({ ...s, sesi: null }));
export const resetCC = () => commit({ ...seed(), sesi: ccload().sesi });

const LABEL: Record<Status, string> = { ok: "menyetujui", rev: "meminta kajian", del: "mendisposisi", hold: "menunda", redo: "meminta input ulang" };
/** Satu keputusan dicatat sekali dan tampil di semua layar yang memuatnya (HP Gubernur, video wall, EIS Direktur, War Room). */
export function putuskan(id: string, v: Status, siapa: string, judul: string) {
  up((s) => {
    const dec = { ...s.dec, [id]: v };
    // Persetujuan Gubernur atas intervensi TPID otomatis menjadi penugasan ke Direktorat Perkulakan Pasar Jaya.
    const g = KEP_GUB.find((k) => k.id === id);
    if (g?.terkait && v === "ok" && !dec[g.terkait]) dec[g.terkait] = "ok";
    return { ...s, dec, log: lg(s, siapa, `${LABEL[v]}: ${judul}`) };
  });
}
export function ingatkanAO(pasar: string, ao: string, siapa: string) { up((s) => ({ ...s, ingat: { ...s.ingat, [pasar]: true }, log: lg(s, siapa, `mengingatkan ${ao} input harga ${pasar}`) })); }

export const BADGE: Record<Status, string> = { ok: "Disetujui", rev: "Kajian diminta", del: "Didisposisi", hold: "Ditunda · kajian Biro Hukum", redo: "Input ulang diminta" };
