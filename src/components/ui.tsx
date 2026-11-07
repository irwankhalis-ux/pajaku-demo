"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import QRCode from "qrcode";
import { useData, peranHome, keluar } from "@/lib/store";
import type { Peran } from "@/lib/model";

const noop = () => () => {};

/** Hanya tampilkan isi bila sesi cocok dengan peran; selain itu kembali ke halaman awal. */
export function Guard({ peran, children }: { peran: Peran; children: ReactNode }) {
  const s = useData();
  const router = useRouter();
  const siap = useSyncExternalStore(noop, () => true, () => false); // true setelah data HP terbaca
  const ok = s.sesi?.peran === peran;
  useEffect(() => {
    if (siap && !ok) router.replace(s.sesi ? peranHome[s.sesi.peran] : "/");
  }, [siap, ok, s.sesi, router]);
  if (!siap || !ok) return <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Memuat…</div>;
  return <>{children}</>;
}

export function BottomNav() {
  const path = usePathname();
  const tabs = [["/beranda/", "Beranda"], ["/dokumen/", "Dokumen"], ["/layanan/", "Layanan"], ["/akun/", "Akun"]] as const;
  const active = path.startsWith("/tu") || path.startsWith("/koreksi") ? "/beranda/" : path;
  return (
    <nav aria-label="Navigasi utama" className="sticky bottom-0 z-10 flex h-[72px] shrink-0 items-center justify-around border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
      {tabs.map(([href, label]) => (
        <Link key={href} href={href} aria-current={active === href ? "page" : undefined} className={`px-3 py-3 text-xs ${active === href ? "font-bold text-pj" : "font-semibold text-muted"}`}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function BackHeader({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (
    <header className="flex items-center gap-2.5 px-4 pt-[calc(18px+env(safe-area-inset-top))] pb-3">
      <Link href={href} aria-label="Kembali" className="flex size-11 items-center justify-center rounded-[10px] border border-line bg-white text-ink">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </Link>
      <div className="min-w-0">
        <div className="text-lg font-bold">{title}</div>
        {sub && <div className="truncate font-mono text-[12.5px] text-muted">{sub}</div>}
      </div>
    </header>
  );
}

/** Kepala gelap untuk layar staf. */
export function StafHeader({ jabatan, judul, children }: { jabatan: string; judul: string; children?: ReactNode }) {
  const router = useRouter();
  return (
    <header className="bg-[#0F2A20] px-[18px] pt-[calc(18px+env(safe-area-inset-top))] pb-4 text-white">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0"><div className="truncate text-xs text-[#9DB5A8]">{jabatan}</div><div className="text-lg font-bold">{judul}</div></div>
        <button onClick={() => { keluar(); router.replace("/"); }} className="shrink-0 rounded-lg bg-[#183A2D] px-3 py-2 text-xs font-semibold text-[#C9D8CF]">Keluar</button>
      </div>
      {children}
    </header>
  );
}

export function Tabs<T extends string>({ value, onChange, items, dark }: { value: T; onChange: (v: T) => void; items: [T, string][]; dark?: boolean }) {
  return (
    <div role="tablist" className={`mt-3 grid gap-1 rounded-[10px] p-1 ${dark ? "bg-[#183A2D]" : "bg-[#ECEDE7]"}`} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
      {items.map(([k, l]) => (
        <button key={k} role="tab" aria-selected={value === k} onClick={() => onChange(k)}
          className={`min-h-10 rounded-lg px-1 text-[12.5px] font-semibold ${value === k ? "bg-white text-ink" : dark ? "text-[#C9D8CF]" : "text-muted"}`}>{l}</button>
      ))}
    </div>
  );
}

export const card = "rounded-xl border border-line bg-white";

export function Tile({ l, v, s, tone = "text-muted" }: { l: string; v: ReactNode; s?: string; tone?: string }) {
  return <div className={`${card} p-3`}><div className="text-xs text-muted">{l}</div><div className="text-2xl font-bold">{v}</div>{s && <div className={`text-[11.5px] ${tone}`}>{s}</div>}</div>;
}

export function Bar({ value, tone = "bg-pj" }: { value: number; tone?: string }) {
  return <div className="h-2 overflow-hidden rounded bg-[#ECEDE7]" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><div className={`h-2 ${tone}`} style={{ width: `${Math.min(100, value)}%` }} /></div>;
}

export function statusDok(s: "menunggu" | "terbit" | "batal" | undefined) {
  if (s === "terbit") return ["terbit", "bg-mint text-mint-ink"];
  if (s === "menunggu") return ["menunggu TTE", "bg-[#FBEFD9] text-[#6E4A12]"];
  return ["belum terbit", "bg-[#ECEDE7] text-[#4B5650]"];
}

/** QR dokumen: berisi nomor dokumen untuk dipindai portal verifikasi Pasar Jaya. */
export function DocQR({ no, size = 200 }: { no: string; size?: number }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString(`PASARJAYA-DOK:${no}`, { type: "svg", margin: 1, color: { dark: "#17211C" } }).then(setSvg).catch(() => setSvg(""));
  }, [no]);
  return <div role="img" aria-label={`QR ${no}`} style={{ width: size, height: size }} className="bg-white [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-[#B9BFB6] bg-white p-4 text-[13px] leading-relaxed text-ink-2">{children}</div>;
}
