"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { masukStaf, peranHome } from "@/lib/store";
import { STAF, PIN_DEMO } from "@/lib/model";
import { BackHeader } from "@/components/ui";

const LV: Record<string, string> = { direksi: "L1", kadiv: "L2", manager: "L3", kepala: "L4", crm: "L4", petugas: "L5", kasir: "L5" };

export default function Staf() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="flex min-h-dvh flex-col">
      <BackHeader href="/" title="Masuk staf Pasar Jaya" sub="Akun jenjang L1–L5 · Konsol Pasar Jaya" />
      <form
        onSubmit={(e) => { e.preventDefault(); const m = masukStaf(id, pin); if (m) return setErr(m); router.replace(peranHome[STAF.find((x) => x.id === id)!.peran]); }}
        className="flex flex-1 flex-col gap-3 px-4 pb-6"
      >
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-semibold">Pilih akun</legend>
          {[...STAF].sort((a, b) => LV[a.peran].localeCompare(LV[b.peran])).map((s) => (
            <button type="button" key={s.id} aria-pressed={id === s.id} onClick={() => { setId(s.id); setErr(""); }}
              className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${id === s.id ? "border-pj bg-[#F0F5F2]" : "border-line bg-white"}`}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#0F2A20] text-xs font-bold text-white">{LV[s.peran]}</span>
              <span className="min-w-0"><span className="block text-sm font-semibold">{s.jabatan}</span><span className="block text-xs text-muted">{s.nama} · {s.id}</span></span>
            </button>
          ))}
        </fieldset>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">PIN
          <input type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }} className="min-h-12 rounded-lg border border-line-2 px-3 font-mono text-lg tracking-[.3em]" />
        </label>
        {/* shortcut: PIN simulasi untuk uji coba; ganti dengan SSO/akun Pasar Jaya */}
        <button type="button" onClick={() => setPin(PIN_DEMO)} className="self-start text-[13px] font-semibold text-pj underline">Isi PIN uji coba</button>
        {err && <div className="text-[13px] text-[#7A2E24]" role="alert">{err}</div>}
        <button disabled={!id || pin.length < 6} className="mt-auto min-h-[50px] rounded-lg text-[15px] font-semibold enabled:bg-pj enabled:text-white disabled:bg-line disabled:text-[#6B7670]">Masuk</button>
      </form>
    </div>
  );
}
