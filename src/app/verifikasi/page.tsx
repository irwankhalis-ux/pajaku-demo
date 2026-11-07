"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useData, pedagangById } from "@/lib/store";

// Simulasi portal verifikasi Pasar Jaya (untuk bank/notaris). Data pribadi disamarkan.
function Portal() {
  const no = useSearchParams().get("no") ?? "";
  const s = useData();
  const router = useRouter();
  const d = s.dok.find((x) => x.no === no);
  const samar = (n: string) => n.split(" ").map((w) => (w.length > 2 ? w[0] + "•".repeat(w.length - 2) + w.slice(-1) : w)).join(" ");
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-pj px-[18px] pt-[calc(20px+env(safe-area-inset-top))] pb-[18px] text-white">
        <div className="text-xs text-pj-soft">Portal verifikasi · Perumda Pasar Jaya</div>
        <h1 className="text-lg font-bold">Cek keaslian dokumen</h1>
      </header>
      <main className="flex flex-1 flex-col gap-3 p-4">
        {d && d.status === "terbit" ? (
          <>
            <div className="rounded-xl bg-mint px-3.5 py-3 text-sm font-bold text-mint-ink">✓ Dokumen asli · ditandatangani elektronik Pasar Jaya</div>
            <div className="rounded-xl border border-line bg-white px-3.5 py-1 text-[13.5px]">
              {[["Nomor", d.no], ["Jenis", d.jenis], ["Tempat usaha", d.tuId], ["Atas nama", samar(pedagangById(s, d.atasNamaId)?.nama ?? "")], ["Masa berlaku", d.berlaku], ["Terbit", d.terbit ?? ""]].map(([k, v], i, a) => (
                <div key={k} className={`flex justify-between gap-2.5 py-2.5 ${i < a.length - 1 ? "border-b border-[#EFF0EA]" : ""}`}><span className="text-muted">{k}</span><b className="text-right">{v}</b></div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-[#FBE9E6] px-3.5 py-3 text-sm font-bold text-[#7A2E24]">✗ {d?.status === "batal" ? `Dokumen ${no} sudah tidak berlaku (diganti versi baru).` : `Nomor ${no} tidak ditemukan atau belum terbit.`}</div>
        )}
        <p className="text-xs text-muted">Portal hanya menampilkan data seperlunya; NIK dan nomor HP tidak ditampilkan.</p>
        <button onClick={() => router.back()} className="min-h-12 rounded-lg border border-line-2 bg-white text-sm font-semibold">Kembali</button>
      </main>
    </div>
  );
}

export default function Page() {
  return <Suspense><Portal /></Suspense>;
}
