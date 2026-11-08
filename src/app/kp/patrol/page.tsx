"use client";

import { KKpi, KPage, kgrid, kpanel } from "@/components/kulakan-ui";
import { EIS } from "@/lib/kulakan";

export default function Patrol() {
  return (
    <KPage judul="Konsol PATROL · multi-pemasok" sub="Setiap BUMD/pemasok punya akun sendiri · langganan + fee per transaksi">
      {() => {
        const tot = EIS.pemasok.reduce((n, p) => n + p[2], 0);
        return (
          <>
            <section className={kgrid}>
              <KKpi l="Pemasok aktif" v={EIS.pemasok.length} s="tahap awal: BUMD pangan DKI" />
              <KKpi l="GMV B2B Okt" v={`Rp${tot.toLocaleString("id-ID")} M`} />
              <KKpi l="Toko TokoPaja pembeli" v={EIS.pemasok.reduce((n, p) => n + p[3], 0).toLocaleString("id-ID")} s="satu toko bisa beli ke beberapa pemasok" />
              <KKpi l="Fee PATROL" v="[x]% GMV" s="tarif placeholder" />
            </section>
            <section className={`${kpanel} flex flex-col`}>
              {EIS.pemasok.map(([n, paket, gmv, toko]) => <div key={n} className="flex flex-wrap justify-between gap-2 border-t border-[#F3F4F6] py-2.5 text-[13px] first:border-0"><span><b>{n}</b><br /><span className="text-xs text-[#4B5563]">paket {paket} · {toko.toLocaleString("id-ID")} toko</span></span><b>Rp{gmv.toLocaleString("id-ID")} M</b></div>)}
            </section>
            <section className={`${kpanel} text-[13px] text-[#3A3F45]`}><b>Aturan platform:</b> pembeli hanya toko TokoPaja dengan e-SIPTU aktif · pembiayaan DO hanya untuk Emerald lewat bank berizin · harga di atas HET perlu persetujuan pemasok tingkat Direktur · data pedagang mengikuti UU PDP. Dasar kerja sama dengan Pasar Jaya: Perda 7/2018 Ps. 11 (2) b & Ps. 15 (1).</section>
          </>
        );
      }}
    </KPage>
  );
}
