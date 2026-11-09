"use client";

import { CCPage, card, muted } from "@/components/cc-ui";
import { resetCC } from "@/lib/cc";

export default function Log() {
  return (
    <CCPage>
      {({ s }) => (
        <>
          <div><h1 className="text-[20px] font-semibold">Jejak keputusan</h1><div className={`text-[12.5px] ${muted}`}>Setiap persetujuan, kajian, disposisi dan pengingat dari HP maupun video wall tercatat di sini.</div></div>
          {s.log.length === 0 && <div className={`${card} p-4 text-[13px] ${muted}`}>Belum ada keputusan hari ini.</div>}
          {s.log.map((l, i) => <div key={i} className={`${card} flex gap-3 p-3 text-[13px]`}><span className="font-mono text-[#7FD3C7]">{l.t}</span><div><b>{l.siapa}</b> {l.apa}</div></div>)}
          <button onClick={() => { if (confirm("Hapus semua keputusan contoh?")) resetCC(); }} className="mt-2 min-h-11 rounded-lg border border-[#3A5060] text-[13px]">Atur ulang data contoh</button>
        </>
      )}
    </CCPage>
  );
}
