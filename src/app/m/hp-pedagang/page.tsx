"use client";

import { useState } from "react";
import { LogoPJ, MPage, Tag, ESTONE } from "@/components/mitra-ui";
import { PROYEK, jt, pedagangBayar, pedagangTtd, plg, balasChat } from "@/lib/mitra";

// Pratinjau menu "Revitalisasi" di aplikasi PaJaKu (TokoPaja) milik pedagang. Persona: Yuliana S. (Emerald).
export default function HpPedagang() {
  const [pid, setPid] = useState("PJK-0045310");
  const [teks, setTeks] = useState("");
  return (
    <MPage judul="" hp>
      {({ s }) => {
        const p = plg(s, pid)!;
        const e = s.esptu.find((x) => x.pelangganId === pid);
        const c = s.chat.find((x) => x.pelangganId === pid);
        const calon = ["PJK-0045310", "PJK-0045677", "PJK-0051207"].map((id) => plg(s, id)!).filter(Boolean);
        return (
          <div className="flex w-full max-w-[400px] flex-col gap-3">
            <div className="flex flex-wrap gap-1.5 text-xs">{calon.map((x) => <button key={x.id} onClick={() => setPid(x.id)} className={`rounded-full border px-2.5 py-1 ${pid === x.id ? "border-[#12302B] bg-[#12302B] text-white" : "border-[#CFCABD] bg-white"}`}>{x.nama}</button>)}</div>
            <div className="overflow-hidden rounded-[28px] border-[6px] border-[#1B1F24] bg-[#F4F3EE]">
              <div className="bg-[#0F5A40] px-4 pt-4 pb-3 text-white"><div className="text-[11px] opacity-85">TokoPaja · menu Revitalisasi</div><div className="text-lg font-bold">{PROYEK.nama}</div><div className="mt-1 flex items-center gap-2 rounded-lg bg-white px-2 py-1"><LogoPJ className="h-5" /><span className="text-[10.5px] text-[#5B6168]">bersama {PROYEK.mitra}</span></div></div>
              <div className="flex flex-col gap-2.5 p-3">
                <div className="rounded-xl bg-white p-3 text-[13px]"><div className="text-xs text-[#5B6168]">{p.nama} · {p.id}</div>
                  {e ? (<><div className="mt-1 flex items-center justify-between"><b className="font-mono">{e.unit}</b><Tag tone={ESTONE[e.status][1]}>{ESTONE[e.status][0]}</Tag></div><div className="text-xs text-[#5B6168]">{e.no} · harga {jt(e.harga)}</div>
                    {e.status === "ttd-pedagang" && <button onClick={() => pedagangTtd(e.no)} className="mt-2 w-full rounded-lg bg-[#0F5A40] py-2.5 text-[13px] font-semibold text-white">Tanda tangani e-SPTU (PIN)</button>}
                    <div className="mt-2 h-2 rounded bg-[#ECEDE7]"><div className="h-2 rounded bg-[#0F5A40]" style={{ width: `${(e.dibayar / e.harga) * 100}%` }} /></div><div className="mt-1 text-xs">Dibayar {jt(e.dibayar)} dari {jt(e.harga)}{e.telat ? ` · telat ${e.telat} hari` : ""}</div>
                    {!e.lunas && e.status !== "draf" && <button onClick={() => pedagangBayar(e.no, Math.min(e.harga - e.dibayar, Math.round(e.harga * 0.05 * 10) / 10))} className="mt-2 w-full rounded-lg border-[1.5px] border-[#0F5A40] py-2 text-[13px] font-semibold text-[#0F5A40]">Bayar angsuran {jt(Math.min(e.harga - e.dibayar, Math.round(e.harga * 0.05 * 10) / 10))} · QRIS</button>}</>) : <div className="mt-1 text-[13px]">Belum ada unit. Ikuti undian / pilih unit lewat Sales.</div>}
                </div>
                <div className="rounded-xl bg-white p-3 text-[13px]"><b>Progres konstruksi {s.progres[0].persen}%</b><div className="text-xs text-[#5B6168]">{s.progres[0].t} · {s.progres[0].catatan}</div></div>
                <div className="rounded-xl bg-white p-3 text-[13px]"><b>Chat tim revitalisasi</b>
                  <div className="mt-1.5 flex max-h-56 flex-col gap-1.5 overflow-y-auto">{(c?.msgs ?? []).slice(-5).map((m, i) => <div key={i} className={`flex ${m.dari === "p" ? "justify-end" : "justify-start"}`}><span className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-xs ${m.dari === "p" ? "bg-[#0F5A40] text-white" : m.dari === "s" ? "bg-[#ECEDE7]" : "border border-[#E1E3DC]"}`}>{m.teks}</span></div>)}</div>
                  {c && <form onSubmit={(ev) => { ev.preventDefault(); if (teks.trim()) { balasChat(c.id, teks.trim(), "p", ""); setTeks(""); } }} className="mt-2 flex gap-1.5"><input aria-label="Pesan" value={teks} onChange={(ev) => setTeks(ev.target.value)} placeholder="Tulis pesan" className="min-h-10 min-w-0 flex-1 rounded-lg border border-[#C9CEC6] px-2 text-xs" /><button className="rounded-lg bg-[#0F5A40] px-3 text-xs font-semibold text-white">Kirim</button></form>}
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-[#5B6168]">Pratinjau layar di aplikasi pedagang (PaJaKu). Aksi di sini langsung tercermin di konsol Mitra & EIS.</p>
          </div>
        );
      }}
    </MPage>
  );
}
