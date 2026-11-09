"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { BADGE, keluarCC, putuskan, stafCC, useCC, type CCState, type StafCC, type Status } from "@/lib/cc";
import { WARNA, dirBy, type Dir } from "@/lib/direksi";

const noop = () => () => {};
export const card = "rounded-xl border border-[#22394A] bg-[#122230]";
export const muted = "text-[#9FB1BF]";

const MENU: [string, string, StafCC["peran"][]][] = [
  ["/cc/gubernur/", "Beranda Gubernur", ["gubernur"]],
  ["/cc/eis/", "EIS Direktur", ["dirut", "keuangan", "properti", "perkulakan", "adum"]],
  ["/cc/wall/?l=gub", "Command Center DKI", ["gubernur", "dirut", "keuangan", "properti", "perkulakan", "adum", "operator"]],
  ["/cc/wall/?l=wr1", "War Room Pasar Jaya", ["dirut", "keuangan", "properti", "perkulakan", "adum", "operator"]],
  ["/cc/log/", "Jejak keputusan", ["gubernur", "dirut", "keuangan", "properti", "perkulakan", "adum", "operator"]],
];

export function LogoPJ({ h = "h-6" }: { h?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/pasarjaya-logo.png" alt="Perumda Pasar Jaya" width={540} height={330} className={`${h} w-auto rounded bg-white px-1`} />;
}

/** Penjaga sesi + kepala halaman HP (gelap, sesuai canvas). */
export function CCPage({ children, lebar }: { children: (c: { s: CCState; staf: StafCC }) => ReactNode; lebar?: boolean }) {
  const s = useCC();
  const router = useRouter();
  const path = usePathname();
  const siap = useSyncExternalStore(noop, () => true, () => false);
  const staf = stafCC(s.sesi?.stafId);
  useEffect(() => { if (siap && !staf) router.replace("/"); }, [siap, staf, router]);
  if (!siap || !staf) return <div className="flex min-h-dvh items-center justify-center text-sm text-[#E6EDF2]">Memuat…</div>;
  const menu = MENU.filter(([, , r]) => r.includes(staf.peran));
  return (
    <div className="flex min-h-dvh flex-col bg-[#0B1620] text-[#E6EDF2]">
      <header className="border-b border-[#22394A] px-4 pt-[calc(12px+env(safe-area-inset-top))] pb-2.5">
        <div className={`mx-auto flex items-center justify-between gap-2 ${lebar ? "" : "max-w-[480px]"}`}>
          <div className="flex min-w-0 items-center gap-2.5">
            <LogoPJ h="h-7" />
            <div className="min-w-0"><div className="text-[15px] font-bold">Command Center <span className="text-[#2BB3A3]">Paja</span></div><div className={`truncate text-[11.5px] ${muted}`}>{staf.nama}</div></div>
          </div>
          <button onClick={() => { keluarCC(); router.replace("/"); }} className="shrink-0 rounded-lg border border-[#3A5060] px-3 py-2 text-xs font-semibold">Keluar</button>
        </div>
        <nav aria-label="Menu" className={`mx-auto mt-2 flex gap-1.5 overflow-x-auto [scrollbar-width:none] ${lebar ? "" : "max-w-[480px]"}`}>
          {menu.map(([h, l]) => { const on = h.startsWith(path) && path !== "/"; return <Link key={h} href={h} aria-current={on ? "page" : undefined} className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap ${on ? "bg-[#2BB3A3] text-[#0B1620]" : "border border-[#3A5060] text-[#C9D5DE]"}`}>{l}</Link>; })}
        </nav>
      </header>
      <main className={`mx-auto flex w-full flex-1 flex-col gap-3 p-4 pb-8 ${lebar ? "" : "max-w-[480px]"}`}>{children({ s, staf })}</main>
    </div>
  );
}

export function Dummy() { return <span className="shrink-0 rounded bg-[#F2A93B] px-1.5 py-1 text-[11px] font-bold text-[#0B1620]">DATA CONTOH</span>; }

export function Badge({ v, ke }: { v: Status; ke?: string }) {
  const teks = v === "ok" ? "Disetujui" : v === "del" ? `Didisposisi ke ${ke ?? "unit terkait"}` : BADGE[v];
  return <span className={`self-start rounded-md px-2.5 py-1.5 text-[13px] font-semibold ${v === "ok" ? "bg-[#2BB3A3] text-[#0B1620]" : "bg-[#3A5060] text-[#E6EDF2]"}`}>{teks}</span>;
}

/** EIS HP Direktur (Ringkas / Keputusan / Peringatan). Dipakai di Command Center Paja dan Konsol Pasar Jaya. */
export function EisHP({ kode, siapa, terang }: { kode: Dir; siapa: string; terang?: boolean }) {
  const s = useCC();
  const R = dirBy(kode);
  const [tab, setTab] = useState<"r" | "d" | "w">("r");
  const pending = R.decs.filter((d) => !s.dec[d.id]).length;
  const box = terang ? "rounded-xl border border-[#22394A] bg-[#122230] text-[#E6EDF2]" : card;
  return (
    <div className="flex flex-col gap-3 text-[#E6EDF2]">
      <div className={`${terang ? "rounded-xl bg-[#0B1620] p-3" : ""} flex items-start justify-between gap-2`}>
        <div className="min-w-0"><div className={`text-[12px] ${muted}`}>EIS Pasar Jaya · {"Sabtu 24 Okt, 07.30"}</div><div className="text-[20px] font-semibold">{R.role}</div><div className="text-[12px] text-[#7FD3C7]">{R.scope}</div></div>
        <Dummy />
      </div>
      <div role="tablist" className="grid grid-cols-3 gap-1.5 rounded-[10px] border border-[#22394A] bg-[#122230] p-1">
        {([["r", "Ringkas"], ["d", `Keputusan · ${pending}`], ["w", "Peringatan"]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-9 rounded-[7px] text-[13px] ${tab === k ? "bg-[#2BB3A3] font-semibold text-[#0B1620]" : "text-[#C9D5DE]"}`}>{l}</button>
        ))}
      </div>
      {tab === "r" && <>
        <div className="flex items-start gap-2.5 rounded-xl border border-[#F07A63] bg-[#3A2420] p-3 text-[13px] leading-snug"><span aria-hidden className="text-[#F07A63]">⚠</span>{R.alert}</div>
        <div className="grid grid-cols-2 gap-2.5">
          {R.kpis.map(([l, v, n, c]) => <div key={l} className={`${box} flex flex-col gap-0.5 p-3`}><div className={`text-[12px] ${muted}`}>{l}</div><div className="font-mono text-[22px] font-semibold" style={{ color: WARNA[c] }}>{v}</div><div className={`text-[11px] ${muted}`}>{n}</div></div>)}
        </div>
        <section className={`${box} flex flex-col gap-2 p-3.5`}>
          <h2 className="text-[14px] font-semibold">{R.barTitle}</h2>
          {R.bars.map(([n, v, w, c]) => <div key={n} className="grid grid-cols-[112px_minmax(0,1fr)_62px] items-center gap-2 text-[12px]"><span>{n}</span><div className="h-2 overflow-hidden rounded bg-[#22394A]"><div className="h-2" style={{ width: `${w}%`, background: WARNA[c] }} /></div><span className="text-right font-mono font-semibold">{v}</span></div>)}
          <div className={`text-[11px] ${muted}`}>{R.barNote}</div>
        </section>
        <button onClick={() => setTab("d")} className="min-h-12 rounded-[10px] border-2 border-[#F2A93B] text-[14px] font-semibold">{pending ? `${pending} keputusan menunggu Anda →` : "Semua keputusan sudah ditindaklanjuti"}</button>
      </>}
      {tab === "d" && R.decs.map((d) => {
        const v = s.dec[d.id];
        return (
          <div key={d.id} className={`${box} flex flex-col gap-1.5 p-3`}>
            <div className="flex justify-between gap-2"><span className="text-[14px] font-semibold">{d.title}</span><span className="self-start rounded px-1.5 py-0.5 text-[11px] font-semibold text-[#0B1620]" style={{ background: WARNA[d.lvl] }}>{d.due}</span></div>
            <div className="text-[12px] leading-snug text-[#C9D5DE]">{d.why}</div>
            <div className="text-[11px] text-[#7FD3C7]">{d.impact}</div>
            {v ? <Badge v={v} ke={d.to} /> : (
              <div className="flex gap-1.5">
                <button onClick={() => putuskan(d.id, "ok", siapa, d.title)} className="min-h-11 flex-1 rounded-lg bg-[#2BB3A3] text-[13px] font-semibold text-[#0B1620]">Setujui</button>
                <button onClick={() => putuskan(d.id, "rev", siapa, d.title)} className="min-h-11 flex-1 rounded-lg border border-[#4A6172] text-[13px]">Minta kajian</button>
                <button onClick={() => putuskan(d.id, "del", siapa, d.title)} className="min-h-11 flex-1 rounded-lg border border-[#4A6172] text-[13px]">Disposisi</button>
              </div>
            )}
          </div>
        );
      })}
      {tab === "w" && <>
        {R.warns.map(([t, sub, c]) => <div key={t} className={`${box} flex items-start gap-2.5 p-3`}><span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: WARNA[c] }} /><div><div className="text-[13px] font-semibold">{t}</div><div className={`text-[12px] ${muted}`}>{sub}</div></div></div>)}
        <div className={`px-0.5 text-[11px] ${muted}`}>{R.warnNote}</div>
      </>}
    </div>
  );
}

/** Panggung video wall 1920×1080: diskalakan agar pas lebar layar (TV, tablet landscape, HP diputar). */
export function Stage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.5);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => setK(Math.min(el.clientWidth / 1920, (window.innerHeight - el.getBoundingClientRect().top) / 1080 || 1));
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el); window.addEventListener("resize", fit);
    return () => { ro.disconnect(); window.removeEventListener("resize", fit); };
  }, []);
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: 1080 * k }}>
      <div className="absolute top-0 left-1/2 origin-top" style={{ width: 1920, height: 1080, transform: `translateX(-50%) scale(${k})` }}>{children}</div>
    </div>
  );
}
