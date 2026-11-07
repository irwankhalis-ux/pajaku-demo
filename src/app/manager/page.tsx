"use client";

import { Guard, StafHeader, card, Tile, Empty, Bar } from "@/components/ui";
import { useData, stafById, statistik, pct, anomaliSelesai, eskalasi } from "@/lib/store";

function Manager() {
  const s = useData();
  const me = stafById(s.sesi!.userId)!;
  const st = statistik(s);
  const anom = s.anomali.filter((a) => a.status !== "selesai").sort((a, b) => b.umur - a.umur);
  const blok = ["A", "B", "C"].map((b) => {
    const t = s.tu.filter((x) => x.blok === b);
    return [b, t.length, t.filter((x) => x.status === "terbit").length] as const;
  });
  const petugas = Object.entries(s.log.filter((l) => l.apa.startsWith("pendataan")).reduce<Record<string, number>>((m, l) => ({ ...m, [l.siapa]: (m[l.siapa] ?? 0) + 1 }), {}));
  return (
    <div className="flex min-h-dvh flex-col">
      <StafHeader jabatan={`L3 · ${me.jabatan} · ${me.nama}`} judul="Area Johar Baru &amp; sekitarnya" />
      <main className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          <Tile l="Didata lapangan" v={st.didata} s={`${pct(st.didata, st.total)}% dari ${st.total} TU`} />
          <Tile l="Divalidasi" v={st.divalidasi} s={`${pct(st.divalidasi, st.total)}% · Kepala Pasar`} />
        </div>
        <section className={`${card} flex flex-col gap-2.5 p-3.5`}>
          <h2 className="text-[15px] font-bold">Dokumen terbit per blok</h2>
          {blok.map(([b, n, t]) => <div key={b} className="flex flex-col gap-1"><div className="flex justify-between text-[13px]"><span>Blok {b}</span><span className="font-mono">{t}/{n} · {pct(t, n)}%</span></div><Bar value={pct(t, n)} tone={pct(t, n) >= 80 ? "bg-pj" : "bg-[#C8781E]"} /></div>)}
        </section>
        <h2 className="pt-1 text-[15px] font-bold">Anomali terbuka · {anom.length}</h2>
        {anom.length ? anom.map((a) => (
          <div key={a.id} className={`${card} flex flex-col gap-2 px-3 py-2.5`}>
            <div className="flex justify-between gap-2"><span className="font-mono text-[13px] font-medium">{a.tuId}</span><span className="shrink-0 rounded-md bg-[#FBEFD9] px-2 py-0.5 text-[11px] font-bold text-[#6E4A12]">{a.umur} hari</span></div>
            <div className="text-[13px]"><b>{a.jenis}</b><br /><span className="text-xs text-muted">{a.temuan} · PIC {a.pic}</span></div>
            {a.status === "eskalasi" ? <div className="text-xs font-semibold text-[#7A2E24]">↑ Dieskalasi ke Kadiv{a.keputusan ? ` · ${a.keputusan}` : ""}</div> : (
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => anomaliSelesai(a.id, me.jabatan)} className="min-h-10 rounded-lg border border-pj bg-white text-[12.5px] font-semibold text-pj">Tandai selesai</button>
                <button onClick={() => eskalasi(a.id, me.jabatan)} className="min-h-10 rounded-lg bg-[#7A2E24] text-[12.5px] font-semibold text-white">Eskalasi ke Kadiv</button>
              </div>
            )}
          </div>
        )) : <Empty>✓ Tidak ada anomali terbuka.</Empty>}
        <section className={`${card} p-3.5`}>
          <h2 className="mb-1.5 text-[15px] font-bold">Pendataan dari aplikasi</h2>
          {petugas.length ? petugas.map(([n, c]) => <div key={n} className="flex justify-between py-1 text-[13px]"><span>{n}</span><b>{c} TU</b></div>) : <p className="text-[13px] text-muted">Belum ada pendataan terkirim dari aplikasi pada data ini.</p>}
        </section>
      </main>
    </div>
  );
}

export default function Page() {
  return <Guard peran="manager"><Manager /></Guard>;
}
