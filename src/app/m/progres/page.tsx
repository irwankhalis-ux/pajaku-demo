"use client";

import { useState } from "react";
import { MPage, mbtn, panel } from "@/components/mitra-ui";
import { PROYEK, kirimProgres } from "@/lib/mitra";

const RENCANA = [0, 6, 14, 22, 30, 38, 46, 53, 60, 66, 72, 78, 83, 88, 92, 95, 97, 99, 100];
const PEKERJAAN = [["Persiapan & pondasi", 100, "Jun – Sep 2026"], ["Struktur", 60, "Sep 2026 – Feb 2027"], ["Atap & MEP", 0, "Mar – Jun 2027"], ["Finishing & fasad", 0, "Jul – Nov 2027"], ["Uji fungsi & BAST", 0, "Des 2027 · serah kelola ke Pasar Jaya"]] as const;

export default function Progres() {
  const [persen, setPersen] = useState("");
  const [cat, setCat] = useState("");
  const [foto, setFoto] = useState(false);
  return (
    <MPage judul="Progres konstruksi" sub={`${PROYEK.mulai} – ${PROYEK.selesai} · update bulanan ke semua pemesan lewat PaJaKu`}>
      {({ s, staf }) => {
        const real = [0, 5, 12, 20, 28, ...s.progres.slice().reverse().filter((p) => p.persen > 28).map((p) => p.persen)];
        const px = (i: number) => (i * 340) / 18, py = (v: number) => 150 - v * 1.4;
        const pts = (a: number[]) => a.map((v, i) => `${px(i)},${py(v)}`).join(" ");
        const now = s.progres[0].persen;
        return (
          <>
            <section className={panel}>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-[15px] font-bold">Kurva S</h2><span className="text-[13px]">Realisasi <b>{now}%</b> · rencana <b>{s.rencana}%</b> · SPI <b>{(now / s.rencana).toFixed(2).replace(".", ",")}</b></span></div>
              <svg viewBox="-4 -4 350 160" className="mt-2 w-full" role="img" aria-label={`Kurva S: realisasi ${now}%, rencana ${s.rencana}%`}>
                {[0, 25, 50, 75, 100].map((v) => <line key={v} x1="0" x2="340" y1={py(v)} y2={py(v)} stroke="#EFECE4" />)}
                <polyline points={pts(RENCANA)} fill="none" stroke="#CFCABD" strokeWidth="2" strokeDasharray="5 4" />
                <polyline points={pts(real)} fill="none" stroke="#0E6E63" strokeWidth="3" />
              </svg>
              <div className="flex gap-4 text-xs text-[#5B6168]"><span>— realisasi</span><span>- - rencana</span><span>Jun 2026 → Des 2027</span></div>
            </section>
            <section className={`${panel} flex flex-col gap-2`}>
              {PEKERJAAN.map(([t, p, d]) => <div key={t} className="grid grid-cols-[1fr_auto] gap-x-2 text-[13px]"><b>{t}</b><span>{t === "Struktur" ? Math.min(100, Math.round(((now - 20) / 27) * 100)) : p}%</span><span className="col-span-2 text-xs text-[#5B6168]">{d}</span></div>)}
            </section>
            {staf.peran !== "pj" && (
              <form onSubmit={(e) => { e.preventDefault(); const v = +persen; if (v > now && v <= 100 && cat.trim()) { kirimProgres(v, cat.trim(), staf.nama); setPersen(""); setCat(""); setFoto(false); } }} className={`${panel} flex flex-col gap-2`}>
                <h2 className="text-[15px] font-bold">Kirim update progres bulanan</h2>
                <input aria-label="Persen progres" inputMode="numeric" value={persen} onChange={(e) => setPersen(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder={`Progres fisik % (sekarang ${now}%)`} className="min-h-11 rounded-lg border border-[#CFCABD] px-3" />
                <textarea aria-label="Catatan" rows={2} value={cat} onChange={(e) => setCat(e.target.value)} placeholder="Catatan untuk pedagang, mis. pengecoran pelat lantai 3 Blok A–C" className="rounded-lg border border-[#CFCABD] p-3 text-sm" />
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#0E6E63]"><input type="file" accept="image/*" multiple className="sr-only" onChange={() => setFoto(true)} />📷 {foto ? "Foto terlampir" : "Lampirkan foto lapangan"}</label>
                <button disabled={!(+persen > now) || !cat.trim()} className={mbtn}>Kirim ke {s.esptu.length} pemesan & EIS</button>
              </form>
            )}
            <section className={`${panel} flex flex-col`}>
              <h2 className="mb-1 text-[15px] font-bold">Riwayat update</h2>
              {s.progres.map((p, i) => <div key={i} className="border-t border-[#EFECE4] py-2 text-[13px] first:border-0"><b>{p.t} · {p.persen}%</b> — {p.catatan} <span className="text-xs text-[#5B6168]">({p.oleh})</span></div>)}
            </section>
          </>
        );
      }}
    </MPage>
  );
}
