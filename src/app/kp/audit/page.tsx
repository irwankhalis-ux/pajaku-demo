"use client";

import { useRouter } from "next/navigation";
import { KPage, kpanel } from "@/components/kulakan-ui";
import { resetK } from "@/lib/kulakan";

export default function Audit() {
  const router = useRouter();
  return (
    <KPage judul="Audit" sub="Jejak aksi tim pemasok">
      {({ s }) => (
        <>
          <section className={`${kpanel} flex flex-col`}>{s.log.slice(0, 120).map((l, i) => <div key={i} className="grid grid-cols-[90px_1fr] gap-2 border-t border-[#F3F4F6] py-2 text-[13px] first:border-0"><span className="font-mono text-[11px] text-[#4B5563]">{l.t}</span><span><b>{l.siapa}</b> · {l.apa}</span></div>)}</section>
          <button onClick={() => { if (window.confirm("Kembalikan data contoh awal?")) { resetK(); router.replace("/"); } }} className="self-start text-[12.5px] font-semibold text-[#4B5563] underline">Atur ulang data contoh di HP ini</button>
        </>
      )}
    </KPage>
  );
}
