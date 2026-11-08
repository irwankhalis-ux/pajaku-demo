"use client";

import { MPage, panel } from "@/components/mitra-ui";
import { resetM } from "@/lib/mitra";
import { useRouter } from "next/navigation";

export default function Audit() {
  const router = useRouter();
  return (
    <MPage judul="Audit" sub="Jejak semua aksi tim Mitra & Pasar Jaya">
      {({ s }) => (
        <>
          <section className={`${panel} flex flex-col`}>{s.log.slice(0, 120).map((l, i) => <div key={i} className="grid grid-cols-[90px_1fr] gap-2 border-t border-[#EFECE4] py-2 text-[13px] first:border-0"><span className="font-mono text-[11px] text-[#5B6168]">{l.t}</span><span><b>{l.siapa}</b> · {l.apa}</span></div>)}</section>
          <button onClick={() => { if (window.confirm("Kembalikan semua data ke contoh awal?")) { resetM(); router.replace("/"); } }} className="self-start text-[12.5px] font-semibold text-[#5B6168] underline">Atur ulang data contoh di HP ini</button>
        </>
      )}
    </MPage>
  );
}
