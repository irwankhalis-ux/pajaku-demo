"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cariHp, masukPedagang } from "@/lib/store";
import { OTP_DEMO } from "@/lib/model";

const CONTOH = [["081234564471", "Siti · Emerald"], ["081398762290", "H. Darmawan · Platinum"], ["085711221180", "Budi · Gold (punya toko)"], ["082133443307", "Andi · Blue"], ["081310026620", "Sutrisno · SHPTU kertas"], ["081377120044", "Rudi · calon Pengelola"]];
const samar = (hp: string) => hp.slice(0, 4) + "••••" + hp.slice(-4);

export default function Masuk() {
  const router = useRouter();
  const [hp, setHp] = useState("");
  const [tahap, setTahap] = useState<"hp" | "otp">("hp");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");

  const kirimOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cariHp(hp)) return setErr("Nomor HP belum terdaftar. Pakai nomor yang dicatat petugas, atau daftar sebagai anggota baru.");
    setErr(""); setTahap("otp");
  };
  const verifikasi = (e: React.FormEvent) => {
    e.preventDefault();
    const m = masukPedagang(hp, otp);
    if (m) return setErr(m);
    router.replace("/beranda/");
  };

  return (
    <div className="flex min-h-dvh flex-col gap-[18px] bg-pj px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-6 text-white">
      <div className="flex items-center justify-between"><span className="text-[13px] text-pj-soft">TokoPaja · PaJaKu</span><Link href="/" className="text-[13px] font-semibold text-pj-soft">Batal</Link></div>
      <h1 className="text-2xl leading-tight font-bold">{tahap === "hp" ? "Masuk ke TokoPaja" : "Masukkan kode OTP"}</h1>
      <p className="text-[14.5px] leading-relaxed text-[#E1EEE7]">
        {tahap === "hp" ? "Gunakan nomor HP yang dicatat petugas saat pendataan, atau yang Anda daftarkan sendiri." : `Kode 6 angka dikirim lewat SMS ke ${samar(hp.replace(/\D/g, ""))}.`}
      </p>
      {tahap === "hp" && <Link href="/daftar/" className="text-[13.5px] font-semibold text-gold underline">Belum punya akun? Daftar</Link>}
      {tahap === "hp" ? (
        <form onSubmit={kirimOtp} className="mt-auto flex flex-col gap-3 rounded-[14px] bg-white p-[18px] text-ink">
          <label htmlFor="hp" className="text-sm font-semibold">Nomor HP</label>
          <input id="hp" value={hp} onChange={(e) => setHp(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" className="min-h-12 rounded-lg border border-line-2 px-3 font-mono text-lg" />
          <div className="flex flex-wrap gap-1.5">
            {CONTOH.map(([n, l]) => <button type="button" key={n} onClick={() => setHp(n)} className="rounded-full border border-line-2 px-2.5 py-1 text-[11.5px] font-semibold text-ink-2">{l}</button>)}
          </div>
          <div className="text-[11.5px] text-muted">Nomor contoh untuk uji coba pilot.</div>
          {err && <div className="text-[13px] text-[#7A2E24]" role="alert">{err}</div>}
          <button className="min-h-[50px] rounded-lg bg-pj text-[15px] font-semibold text-white">Kirim kode OTP</button>
        </form>
      ) : (
        <form onSubmit={verifikasi} className="mt-auto flex flex-col gap-3 rounded-[14px] bg-white p-[18px] text-ink">
          <label htmlFor="otp" className="text-sm">Kode OTP</label>
          <div className="relative">
            <div className="grid grid-cols-6 gap-1.5" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => <div key={i} className={`flex h-12 items-center justify-center rounded-lg border font-mono text-xl font-bold ${i === otp.length ? "border-pj" : "border-line-2"}`}>{otp[i] ?? ""}</div>)}
            </div>
            <input id="otp" value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="absolute inset-0 opacity-0" autoFocus />
          </div>
          {/* shortcut: OTP simulasi; ganti dengan verifikasi SMS di server saat backend tersambung */}
          <button type="button" onClick={() => setOtp(OTP_DEMO)} className="min-h-10 text-[13px] font-semibold text-pj">Isi OTP otomatis (simulasi)</button>
          {err && <div className="text-[13px] text-[#7A2E24]" role="alert">{err}</div>}
          <button disabled={otp.length < 6} className="min-h-[50px] rounded-lg text-[15px] font-semibold enabled:bg-pj enabled:text-white disabled:bg-line disabled:text-[#6B7670]">Masuk</button>
          <button type="button" onClick={() => { setTahap("hp"); setOtp(""); setErr(""); }} className="text-[13px] font-semibold text-muted">Ganti nomor</button>
        </form>
      )}
    </div>
  );
}
