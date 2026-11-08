"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useData, peranHome } from "@/lib/store";
import { IS_KONSOL, IS_KULAKAN, IS_MITRA } from "@/lib/app";
import { HOME as KHOME, PEMASOK, stafK, useK } from "@/lib/kulakan";
import { HOME, PROYEK, stafM, useM } from "@/lib/mitra";

export default function Splash() {
  return IS_MITRA ? <Mitra /> : IS_KULAKAN ? <Kulakan /> : <Utama />;
}

function Utama() {
  const s = useData();
  const router = useRouter();
  useEffect(() => {
    if (!s.sesi) return;
    const staf = s.sesi.peran !== "pedagang";
    if (staf === IS_KONSOL) router.replace(peranHome[s.sesi.peran]);
  }, [s.sesi, router]);
  return IS_KONSOL ? <Konsol /> : <TokoPaja />;
}

function Logo() {
  return (
    <div className="w-[210px] rounded-3xl bg-white px-6 py-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/pasarjaya-logo.png" alt="Perumda Pasar Jaya" width={540} height={330} className="h-auto w-full" />
    </div>
  );
}

function TokoPaja() {
  return (
    <div className="flex min-h-dvh flex-col bg-pj px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))] text-white">
      <div className="flex justify-end"><span className="rounded-md border border-[#3E7A60] px-2 py-[3px] text-[10px] font-semibold tracking-[.1em] text-pj-soft">PILOT JOHAR BARU · DATA CONTOH</span></div>
      <div className="flex flex-1 flex-col items-center justify-center gap-[18px] text-center">
        <Logo />
        <div>
          <div className="text-[36px] font-bold tracking-[-.01em]">Toko<span className="text-gold">Paja</span></div>
          <div className="mt-0.5 text-[12px] font-semibold tracking-[.14em] text-pj-soft">APLIKASI PEDAGANG PAJAKU</div>
        </div>
        <ul className="flex max-w-[300px] flex-col gap-1.5 text-left text-[14px] leading-snug text-[#E1EEE7]">
          <li>✓ e-SHPTU &amp; e-SIPTU resmi di HP, ber-QR</li>
          <li>✓ Migrasi SHPTU kertas tanpa antre</li>
          <li>✓ Buka toko online dari e-SIPTU, terima pesanan &amp; kulakan</li>
          <li>✓ Bayar BPP, perpanjang izin, ajukan kredit</li>
        </ul>
      </div>
      <div className="flex flex-col gap-2.5">
        <Link href="/masuk/" className="block rounded-[10px] bg-white p-[15px] text-center text-[15px] font-bold text-pj">Masuk dengan no. HP</Link>
        <Link href="/daftar/" className="block rounded-[10px] border-[1.5px] border-pj-soft p-3.5 text-center text-[14.5px] font-semibold">Daftar akun baru</Link>
        <div className="text-center text-[12px] text-pj-soft">Pemilik SHPTU, pengelola/penyewa kios, atau calon pedagang</div>
      </div>
      <div className="mt-4 border-t border-pj-2 pt-3.5 text-center">
        <div className="text-[10px] font-semibold tracking-[.12em] text-[#9FC6B2]">POWERED BY</div>
        <div className="mt-[3px] text-[13.5px] font-bold">Patrol Indonesia Raya</div>
      </div>
    </div>
  );
}

function Konsol() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0F2A20] px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))] text-white">
      <div className="flex justify-end"><span className="rounded-md border border-[#2E5444] px-2 py-[3px] text-[10px] font-semibold tracking-[.1em] text-[#9DB5A8]">PILOT JOHAR BARU · DATA CONTOH</span></div>
      <div className="flex flex-1 flex-col items-center justify-center gap-[18px] text-center">
        <Logo />
        <div>
          <div className="text-[32px] font-bold">Konsol <span className="text-gold">Pasar Jaya</span></div>
          <div className="mt-0.5 text-[12px] font-semibold tracking-[.14em] text-[#9DB5A8]">BACK OFFICE · EIS DIREKSI · CRM</div>
        </div>
        <p className="max-w-[300px] text-[14.5px] leading-relaxed text-[#C9D8CF]">Migrasi e-SHPTU &amp; e-SIPTU, tanda tangan elektronik, tagihan BPP, CRM tenant 360, operasi pasar dan harga harian — dari HP Direksi sampai petugas.</p>
      </div>
      <Link href="/staf/" className="block rounded-[10px] bg-white p-[15px] text-center text-[15px] font-bold text-[#0F2A20]">Masuk staf Pasar Jaya</Link>
      <div className="mt-4 border-t border-[#24493A] pt-3.5 text-center">
        <div className="text-[10px] font-semibold tracking-[.12em] text-[#9DB5A8]">POWERED BY</div>
        <div className="mt-[3px] text-[13.5px] font-bold">Patrol Indonesia Raya</div>
      </div>
    </div>
  );
}

