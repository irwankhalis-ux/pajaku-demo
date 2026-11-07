"use client";

import { useState } from "react";
import { Guard, StafHeader, Tabs, card, Tile, Bar, Empty } from "@/components/ui";
import { useData, stafById, statistik, pct, tandaTangan, pedagangById } from "@/lib/store";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

function Direksi() {
  const s = useData();
  const me = stafById(s.sesi!.userId)!;
  const st = statistik(s);
  const [tab, setTab] = useState<"ringkas" | "tte">("ringkas");
  const [step, setStep] = useState<"review" | "pin" | "done">("review");
  const [pin, setPin] = useState(0);
  const [n, setN] = useState(0);
  const sh = st.menunggu.filter((d) => d.jenis === "e-SHPTU").length, si = st.menunggu.length - sh;

  const funnel: [string, number][] = [["Didata lapangan", st.didata], ["Divalidasi Kepala Pasar", st.divalidasi], ["e-SHPTU terbit", st.terbitSh], ["e-SIPTU terbit", st.terbitSi]];
  let body;
  if (tab === "ringkas") {
    body = (
      <>
        <div className="text-[13px] text-muted">Pilot Pasar Johar Baru · {st.total} TU</div>
        <div className="grid grid-cols-2 gap-2">
          <Tile l="e-SHPTU terbit" v={st.terbitSh} s={`${pct(st.terbitSh, st.total)}% · target ≥80%`} tone={pct(st.terbitSh, st.total) >= 80 ? "text-[#2F6B4F]" : "text-[#9A5B0E]"} />
          <Tile l="e-SIPTU terbit" v={st.terbitSi} s={`${pct(st.terbitSi, st.total)}% · target ≥80%`} tone={pct(st.terbitSi, st.total) >= 80 ? "text-[#2F6B4F]" : "text-[#9A5B0E]"} />
          <Tile l="Anomali terbuka" v={st.anomali} />
          <Tile l="Akun pedagang aktif" v={st.aktif} s={`${pct(st.aktif, st.pemakai)}% dari ${st.pemakai}`} tone="text-[#2F6B4F]" />
        </div>
        <section className={`${card} flex flex-col gap-2.5 p-3.5`}>
          <h2 className="text-[15px] font-bold">Alur migrasi</h2>
          {funnel.map(([l, v]) => <div key={l} className="flex flex-col gap-1"><div className="flex justify-between text-[13px]"><span>{l}</span><span className="font-mono">{v} · {pct(v, st.total)}%</span></div><Bar value={pct(v, st.total)} /></div>)}
        </section>
        {st.menunggu.length > 0 ? (
          <button onClick={() => { setTab("tte"); setStep("review"); }} className="flex w-full items-center justify-between gap-2 rounded-[10px] bg-mint px-3 py-3 text-left">
            <span className="text-sm"><b>{st.menunggu.length} dokumen</b> menunggu tanda tangan<br /><span className="text-xs text-[#4B5650]">{sh} e-SHPTU · {si} e-SIPTU</span></span><span className="shrink-0 text-sm font-bold text-pj">Tandatangani ›</span>
          </button>
        ) : <div className="rounded-[10px] bg-mint px-3 py-3 text-sm text-mint-ink">✓ Tidak ada dokumen menunggu tanda tangan.</div>}
        {s.anomali.filter((a) => a.keputusan?.startsWith("Teruskan")).map((a) => <div key={a.id} className="rounded-[10px] bg-[#F7E3E0] px-3 py-3 text-[13px] text-[#7A2E24]"><b>Diteruskan Kadiv:</b> {a.jenis} · {a.tuId}</div>)}
      </>
    );
  } else if (step === "pin") {
    body = (
      <div className="flex flex-col items-center gap-[18px] py-2">
        <div className="text-base font-bold">PIN sertifikat elektronik</div>
        <div className="text-center text-[13px] text-muted">PIN dari penyedia TTE (PSrE). Uji coba: 6 angka apa saja.</div>
        <div className="flex gap-3" aria-label={`${pin} dari 6 angka`}>{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className={`size-4 rounded-full ${i < pin ? "bg-pj" : "border-2 border-[#9AA59E] bg-white"}`} />)}</div>
        <div className="grid w-full grid-cols-3 gap-2.5">
          {KEYS.map((k, i) => k === "" ? <span key={i} /> : (
            <button key={i} aria-label={k === "⌫" ? "Hapus" : k} onClick={() => {
              if (k === "⌫") return setPin(Math.max(0, pin - 1));
              if (pin + 1 >= 6) { setN(tandaTangan(me.jabatan)); setPin(0); setStep("done"); } else setPin(pin + 1);
            }} className="min-h-[60px] rounded-xl border border-line bg-white text-[22px] font-semibold">{k}</button>
          ))}
        </div>
        <button onClick={() => { setStep("review"); setPin(0); }} className="min-h-11 text-[13px] font-semibold text-muted">Batal</button>
      </div>
    );
  } else if (step === "done") {
    body = (
      <div className="flex flex-col items-center gap-3.5 py-4 text-center" aria-live="polite">
        <div className="flex size-[72px] items-center justify-center rounded-full bg-mint text-3xl text-mint-ink">✓</div>
        <div className="text-xl font-bold">{n} dokumen ditandatangani</div>
        <p className="text-sm text-ink-2">e-SHPTU &amp; e-SIPTU terbit, tercatat di log audit, dan langsung muncul di aplikasi pedagang.</p>
        <div className={`${card} w-full p-3 text-left text-[13.5px] leading-[1.7]`}>e-SHPTU <b>{st.terbitSh}/{st.total} ({pct(st.terbitSh, st.total)}%)</b><br />e-SIPTU <b>{st.terbitSi}/{st.total} ({pct(st.terbitSi, st.total)}%)</b> · target ≥80%</div>
        <button onClick={() => setTab("ringkas")} className="min-h-11 text-[13px] font-semibold text-muted">Kembali ke Ringkasan</button>
      </div>
    );
  } else {
    body = st.menunggu.length ? (
      <>
        <div className="flex items-center justify-between rounded-[10px] bg-[#183A2D] p-3 text-white"><div><div className="text-xs text-[#9DB5A8]">Batch Johar Baru</div><div className="text-[22px] font-bold">{st.menunggu.length} dokumen</div></div><div className="text-right text-[12.5px] text-[#C9D8CF]">{sh} e-SHPTU<br />{si} e-SIPTU</div></div>
        <div className="text-[13px] text-muted">Semua sudah divalidasi Kepala Pasar. Terbaru:</div>
        {[...st.menunggu].reverse().slice(0, 8).map((d) => (
          <div key={d.no} className={`${card} flex items-center justify-between gap-2 px-3 py-2.5`}>
            <div className="min-w-0"><div className="truncate font-mono text-[12.5px]">{d.no}</div><div className="text-[13px] font-semibold">{pedagangById(s, d.atasNamaId)?.nama}</div><div className="text-xs text-muted">{d.tuId}{d.no.endsWith("-R1") ? " · revisi koreksi" : ""}</div></div>
            <span className={`shrink-0 rounded-md px-2 py-[3px] text-[11.5px] font-bold ${d.jenis === "e-SHPTU" ? "bg-[#E5ECEF] text-[#2E3F49]" : "bg-mint text-mint-ink"}`}>{d.jenis}</span>
          </div>
        ))}
        <button onClick={() => { setStep("pin"); setPin(0); }} className="sticky bottom-[calc(12px+env(safe-area-inset-bottom))] mt-2 min-h-[52px] rounded-lg bg-pj text-[15px] font-semibold text-white shadow-lg">Tanda tangani {st.menunggu.length} dokumen</button>
      </>
    ) : <Empty>Tidak ada dokumen menunggu. Dokumen masuk setelah Kepala Pasar memvalidasi TU.</Empty>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <StafHeader jabatan={`L1 · ${me.nama}`} judul="PaJaKu · Direksi">
        <Tabs dark value={tab} onChange={(v) => { setTab(v); if (v === "tte" && step === "done") setStep("review"); }} items={[["ringkas", "Ringkasan"], ["tte", `Tanda tangan${st.menunggu.length ? ` · ${st.menunggu.length}` : ""}`]]} />
      </StafHeader>
      <main className="flex flex-1 flex-col gap-3 p-4">{body}</main>
    </div>
  );
}

export default function Page() {
  return <Guard peran="direksi"><Direksi /></Guard>;
}
