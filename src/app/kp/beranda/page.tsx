"use client";

import Link from "next/link";
import { useState } from "react";
import { KPage, kpanel } from "@/components/kulakan-ui";
import { BAYAR, EIS, isDO, m, skuBy, tokoBy, totalP } from "@/lib/kulakan";

export default function Beranda() {
  const [bertugas, setBertugas] = useState(true);
  return (
    <KPage judul="">
      {({ s, staf }) => {
        const grup = staf.grup;
        const mine = s.pesanan.filter((p) => p.status === "baru" && (!grup || skuBy(s, p.items[0].sku)?.grup === grup));
        const toko = s.toko.filter((t) => !grup || t.grup.includes(grup));
        const target = grup ? EIS.komposisi.filter((k) => k[1].includes(staf.nama)).reduce((n, k) => n + k[3], 0) * 1.05 : 18.5;
        const real = grup ? s.pesanan.filter((p) => p.status !== "ditolak" && skuBy(s, p.items[0].sku)?.grup === grup).reduce((n, p) => n + totalP(p), 0) / 1e9 + target * 0.24 : 3.9;
        return (
          <>
            <section className="rounded-[14px] bg-[#1E293B] p-4 text-white">
              <div className="flex items-center justify-between gap-2"><div><div className="text-[15px] font-bold">{staf.nama} · {grup ?? "semua grup dagangan"}</div><div className="text-xs text-[#CBD5E1]">{s.sku.filter((k) => !grup || k.grup === grup).length} SKU · {toko.length} toko TokoPaja</div></div><button onClick={() => setBertugas(!bertugas)} className={`rounded-full px-3 py-2 text-xs font-bold ${bertugas ? "bg-[#DCFCE7] text-[#14532D]" : "bg-[#E5E7EB] text-[#374151]"}`}>{bertugas ? "Bertugas" : "Off"}</button></div>
              <div className="mt-3 flex justify-between text-xs text-[#CBD5E1]"><span>Target November</span><b className="text-white">{m(real * 1e9)} / {m(target * 1e9)}</b></div>
              <div className="mt-1 h-2 rounded bg-[#334155]"><div className="h-2 rounded bg-[#FDBA74]" style={{ width: `${Math.min(100, (real / target) * 100)}%` }} /></div>
            </section>
            <section className="grid grid-cols-3 gap-2">
              <Link href="/kp/pesanan/" className="rounded-[14px] border border-[#E5E7EB] bg-white p-3"><div className="text-2xl font-extrabold text-[#C2410C]">{mine.length}</div><div className="text-[11px] font-semibold text-[#4B5563]">Konfirmasi</div></Link>
              <Link href="/kp/crm/?f=restok" className="rounded-[14px] border border-[#E5E7EB] bg-white p-3"><div className="text-2xl font-extrabold">{toko.filter((t) => t.sinyal === "restok").length}</div><div className="text-[11px] font-semibold text-[#4B5563]">Akan restok</div></Link>
              <Link href="/kp/crm/?f=menurun" className="rounded-[14px] border border-[#E5E7EB] bg-white p-3"><div className="text-2xl font-extrabold">{toko.filter((t) => t.sinyal === "menurun").length}</div><div className="text-[11px] font-semibold text-[#4B5563]">Mulai menurun</div></Link>
            </section>
            <section className="flex flex-col gap-2 rounded-[14px] border border-[#FED7AA] bg-[#FFF7ED] p-4">
              <div className="text-xs font-bold text-[#9A3412]">Broadcast cepat ke grup dagangan</div>
              <div className="text-[15px] font-extrabold">{toko.filter((t) => t.sinyal === "restok").length} toko TokoPaja stoknya menipis</div>
              <div className="text-[13px] text-[#4B5563]">Kirim penawaran lewat notifikasi TokoPaja · perlu setuju Sales Manager</div>
              <Link href="/kp/crm/" className="flex min-h-11 items-center justify-center rounded-[10px] bg-[#C2410C] text-sm font-bold text-white">Susun broadcast</Link>
            </section>
            <section className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between"><h2 className="text-base font-extrabold">Pesanan perlu konfirmasi</h2><Link href="/kp/pesanan/" className="text-[13px] font-bold text-[#C2410C]">Lihat semua</Link></div>
              {mine.slice(0, 5).map((p) => { const t = tokoBy(s, p.tokoId)!; return (
                <Link key={p.id} href={`/kp/pesanan/?id=${p.id}`} className={`${kpanel} flex flex-col gap-1 p-3`}>
                  <div className="flex justify-between gap-2"><b className="text-sm">{t.nama}</b><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${isDO(p.bayar) ? "bg-[#FFEDD5] text-[#9A3412]" : "bg-[#F3F4F6]"}`}>{BAYAR[p.bayar]}</span></div>
                  <div className="text-xs text-[#4B5563]">{t.pasar} · {t.kios} · {({ E: "Emerald", P: "Platinum", G: "Gold", B: "Biru" })[t.kat]}</div>
                  <div className="text-sm">{p.items.map((i) => `${skuBy(s, i.sku)?.nama} × ${i.qty}`).join(", ")} · <b>{m(totalP(p))}</b></div>
                </Link>
              ); })}
              {!mine.length && <div className={`${kpanel} text-[13px] text-[#4B5563]`}>Tidak ada pesanan baru.</div>}
            </section>
            <section className={`${kpanel} flex flex-col`}>
              <h2 className="mb-1 text-base font-extrabold">Tindak lanjut hari ini</h2>
              {toko.filter((t) => t.sinyal === "menurun" || t.sinyal === "baru").slice(0, 4).map((t) => <div key={t.id} className="flex items-center justify-between gap-2 border-t border-[#F3F4F6] py-2.5 first:border-0"><span><b className="text-sm">{t.nama}</b><br /><span className={`text-xs font-semibold ${t.sinyal === "menurun" ? "text-[#B45309]" : "text-[#4B5563]"}`}>{t.sinyal === "menurun" ? `Belanja turun · ${t.pasar}` : `Baru buka TokoPaja · belum kulakan · ${t.pasar}`}</span></span><a href="tel:0" aria-label={`Telepon ${t.nama}`} className="flex size-11 items-center justify-center rounded-full bg-[#E8F1EA] text-[#14532D]">📞</a></div>)}
            </section>
          </>
        );
      }}
    </KPage>
  );
}
