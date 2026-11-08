"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, card } from "@/components/ui";
import { Field, Steps, btn, input } from "@/components/kit";
import { ajukanPengelola, load, pedagangById, tuById } from "@/lib/store";

export default function RegistrasiPengelola() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [kid, setKid] = useState("");
  const [periode, setPeriode] = useState("1 Des 2026 – 30 Nov 2027");
  const [dag, setDag] = useState("Pangan Basah · sayur, bumbu dapur");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  return (
    <PedagangPage nav={false}>
      {({ s, p }) => {
        const t = tuById(s, kid.trim().toUpperCase());
        const pem = t && pedagangById(s, t.pemilikId);
        return (
          <>
            <BackHeader href="/beranda/" title="Registrasi Pengelola" sub="Keluarga atau penyewa kios" />
            <main className="flex flex-1 flex-col gap-3 px-4 pb-6">
              <Steps n={step} of={3} labels={["Kios", "Data sewa", "Kirim"]} />
              {step === 1 && (
                <>
                  <Field label="ID Kios atau pindai QR di kios" id="kid"><input id="kid" value={kid} onChange={(e) => setKid(e.target.value)} placeholder="JHB-C-B-044" className={`${input} font-mono uppercase`} /></Field>
                  <button type="button" onClick={() => setKid("JHB-C-B-044")} className="-mt-1.5 self-start text-[12.5px] font-semibold text-pj underline">Pakai contoh (lapak kosong milik H. Darmawan)</button>
                  {t && pem && (
                    <div className={`${card} relative overflow-hidden py-3 pr-3.5 pl-[18px]`}>
                      <span className="absolute inset-y-0 left-0 w-[5px] bg-[#1E9E5A]" />
                      <div className="font-mono text-xs text-ink-2">ID KIOS · {t.id}</div>
                      <div className="text-[15px] font-bold">Pasar Johar Baru</div>
                      <div className="text-xs text-muted">Blok {t.blok} · {t.jenis} {t.luas} m²</div>
                      <div className="mt-2 border-t border-line pt-2 text-xs text-muted">Pemilik: {pem.nama[0]}•••{pem.nama.slice(-1)} · {t.buka && t.pemakaiId !== t.pemilikId ? "sudah ada Pengelola" : t.buka ? "dipakai Pemilik" : "kios kosong, e-SIPTU a.n. Pemilik"}</div>
                    </div>
                  )}
                </>
              )}
              {step === 2 && (
                <>
                  <div className="flex items-center gap-3 rounded-xl border-[1.5px] border-[#bfe3cf] bg-[#F3FBF6] p-3.5"><span className="text-[#157A44]">🪪</span><span className="flex-1"><span className="block text-[13px] font-bold">NIK terverifikasi</span><span className="block text-xs text-muted">{p.nik.slice(0, 4)} •••• •••• {p.nik.slice(-4)} · Dukcapil via mitra KYC</span></span><span className="text-[#157A44]">✓</span></div>
                  <Field label="Periode sewa / pengelolaan" id="per"><input id="per" value={periode} onChange={(e) => setPeriode(e.target.value)} className={input} /></Field>
                  <Field label="Kelompok & komoditas dagangan" id="dag"><input id="dag" value={dag} onChange={(e) => setDag(e.target.value)} className={input} /></Field>
                  <label className={`${card} flex gap-2.5 p-3.5 text-[13px] leading-relaxed`}><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="mt-1 size-[18px] accent-pj" />Saya bertanggung jawab membayar BPP, listrik &amp; air kios ini atas nama sendiri melalui e-SIPTU saya. Uang sewa ke Pemilik di luar tagihan Pasar Jaya.</label>
                </>
              )}
              {step === 3 && (
                <div className={`${card} p-3.5 text-[13.5px] leading-relaxed`}>
                  <b>Ringkasan</b><br />Kios {t?.id} · {periode}<br />{dag}<br /><span className="text-muted">Setelah dikirim, Pemilik menerima notifikasi di aplikasinya dan menyetujui dengan PIN. Lalu Kepala Pasar memverifikasi dan e-SIPTU dialihkan ke nama Anda.</span>
                </div>
              )}
              {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
              <div className="mt-auto flex gap-2">
                {step > 1 && <button onClick={() => { setErr(""); setStep(step - 1); }} className="min-h-12 flex-1 rounded-[10px] border border-line-2 bg-white font-semibold">Kembali</button>}
                <button className={`${btn} flex-[2]`} onClick={() => {
                  setErr("");
                  if (step === 1) { if (!t) return setErr("ID Kios tidak ditemukan."); if (t.pemilikId === p.id) return setErr("Anda Pemilik TU ini."); return setStep(2); }
                  if (step === 2) { if (!ok) return setErr("Centang pernyataan tanggung jawab BPP."); return setStep(3); }
                  const m = ajukanPengelola(p.id, t!.id, periode, dag);
                  if (m) return setErr(m);
                  router.replace(`/pengajuan/?id=${load().pengajuan[0].id}`);
                }}>{step === 3 ? "Kirim ke Pemilik untuk persetujuan" : "Lanjut"}</button>
              </div>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
