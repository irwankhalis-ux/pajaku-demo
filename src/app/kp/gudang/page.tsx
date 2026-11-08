"use client";

import { useState } from "react";
import { KKpi, KPage, ST, kbtn, kgrid, kpanel } from "@/components/kulakan-ui";
import { BAYAR, berangkat, isDO, m, serahTerima, skuBy, tokoBy, totalP } from "@/lib/kulakan";

export default function Gudang() {
  const [scan, setScan] = useState("");
  return (
    <KPage judul="Gudang & delivery" sub="Jakgrosir Kramat Jati → hub pasar → kios · serah terima dengan QR TokoPaja">
      {({ s, staf }) => {
        const siap = s.pesanan.filter((p) => p.status === "dikonfirmasi");
        const jalan = s.pesanan.filter((p) => p.status === "dikirim");
        const hubs = [...new Set([...siap, ...jalan].map((p) => p.hub))];
        return (
          <>
            <section className={kgrid}>
              <KKpi l="Siap dimuat" v={siap.length} s={`${hubs.length} hub tujuan`} />
              <KKpi l="Dalam perjalanan" v={jalan.length} />
              <KKpi l="Diterima hari ini" v={s.pesanan.filter((p) => p.status === "diterima").length} s="QR serah terima" />
              <KKpi l="Stok menipis" v={s.sku.filter((k) => k.stok < 200).length} s="SKU di bawah 200" tone="text-[#B45309]" />
            </section>
            {hubs.map((h) => {
              const sp = siap.filter((p) => p.hub === h), jp = jalan.filter((p) => p.hub === h);
              return (
                <section key={h} className={`${kpanel} flex flex-col gap-2`}>
                  <div className="flex flex-wrap items-center justify-between gap-2"><b className="text-[15px]">Rute {h}</b>{sp.length > 0 && <button onClick={() => berangkat(sp.map((p) => p.id), staf.nama)} className={kbtn}>Muat & berangkat ({sp.length})</button>}</div>
                  {[...sp, ...jp].map((p) => { const t = tokoBy(s, p.tokoId)!; return (
                    <div key={p.id} className="flex flex-wrap items-center gap-2 border-t border-[#F3F4F6] py-2 text-[13px]">
                      <span className="min-w-0 flex-1"><b>{t.nama}</b> · <span className="font-mono text-xs">{t.kios}</span><br /><span className="text-xs text-[#4B5563]">{p.items.map((i) => `${skuBy(s, i.sku)?.nama.split(" (")[0]} × ${i.qty}`).join(", ")} · {m(totalP(p))} · {BAYAR[p.bayar]}</span></span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ST[p.status]}`}>{p.status}</span>
                      {p.status === "dikirim" && <button onClick={() => { setScan(p.id); serahTerima(p.id, staf.nama); }} className="rounded-lg bg-[#14532D] px-3 py-2 text-xs font-bold text-white">Pindai QR kios · serah terima</button>}
                    </div>
                  ); })}
                </section>
              );
            })}
            {!hubs.length && <div className={kpanel}>Tidak ada kiriman yang menunggu.</div>}
            {scan && (() => { const p = s.pesanan.find((x) => x.id === scan)!; return <div role="status" className="rounded-[14px] bg-[#DCFCE7] p-3.5 text-[13px] text-[#14532D]"><b>{scan} diterima kios.</b> {isDO(p.bayar) ? "DO berstatus diterima → Bank Jakarta membayar Pasar Jaya H+1." : p.bayar === "tempo14" ? "Piutang tempo 14 hari mulai berjalan." : "Pembayaran sudah lunas."}</div>; })()}
          </>
        );
      }}
    </KPage>
  );
}
