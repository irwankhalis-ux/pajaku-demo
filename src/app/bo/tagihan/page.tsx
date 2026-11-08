"use client";

import Link from "next/link";
import { useState } from "react";
import { BoPage, EWS, Kpi, Stacked, grid, panel } from "@/components/bo";
import { chip } from "@/components/kit";
import { ingatkanTagihan, lunasiTunggakan, pedagangById, pct, rp } from "@/lib/store";

export default function Tagihan() {
  const [f, setF] = useState(2);
  return (
    <BoPage judul="Tagihan BPP & HPTU">
      {({ s, staf }) => {
        const isi = s.tu.filter((t) => t.buka || t.tunggakan > 0);
        const bpp = (luas: number) => luas * 45_000;
        const nunggak = isi.filter((t) => t.tunggakan >= f).sort((a, b) => b.tunggakan - a.tunggakan);
        const piutang = isi.reduce((n, t) => n + t.tunggakan * bpp(t.luas), 0);
        const potensi = isi.reduce((n, t) => n + bpp(t.luas), 0);
        const bayar = s.tagihan.filter((t) => t.status === "lunas" && t.bayar).slice(-6).reverse();
        const ingat = new Set(s.interaksi.filter((x) => x.catatan.startsWith("Pengingat")).map((x) => x.catatan.match(/\((.+)\)/)?.[1]));
        return (
          <>
            <section className={grid}>
              <Kpi l="Kolektibilitas" v={`${pct(isi.filter((t) => t.tunggakan === 0).length, isi.length)}%`} s="TU tanpa tunggakan" />
              <Kpi l="Potensi BPP / bulan" v={rp(potensi).replace(/\.\d{3}$/, " rb").replace("Rp", "Rp ")} s={`${isi.length} TU tertagih · Rp45 rb/m² (ilustrasi)`} />
              <Kpi l="Piutang BPP" v={rp(piutang)} s={`${isi.filter((t) => t.tunggakan > 0).length} TU menunggak`} tone="text-[#A3361C]" />
              <Kpi l="Bayar via aplikasi" v={s.tagihan.filter((t) => t.bayar && t.bayar.metode !== "Tunai di loket").length} s="QRIS · VA · JakOne (data contoh)" />
            </section>
            <section className={panel}><h2 className="mb-3 text-[15px] font-bold">Status BPP per TU</h2><Stacked parts={EWS.map((e) => ({ l: e.l, c: e.c, rule: e.rule, n: isi.filter((t) => e.f(t.tunggakan)).length }))} /></section>
            <div className="flex flex-wrap items-center gap-1.5"><span className="text-[13px] font-semibold">Tampilkan:</span>{[[1, "≥1 bulan"], [2, "Waspada+"], [3, "Macet"]].map(([n, l]) => <button key={n} onClick={() => setF(n as number)} className={chip(f === n)}>{l}</button>)}</div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              {nunggak.slice(0, 40).map((t) => {
                const pid = t.buka ? t.pemakaiId : t.pemilikId;
                return (
                  <div key={t.id} className="flex flex-wrap items-center gap-2 border-t border-[#EEF0EA] px-3.5 py-2.5 first:border-0">
                    <Link href={`/bo/crm/?id=${pid}`} className="min-w-0 flex-1"><b className="block text-sm">{pedagangById(s, pid)?.nama}</b><span className="font-mono text-xs text-muted">{t.id} · {t.tunggakan} bln · {rp(t.tunggakan * bpp(t.luas))}</span></Link>
                    <span className={`text-xs font-bold ${t.tunggakan >= 3 ? "text-[#A3361C]" : "text-[#9A5B0E]"}`}>{t.tunggakan >= 3 ? "Macet" : t.tunggakan === 2 ? "Waspada" : "DPK"}</span>
                    <button disabled={ingat.has(t.id)} onClick={() => ingatkanTagihan(t.id, staf.nama)} className="rounded-lg bg-mint px-2.5 py-2 text-xs font-semibold text-mint-ink disabled:opacity-60">{ingat.has(t.id) ? "Diingatkan" : "Ingatkan"}</button>
                    <button onClick={() => lunasiTunggakan(t.id, staf.nama)} className="rounded-lg border border-line-2 px-2.5 py-2 text-xs font-semibold">Catat bayar loket</button>
                  </div>
                );
              })}
              {nunggak.length === 0 && <div className="p-4 text-[13px] text-muted">Tidak ada TU di kategori ini.</div>}
            </div>
            <section className={panel}>
              <h2 className="mb-2 text-[15px] font-bold">Pembayaran terakhir</h2>
              {bayar.map((t) => <div key={t.id} className="flex justify-between border-t border-[#EEF0EA] py-1.5 text-[13px] first:border-0"><span>{pedagangById(s, t.pedagangId)?.nama} · {t.jenis} {t.periode}</span><b>{rp(t.jumlah)} · {t.bayar?.metode}</b></div>)}
            </section>
          </>
        );
      }}
    </BoPage>
  );
}
