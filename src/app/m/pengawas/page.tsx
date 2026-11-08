"use client";

import { LogoPJ, MKpi, MPage, Tag, mgrid, panel } from "@/components/mitra-ui";
import { PROYEK, jt, majukanESPTU, plg, ringkas, sahkanUndian, setujuiTermin } from "@/lib/mitra";

export default function Pengawas() {
  return (
    <MPage judul="Pengawas Perumda Pasar Jaya" sub="Persetujuan sebagai pemilik pasar · data proyek dibaca langsung dari konsol Mitra">
      {({ s, staf }) => {
        const r = ringkas(s);
        const pj = staf.peran === "pj";
        const und = s.undian.filter((u) => u.status === "diimpor");
        const tte = s.esptu.filter((e) => e.status === "tte-pj");
        const ter = s.termin.filter((t) => t.status !== "cair");
        return (
          <>
            <div className="flex items-center gap-3 rounded-[14px] bg-white p-3 ring-1 ring-[#E2DED4]"><LogoPJ className="h-10" /><div className="text-[13px] text-[#3A3F45]"><b>{PROYEK.nama}</b> · {PROYEK.mitra}<br />Kios eksisting harga dikunci · serah kelola ke Pasar Jaya {PROYEK.selesai}</div></div>
            {!pj && <div className="rounded-lg bg-[#FBE8D2] px-3 py-2 text-[13px] text-[#7A3E0B]">Mode baca. Persetujuan hanya bisa dilakukan akun Pengawas Pasar Jaya.</div>}
            <section className={mgrid}>
              <MKpi l="Pemilik eksisting ber-e-SPTU" v={`${r.eks}/401`} s="hak pedagang lama" />
              <MKpi l="e-SPTU menunggu TTE" v={tte.length} />
              <MKpi l="Saldo escrow" v={jt(r.kas - r.cair)} s={`cair ke Mitra ${jt(r.cair)}`} />
              <MKpi l="Progres fisik" v={`${r.progres}%`} s={`rencana ${s.rencana}%`} />
            </section>
            <section className={`${panel} flex flex-col gap-2`}>
              <h2 className="text-[15px] font-bold">1 · Pengesahan hasil undian ({und.length})</h2>
              {und.map((u) => <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#F4F2EC] p-3 text-[13px]"><span><b>{u.zona}</b> · {u.peserta} pemenang · disaksikan notaris</span>{pj && <button onClick={() => sahkanUndian(u.id, staf.nama)} className="rounded-lg bg-[#0E6E63] px-3 py-2 text-xs font-semibold text-white">Sahkan & terbitkan e-SPTU</button>}</div>)}
              {!und.length && <div className="text-[13px] text-[#5B6168]">Tidak ada hasil undian yang menunggu.</div>}
            </section>
            <section className={`${panel} flex flex-col gap-2`}>
              <h2 className="text-[15px] font-bold">2 · TTE e-SPTU ({tte.length})</h2>
              {tte.slice(0, 20).map((e) => <div key={e.no} className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EFECE4] py-2 text-[13px] first:border-0"><span><b className="font-mono text-xs">{e.no}</b><br />{plg(s, e.pelangganId)?.nama} · {e.unit} · {jt(e.harga)}</span>{pj && <button onClick={() => majukanESPTU(e.no, staf.nama)} className="rounded-lg bg-[#0E6E63] px-3 py-2 text-xs font-semibold text-white">TTE Pasar Jaya</button>}</div>)}
              {pj && tte.length > 1 && <button onClick={() => tte.forEach((e) => majukanESPTU(e.no, staf.nama))} className="self-start rounded-lg bg-[#12302B] px-3 py-2 text-xs font-semibold text-white">TTE semua ({tte.length})</button>}
              {!tte.length && <div className="text-[13px] text-[#5B6168]">Tidak ada antrean.</div>}
            </section>
            <section className={`${panel} flex flex-col gap-2`}>
              <h2 className="text-[15px] font-bold">3 · Termin pencairan escrow</h2>
              {s.termin.map((t) => <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EFECE4] py-2 text-[13px] first:border-0"><span>{t.ket} · <b>{jt(t.jumlah)}</b></span>{t.status === "cair" ? <Tag tone="bg-[#DCEFEA] text-[#0A5249]">cair</Tag> : pj ? <button onClick={() => setujuiTermin(t.id, staf.nama)} className="rounded-lg bg-[#0E6E63] px-3 py-2 text-xs font-semibold text-white">{t.status === "diajukan" ? "Setujui (cek laporan MK)" : "Konfirmasi cair dari bank escrow"}</button> : <Tag tone="bg-[#E1E8F6] text-[#233C73]">{t.status}</Tag>}</div>)}
              {!ter.length && <div className="text-xs text-[#5B6168]">Tidak ada termin yang menunggu.</div>}
            </section>
          </>
        );
      }}
    </MPage>
  );
}
