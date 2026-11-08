"use client";

import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, card } from "@/components/ui";
import { chip } from "@/components/kit";
import { rp } from "@/lib/store";

export default function Harga() {
  const [k, setK] = useState("Semua");
  return (
    <PedagangPage>
      {({ s }) => {
        const kel = ["Semua", ...new Set(s.harga.map((h) => h.kelompok))];
        const list = s.harga.filter((h) => k === "Semua" || h.kelompok === k);
        return (
          <>
            <BackHeader href="/beranda/" title="Info harga pasar" sub="Pasar Johar Baru · dicatat kasir/AO tiap pagi" />
            <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
              <div className="flex flex-wrap gap-1.5">{kel.map((x) => <button key={x} onClick={() => setK(x)} className={chip(k === x)}>{x}</button>)}</div>
              <section className={`${card} px-3.5 py-1`}>
                {list.map((h, i) => {
                  const d = h.hariIni - h.kemarin;
                  return (
                    <div key={h.komoditas} className={`flex items-center justify-between gap-2 py-2.5 ${i < list.length - 1 ? "border-b border-[#EFF0EA]" : ""}`}>
                      <span><span className="block text-sm font-semibold">{h.komoditas}</span><span className="text-xs text-muted">{h.kelompok} · {h.t}</span></span>
                      <span className="text-right"><span className="block text-sm font-bold">{rp(h.hariIni)}/{h.satuan}</span><span className={`text-xs font-semibold ${d > 0 ? "text-[#B5531B]" : d < 0 ? "text-[#157A44]" : "text-muted"}`}>{d > 0 ? `▲ ${rp(d)}` : d < 0 ? `▼ ${rp(-d)}` : "= tetap"}</span></span>
                    </div>
                  );
                })}
              </section>
              <p className="text-xs text-muted">Harga rata-rata pedagang hari ini. Data yang sama dikirim ke Command Center Pemprov DKI untuk TPID.</p>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
