"use client";

import type { ReactNode } from "react";
import { Guard, StafHeader } from "./ui";
import { useData, stafById } from "@/lib/store";
import type { Staf, State } from "@/lib/model";

/** Kerangka halaman back office Konsol (semua jenjang staf). */
export function BoPage({ judul, children }: { judul: string; children: (c: { s: State; staf: Staf }) => ReactNode }) {
  return <Guard peran="staf"><Inner judul={judul}>{children}</Inner></Guard>;
}
function Inner({ judul, children }: { judul: string; children: (c: { s: State; staf: Staf }) => ReactNode }) {
  const s = useData();
  const staf = stafById(s.sesi!.userId)!;
  return (
    <div className="flex min-h-dvh flex-col">
      <StafHeader jabatan={`${staf.jabatan} · ${staf.nama}`} judul={judul} />
      <main className="flex flex-1 flex-col gap-3.5 p-4 pb-8">{children({ s, staf })}</main>
    </div>
  );
}

export const grid = "grid grid-cols-2 gap-2.5 md:grid-cols-4";
export const panel = "rounded-xl border border-line bg-white p-4";

export function Kpi({ l, v, s, src, tone = "text-muted" }: { l: string; v: ReactNode; s?: string; src?: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-line bg-white p-3.5">
      <div className="text-[12px] text-muted">{l}</div>
      <div className="text-[24px] leading-tight font-bold">{v}</div>
      {s && <div className={`text-[11.5px] ${tone}`}>{s}</div>}
      {src && <div className="font-mono text-[10px] text-[#7A857F]">{src}</div>}
    </div>
  );
}

export function Stacked({ parts }: { parts: { l: string; n: number; c: string; rule?: string }[] }) {
  const tot = parts.reduce((a, b) => a + b.n, 0) || 1;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex h-7 overflow-hidden rounded-md">{parts.map((p) => <div key={p.l} style={{ width: `${(p.n / tot) * 100}%`, background: p.c }} title={p.l} />)}</div>
      {parts.map((p) => (
        <div key={p.l} className="grid grid-cols-[12px_1fr_auto_44px] items-center gap-2 text-[13px]">
          <span className="size-3 rounded-[3px]" style={{ background: p.c }} />
          <span><b>{p.l}</b>{p.rule && <span className="text-muted"> · {p.rule}</span>}</span>
          <span className="font-mono">{p.n}</span>
          <span className="text-right text-muted">{Math.round((p.n / tot) * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

export function MiniBar({ v, tone = "#0F5A40" }: { v: number; tone?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded bg-[#EEF0EA]"><div className="h-2 rounded" style={{ width: `${Math.min(100, v)}%`, background: tone }} /></div>
      <span className="w-9 text-right text-[12px]">{v}%</span>
    </div>
  );
}

export const EWS = [
  { l: "Lancar", c: "#1E9E5A", rule: "BPP terbayar", f: (n: number) => n === 0 },
  { l: "DPK", c: "#F2C27A", rule: "tunggak 1 bln", f: (n: number) => n === 1 },
  { l: "Waspada", c: "#E08A2E", rule: "tunggak 2 bln", f: (n: number) => n === 2 },
  { l: "Macet", c: "#A3361C", rule: "≥3 bln", f: (n: number) => n >= 3 },
];
