"use client";

import { useState } from "react";
import { BoPage, panel } from "@/components/bo";
import { btn, btn2 } from "@/components/kit";
import { HARGA_TPID, rpx } from "@/lib/direksi";
import { PETA_HARGA, kirimHargaTPID } from "@/lib/store";

const PASAR = "Pasar Johar Baru";
const AO = "AO-JP-02";
/** Median pasar sekitar (Jakarta Pusat) sebagai pembanding validasi otomatis. */
const ACUAN = Object.fromEntries(HARGA_TPID.map(([k, h]) => [k, Math.round((h * 1.01) / 100) * 100]));
const median3 = (a: number[]) => [...a].sort((x, y) => x - y)[1];

export default function InputTPID() {
  const [isi, setIsi] = useState<Record<string, [string, string, string]>>({});
  const [foto, setFoto] = useState<Record<string, boolean>>({});
  const [kirim, setKirim] = useState("");
  return (
    <BoPage judul="Input harga TPID">
      {({ s, staf }) => {
        const baris = HARGA_TPID.map(([k]) => {
          const v = (isi[k] ?? ["", "", ""]).map((x) => Number(x) || 0) as [number, number, number];
          const lengkap = v.every((x) => x > 0);
          const med = lengkap ? median3(v) : 0;
          const dev = lengkap ? (med - ACUAN[k]) / ACUAN[k] : 0;
          return { k, v, lengkap, med, dev, tanda: lengkap && Math.abs(dev) > 0.25 };
        });
        const siap = baris.filter((b) => b.lengkap).length;
        const riwayat = s.tpid ?? [];
        const contoh = () => {
          const n: Record<string, [string, string, string]> = {};
          HARGA_TPID.forEach(([k], i) => { const a = ACUAN[k]; n[k] = [a - 500 * (i % 3), a, a + 500 * ((i + 1) % 3)].map((x) => String(Math.max(100, x))) as [string, string, string]; });
          setIsi(n); setFoto(Object.fromEntries(HARGA_TPID.map(([k]) => [k, true])));
        };
        if (kirim) {
          const e = riwayat.find((r) => r.id === kirim);
          return (
            <section className={`${panel} flex flex-col gap-2`}>
              <div className="text-[18px] font-bold">Harga terkirim ✓</div>
              <div className="text-[13.5px]">{e?.baris.length} komoditas dari {PASAR} masuk antrean validasi pukul {e?.t}. Data diteruskan ke <b>War Room Direksi (layar 2)</b> dan <b>Command Center Gubernur</b> pukul 10.30 WIB.</div>
              {!!e?.baris.filter((b) => b.tanda).length && <div className="rounded-lg bg-[#FBEFD9] p-2.5 text-[13px] text-[#6E4A12]">{e.baris.filter((b) => b.tanda).length} entri menyimpang &gt;25% dari median pasar sekitar dan menunggu verifikasi Kepala Pasar.</div>}
              <div className="text-[12.5px] text-muted">Harga harian pasar di TokoPaja ikut diperbarui untuk: {e?.baris.filter((b) => !b.tanda && PETA_HARGA[b.komoditas]).map((b) => PETA_HARGA[b.komoditas]).join(", ") || "—"}.</div>
              <button onClick={() => { setKirim(""); setIsi({}); setFoto({}); }} className={btn2}>Input lagi</button>
            </section>
          );
        }
        return (
          <>
            <section className={`${panel} flex flex-col gap-1`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><div className="text-[16px] font-bold">{PASAR} · {AO}</div><span className="rounded-md bg-[#FBEFD9] px-2 py-0.5 text-[11.5px] text-[#6E4A12]">Data contoh</span></div>
              <div className="text-[13px] text-muted">Juru tagih/AO mengisi 14 komoditas TPID dari 3 pedagang responden, 07.00–10.00, sambil menjalankan rute penagihan. Harga yang menyimpang &gt;25% dari median pasar sekitar ditandai untuk diverifikasi Kepala Pasar.</div>
              <div className="mt-1 text-[12.5px]">Pengisi: <b>{staf.nama}</b> · terisi lengkap <b>{siap}/14</b></div>
              <button onClick={contoh} className="self-start text-[13px] font-semibold text-pj underline">Isi contoh harga</button>
            </section>
            <section className={`${panel} flex flex-col gap-0`}>
              <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,72px)] gap-1.5 pb-1 text-[11.5px] text-muted md:grid-cols-[minmax(0,1fr)_repeat(3,96px)_70px]"><span>Komoditas · median sekitar</span><span>Resp. 1</span><span>Resp. 2</span><span>Resp. 3</span><span className="hidden md:block">Foto</span></div>
              {baris.map((b) => (
                <div key={b.k} className={`grid grid-cols-[minmax(0,1fr)_repeat(3,72px)] items-center gap-1.5 border-t border-line py-1.5 md:grid-cols-[minmax(0,1fr)_repeat(3,96px)_70px] ${b.tanda ? "bg-[#FDF3E3]" : ""}`}>
                  <div className="min-w-0 text-[13px]"><div className="font-semibold">{b.k}</div><div className="text-[11.5px] text-muted">{rpx(ACUAN[b.k])}{b.lengkap && <> · median <b className={b.tanda ? "text-[#A3361C]" : "text-ink"}>{rpx(b.med)}</b>{b.tanda && ` (${b.dev > 0 ? "+" : ""}${Math.round(b.dev * 100)}%)`}</>}</div></div>
                  {[0, 1, 2].map((i) => <input key={i} aria-label={`${b.k} responden ${i + 1}`} inputMode="numeric" value={(isi[b.k] ?? ["", "", ""])[i]} onChange={(e) => { const cur = [...(isi[b.k] ?? ["", "", ""])] as [string, string, string]; cur[i] = e.target.value.replace(/\D/g, ""); setIsi({ ...isi, [b.k]: cur }); }} className="min-h-10 w-full rounded-lg border border-line bg-white px-1.5 text-right font-mono text-[13px]" />)}
                  <button onClick={() => setFoto({ ...foto, [b.k]: !foto[b.k] })} aria-pressed={!!foto[b.k]} className={`col-span-4 mt-1 rounded-md text-[11.5px] md:col-span-1 md:mt-0 ${foto[b.k] ? "bg-[#E3F1EA] font-semibold text-pj" : "border border-line text-muted"} min-h-8`}>{foto[b.k] ? "Foto ✓" : "+ Foto"}</button>
                </div>
              ))}
            </section>
            <button disabled={siap < 14} onClick={() => setKirim(kirimHargaTPID(PASAR, baris.map((b) => ({ komoditas: b.k, harga: b.v, median: b.med, acuan: ACUAN[b.k], tanda: b.tanda, foto: !!foto[b.k] })), staf.nama))} className={btn}>{siap < 14 ? `Lengkapi ${14 - siap} komoditas lagi` : "Kirim ke War Room & Command Center"}</button>
            {riwayat.length > 0 && (
              <section className={`${panel} flex flex-col gap-1.5`}>
                <div className="text-[14px] font-bold">Riwayat kiriman</div>
                {riwayat.slice(0, 6).map((r) => <div key={r.id} className="flex justify-between gap-2 border-t border-line pt-1.5 text-[12.5px]"><span>{r.tgl} {r.t} · {r.pasar} · {r.oleh}</span><span className={r.baris.some((b) => b.tanda) ? "text-[#A3361C]" : "text-pj"}>{r.baris.filter((b) => b.tanda).length ? `${r.baris.filter((b) => b.tanda).length} ditandai` : "valid"}</span></div>)}
              </section>
            )}
          </>
        );
      }}
    </BoPage>
  );
}
