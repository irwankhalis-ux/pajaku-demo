"use client";

import Link from "next/link";
import { useState } from "react";
import { BackHeader, card } from "@/components/ui";
import { Field, Steps, btn, input } from "@/components/kit";
import { cariHp, daftarAnggota } from "@/lib/store";
import { OTP_DEMO } from "@/lib/model";

// Registrasi akun: data diri → OTP → verifikasi NIK & swafoto → pilih jalur (migrasi SHPTU / Pengelola / calon pedagang)
export default function Daftar() {
  const [step, setStep] = useState(1);
  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [nik, setNik] = useState("");
  const [otp, setOtp] = useState("");
  const [ktp, setKtp] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [setuju, setSetuju] = useState(false);
  const [err, setErr] = useState("");

  const lanjut1 = (e: React.FormEvent) => {
    e.preventDefault();
    const d = hp.replace(/\D/g, "");
    if (nama.trim().length < 3) return setErr("Isi nama lengkap sesuai KTP.");
    if (!/^08\d{8,11}$/.test(d)) return setErr("Nomor HP tidak valid (contoh 0812…).");
    if (!/^\d{16}$/.test(nik.replace(/\D/g, ""))) return setErr("NIK harus 16 angka.");
    if (cariHp(d)) return setErr("Nomor HP sudah terdaftar. Silakan masuk.");
    if (!setuju) return setErr("Setujui pemrosesan data pribadi dulu.");
    setErr(""); setStep(2);
  };
  const lanjut2 = (e: React.FormEvent) => { e.preventDefault(); if (otp !== OTP_DEMO) return setErr("Kode OTP salah."); setErr(""); setStep(3); };
  const lanjut3 = () => { const m = daftarAnggota(nama, hp, nik); if (m) return setErr(m); setErr(""); setStep(4); };

  return (
    <div className="flex min-h-dvh flex-col">
      <BackHeader href={step === 1 ? "/" : "/daftar/"} title="Daftar akun TokoPaja" sub={["Data diri", "Verifikasi HP", "Verifikasi identitas", "Pilih jalur"][step - 1]} />
      <main className="flex flex-1 flex-col gap-3.5 px-4 pb-6">
        <Steps n={step} of={4} labels={["Data diri", "OTP", "NIK & wajah", "Jalur"]} />
        {step === 1 && (
          <form onSubmit={lanjut1} className="flex flex-1 flex-col gap-3">
            <Field label="Nama lengkap (sesuai KTP)" id="nama"><input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} autoComplete="name" className={input} /></Field>
            <Field label="Nomor HP" id="hp" hint="OTP dikirim lewat SMS ke nomor ini"><input id="hp" value={hp} onChange={(e) => setHp(e.target.value)} inputMode="tel" placeholder="08xxxxxxxxxx" className={`${input} font-mono`} /></Field>
            <Field label="NIK" id="nik" hint="16 angka · disimpan terenkripsi, tampil tersamar (UU PDP)"><input id="nik" value={nik} onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))} inputMode="numeric" className={`${input} font-mono`} /></Field>
            <button type="button" onClick={() => { setNama("Wahyu Kurniawan"); setHp("081299887766"); setNik("3171042205880007"); setSetuju(true); }} className="self-start text-[12.5px] font-semibold text-pj underline">Isi contoh</button>
            <label className="flex gap-2.5 text-[13px] leading-relaxed"><input type="checkbox" checked={setuju} onChange={(e) => setSetuju(e.target.checked)} className="mt-1 size-[18px] accent-pj" />Saya setuju data saya diproses Perumda Pasar Jaya untuk penerbitan dokumen, penagihan, dan layanan TokoPaja.</label>
            {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
            <button className={`${btn} mt-auto`}>Kirim kode OTP</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={lanjut2} className="flex flex-1 flex-col gap-3">
            <p className="text-[14px] text-ink-2">Kode 6 angka dikirim ke <b>{hp.slice(0, 4)}••••{hp.slice(-4)}</b>.</p>
            <Field label="Kode OTP" id="otp"><input id="otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className={`${input} font-mono text-xl tracking-[.4em]`} /></Field>
            <button type="button" onClick={() => setOtp(OTP_DEMO)} className="self-start text-[12.5px] font-semibold text-pj underline">Isi OTP otomatis (simulasi)</button>
            {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
            <button disabled={otp.length < 6} className={`${btn} mt-auto`}>Verifikasi</button>
          </form>
        )}
        {step === 3 && (
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-[14px] text-ink-2">Kami mencocokkan NIK dan wajah Anda ke Dukcapil lewat mitra KYC.</p>
            {([["Foto KTP", ktp, setKtp, "Letakkan KTP di bidang datar, terang"], ["Swafoto + kedipkan mata", selfie, setSelfie, "Deteksi wajah hidup (liveness)"]] as const).map(([l, v, set, h]) => (
              <button key={l} type="button" onClick={() => set(true)} className={`${card} flex items-center gap-3 p-3.5 text-left`}>
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-lg ${v ? "bg-pj text-white" : "bg-mint"}`}>{v ? "✓" : "📷"}</span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{l}</span><span className="block text-xs text-muted">{v ? "Tersimpan · siap dicek" : h}</span></span>
                {!v && <span className="text-[13px] font-semibold text-pj">Ambil</span>}
              </button>
            ))}
            {ktp && selfie && <div className="rounded-xl bg-mint px-3.5 py-3 text-[13px] text-mint-ink">✓ NIK {nik.slice(0, 4)} •••• •••• {nik.slice(-4)} cocok dengan Dukcapil (simulasi).</div>}
            {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
            <button disabled={!ktp || !selfie} onClick={lanjut3} className={`${btn} mt-auto`}>Buat akun</button>
          </div>
        )}
        {step === 4 && (
          <div className="flex flex-1 flex-col gap-3">
            <div className="rounded-xl bg-mint px-3.5 py-3 text-[13.5px] text-mint-ink">✓ Akun aktif sebagai <b>Blue (Anggota)</b>. Pilih yang sesuai dengan Anda:</div>
            {[
              ["/migrasi/", "📜", "Saya pemilik SHPTU kertas", "Migrasi digital ke e-SHPTU & e-SIPTU: foto SHPTU lama, cocokkan kios, kirim."],
              ["/registrasi-pengelola/", "🤝", "Saya mengelola / menyewa kios orang lain", "Registrasi Pengelola: Pemilik menyetujui lewat aplikasinya, e-SIPTU pindah ke nama Anda."],
              ["/beranda/", "🛒", "Saya calon pedagang", "Lihat kios kosong lewat JaKios dan program untuk Anggota."],
            ].map(([href, ic, t, d]) => (
              <Link key={href} href={href} className={`${card} flex items-start gap-3 p-3.5`}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-mint text-xl" aria-hidden="true">{ic}</span>
                <span><span className="block text-[15px] font-bold">{t}</span><span className="block text-[12.5px] leading-snug text-muted">{d}</span></span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
