"use client";

import { useState } from "react";
import { MPage, mchip, panel } from "@/components/mitra-ui";
import { BANK, KREDIT_TAHAP, jt, majukanKredit, plg, rp } from "@/lib/mitra";

export default function Kredit() {
  const [b, setB] = useState(0);
  const [harga, setHarga] = useState(112);
  const [dp, setDp] = useState(20);
  const [tenor, setTenor] = useState(60);
  return (
    <MPage judul="Pembiayaan bank" sub="Kredit kios dengan agunan hak di e-SPTU · pencairan bertahap 30/40/30 ke escrow">
      {({ s, staf }) => {
        const bank = BANK[b];
        const d = Math.max(dp, bank.dpMin), t = Math.min(tenor, bank.maxT);
        const plafon = harga * (1 - d / 100), r = bank.rate / 100 / 12;
        const ang = (plafon * 1e6 * r) / (1 - Math.pow(1 + r, -t));
        return (
          <>
            <section className={`${panel} flex flex-col gap-2.5`}>
              <h2 className="text-[15px] font-bold">Simulasi angsuran (untuk dibagikan ke pedagang)</h2>
              <div className="flex flex-wrap gap-1.5">{BANK.map((x, i) => <button key={x.nama} onClick={() => setB(i)} className={mchip(b === i)}>{x.nama} · {String(x.rate).replace(".", ",")}%</button>)}</div>
              <div className="flex flex-wrap gap-1.5">{[[64, "Kios 4 m² eksisting"], [112, "Kios 4 m² Biru"], [456, "Toko 12 m² Biru"]].map(([v, l]) => <button key={v} onClick={() => setHarga(v as number)} className={mchip(harga === v)}>{l} · Rp{v} jt</button>)}</div>
              <div className="flex flex-wrap gap-1.5">{[20, 25, 30, 40].map((v) => <button key={v} onClick={() => setDp(v)} className={mchip(d === v)}>DP {v}%</button>)}{[24, 36, 48, 60, 84].map((v) => <button key={v} onClick={() => setTenor(v)} className={mchip(t === v)} disabled={v > bank.maxT}>{v} bln</button>)}</div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{[["Uang muka", jt(harga * d / 100)], ["Plafon bank", jt(plafon)], ["Angsuran / bulan", rp(ang)], [`Total bunga ${t} bln`, jt((ang * t) / 1e6 - plafon)]].map(([l, v], i) => <div key={l} className={`rounded-xl p-3 ${i === 2 ? "bg-[#12302B] text-white" : "bg-[#F4F2EC]"}`}><div className={`text-xs ${i === 2 ? "text-[#A7C3BC]" : "text-[#5B6168]"}`}>{l}</div><div className="text-lg font-extrabold">{v}</div></div>)}</div>
              <div className="text-[11.5px] text-[#5B6168]">Suku bunga & syarat contoh · SLA analisa {bank.sla} hari · DP minimum {bank.dpMin}% · tenor maks {bank.maxT} bln</div>
            </section>
            <section className={`${panel} flex flex-col`}>
              <h2 className="mb-1 text-[15px] font-bold">Aplikasi kredit ({s.kredit.length})</h2>
              {s.kredit.map((k) => {
                const sla = BANK.find((x) => x.nama === k.bank)?.sla ?? 14;
                return (
                  <div key={k.id} className="flex flex-col gap-1.5 border-t border-[#EFECE4] py-2.5 text-[13px] first:border-0">
                    <div className="flex flex-wrap justify-between gap-2"><span><b>{plg(s, k.pelangganId)?.nama}</b> · <span className="font-mono text-xs">{k.id} · {k.unit}</span></span><span>{k.bank} · plafon {jt(k.plafon)}</span></div>
                    <div className="grid grid-cols-6 gap-1">{KREDIT_TAHAP.map((t2, i) => <div key={t2} title={t2} className={`h-2 rounded ${i < k.tahap ? "bg-[#0E6E63]" : i === k.tahap ? (k.umur > sla ? "bg-[#A8322A]" : "bg-[#B85C12]") : "bg-[#E2DED4]"}`} />)}</div>
                    <div className="flex flex-wrap items-center justify-between gap-2"><span className={k.umur > sla ? "text-[#7E231C]" : "text-[#3A3F45]"}>{KREDIT_TAHAP[k.tahap]} · {k.catatan} · {k.umur} hari{k.umur > sla ? " (lewat SLA)" : ""}</span>{k.tahap < 5 && staf.peran !== "pj" && <button onClick={() => majukanKredit(k.id, staf.nama)} className="rounded-lg bg-[#DCEFEA] px-3 py-1.5 text-xs font-semibold text-[#0A5249]">→ {KREDIT_TAHAP[k.tahap + 1]}</button>}</div>
                  </div>
                );
              })}
            </section>
            <section className="grid gap-2.5 md:grid-cols-2">
              {[["Verifikasi e-SHPTU di portal", "Bank memeriksa keaslian e-SHPTU (TTE + QR) dan status unit tanpa surat-menyurat."], ["Agunan tercatat sejak e-SPTU", "Selama konstruksi hak atas unit di e-SPTU jadi agunan; setelah serah terima pindah ke e-SHPTU unit baru."], ["Riwayat bayar pedagang lama", "Rekam jejak BPP & buka/tutup kios di PaJaKu memperkuat penilaian."], ["Pencairan bertahap ke escrow", "30% / 40% / 30% mengikuti progres konstruksi dari laporan MK; tahap akhir saat BAST."]].map(([a, b2]) => <div key={a} className={`${panel} text-[13px]`}><b>{a}</b><div className="text-[#5B6168]">{b2}</div></div>)}
            </section>
          </>
        );
      }}
    </MPage>
  );
}
