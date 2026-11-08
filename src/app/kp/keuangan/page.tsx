"use client";

import { KKpi, KPage, kgrid, kpanel } from "@/components/kulakan-ui";
import { BANK, BAYAR, EIS, isDO, m, tokoBy, totalP } from "@/lib/kulakan";

export default function Keuangan() {
  return (
    <KPage judul="Finance & Accounting" sub="Rekonsiliasi QRIS/VA · pembiayaan DO Bank Jakarta · tagihan PATROL">
      {({ s }) => {
        const D = EIS.doBank;
        const dos = s.pesanan.filter((p) => isDO(p.bayar) && p.status !== "ditolak");
        return (
          <>
            <section className={kgrid}>
              <KKpi l="DO dibiayai (Okt)" v={`Rp${String(D.dibiayai).replace(".", ",")} M`} s="31% dari sales value" />
              <KKpi l="Sudah cair dari bank" v={`Rp${String(D.cair).replace(".", ",")} M`} />
              <KKpi l="Emerald memakai DO" v={`${D.pakai} / ${D.emerald.toLocaleString("id-ID")}`} s="hanya akun Emerald" />
              <KKpi l="Porsi akad 30/60/90" v={D.akad.join(" / ") + "%"} />
            </section>
            <section className={`${kpanel} flex flex-col gap-2`}>
              <b className="text-[15px]">Alur pembiayaan DO {BANK}</b>
              {["Pedagang Emerald memilih akad bayar tunda 30/60/90 hari di TokoPaja → DO dibuat", `${BANK} menyetujui sesuai plafon pedagang`, "Barang diterima kios (QR serah terima)", `${BANK} membayar Pasar Jaya tunai H+1 · pedagang mengangsur ke bank`].map((x, i) => <div key={x} className="flex gap-2 text-[13px]"><span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#14532D] text-[10px] font-bold text-white">{i + 1}</span>{x}</div>)}
              <div className="text-xs text-[#4B5563]">Risiko gagal bayar di bank tanpa regres ke Pasar Jaya (usulan PKS). Dana tidak melewati PATROL.</div>
            </section>
            <section className={`${kpanel} flex flex-col`}>
              <b className="mb-1 text-[15px]">DO per status</b>
              {dos.map((p) => <div key={p.id} className="flex justify-between gap-2 border-t border-[#F3F4F6] py-2 text-[13px] first:border-0"><span>{tokoBy(s, p.tokoId)?.nama} · {p.id}<br /><span className="text-xs text-[#4B5563]">{BAYAR[p.bayar]}</span></span><span className="text-right"><b>{m(totalP(p))}</b><br /><span className={`text-xs font-bold ${p.doStatus === "dibayar" ? "text-[#14532D]" : p.doStatus === "melebihi plafon" ? "text-[#B91C1C]" : "text-[#9A3412]"}`}>{p.doStatus}</span></span></div>)}
            </section>
            <section id="patrol" className={`${kpanel} flex flex-col gap-1.5 text-[13px]`}>
              <b className="text-[15px]">Tagihan PATROL (kerja sama aplikasi)</b>
              {[["Langganan paket Pro / bulan", "[tarif]"], ["Fee per transaksi selesai", "[x]% × sales value"], ["Sales value Okt", "Rp15,6 M"], ["Dasar kerja sama", "Perda DKI 7/2018 Ps. 11 ayat (2) huruf b"]].map(([a, b]) => <div key={a} className="flex justify-between border-b border-[#F3F4F6] py-1.5"><span className="text-[#4B5563]">{a}</span><b>{b}</b></div>)}
            </section>
          </>
        );
      }}
    </KPage>
  );
}
