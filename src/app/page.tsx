"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useData, peranHome } from "@/lib/store";

export default function Splash() {
  const s = useData();
  const router = useRouter();
  useEffect(() => { if (s.sesi) router.replace(peranHome[s.sesi.peran]); }, [s.sesi, router]);

  return (
    <div className="flex min-h-dvh flex-col bg-pj px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))] text-white">
      <div className="flex justify-end">
        <span className="rounded-md border border-[#3E7A60] px-2 py-[3px] text-[10px] font-semibold tracking-[.1em] text-pj-soft">PILOT JOHAR BARU · DATA CONTOH</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-[18px] text-center">
        <div className="w-[210px] rounded-3xl bg-white px-5 py-[18px]">
          <div className="text-[13px] font-semibold tracking-[.12em] text-muted">PERUMDA</div>
          <div className="text-2xl font-bold text-pj">PASAR JAYA</div>
        </div>
        <div>
          <div className="text-[34px] font-bold tracking-[-.01em]">PasarJaya<span className="text-gold">Ku</span></div>
          <div className="mt-1 text-[13px] font-semibold tracking-[.14em] text-pj-soft">PAJAKU</div>
        </div>
        <p className="max-w-[290px] text-[15px] leading-relaxed text-[#E1EEE7]">e-SHPTU, e-SIPTU dan data tempat usaha Anda di Pasar Jaya, dalam satu aplikasi.</p>
      </div>
      <div className="flex flex-col gap-2.5">
        <Link href="/masuk/" className="block rounded-[10px] bg-white p-[15px] text-center text-[15px] font-bold text-pj">Masuk dengan no. HP terdaftar</Link>
        <div className="text-center text-[12.5px] text-pj-soft">Pakai no. HP yang dicatat petugas saat pendataan · OTP</div>
        <Link href="/daftar/" className="mt-1.5 block rounded-[10px] border-[1.5px] border-pj-soft p-3.5 text-center text-[14.5px] font-semibold">Daftar sebagai Anggota baru</Link>
        <Link href="/staf/" className="mt-1 py-2 text-center text-[13px] font-semibold text-gold underline">Masuk sebagai petugas / pejabat Pasar Jaya</Link>
      </div>
      <div className="mt-4 border-t border-pj-2 pt-3.5 text-center">
        <div className="text-[10px] font-semibold tracking-[.12em] text-[#9FC6B2]">POWERED BY</div>
        <div className="mt-[3px] text-[13.5px] font-bold">Patrol Indonesia Raya</div>
      </div>
    </div>
  );
}
