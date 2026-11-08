"use client";

import { useState } from "react";
import { KPage, kbtnO, kchip, kpanel } from "@/components/kulakan-ui";
import { WithQ } from "@/components/kit";
import { buatBroadcast, m, setujuiBroadcast, type Grup, type KState, type Staf } from "@/lib/kulakan";

export default function Page() {
  return <WithQ>{(q) => <KPage judul="CRM & broadcast" sub="Satu Sales Agent memegang satu grup komoditas · broadcast ke toko TokoPaja sesuai grup dagangan">{({ s, staf }) => <Isi s={s} staf={staf} f0={q("f")} />}</KPage>}</WithQ>;
}

const GR: Grup[] = ["Minyak & Lemak", "Gula, Tepung & Bahan kue", "Telur & Susu"];
function Isi({ s, staf, f0 }: { s: KState; staf: Staf; f0: string }) {
  const [f, setF] = useState(f0 || "semua");
  const [grup, setGrup] = useState<Grup>(staf.grup ?? GR[0]);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const toko = s.toko.filter((t) => t.grup.includes(grup));
  const list = toko.filter((t) => f === "semua" || t.sinyal === f).sort((a, b) => b.belanja30 - a.belanja30);
  const sasaran = toko.filter((t) => f === "semua" || t.sinyal === f).length;
  const sm = staf.peran === "salesmgr" || staf.peran === "direktur";
  return (
    <>
      {!staf.grup && <div className="flex flex-wrap gap-1.5">{GR.map((g) => <button key={g} onClick={() => setGrup(g)} className={kchip(grup === g)}>{g}</button>)}</div>}
      <div className="flex flex-wrap gap-1.5">{[["semua", "Semua"], ["restok", "Akan restok"], ["menurun", "Mulai menurun"], ["baru", "Baru buka TokoPaja"]].map(([k, l]) => <button key={k} onClick={() => setF(k)} className={kchip(f === k)}>{l} · {toko.filter((t) => k === "semua" || t.sinyal === k).length}</button>)}</div>
      <section className={`${kpanel} flex flex-col p-2`}>
        {list.slice(0, 30).map((t) => <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg p-2.5 text-[13px]"><span className="min-w-0"><b>{t.nama}</b> <span className="text-xs text-[#4B5563]">{({ E: "Emerald", P: "Platinum", G: "Gold", B: "Biru" })[t.kat]}</span><br /><span className="text-xs text-[#4B5563]">{t.pasar} · {t.kios} · belanja 30 hari {m(t.belanja30)} · {t.pesanan} pesanan</span></span><span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${t.sinyal === "restok" ? "bg-[#FFEDD5] text-[#9A3412]" : t.sinyal === "menurun" ? "bg-[#FEF3C7] text-[#92400E]" : t.sinyal === "baru" ? "bg-[#E0F2FE] text-[#075985]" : "bg-[#F3F4F6]"}`}>{t.sinyal}</span></div>)}
      </section>
      {staf.peran === "agent" && (
        <form onSubmit={(e) => { e.preventDefault(); if (judul.trim()) { buatBroadcast(grup, judul.trim(), isi.trim(), sasaran, staf.nama); setJudul(""); setIsi(""); } }} className={`${kpanel} flex flex-col gap-2`}>
          <b className="text-[15px]">Susun broadcast ke {sasaran} toko ({f === "semua" ? "semua" : f})</b>
          <input aria-label="Judul" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="mis. Minyak goreng 1 L Rp171.600/dus untuk ≥10 dus" className="min-h-11 rounded-lg border border-[#D1D5DB] px-3" />
          <textarea aria-label="Isi" rows={2} value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="Isi notifikasi TokoPaja" className="rounded-lg border border-[#D1D5DB] p-3 text-sm" />
          <button className={kbtnO}>Ajukan ke Sales Manager</button>
        </form>
      )}
      <section className={`${kpanel} flex flex-col`}>
        <b className="mb-1 text-[15px]">Broadcast</b>
        {s.broadcast.map((b) => <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F3F4F6] py-2 text-[13px] first:border-0"><span><b>{b.judul}</b><br /><span className="text-xs text-[#4B5563]">{b.grup} · {b.target} toko · {b.oleh} · {b.t}</span></span>{b.status === "terkirim" ? <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-bold text-[#14532D]">terkirim</span> : sm ? <button onClick={() => setujuiBroadcast(b.id, staf.nama)} className="rounded-lg bg-[#14532D] px-3 py-2 text-xs font-bold text-white">{b.status === "menunggu" ? "Setujui" : "Kirim ke TokoPaja"}</button> : <span className="rounded-full bg-[#FFEDD5] px-2 py-0.5 text-[11px] font-bold text-[#9A3412]">{b.status}</span>}</div>)}
      </section>
    </>
  );
}
