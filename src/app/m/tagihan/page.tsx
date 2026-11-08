"use client";

import { useState } from "react";
import { MPage, MKpi, mbtn, mchip, mgrid, panel } from "@/components/mitra-ui";
import { EWS, PROYEK, ajukanTermin, batasCair, catatBayar, ingatkan, jt, plg, ringkas } from "@/lib/mitra";

export default function Tagihan() {
  const [f, setF] = useState(1);
  const [done, setDone] = useState<string[]>([]);
  return (
    <MPage judul="Tagihan, escrow & serah terima" sub="VA/QRIS rekonsiliasi otomatis · 5 status peringatan dini">
      {({ s, staf }) => {
        const r = ringkas(s);
        const aktif = s.esptu.filter((e) => e.status !== "draf" && !e.lunas);
        const list = aktif.filter((e) => EWS[f].f(e.telat)).sort((a, b) => b.telat - a.telat).slice(0, 40);
        const tunggak = aktif.filter((e) => e.telat > 30);
        const saldo = r.kas - r.cair;
        const termin = Math.round(Math.max(0, batasCair(r.kas, r.progres) - r.cair));
        return (
          <>
            <section className={mgrid}>
              <MKpi l="Kas di escrow (kumulatif)" v={jt(r.kas)} s={`${Math.round((r.kas / r.nilai) * 100)}% dari nilai kontrak ${jt(r.nilai)}`} />
              <MKpi l="Dicairkan ke Mitra" v={jt(r.cair)} s={`saldo escrow ${jt(saldo)}`} />
              <MKpi l="Tertunggak > 30 hari" v={jt(tunggak.reduce((n, e) => n + e.harga * 0.05, 0))} s={`${tunggak.length} akun`} tone="text-[#7E231C]" />
              <MKpi l="Unit lunas" v={r.lunas} s={`target serah terima ${PROYEK.selesai}`} />
            </section>
            <section className={`${panel} flex flex-col gap-2`}>
              <h2 className="text-[15px] font-bold">Peringatan dini collection</h2>
              <div className="flex h-6 overflow-hidden rounded">{EWS.map((e) => { const n = aktif.filter((x) => e.f(x.telat)).length; return <div key={e.l} style={{ width: `${(n / Math.max(1, aktif.length)) * 100}%`, background: e.c }} />; })}</div>
              <div className="flex flex-wrap gap-1.5">{EWS.map((e, i) => <button key={e.l} onClick={() => setF(i)} className={mchip(f === i)}>{e.l} · {aktif.filter((x) => e.f(x.telat)).length}</button>)}</div>
              <div className="text-xs text-[#5B6168]">Tangga collection: H-3 pengingat otomatis · H+1 chat Collection · H+30 telepon · H+61 kunjungan & surat · H+90 rapat dengan Pasar Jaya.</div>
              {list.map((e) => (
                <div key={e.no} className="flex flex-wrap items-center gap-2 border-t border-[#EFECE4] py-2 text-[13px]">
                  <span className="min-w-0 flex-1"><b>{plg(s, e.pelangganId)?.nama}</b> · <span className="font-mono text-xs">{e.unit}</span><br /><span className="text-[#5B6168]">dibayar {jt(e.dibayar)} / {jt(e.harga)} · {e.telat ? `telat ${e.telat} hari` : "tepat waktu"} · {e.skema}</span></span>
                  {e.telat > 0 && <button disabled={done.includes(e.no)} onClick={() => { ingatkan(e.no, staf.nama); setDone([...done, e.no]); }} className="rounded-lg bg-[#DCEFEA] px-3 py-2 text-xs font-semibold text-[#0A5249] disabled:opacity-60">{done.includes(e.no) ? "Terkirim" : "Ingatkan via chat"}</button>}
                  <button onClick={() => catatBayar(e.no, Math.round(e.harga * 0.1 * 10) / 10, "VA Bank DKI", staf.nama)} className="rounded-lg border border-[#CFCABD] px-3 py-2 text-xs font-semibold">Catat bayar VA (10%)</button>
                </div>
              ))}
              {!list.length && <div className="text-[13px] text-[#5B6168]">Tidak ada akun di status ini.</div>}
            </section>
            <section className={`${panel} flex flex-col gap-2`}>
              <h2 className="text-[15px] font-bold">Escrow & termin pencairan</h2>
              <p className="text-xs text-[#5B6168]">Dana pedagang & bank masuk rekening escrow; dicairkan ke Mitra per termin sesuai progres fisik (laporan MK) dengan persetujuan Pasar Jaya. Batas kumulatif (contoh): kas masuk × (progres fisik + 10%) = {jt(batasCair(r.kas, r.progres))}.</p>
              {s.termin.map((t) => <div key={t.id} className="flex justify-between gap-2 border-t border-[#EFECE4] py-2 text-[13px]"><span>{t.ket} · {t.t}</span><b>{jt(t.jumlah)} · {t.status}</b></div>)}
              {(staf.peran === "keuangan" || staf.peran === "direksi") && termin > 0 && !s.termin.some((t) => t.status !== "cair") && <button onClick={() => ajukanTermin(`Termin ${s.termin.length + 1} · progres ${r.progres}%`, termin, staf.nama)} className={mbtn}>Ajukan termin {jt(termin)} ke Pasar Jaya</button>}
              {s.termin.some((t) => t.status !== "cair") && <div className="text-[12.5px] text-[#233C73]">Termin diajukan · menunggu persetujuan pengawas Pasar Jaya.</div>}
            </section>
            <section className={`${panel} flex flex-col gap-1.5`}>
              <h2 className="text-[15px] font-bold">Serah terima & serah kelola</h2>
              <div className="text-[13px] text-[#3A3F45]">Lunas → BAST → e-SHPTU & e-SIPTU unit baru (Pasar Jaya) → serah kelola → operasional Pasar Jaya · mulai {PROYEK.selesai}.</div>
              <div className="text-[13px]"><b>{r.lunas}</b> unit lunas siap BAST saat konstruksi selesai · {s.esptu.filter((e) => e.status === "sah" && !e.lunas).length} unit masih membayar.</div>
            </section>
          </>
        );
      }}
    </MPage>
  );
}
