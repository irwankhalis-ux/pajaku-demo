"use client";

import { useState } from "react";
import { BoPage } from "@/components/bo";
import { input } from "@/components/kit";

export default function Audit() {
  const [q, setQ] = useState("");
  return (
    <BoPage judul="Laporan & Audit">
      {({ s }) => {
        const qq = q.trim().toLowerCase();
        const list = s.log.filter((l) => !qq || `${l.siapa} ${l.apa} ${l.tuId ?? ""}`.toLowerCase().includes(qq));
        return (
          <>
            <p className="text-[13px] text-ink-2">Jejak semua aksi: pendataan, validasi, TTE, pembayaran, pengajuan aplikasi, CRM. Di versi server disimpan tak dapat diubah (append-only) untuk BPK/SPI.</p>
            <label htmlFor="qa" className="sr-only">Saring log</label>
            <input id="qa" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Saring: nama, aksi, ID Kios" className={input} />
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              {list.slice(0, 100).map((l, i) => <div key={i} className="grid grid-cols-[92px_1fr] gap-2.5 border-t border-[#EEF0EA] px-3.5 py-2 text-[13px] first:border-0"><span className="font-mono text-[11.5px] text-muted">{l.t}</span><span><b>{l.siapa}</b> · {l.apa}{l.tuId ? <span className="font-mono text-xs text-muted"> · {l.tuId}</span> : null}</span></div>)}
            </div>
          </>
        );
      }}
    </BoPage>
  );
}
