"use client";

import { useState } from "react";
import { MPage, Tag, mchip, panel } from "@/components/mitra-ui";
import { LANTAI, jt, ubahHarga } from "@/lib/mitra";

export default function Inventori() {
  const [edit, setEdit] = useState<Record<string, string>>({});
  const [f, setF] = useState("semua");
  return (
    <MPage judul="Inventori unit & daftar harga" sub="Harga eksisting dikunci Pasar Jaya · Gold & Biru kebijakan Mitra">
      {({ s, staf }) => {
        const boleh = staf.peran === "salesmgr" || staf.peran === "direksi" || staf.peran === "keuangan";
        const rows = Object.keys(LANTAI).map((fk) => {
          const us = s.units.filter((u) => u.fk === fk);
          const c = (st: string, j?: string) => us.filter((u) => u.status === st && (!j || u.alokasi === j)).length;
          return { fk, us, terjual: c("terjual") + c("dipesan"), tersedia: c("tersedia"), alokasi: c("alokasi"), ditahan: c("ditahan"), gold: c("tersedia", "gold"), biru: c("tersedia", "biru") };
        });
        return (
          <>
            <section className="grid gap-3 md:grid-cols-2">
              {rows.map((r) => (
                <div key={r.fk} className={`${panel} flex flex-col gap-2`}>
                  <div className="flex justify-between"><b>{LANTAI[r.fk].nama}</b><Tag tone="bg-[#EFECE4] text-[#3A3F45]">zona {LANTAI[r.fk].zona}</Tag></div>
                  <div className="text-[12.5px] text-[#5B6168]">{r.us.length} unit · {LANTAI[r.fk].m2} m² standar{r.fk === "D" ? " · 10 toko 12 m²" : ""}</div>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[11.5px]">{[["Terjual", r.terjual], ["Alokasi eks.", r.alokasi], ["Gold sisa", r.gold + r.ditahan], ["Biru sisa", r.biru]].map(([l, v]) => <div key={l} className="rounded-lg bg-[#F4F2EC] py-1.5"><b className="block text-[15px]">{v}</b>{l}</div>)}</div>
                  <div className="grid grid-cols-3 gap-2 text-[12.5px]">
                    {(["Eksisting", "Gold", "Biru"] as const).map((l, i) => (
                      <label key={l} className="flex flex-col gap-1"><span className="text-[#5B6168]">{l} · /m²</span>
                        {i === 0 || !boleh ? <span className="min-h-10 rounded-lg bg-[#F4F2EC] px-2 py-2 font-mono">Rp{s.harga[r.fk][i]} jt{i === 0 ? " 🔒" : ""}</span>
                          : <span className="flex gap-1"><input inputMode="decimal" aria-label={`Harga ${l} ${r.fk}`} value={edit[r.fk + i] ?? String(s.harga[r.fk][i])} onChange={(e) => setEdit({ ...edit, [r.fk + i]: e.target.value.replace(/[^\d.]/g, "") })} className="min-h-10 w-full min-w-0 rounded-lg border border-[#CFCABD] px-2 font-mono" />
                            {edit[r.fk + i] && +edit[r.fk + i] !== s.harga[r.fk][i] && <button onClick={() => { ubahHarga(r.fk, i as 1 | 2, +edit[r.fk + i], staf.nama); setEdit({ ...edit, [r.fk + i]: "" }); }} className="rounded-lg bg-[#0E6E63] px-2 text-xs font-semibold text-white">OK</button>}</span>}
                        <span className="text-[11px] text-[#5B6168]">kios {LANTAI[r.fk].m2} m² = {jt(s.harga[r.fk][i] * LANTAI[r.fk].m2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </section>
            {!boleh && <p className="text-xs text-[#5B6168]">Perubahan harga Gold & Biru hanya oleh Sales Manager, Keuangan, atau Direksi Mitra.</p>}
            <section className={panel}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h2 className="text-[15px] font-bold">Unit tersedia untuk dijual</h2><div className="flex gap-1.5">{["semua", "gold", "biru"].map((x) => <button key={x} onClick={() => setF(x)} className={mchip(f === x)}>{x === "semua" ? "Semua" : x === "gold" ? "Gold" : "Biru"}</button>)}</div></div>
              <div className="flex flex-wrap gap-1.5">{s.units.filter((u) => u.status === "tersedia" && (f === "semua" ? u.alokasi !== "eks" : u.alokasi === f)).slice(0, 80).map((u) => <a key={u.code} href={`/m/pesanan/?unit=${u.code}`} className={`rounded-md px-2 py-1 font-mono text-[11px] ${u.alokasi === "gold" ? "bg-[#FBF3D9] text-[#4A3A05]" : "bg-[#E1E8F6] text-[#233C73]"}`}>{u.code.slice(4)}</a>)}</div>
            </section>
          </>
        );
      }}
    </MPage>
  );
}
