"use client";

import Link from "next/link";
import { KKpi, KPage, kgrid, kpanel } from "@/components/kulakan-ui";
import { EIS, m } from "@/lib/kulakan";

export default function Eis() {
  return (
    <KPage judul="EIS Direktur Perkulakan dan Ritel" sub="Oktober 2026 · penjualan ke toko TokoPaja di pasar Pasar Jaya · angka ilustrasi">
      {({ s }) => {
        const tot = EIS.komposisi.reduce((n, k) => n + k[2], 0), tgt = EIS.komposisi.reduce((n, k) => n + k[3], 0);
        const tpid = s.tugas.reduce((n, t) => n + t.realisasi * (t.satuan === "ton" ? 1000 : 1) * t.hargaJual, 0);
        const T = EIS.tagihan;
        return (
          <>
            <section className={kgrid}>
              <KKpi l="Sales value" v={`Rp${tot.toLocaleString("id-ID")} M`} s={`target Rp${tgt.toLocaleString("id-ID")} M`} />
              <KKpi l="Capaian target" v={`${Math.round((tot / tgt) * 100)}%`} s="turun dari 92% (Sep)" tone="text-[#B45309]" />
              <KKpi l="Tagihan tertagih" v={`${(((T.cair + T.doProses) / tot) * 100).toFixed(1).replace(".", ",")}%`} s={`DO Bank Jakarta proses Rp${String(T.doProses).replace(".", ",")} M`} />
              <KKpi l="Penugasan TPID" v={m(tpid)} s={`${s.tugas.length} komoditas · ${s.tugas.reduce((n, t) => n + t.pasar, 0)} pasar sasaran`} hi />
            </section>
            <section className={`${kpanel} flex flex-col gap-3`}>
              <h2 className="text-[16px] font-extrabold">Komposisi penjualan per komoditas</h2>
              <div className="flex h-8 gap-0.5 overflow-hidden rounded-lg">{EIS.komposisi.map(([n, , v, , , c]) => <div key={n} style={{ width: `${(v / tot) * 100}%`, background: c }} title={n} />)}</div>
              <div className="overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-[13px]"><thead><tr className="bg-[#F9FAFB] text-left text-[11.5px] text-[#4B5563]">{["Komoditas", "Grup / Sales Agent", "Sales value", "Porsi", "Target", "Capaian", "Margin"].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
                <tbody>{EIS.komposisi.map(([n, g, v, t, mg, c]) => <tr key={n} className="border-t border-[#F3F4F6]"><td className="px-2 py-2.5 font-bold"><span className="mr-1.5 inline-block size-2.5 rounded-sm" style={{ background: c }} />{n}</td><td className="px-2">{g}</td><td className="px-2 font-bold">Rp{v.toLocaleString("id-ID")} M</td><td className="px-2">{Math.round((v / tot) * 100)}%</td><td className="px-2">Rp{t.toLocaleString("id-ID")} M</td><td className={`px-2 font-bold ${v >= t ? "text-[#15803D]" : "text-[#B45309]"}`}>{Math.round((v / t) * 100)}%</td><td className="px-2">{String(mg).replace(".", ",")}%</td></tr>)}</tbody></table></div>
            </section>
            <section className="grid gap-3.5 md:grid-cols-[3fr_2fr]">
              <div className={`${kpanel} flex flex-col gap-2`}>
                <h2 className="text-[16px] font-extrabold">Capaian vs target bulanan</h2>
                <div className="grid h-44 grid-cols-5 items-end gap-3 border-b border-[#E5E7EB] px-1">{EIS.bulan.map(([b, r, t]) => <div key={b} className="flex h-full flex-col items-center justify-end gap-1"><span className="text-[11px] font-bold">{Math.round((r / t) * 100)}%</span><div className="flex w-full max-w-[52px] items-end rounded-t-md border-2 border-dashed border-[#64748B]" style={{ height: `${(t / 18.5) * 100}%` }}><div className="w-full rounded-t" style={{ height: `${(r / t) * 100}%`, background: b === "Nov" ? "#4D9A6A" : "#14532D" }} /></div></div>)}</div>
                <div className="grid grid-cols-5 gap-3 text-center text-[11px] text-[#4B5563]">{EIS.bulan.map(([b, r, t]) => <div key={b}><b className="text-[#1A1F1C]">{b}</b><br />{r}/{t} M</div>)}</div>
              </div>
              <div className={`${kpanel} flex flex-col gap-1.5 text-[13px]`}>
                <h2 className="text-[16px] font-extrabold">Tagihan Oktober</h2>
                <div className="flex h-4 gap-0.5 overflow-hidden rounded"><div style={{ width: "89%" }} className="bg-[#14532D]" /><div style={{ width: "7%" }} className="bg-[#4D9A6A]" /><div style={{ width: "4%" }} className="bg-[#C2410C]" /></div>
                {[["Sudah cair (QRIS, VA, bank)", `Rp${String(T.cair).replace(".", ",")} M`], ["Pembiayaan DO Bank Jakarta · proses cair", `Rp${String(T.doProses).replace(".", ",")} M`], ["Piutang tempo sendiri", `Rp${String(T.tempo).replace(".", ",")} M`], ["  > 30 hari", `Rp${T.lebih30} jt`]].map(([a, b]) => <div key={a} className="flex justify-between border-b border-[#F3F4F6] py-1.5"><span>{a}</span><b>{b}</b></div>)}
                <Link href="/kp/keuangan/" className="text-[13px] font-bold text-[#C2410C]">Rincian Finance & DO ›</Link>
              </div>
            </section>
            <Link href="/kp/tpid/" className="flex items-center justify-between rounded-[14px] border-2 border-[#FDBA74] bg-white p-4"><span><span className="block text-[11px] font-extrabold text-[#9A3412]">PENUGASAN GUBERNUR · PENGENDALIAN INFLASI</span><b className="text-[15px]">{s.tugas.filter((t) => t.status !== "selesai").length} komoditas berjalan · {s.tugas.filter((t) => t.status === "pasokan kurang").length} pasokan kurang</b></span><span className="text-xl">›</span></Link>
          </>
        );
      }}
    </KPage>
  );
}
