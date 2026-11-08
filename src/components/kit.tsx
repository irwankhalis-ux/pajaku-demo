"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { PIN_DEMO } from "@/lib/model";

export const btn = "flex min-h-12 items-center justify-center rounded-[10px] bg-pj px-4 text-[15px] font-semibold text-white disabled:bg-line disabled:text-[#6B7670]";
export const btn2 = "flex min-h-12 items-center justify-center rounded-[10px] border-[1.5px] border-pj bg-white px-4 text-[14.5px] font-semibold text-pj";
export const btnSm = "inline-flex min-h-10 items-center justify-center rounded-lg bg-pj px-3 text-[13px] font-semibold text-white disabled:bg-line disabled:text-[#6B7670]";
export const btnSm2 = "inline-flex min-h-10 items-center justify-center rounded-lg bg-mint px-3 text-[13px] font-semibold text-mint-ink";
export const input = "min-h-12 w-full rounded-lg border border-line-2 bg-white px-3 text-[15px]";
export const chip = (on: boolean) => `min-h-10 rounded-full border px-3 text-[13px] font-semibold ${on ? "border-pj bg-pj text-white" : "border-line-2 bg-white text-ink-2"}`;

/** Bungkus halaman yang membaca ?param= (wajib Suspense pada ekspor statis). */
export function WithQ({ children }: { children: (q: (k: string) => string) => ReactNode }) {
  return <Suspense><Q>{children}</Q></Suspense>;
}
function Q({ children }: { children: (q: (k: string) => string) => ReactNode }) {
  const sp = useSearchParams();
  return <>{children((k) => sp.get(k) ?? "")}</>;
}

export function Field({ label, id, children, hint }: { label: string; id: string; children: ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-ink-2">{label}</label>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

export function Steps({ n, of, labels }: { n: number; of: number; labels?: string[] }) {
  return (
    <div className="flex gap-1.5" aria-label={`Langkah ${n} dari ${of}`}>
      {Array.from({ length: of }, (_, i) => (
        <div key={i} className="flex flex-1 flex-col gap-1">
          <div className={`h-1 rounded ${i < n ? "bg-pj" : "bg-line"}`} />
          {labels && <span className={`text-[10.5px] ${i < n ? "font-semibold text-ink-2" : "text-muted"}`}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

/** Input PIN 6 angka + isi otomatis (simulasi). */
export function PinInput({ value, onChange, label = "PIN PaJaKu" }: { value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="pin" className="text-[13px] font-semibold text-ink-2">{label}</label>
      <input id="pin" type="password" inputMode="numeric" maxLength={6} value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} className={`${input} font-mono text-lg tracking-[.4em]`} />
      <button type="button" onClick={() => onChange(PIN_DEMO)} className="self-start text-[12.5px] font-semibold text-pj underline">Isi PIN uji coba</button>
    </div>
  );
}

/** Lembar bawah sederhana. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()} className="flex max-h-[88dvh] w-full max-w-[430px] flex-col gap-3 overflow-y-auto rounded-t-2xl bg-white p-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between"><h2 className="text-base font-bold">{title}</h2><button onClick={onClose} className="min-h-10 px-2 text-sm font-semibold text-muted">Tutup</button></div>
        {children}
      </div>
    </div>
  );
}

export function Pill({ children, tone = "bg-mint text-mint-ink" }: { children: ReactNode; tone?: string }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${tone}`}>{children}</span>;
}

export function MenuTile({ href, icon, label, badge }: { href: string; icon: string; label: string; badge?: number }) {
  return (
    <Link href={href} className="relative flex flex-col items-center gap-1.5 rounded-xl bg-white px-1 py-2.5 text-center text-[11.5px] leading-tight font-semibold text-ink-2">
      <span className="flex size-10 items-center justify-center rounded-xl bg-mint text-lg" aria-hidden="true">{icon}</span>
      {label}
      {badge ? <span className="absolute top-1.5 right-2 rounded-full bg-[#C8781E] px-1.5 text-[10px] font-bold text-white">{badge}</span> : null}
    </Link>
  );
}

export function Timeline({ items }: { items: { t: string; s?: string; done: boolean; now?: boolean }[] }) {
  return (
    <ol className="relative flex flex-col gap-3.5 pl-6">
      <span className="absolute top-1.5 bottom-1.5 left-[7px] w-0.5 bg-line" aria-hidden="true" />
      {items.map((x, i) => (
        <li key={i} className="relative">
          <span className={`absolute top-1 -left-[22px] size-3 rounded-full ${x.done ? "bg-pj" : x.now ? "border-2 border-[#F2A541] bg-white shadow-[0_0_0_4px_#FDEBCB]" : "border-2 border-line bg-white"}`} aria-hidden="true" />
          <div className={`text-[13.5px] font-semibold ${x.done || x.now ? "" : "text-muted"}`}>{x.t}</div>
          {x.s && <div className="text-xs text-muted">{x.s}</div>}
        </li>
      ))}
    </ol>
  );
}

export function useToggle(init = false) {
  const [v, set] = useState(init);
  return [v, () => set((x) => !x), set] as const;
}
