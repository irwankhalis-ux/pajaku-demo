"use client";

import Link from "next/link";
import { Badge, CCPage, Dummy, card, muted } from "@/components/cc-ui";
import { putuskan } from "@/lib/cc";
import { KEP_GUB, KOTA, WARNA, fmt } from "@/lib/direksi";

export default function HPGubernur() {
  return (
    <CCPage>
      {({ s, staf }) => {
        const kota = [...KOTA].sort((a, b) => b[4]["Cabai rawit"][0] - a[4]["Cabai rawit"][0]);
        const items = KEP_GUB.slice(0, 2);
        const pending = items.filter((d) => !s.dec[d.id]).length;
        return (
          <>
            <div className="flex items-start justify-between"><div><div className={`text-[13px] ${muted}`}>TPID DKI Jakarta · Sabtu 24 Okt, 07.30</div><div className="text-[22px] font-semibold">Selamat pagi, Gubernur</div></div><Dummy /></div>
            <div className="flex items-start gap-2.5 rounded-xl border border-[#F07A63] bg-[#3A2420] p-3 text-[14px] leading-snug"><span aria-hidden className="text-[#F07A63]">⚠</span><div>Pasokan cabai rawit ke Pasar Induk Kramat Jati turun <b>27%</b>. Harga naik di <b>55 dari 156</b> pasar, terbanyak Jakarta Timur dan Utara.</div></div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className={`${card} p-3`}><div className={`text-[12px] ${muted}`}>Inflasi yoy (Sep)</div><div className="font-mono text-[26px] font-semibold">2,74%</div><div className={`text-[12px] ${muted}`}>batas atas 3,5%</div></div>
              <div className={`${card} p-3`}><div className={`text-[12px] ${muted}`}>IPH minggu ini</div><div className="font-mono text-[26px] font-semibold text-[#F2A93B]">+0,62%</div><div className={`text-[12px] ${muted}`}>minggu lalu +0,22%</div></div>
            </div>
            <section className={`${card} flex flex-col gap-1.5 p-3.5`}>
              <h2 className="mb-0.5 text-[16px] font-semibold">Cabai rawit per kota · 7 hari</h2>
              {kota.map((k) => { const [v, r] = k[4]["Cabai rawit"]; return <div key={k[0]} className="grid grid-cols-[minmax(0,1fr)_70px_80px] items-center gap-2 text-[14px]"><span>{k[0]}</span><span className="text-right font-mono font-semibold" style={{ color: v >= 5 ? WARNA.r : v >= 2 ? WARNA.a : WARNA.g }}>+{fmt(v)}%</span><span className={`text-right text-[12px] ${muted}`}>{r}/{k[1]} pasar</span></div>; })}
            </section>
            <section className={`${card} flex flex-col gap-2.5 border-2 border-[#F2A93B] p-3.5`}>
              <h2 className="text-[16px] font-semibold">Menunggu persetujuan · {pending}</h2>
              {items.map((d) => (
                <div key={d.id} className="flex flex-col gap-1.5 border-b border-[#22394A] pb-2.5 last:border-0">
                  <div className="text-[14px] font-semibold">{d.title}</div><div className={`text-[12px] ${muted}`}>{d.sim}</div>
                  {s.dec[d.id] ? <Badge v={s.dec[d.id]} ke="TPID" /> : <div className="flex gap-2"><button onClick={() => putuskan(d.id, "ok", staf.nama, d.title)} className="min-h-11 flex-1 rounded-lg bg-[#2BB3A3] text-[14px] font-semibold text-[#0B1620]">Setujui</button><button onClick={() => putuskan(d.id, "rev", staf.nama, d.title)} className="min-h-11 flex-1 rounded-lg border border-[#4A6172] text-[14px]">Minta kajian</button></div>}
                  {s.dec[d.id] === "ok" && <div className="text-[12px] text-[#7FD3C7]">Diteruskan ke Direktorat Perkulakan Pasar Jaya sebagai penugasan TPID.</div>}
                </div>
              ))}
              <Link href="/cc/wall/?l=gub" className="text-center text-[13px] font-semibold text-[#7FD3C7] underline">Lihat semua di video wall Command Center →</Link>
            </section>
          </>
        );
      }}
    </CCPage>
  );
}
