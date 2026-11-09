"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HOME_CC, PIN_CC, STAF_CC, masukCC } from "@/lib/cc";

export default function Masuk() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-[#0B1620] text-[#E6EDF2]">
      <header className="flex items-center gap-2.5 px-4 pt-[calc(18px+env(safe-area-inset-top))] pb-3">
        <Link href="/" aria-label="Kembali" className="flex size-11 items-center justify-center rounded-[10px] border border-[#3A5060]">‹</Link>
        <div><div className="text-lg font-bold">Masuk Command Center Paja</div><div className="text-xs text-[#9FB1BF]">Pilih peran (akun contoh)</div></div>
      </header>
      <form onSubmit={(e) => { e.preventDefault(); const m = masukCC(id, pin); if (m) return setErr(m); router.replace(HOME_CC[STAF_CC.find((x) => x.id === id)!.peran]); }} className="flex flex-1 flex-col gap-2 px-4 pb-6">
        {STAF_CC.map((s, i) => (
          <div key={s.id}>
            {i === 1 && <div className="mt-1 mb-1.5 text-[11px] font-semibold tracking-[.1em] text-[#9FB1BF]">DIREKSI PERUMDA PASAR JAYA</div>}
            {i === 6 && <div className="mt-1 mb-1.5 text-[11px] font-semibold tracking-[.1em] text-[#9FB1BF]">RUANG KENDALI</div>}
            <button type="button" aria-pressed={id === s.id} onClick={() => { setId(s.id); setErr(""); }} className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${id === s.id ? "border-[#2BB3A3] bg-[#12313A]" : "border-[#22394A] bg-[#122230]"}`}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#22394A] text-[10px] font-bold">{s.id}</span>
              <span className="min-w-0"><span className="block text-sm font-semibold">{s.nama}</span><span className="block text-xs text-[#9FB1BF]">{s.jabatan}</span></span>
            </button>
          </div>
        ))}
        <label className="mt-2 flex flex-col gap-1.5 text-sm font-semibold">PIN<input type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }} className="min-h-12 rounded-lg border border-[#3A5060] bg-[#122230] px-3 font-mono text-lg tracking-[.3em]" /></label>
        <button type="button" onClick={() => setPin(PIN_CC)} className="self-start text-[13px] font-semibold text-[#7FD3C7] underline">Isi PIN uji coba</button>
        {err && <div role="alert" className="text-[13px] text-[#F07A63]">{err}</div>}
        <button disabled={!id || pin.length < 6} className="mt-3 min-h-[50px] rounded-lg bg-[#2BB3A3] text-[15px] font-bold text-[#0B1620] disabled:bg-[#22394A] disabled:text-[#9FB1BF]">Masuk</button>
      </form>
    </div>
  );
}
