"use client";

import { useState } from "react";
import { BoPage } from "@/components/bo";
import { EisHP } from "@/components/cc-ui";
import { DIREKSI, type Dir } from "@/lib/direksi";

export default function EisDirektorat() {
  const [kode, setKode] = useState<Dir>("dirut");
  return (
    <BoPage judul="EIS 5 Direktur">
      {({ staf }) => (
        <>
          <div className="text-[12.5px] text-muted">Struktur SK Direksi 172/2022. Keputusan yang diambil di sini sama dengan EIS di aplikasi Command Center Paja (HP Direksi & War Room).</div>
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none]">
            {DIREKSI.map((d) => <button key={d.kode} onClick={() => setKode(d.kode)} aria-pressed={kode === d.kode} className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${kode === d.kode ? "bg-[#0F2A20] text-white" : "border border-line bg-white"}`}>{d.role.replace("Direktur ", "Dir. ")}</button>)}
          </div>
          <div className="mx-auto w-full max-w-[480px] rounded-2xl bg-[#0B1620] p-4">
            <EisHP key={kode} kode={kode} siapa={staf.nama} />
          </div>
        </>
      )}
    </BoPage>
  );
}
