"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader } from "@/components/ui";
import { ajukanKoreksi } from "@/lib/store";

const FIELDS = ["Nama", "NIK", "Jenis TU / luas", "Jenis dagangan", "Pemakai / Pengelola", "Lainnya"];

function Form() {
  const id = useSearchParams().get("id") ?? "";
  const [sel, setSel] = useState<string[]>([]);
  const [teks, setTeks] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [tiket, setTiket] = useState("");
  const ok = sel.length > 0 && teks.trim().length > 4;
  return (
    <PedagangPage nav={false}>
      {({ p }) => tiket ? (
        <>
          <BackHeader href={`/tu/?id=${id}`} title="Koreksi terkirim" sub={id} />
          <main className="flex flex-1 flex-col items-center gap-3.5 px-6 py-5 text-center" aria-live="polite">
            <div className="flex size-[72px] items-center justify-center rounded-full bg-mint text-3xl text-mint-ink">✓</div>
            <div className="font-mono text-sm">{tiket}</div>
            <p className="text-sm leading-relaxed text-ink-2">Diteruskan ke Kepala Pasar Johar Baru. Tanggapan muncul di menu Layanan, biasanya ≤7 hari kerja.</p>
            <Link href="/layanan/" className="w-full rounded-lg bg-pj p-3.5 text-sm font-semibold text-white">Lihat di Layanan</Link>
            <Link href="/beranda/" className="text-sm font-semibold text-muted">Kembali ke Beranda</Link>
          </main>
        </>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (ok) setTiket(ajukanKoreksi(p.id, id, sel, teks.trim(), !!foto)); }} className="flex min-h-dvh flex-col">
          <BackHeader href={`/tu/?id=${id}`} title="Ajukan koreksi data" sub={id} />
          <main className="flex flex-1 flex-col gap-3.5 px-4 pb-4">
            <fieldset>
              <legend className="mb-2 text-sm font-bold">Data mana yang tidak sesuai?</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {FIELDS.map((f) => { const on = sel.includes(f); return <button type="button" key={f} aria-pressed={on} onClick={() => setSel(on ? sel.filter((x) => x !== f) : [...sel, f])} className={`min-h-11 rounded-lg border text-[13px] font-semibold ${on ? "border-pj bg-pj text-white" : "border-line-2 bg-white"}`}>{f}</button>; })}
              </div>
            </fieldset>
            <label className="flex flex-col gap-1.5 text-sm font-bold">Data yang benar
              <textarea rows={4} value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Contoh: jenis dagangan saya sekarang sembako & minyak, bukan kelontong." className="resize-none rounded-lg border border-line-2 px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className={`flex min-h-[50px] cursor-pointer items-center justify-between rounded-[10px] border px-3.5 ${foto ? "border-pj-soft bg-mint text-mint-ink" : "border-line-2 bg-white"}`}>
              <span className="text-sm font-semibold">Lampirkan foto pendukung</span><span className="text-[13px] font-semibold">{foto ? "✓ 1 foto" : "Ambil foto"}</span>
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
            </label>
            <p className="text-[12.5px] leading-normal text-muted">Koreksi diperiksa Kepala Pasar. Bila disetujui, dokumen terbit ulang dengan TTE baru dan versi lama tidak berlaku.</p>
          </main>
          <footer className="sticky bottom-0 border-t border-line bg-white px-4 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))]">
            <button disabled={!ok} className="min-h-[50px] w-full rounded-lg text-[15px] font-semibold enabled:bg-pj enabled:text-white disabled:bg-line disabled:text-[#6B7670]">Kirim koreksi</button>
          </footer>
        </form>
      )}
    </PedagangPage>
  );
}

export default function Page() {
  return <Suspense><Form /></Suspense>;
}
