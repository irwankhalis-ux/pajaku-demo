"use client";

import { BoPage, Kpi, grid, panel } from "@/components/bo";
import { pedagangById, pct, rp, statistik } from "@/lib/store";
import Link from "next/link";

export default function TokoBo() {
  return (
    <BoPage judul="TokoPaja · e-commerce pedagang">
      {({ s }) => {
        const gmv = s.toko.reduce((n, t) => n + t.omzet, 0);
        const trx = s.toko.reduce((n, t) => n + t.transaksi, 0);
        const st = statistik(s);
        const top = [...s.toko].sort((a, b) => b.omzet - a.omzet).slice(0, 12);
        const kul = s.kulakan.reduce((n, k) => n + k.items.reduce((m, i) => m + i.qty * i.harga, 0), 0);
        return (
          <>
            <section className={grid}>
              <Kpi l="Toko aktif" v={s.toko.length} s={`${pct(s.toko.length, st.terisi)}% dari TU terisi`} />
              <Kpi l="GMV bulan ini" v={rp(gmv)} s={`${trx} transaksi · rata ${rp(trx ? gmv / trx : 0)}`} />
              <Kpi l="Fee layanan (usulan 2%)" v={rp(gmv * 0.02)} s="dibagi Pasar Jaya & PATROL (ilustrasi)" />
              <Kpi l="Kulakan B2B" v={rp(kul)} s={`${s.kulakan.length} pesanan · ${s.kulakan.filter((k) => k.bayar === "tempo").length} tempo SCF`} />
            </section>
            <section className={panel}>
              <h2 className="mb-2 text-[15px] font-bold">Toko teratas</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-[13px]">
                  <thead><tr className="text-left text-[11px] text-muted uppercase">{["Toko", "Kios", "Pedagang", "Omzet", "Trx", "Layanan"].map((h) => <th key={h} className="border-b border-line px-2 py-2">{h}</th>)}</tr></thead>
                  <tbody>{top.map((t) => <tr key={t.id}><td className="border-b border-[#EEF0EA] px-2 py-2 font-semibold">{t.nama}</td><td className="border-b border-[#EEF0EA] px-2 font-mono text-xs">{t.tuId}</td><td className="border-b border-[#EEF0EA] px-2"><Link href={`/bo/crm/?id=${t.pedagangId}`} className="text-pj">{pedagangById(s, t.pedagangId)?.nama}</Link></td><td className="border-b border-[#EEF0EA] px-2">{rp(t.omzet)}</td><td className="border-b border-[#EEF0EA] px-2">{t.transaksi}</td><td className="border-b border-[#EEF0EA] px-2 text-xs">{[t.ambil && "ambil", t.antar && "antar", t.kulakan && "kulakan"].filter(Boolean).join(" · ")}</td></tr>)}</tbody>
                </table>
              </div>
            </section>
            <p className="text-xs text-muted">Toko hanya bisa dibuka oleh pemegang e-SIPTU aktif; produk dibatasi kelompok dagangan di e-SIPTU — e-commerce memperkuat kepatuhan migrasi.</p>
          </>
        );
      }}
    </BoPage>
  );
}
