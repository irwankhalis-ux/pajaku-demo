"use client";

import type { ReactNode } from "react";
import { useData, pedagangById, kategoriOf, tuOf, dokTU } from "@/lib/store";
import type { State, Pedagang, TU, Kategori } from "@/lib/model";
import { Guard, BottomNav } from "./ui";

/** Kerangka halaman pedagang: cek sesi + navigasi bawah. */
export function PedagangPage({ children, nav = true }: { children: (ctx: Ctx) => ReactNode; nav?: boolean }) {
  return (
    <Guard peran="pedagang">
      <Inner nav={nav}>{children}</Inner>
    </Guard>
  );
}

export type Ctx = { s: State; p: Pedagang; kat: Kategori; tus: TU[] };

function Inner({ children, nav }: { children: (ctx: Ctx) => ReactNode; nav: boolean }) {
  const s = useData();
  const p = pedagangById(s, s.sesi!.userId)!;
  return (
    <div className="flex min-h-dvh flex-col">
      {children({ s, p, kat: kategoriOf(s, p.id), tus: tuOf(s, p.id) })}
      {nav && <BottomNav />}
    </div>
  );
}

/** Dokumen yang relevan untuk pedagang ini di satu TU (e-SHPTU ke Pemilik, e-SIPTU ke Pemakai). */
export function dokUntuk(s: State, p: Pedagang, t: TU) {
  const d = dokTU(s, t.id);
  const pilih = (j: string) => d.find((x) => x.jenis === j && x.status === "terbit") ?? d.find((x) => x.jenis === j);
  return {
    sh: pilih("e-SHPTU"),
    si: pilih("e-SIPTU"),
    milik: t.pemilikId === p.id,
    pakai: t.pemakaiId === p.id,
  };
}

export const statusTU: Record<TU["status"], string> = {
  arsip: "Menunggu pendataan ulang",
  dikembalikan: "Pendataan dilengkapi petugas",
  didata: "Menunggu validasi Kepala Pasar",
  divalidasi: "Menunggu tanda tangan Direksi",
  terbit: "Dokumen elektronik terbit",
};
