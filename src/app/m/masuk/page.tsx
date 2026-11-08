"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HOME, PIN, STAF, masuk } from "@/lib/mitra";
import { LogoPJ } from "@/components/mitra-ui";

export default function Masuk() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="flex min-h-dvh flex-col bg-[#F4F2EC]">
      <header className="flex items-center gap-2.5 px-4 pt-[calc(18px+env(safe-area-inset-top))] pb-3">
        <Link href="/" aria-label="Kembali" className="flex size-11 items-center justify-center rounded-[10px] border border-[#E2DED4] bg-white">‹</Link>
        <div><div className="text-lg font-bold">Masuk MitraPaja</div><div className="text-xs text-[#5B6168]">Tim Mitra Pengembang & pengawas Pasar Jaya</div></div>
      </header>
      <form onSubmit={(e) => { e.preventDefault(); const m = masuk(id, pin); if (m) return setErr(m); router.replace(HOME[STAF.find((x) => x.id === id)!.peran]); }} className="flex flex-1 flex-col gap-2 px-4 pb-6">
        {STAF.map((s) => (
          <button type="button" key={s.id} aria-pressed={id === s.id} onClick={() => { setId(s.id); setErr(""); }} className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${id === s.id ? "border-[#0E6E63] bg-[#F0F8F6]" : "border-[#E2DED4] bg-white"}`}>
            {s.peran === "pj" ? <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-[#E2DED4]"><LogoPJ className="h-5" /></span> : <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#12302B] text-[11px] font-bold text-white">{s.id.slice(2)}</span>}
            <span className="min-w-0"><span className="block text-sm font-semibold">{s.jabatan}</span><span className="block text-xs text-[#5B6168]">{s.nama}</span></span>
          </button>
        ))}
        <label className="mt-2 flex flex-col gap-1.5 text-sm font-semibold">PIN
          <input type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }} className="min-h-12 rounded-lg border border-[#CFCABD] bg-white px-3 font-mono text-lg tracking-[.3em]" />
        </label>
        <button type="button" onClick={() => setPin(PIN)} className="self-start text-[13px] font-semibold text-[#0E6E63] underline">Isi PIN uji coba</button>
        {err && <div role="alert" className="text-[13px] text-[#7E231C]">{err}</div>}
        <button disabled={!id || pin.length < 6} className="mt-auto min-h-[50px] rounded-lg bg-[#0E6E63] text-[15px] font-semibold text-white disabled:bg-[#E2DED4] disabled:text-[#5B6168]">Masuk</button>
      </form>
    </div>
  );
}
