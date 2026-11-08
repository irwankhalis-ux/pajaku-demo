"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import QRCode from "qrcode";
import { useData, peranHome, keluar } from "@/lib/store";
import type { Peran } from "@/lib/model";

const noop = () => () => {};

/** Hanya tampilkan isi bila sesi cocok dengan peran; selain itu kembali ke halaman awal. */
export function Guard({ peran, children }: { peran: Peran | "staf"; children: ReactNode }) {
  const s = useData();
  const router = useRouter();
  const siap = useSyncExternalStore(noop, () => true, () => false); // true setelah data HP terbaca
  const ok = peran === "staf" ? !!s.sesi && s.sesi.peran !== "pedagang" : s.sesi?.peran === peran;
  useEffect(() => {
    if (siap && !ok) router.replace(s.sesi ? peranHome[s.sesi.peran] : "/");
  }, [siap, ok, s.sesi, router]);
  if (!siap || !ok) return <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Memuat…</div>;
  return <>{children}</>;
}

export function BottomNav() {
  const path = usePathname();
  const tabs = [["/beranda/", "Beranda", "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"], ["/toko/", "Toko", "M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v7h14v-7"], ["/dokumen/", "Dokumen", "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"], ["/layanan/", "Layanan", "M4 5h16v11H8l-4 4z"], ["/akun/", "Akun", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6"]] as const;
  const active = "/" + (path.split("/")[1] || "beranda") + "/";
  const map: Record<string, string> = { "/tu/": "/beranda/", "/koreksi/": "/beranda/", "/keuangan/": "/beranda/", "/harga/": "/beranda/", "/program/": "/beranda/", "/pesan/": "/beranda/", "/perpanjang/": "/beranda/", "/migrasi/": "/beranda/", "/pengajuan/": "/beranda/", "/persetujuan/": "/beranda/", "/registrasi-pengelola/": "/beranda/", "/verifikasi/": "/dokumen/" };
  const cur = map[active] ?? active;
  return (
    <nav aria-label="Navigasi utama" className="sticky bottom-0 z-10 grid h-[66px] shrink-0 grid-cols-5 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
      {tabs.map(([href, label, d]) => (
        <Link key={href} href={href} aria-current={cur === href ? "page" : undefined} className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${cur === href ? "font-bold text-pj" : "font-semibold text-muted"}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={cur === href ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
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
      <BoMenu />
      {children}
    </header>
  );
}

/** Menu back office Konsol: tugas jenjang + modul kantor. */
export const BO_MENU: [string, string][] = [["tugas", "Tugas saya"], ["/bo/eis/", "EIS Direksi"], ["/bo/migrasi/", "Migrasi & TTE"], ["/bo/crm/", "CRM"], ["/bo/tagihan/", "Tagihan"], ["/bo/operasi/", "Operasi & Harga"], ["/bo/toko/", "TokoPaja"], ["/bo/perkulakan/", "Perkulakan"], ["/bo/dokumen/", "Dokumen"], ["/bo/audit/", "Audit"]];
export function BoMenu() {
  const s = useData();
  const path = usePathname();
  const home = s.sesi ? peranHome[s.sesi.peran] : "/";
  return (
    <nav aria-label="Menu konsol" className="-mx-[18px] mt-3 flex gap-1.5 overflow-x-auto px-[18px] pb-0.5 [scrollbar-width:none]">
      {BO_MENU.map(([href, label]) => {
        const h = href === "tugas" ? home : href;
        const on = path === h || (href === "tugas" && !path.startsWith("/bo/")) || (href !== "tugas" && path.startsWith(href));
        return <Link key={href} href={h} aria-current={on ? "page" : undefined} className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap ${on ? "bg-white text-[#0F2A20]" : "bg-[#183A2D] text-[#C9D8CF]"}`}>{label}</Link>;
      })}
    </nav>
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
