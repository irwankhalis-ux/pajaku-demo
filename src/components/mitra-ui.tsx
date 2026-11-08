"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { HOME, PROYEK, keluarM, stafM, useM, type MState, type Staf } from "@/lib/mitra";

const noop = () => () => {};
export const panel = "rounded-[14px] border border-[#E2DED4] bg-white p-4";
export const mbtn = "inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#0E6E63] px-4 text-sm font-semibold text-white disabled:bg-[#E2DED4] disabled:text-[#5B6168]";
export const mbtn2 = "inline-flex min-h-11 items-center justify-center rounded-[10px] border border-[#CFCABD] bg-white px-4 text-sm font-semibold text-[#1B1F24]";
export const mchip = (on: boolean) => `min-h-10 rounded-full border px-3 text-[13px] font-semibold ${on ? "border-[#12302B] bg-[#12302B] text-white" : "border-[#CFCABD] bg-white text-[#1B1F24]"}`;

export function LogoPJ({ className = "h-8" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/pasarjaya-logo.png" alt="Perumda Pasar Jaya" width={540} height={330} className={`w-auto ${className}`} />;
}

export const MENU: [string, string, Staf["peran"][] | null][] = [
  ["/m/dashboard/", "Dashboard & unit", null],
  ["/m/unit/", "Inventori & harga", null],
  ["/m/eksisting/", "Eksisting & undian", null],
  ["/m/prospek/", "Prospek Biru", null],
  ["/m/pesanan/", "Pemesanan & e-SPTU", null],
  ["/m/kredit/", "Pembiayaan bank", null],
  ["/m/tagihan/", "Tagihan & escrow", null],
  ["/m/progres/", "Progres konstruksi", null],
  ["/m/crm/", "CRM & chat", null],
  ["/m/tata-kelola/", "Tata kelola", null],
  ["/m/eis/", "EIS Direksi (HP)", null],
  ["/m/pengawas/", "Pengawas Pasar Jaya", null],
  ["/m/hp-pedagang/", "HP Pedagang", null],
  ["/m/audit/", "Audit", null],
];

/** Kerangka halaman MitraPaja: cek sesi, kepala gelap + logo Pasar Jaya sebagai mitra, menu geser. */
export function MPage({ judul, sub, children, hp }: { judul: string; sub?: string; children: (c: { s: MState; staf: Staf }) => ReactNode; hp?: boolean }) {
  const s = useM();
  const router = useRouter();
  const path = usePathname();
  const siap = useSyncExternalStore(noop, () => true, () => false);
  const staf = stafM(s.sesi?.stafId);
  useEffect(() => { if (siap && !staf) router.replace("/"); }, [siap, staf, router]);
  if (!siap || !staf) return <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Memuat…</div>;
  return (
    <div className="flex min-h-dvh flex-col bg-[#F4F2EC]">
      <header className="bg-[#12302B] px-4 pt-[calc(14px+env(safe-area-inset-top))] pb-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[18px] font-extrabold">Mitra<span className="text-[#7FD1C1]">Paja</span> <span className="text-[12px] font-semibold text-[#A7C3BC]">· {PROYEK.nama}</span></div>
            <div className="truncate text-[11.5px] text-[#A7C3BC]">{staf.jabatan} · {staf.nama}</div>
          </div>
          <button onClick={() => { keluarM(); router.replace("/"); }} className="shrink-0 rounded-lg bg-[#1A3F38] px-3 py-2 text-xs font-semibold text-[#D3E4DF]">Keluar</button>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5"><span className="text-[10.5px] font-bold tracking-[.06em] text-[#5B6168]">MITRA RESMI</span><LogoPJ className="h-6" /><span className="truncate text-[11px] text-[#5B6168]">{PROYEK.mitra}</span></div>
        <nav aria-label="Menu MitraPaja" className="-mx-4 mt-2.5 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none]">
          {MENU.map(([h, l]) => {
            const on = path === h || (h === HOME[staf.peran] && path === "/m/");
            return <Link key={h} href={h} aria-current={on ? "page" : undefined} className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap ${on ? "bg-white text-[#12302B]" : "bg-[#1A3F38] text-[#D3E4DF]"}`}>{l}</Link>;
          })}
        </nav>
      </header>
      <main className={`flex flex-1 flex-col gap-3.5 p-4 pb-8 ${hp ? "items-center" : ""}`}>
        {(judul || sub) && <div className="w-full"><h1 className="text-[22px] font-extrabold text-[#1B1F24]">{judul}</h1>{sub && <div className="text-[12.5px] text-[#5B6168]">{sub}</div>}</div>}
        {children({ s, staf })}
      </main>
    </div>
  );
}

export function MKpi({ l, v, s, tone = "text-[#5B6168]" }: { l: string; v: ReactNode; s?: string; tone?: string }) {
  return <div className="flex flex-col gap-0.5 rounded-[12px] border border-[#E2DED4] bg-white p-3"><span className="text-[12px] text-[#5B6168]">{l}</span><span className="text-[22px] leading-tight font-extrabold">{v}</span>{s && <span className={`text-[11.5px] ${tone}`}>{s}</span>}</div>;
}
export const mgrid = "grid grid-cols-2 gap-2.5 md:grid-cols-4";
export function Bar2({ v, c = "#0E6E63" }: { v: number; c?: string }) {
  return <div className="h-2 rounded bg-[#EFECE4]"><div className="h-2 rounded" style={{ width: `${Math.min(100, v)}%`, background: c }} /></div>;
}
export function Tag({ children, tone }: { children: ReactNode; tone: string }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${tone}`}>{children}</span>;
}
export const ESTONE: Record<string, [string, string]> = {
  draf: ["Draf", "bg-[#EFECE4] text-[#3A3F45]"], "ttd-pedagang": ["Menunggu TTD pedagang", "bg-[#FBE8D2] text-[#7A3E0B]"],
  "tte-pj": ["Menunggu TTE Pasar Jaya", "bg-[#E1E8F6] text-[#233C73]"], sah: ["Sah", "bg-[#DCEFEA] text-[#0A5249]"],
};
