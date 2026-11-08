"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { HOME, PEMASOK, keluarK, stafK, useK, type KState, type Staf } from "@/lib/kulakan";

const noop = () => () => {};
export const kpanel = "rounded-[14px] border border-[#E5E7EB] bg-white p-4";
export const kbtn = "inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#14532D] px-4 text-sm font-bold text-white disabled:bg-[#E5E7EB] disabled:text-[#4B5563]";
export const kbtnO = "inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#C2410C] px-4 text-sm font-bold text-white disabled:bg-[#E5E7EB] disabled:text-[#4B5563]";
export const kchip = (on: boolean) => `min-h-10 rounded-full border px-3 text-[13px] font-semibold ${on ? "border-[#1E293B] bg-[#1E293B] text-white" : "border-[#D1D5DB] bg-white text-[#1A1F1C]"}`;
export const kgrid = "grid grid-cols-2 gap-2.5 md:grid-cols-4";

export const MENU: [string, string, Staf["peran"][]][] = [
  ["/kp/beranda/", "Beranda", ["salesmgr", "agent"]],
  ["/kp/eis/", "EIS Direktur", ["direktur", "salesmgr", "finance", "merch"]],
  ["/kp/pesanan/", "Pesanan", ["direktur", "salesmgr", "agent", "delivery", "finance"]],
  ["/kp/katalog/", "Katalog & harga", ["direktur", "salesmgr", "agent", "merch"]],
  ["/kp/crm/", "CRM & broadcast", ["direktur", "salesmgr", "agent"]],
  ["/kp/gudang/", "Gudang & delivery", ["direktur", "delivery", "salesmgr"]],
  ["/kp/tagihan/", "Collection", ["direktur", "collection", "finance"]],
  ["/kp/keuangan/", "Finance & DO", ["direktur", "finance"]],
  ["/kp/tpid/", "Penugasan TPID", ["direktur", "merch", "salesmgr"]],
  ["/kp/organisasi/", "Organisasi", ["direktur", "patrol", "salesmgr", "finance"]],
  ["/kp/patrol/", "Konsol PATROL", ["patrol", "direktur", "finance"]],
  ["/kp/audit/", "Audit", ["direktur", "patrol", "finance"]],
];

export function KPage({ judul, sub, children }: { judul: string; sub?: string; children: (c: { s: KState; staf: Staf }) => ReactNode }) {
  const s = useK();
  const router = useRouter();
  const path = usePathname();
  const siap = useSyncExternalStore(noop, () => true, () => false);
  const staf = stafK(s.sesi?.stafId);
  useEffect(() => { if (siap && !staf) router.replace("/"); }, [siap, staf, router]);
  if (!siap || !staf) return <div className="flex min-h-dvh items-center justify-center text-sm">Memuat…</div>;
  const menu = MENU.filter(([, , r]) => r.includes(staf.peran));
  return (
    <div className="flex min-h-dvh flex-col bg-[#F3F4F6] text-[#1A1F1C]">
      <header className="bg-[#1E293B] px-4 pt-[calc(14px+env(safe-area-inset-top))] pb-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0"><div className="text-[18px] font-extrabold">Kulakan<span className="text-[#FDBA74]">Patrol</span> <span className="text-[11.5px] font-semibold text-[#CBD5E1]">· pemasok</span></div><div className="truncate text-[11.5px] text-[#CBD5E1]">{staf.jabatan} · {staf.nama}</div></div>
          <button onClick={() => { keluarK(); router.replace("/"); }} className="shrink-0 rounded-lg bg-[#334155] px-3 py-2 text-xs font-semibold">Keluar</button>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-[#4B5563]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pasarjaya-logo.png" alt="Perumda Pasar Jaya" width={540} height={330} className="h-6 w-auto" />
          <span className="truncate text-[11px]"><b className="text-[#1A1F1C]">{PEMASOK.unit}</b> · {PEMASOK.gudang}</span>
        </div>
        {menu.length > 1 && <nav aria-label="Menu" className="-mx-4 mt-2.5 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none]">{menu.map(([h, l]) => { const on = path === h || (path === "/kp/" && h === HOME[staf.peran]); return <Link key={h} href={h} aria-current={on ? "page" : undefined} className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap ${on ? "bg-white text-[#1E293B]" : "bg-[#334155] text-[#E2E8F0]"}`}>{l}</Link>; })}</nav>}
      </header>
      <main className="flex flex-1 flex-col gap-3.5 p-4 pb-8">
        {judul && <div><h1 className="text-[22px] font-extrabold">{judul}</h1>{sub && <div className="text-[12.5px] text-[#4B5563]">{sub}</div>}</div>}
        {children({ s, staf })}
      </main>
    </div>
  );
}

export function KKpi({ l, v, s, tone = "text-[#4B5563]", hi }: { l: string; v: ReactNode; s?: string; tone?: string; hi?: boolean }) {
  return <div className={`flex flex-col gap-0.5 rounded-[14px] border bg-white p-3 ${hi ? "border-2 border-[#FDBA74]" : "border-[#E5E7EB]"}`}><span className="text-[12px] font-semibold text-[#4B5563]">{l}</span><span className="text-[22px] leading-tight font-extrabold">{v}</span>{s && <span className={`text-[11.5px] ${tone}`}>{s}</span>}</div>;
}
export const ST: Record<string, string> = { baru: "bg-[#FFEDD5] text-[#9A3412]", dikonfirmasi: "bg-[#E0F2FE] text-[#075985]", dikirim: "bg-[#EDE9FE] text-[#5B21B6]", diterima: "bg-[#DCFCE7] text-[#14532D]", ditolak: "bg-[#FEE2E2] text-[#991B1B]" };
