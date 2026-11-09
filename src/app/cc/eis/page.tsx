"use client";

import { useRouter } from "next/navigation";
import { CCPage, EisHP } from "@/components/cc-ui";
import { WithQ } from "@/components/kit";
import { DIREKSI, type Dir } from "@/lib/direksi";

const KODE: Record<string, Dir> = { dirut: "dirut", keuangan: "keuangan", properti: "properti", perkulakan: "perkulakan", adum: "adum" };

export default function EisDirektur() {
  const router = useRouter();
  return (
    <WithQ>{(q) => (
      <CCPage>
        {({ staf }) => {
          const milik = KODE[staf.peran];
          // Direktur Utama dapat membuka EIS direktorat lain; direktur lain melihat EIS-nya sendiri.
          const kode = (staf.peran === "dirut" && KODE[q("d")]) || milik || "dirut";
          return (
            <>
              {staf.peran === "dirut" && (
                <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none]">
                  {DIREKSI.map((d) => <button key={d.kode} onClick={() => router.replace(`/cc/eis/?d=${d.kode}`)} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${d.kode === kode ? "bg-[#E6EDF2] text-[#0B1620]" : "border border-[#3A5060] text-[#C9D5DE]"}`}>{d.role.replace("Direktur ", "Dir. ")}</button>)}
                </div>
              )}
              <EisHP key={kode} kode={kode} siapa={staf.nama} />
            </>
          );
        }}
      </CCPage>
    )}</WithQ>
  );
}
