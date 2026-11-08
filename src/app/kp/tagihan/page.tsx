"use client";

import { KKpi, KPage, kgrid, kpanel } from "@/components/kulakan-ui";
import { EIS, isDO, lunasTempo, m, tokoBy, totalP } from "@/lib/kulakan";

export default function Tagihan() {
  return (
    <KPage judul="Collection" sub="Piutang tempo sendiri · pembiayaan DO ditagih Bank Jakarta, bukan Collection">
      {({ s, staf }) => {
        const tempo = s.pesanan.filter((p) => p.bayar === "tempo14" && p.status === "diterima" && !p.lunas).sort((a, b) => b.umur - a.umur);
        const do_ = s.pesanan.filter((p) => isDO(p.bayar) && p.status !== "ditolak");
        return (
          <>
            <section className={kgrid}>
              <KKpi l="Piutang tempo aktif" v={m(tempo.reduce((n, p) => n + totalP(p), 0))} s={`${tempo.length} toko`} />
              <KKpi l="> 30 hari" v={tempo.filter((p) => p.umur > 30).length} s="perlu kunjungan" tone="text-[#B91C1C]" />
              <KKpi l="Portofolio (Okt)" v={`Rp${EIS.tagihan.lebih30} jt`} s="piutang > 30 hari · 12 toko" />
              <KKpi l="DO Bank Jakarta" v={do_.length} s="ditagih bank ke pedagang" />
            </section>
            <section className={`${kpanel} flex flex-col`}>
              <b className="mb-1 text-[15px]">Tagihan & kunjungan</b>
              {tempo.map((p) => { const t = tokoBy(s, p.tokoId)!; return (
                <div key={p.id} className="flex flex-wrap items-center gap-2 border-t border-[#F3F4F6] py-2.5 text-[13px] first:border-0">
                  <span className="min-w-0 flex-1"><b>{t.nama}</b> · {t.pasar}<br /><span className={`text-xs font-semibold ${p.umur > 30 ? "text-[#B91C1C]" : p.umur > 14 ? "text-[#B45309]" : "text-[#4B5563]"}`}>{p.id} · {m(totalP(p))} · {p.umur > 14 ? `lewat jatuh tempo ${p.umur - 14} hari` : `jatuh tempo ${14 - p.umur} hari lagi`}</span></span>
                  <a href="tel:0" className="rounded-lg bg-[#E8F1EA] px-3 py-2 text-xs font-bold text-[#14532D]">Telepon</a>
                  <button onClick={() => lunasTempo(p.id, staf.nama)} className="rounded-lg bg-[#14532D] px-3 py-2 text-xs font-bold text-white">Catat lunas (QRIS/VA)</button>
                </div>
              ); })}
              {!tempo.length && <div className="text-[13px] text-[#4B5563]">Tidak ada piutang tempo.</div>}
            </section>
          </>
        );
      }}
    </KPage>
  );
}
