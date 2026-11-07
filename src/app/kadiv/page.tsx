"use client";

import { Guard, StafHeader, card, Tile, Empty, Bar } from "@/components/ui";
import { useData, stafById, statistik, pct, putuskanEskalasi } from "@/lib/store";

// Pasar selain Johar Baru: rencana gelombang (ilustrasi, belum ada data).
const RENCANA: [string, number, string][] = [["Pasar Cempaka Putih", 312, "gelombang 1 · Jan 2027"], ["Pasar Paseban", 287, "gelombang 1 · Feb 2027"], ["Pasar Senen Blok III", 540, "gelombang 2 · Mar 2027"]];

function Kadiv() {
  const s = useData();
  const me = stafById(s.sesi!.userId)!;
  const st = statistik(s);
  const p = pct(st.terbitSh, st.total);
  const esk = s.anomali.filter((a) => a.status === "eskalasi" || (a.keputusan && a.status === "selesai"));
  return (
    <div className="flex min-h-dvh flex-col">
      <StafHeader jabatan={`L2 · ${me.jabatan} · ${me.nama}`} judul="Migrasi Wilayah I" />
      <main className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          <Tile l="Pasar di wilayah" v={1 + RENCANA.length} s="1 pilot berjalan" />
          <Tile l="e-SHPTU terbit" v={st.terbitSh} s={`${p}% pilot · target ≥80%`} tone={p >= 80 ? "text-[#2F6B4F]" : "text-[#9A5B0E]"} />
        </div>
        <h2 className="pt-1 text-[15px] font-bold">Progres per pasar</h2>
        <div className={`${card} flex flex-col gap-1.5 px-3 py-2.5`}>
          <div className="flex justify-between gap-2"><span className="text-sm font-semibold">Pasar Johar Baru</span><span className="font-mono text-xs">{st.total} TU</span></div>
          <Bar value={p} tone={p >= 80 ? "bg-pj" : "bg-[#C8781E]"} />
          <div className="flex justify-between text-[11.5px] text-muted"><span>pilot · data aplikasi</span><span>{p}% e-SHPTU</span></div>
        </div>
        {RENCANA.map(([n, tu, k]) => (
          <div key={n} className={`${card} flex flex-col gap-1.5 px-3 py-2.5 opacity-80`}>
            <div className="flex justify-between gap-2"><span className="text-sm font-semibold">{n}</span><span className="font-mono text-xs">{tu} TU</span></div>
            <div className="flex justify-between text-[11.5px] text-muted"><span>{k}</span><span>rencana</span></div>
          </div>
        ))}
        <h2 className="pt-1 text-[15px] font-bold">Eskalasi dari Manager Area</h2>
        {esk.length ? esk.map((a) => (
          <div key={a.id} className="flex flex-col gap-2 rounded-[10px] bg-[#F7E3E0] px-3 py-3 text-sm">
            <div><b className="font-mono text-[13px]">{a.tuId}</b> · {a.jenis}<br /><span className="text-xs text-[#7A2E24]">{a.temuan} · umur {a.umur} hari</span></div>
            {a.keputusan ? <div className="rounded-lg bg-white/70 px-2.5 py-2 text-[13px] font-semibold">✓ {a.keputusan}</div> : (
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => putuskanEskalasi(a.id, "Ditangani Kadiv · klarifikasi minggu ini", me.jabatan)} className="min-h-11 rounded-lg bg-pj px-2 text-[12.5px] font-semibold text-white">Tangani di Kadiv</button>
                <button onClick={() => putuskanEskalasi(a.id, "Teruskan ke Direksi", me.jabatan)} className="min-h-11 rounded-lg border border-line-2 bg-white px-2 text-[12.5px] font-semibold">Teruskan ke Direksi</button>
              </div>
            )}
          </div>
        )) : <Empty>Belum ada eskalasi dari Manager Area.</Empty>}
      </main>
    </div>
  );
}

export default function Page() {
  return <Guard peran="kadiv"><Kadiv /></Guard>;
}