function Mitra() {
  const s = useM();
  const router = useRouter();
  const st = stafM(s.sesi?.stafId);
  useEffect(() => { if (st) router.replace(HOME[st.peran]); }, [st, router]);
  return (
    <div className="flex min-h-dvh flex-col bg-[#12302B] px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))] text-white">
      <div className="flex justify-end"><span className="rounded-md border border-[#2A514A] px-2 py-[3px] text-[10px] font-semibold tracking-[.1em] text-[#A7C3BC]">DATA CONTOH · ILUSTRASI</span></div>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div>
          <div className="text-[38px] font-extrabold tracking-[-.01em]">Mitra<span className="text-[#7FD1C1]">Paja</span></div>
          <div className="mt-0.5 text-[12px] font-semibold tracking-[.14em] text-[#A7C3BC]">KONSOL MITRA PENGEMBANG REVITALISASI</div>
        </div>
        <div className="flex w-[250px] flex-col items-center gap-2 rounded-3xl bg-white px-6 py-4">
          <span className="text-[10.5px] font-bold tracking-[.12em] text-[#5B6168]">BERMITRA DENGAN</span>
          <Logo />
        </div>
        <div className="text-[14px] leading-relaxed text-[#D3E4DF]"><b className="text-white">{PROYEK.nama}</b><br />{PROYEK.mitra} · {PROYEK.tu} tempat usaha<br />Konstruksi {PROYEK.mulai} – {PROYEK.selesai}</div>
        <ul className="flex max-w-[310px] flex-col gap-1 text-left text-[13.5px] text-[#D3E4DF]">
          <li>✓ Penjualan 3 jalur: Eksisting · Gold · Biru</li>
          <li>✓ Undian zoning, e-SPTU ber-TTE Pasar Jaya</li>
          <li>✓ Tagihan VA/QRIS, escrow, kredit bank</li>
          <li>✓ CRM chat PaJaKu & EIS Direksi di HP</li>
        </ul>
      </div>
      <Link href="/m/masuk/" className="block rounded-[10px] bg-white p-[15px] text-center text-[15px] font-bold text-[#12302B]">Masuk tim Mitra / Pasar Jaya</Link>
      <div className="mt-4 border-t border-[#24524A] pt-3.5 text-center">
        <div className="text-[10px] font-semibold tracking-[.12em] text-[#A7C3BC]">POWERED BY</div>
        <div className="mt-[3px] text-[13.5px] font-bold">PATROL · PaJaKu</div>
      </div>
    </div>
  );
}

function Kulakan() {
  const s = useK();
  const router = useRouter();
  const st = stafK(s.sesi?.stafId);
  useEffect(() => { if (st) router.replace(KHOME[st.peran]); }, [st, router]);
  return (
    <div className="flex min-h-dvh flex-col bg-[#1E293B] px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))] text-white">
      <div className="flex justify-end"><span className="rounded-md border border-[#334155] px-2 py-[3px] text-[10px] font-semibold tracking-[.1em] text-[#CBD5E1]">DATA CONTOH · ILUSTRASI</span></div>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div>
          <div className="text-[38px] font-extrabold">Kulakan<span className="text-[#FDBA74]">Patrol</span></div>
          <div className="mt-0.5 text-[12px] font-semibold tracking-[.14em] text-[#CBD5E1]">APLIKASI PEMASOK B2B · PATROL</div>
        </div>
        <div className="flex w-[250px] flex-col items-center gap-2 rounded-3xl bg-white px-6 py-4 text-[#1A1F1C]">
          <span className="text-[10.5px] font-bold tracking-[.12em] text-[#4B5563]">AKUN PEMASOK</span>
          <Logo />
          <span className="text-[12px] font-semibold">{PEMASOK.unit}</span>
        </div>
        <ul className="flex max-w-[310px] flex-col gap-1 text-left text-[13.5px] text-[#E2E8F0]">
          <li>✓ Pesanan dari toko TokoPaja (pedagang ber-e-SIPTU)</li>
          <li>✓ Harga grosir bertingkat & stok Jakgrosir</li>
          <li>✓ Pembiayaan DO Bank Jakarta 30/60/90 hari (Emerald)</li>
          <li>✓ Penugasan Gubernur/TPID & EIS Direktur</li>
        </ul>
      </div>
      <Link href="/kp/masuk/" className="block rounded-[10px] bg-[#C2410C] p-[15px] text-center text-[15px] font-bold text-white">Masuk tim pemasok</Link>
      <div className="mt-4 border-t border-[#334155] pt-3.5 text-center"><div className="text-[10px] font-semibold tracking-[.12em] text-[#CBD5E1]">POWERED BY</div><div className="mt-[3px] text-[13.5px] font-bold">PATROL · PaJaKu</div></div>
    </div>
  );
}
