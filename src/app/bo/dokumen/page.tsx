"use client";

import { useState } from "react";
import { BoPage, Kpi, grid, panel } from "@/components/bo";
import { DocQR } from "@/components/ui";
import { input } from "@/components/kit";
import { pedagangById } from "@/lib/store";

export default function DokumenBo() {
  const [q, setQ] = useState("");
  const [buka, setBuka] = useState("");
  return (
    <BoPage judul="Dokumen e-SHPTU / e-SIPTU">
      {({ s }) => {
        const qq = q.trim().toLowerCase();
        const list = qq.length >= 3 ? s.dok.filter((d) => d.no.toLowerCase().includes(qq) || d.tuId.toLowerCase().includes(qq) || (pedagangById(s, d.atasNamaId)?.nama.toLowerCase().includes(qq) ?? false)).slice(0, 30) : [];
        const n = (st: string, j?: string) => s.dok.filter((d) => d.status === st && (!j || d.jenis === j)).length;
        return (
          <>
            <section className={grid}>
              <Kpi l="e-SHPTU terbit" v={n("terbit", "e-SHPTU")} />
              <Kpi l="e-SIPTU terbit" v={n("terbit", "e-SIPTU")} />
              <Kpi l="Menunggu TTE" v={n("menunggu")} />
              <Kpi l="Dibatalkan / diganti" v={n("batal")} s="revisi, pengalihan, perpanjangan" />
            </section>
            <label htmlFor="cd" className="sr-only">Cari dokumen</label>
            <input id="cd" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nomor dokumen, ID Kios, atau nama (min. 3 huruf)" className={input} />
            {list.map((d) => (
              <div key={d.no} className={`${panel} flex flex-col gap-2`}>
                <button onClick={() => setBuka(buka === d.no ? "" : d.no)} className="flex flex-wrap items-center justify-between gap-2 text-left"><span><b className="block font-mono text-[13px]">{d.no}</b><span className="text-xs text-muted">{d.jenis} · {d.tuId} · a.n. {pedagangById(s, d.atasNamaId)?.nama} · {d.berlaku}</span></span><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${d.status === "terbit" ? "bg-mint text-mint-ink" : d.status === "batal" ? "bg-[#ECEDE7] text-muted" : "bg-[#FBEFD9] text-[#6E4A12]"}`}>{d.status}</span></button>
                {buka === d.no && <div className="flex flex-wrap items-center gap-3"><DocQR no={d.no} size={120} /><div className="text-[12.5px] text-ink-2">{d.keterangan}<br />Terbit: {d.terbit ?? "—"}<br />QR berisi PASARJAYA-DOK:{d.no} untuk portal verifikasi (bank, notaris).</div></div>}
              </div>
            ))}
            {qq.length >= 3 && !list.length && <div className={panel}>Tidak ditemukan.</div>}
          </>
        );
      }}
    </BoPage>
  );
}
