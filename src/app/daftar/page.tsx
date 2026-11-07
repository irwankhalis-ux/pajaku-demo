"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { daftarAnggota } from "@/lib/store";
import { BackHeader } from "@/components/ui";

export default function Daftar() {
  const router = useRouter();
  const [f, setF] = useState({ nama: "", hp: "", nik: "" });
  const [err, setErr] = useState("");
  const field = (k: keyof typeof f, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className="flex flex-col gap-1.5 text-sm font-semibold">{label}
      <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="min-h-12 rounded-lg border border-line-2 px-3 text-base font-normal" {...props} />
    </label>
  );
  return (
    <div className="flex min-h-dvh flex-col">
      <BackHeader href="/" title="Daftar anggota baru" sub="Kategori Blue (Biru)" />
      <form
        onSubmit={(e) => { e.preventDefault(); const m = daftarAnggota(f.nama, f.hp, f.nik); if (m) setErr(m); else router.replace("/beranda/"); }}
        className="flex flex-1 flex-col gap-3.5 px-4 pb-6"
      >
        <p className="text-[13.5px] leading-relaxed text-ink-2">Untuk Anda yang ingin berdagang di pasar Pasar Jaya. Setelah terdaftar, Anda bisa melihat TU kosong di JaKios atau ditunjuk Pemilik TU sebagai Pengelola.</p>
        {field("nama", "Nama lengkap sesuai KTP", { autoComplete: "name", required: true })}
        {field("hp", "Nomor HP", { inputMode: "tel", autoComplete: "tel", placeholder: "08xxxxxxxxxx", required: true })}
        {field("nik", "NIK (16 angka)", { inputMode: "numeric", maxLength: 16, required: true })}
        <p className="text-[12px] text-muted">NIK akan dicocokkan ke Dukcapil saat verifikasi. Data Anda dikelola Perumda Pasar Jaya.</p>
        {err && <div className="text-[13px] text-[#7A2E24]" role="alert">{err}</div>}
        <button className="mt-auto min-h-[50px] rounded-lg bg-pj text-[15px] font-semibold text-white">Daftar &amp; masuk</button>
      </form>
    </div>
  );
}
