"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HOME, PIN, STAF, masuk } from "@/lib/kulakan";

export default function Masuk() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="flex min-h-dvh flex-col bg-[#F3F4F6]">
      <header className="flex items-center gap-2.5 px-4 pt-[calc(18px+env(safe-area-inset-top))] pb-3">
        <Link href="/" aria-label="Kembali" className="flex size-11 items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white">‹</Link>
        <div><div className="text-lg font-bold">Masuk KulakanPatrol</div><div className="text-xs text-[#4B5563]">Perumda Pasar Jaya · Direktorat Perkulakan dan Ritel</div></div>
      </header>
      <form onSubmit={(e) => { e.preventDefault(); const m = masuk(id, pin); if (m) return setErr(m); router.replace(HOME[STAF.find((x) => x.id === id)!.peran]); }} className="flex flex-1 flex-col gap-2 px-4 pb-6">
        {STAF.map((s) => (
          <button type="button" key={s.id} aria-pressed={id === s.id} onClick={() => { setId(s.id); setErr(""); }} className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${id === s.id ? "border-[#C2410C] bg-[#FFF7ED]" : "border-[#E5E7EB] bg-white"}`}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1E293B] text-[11px] font-bold text-white">{s.id.slice(2)}</span>
            <span className="min-w-0"><span className="block text-sm font-semibold">{s.jabatan}</span><span className="block text-xs text-[#4B5563]">{s.nama}</span></span>
          </button>
        ))}
        <label className="mt-2 flex flex-col gap-1.5 text-sm font-semibold">PIN<input type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }} className="min-h-12 rounded-lg border border-[#D1D5DB] bg-white px-3 font-mono text-lg tracking-[.3em]" /></label>
        <button type="button" onClick={() => setPin(PIN)} className="self-start text-[13px] font-semibold text-[#C2410C] underline">Isi PIN uji coba</button>
        {err && <div role="alert" className="text-[13px] text-[#991B1B]">{err}</div>}
        <button disabled={!id || pin.length < 6} className="mt-auto min-h-[50px] rounded-lg bg-[#14532D] text-[15px] font-bold text-white disabled:bg-[#E5E7EB] disabled:text-[#4B5563]">Masuk</button>
      </form>
    </div>
  );
}
