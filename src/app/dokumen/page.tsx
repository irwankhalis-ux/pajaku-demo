"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { DocQR, Empty } from "@/components/ui";
import { dokOf } from "@/lib/store";

function Dompet() {
  const awal = useSearchParams().get("no");
  const [pick, setPick] = useState<string | null>(awal);
  const [info, setInfo] = useState("");
  return (
    <PedagangPage>
      {({ s, p }) => {
        const docs = dokOf(s, p.id).sort((a, b) => a.tuId.localeCompare(b.tuId) || a.jenis.localeCompare(b.jenis));
        const terbit = docs.filter((d) => d.status === "terbit");
        const cur = terbit.find((d) => d.no === pick) ?? terbit[0];
        const bagikan = async () => {
          const text = `${cur.jenis} ${cur.no} (${cur.tuId}) a.n. ${p.nama} — cek keaslian di portal verifikasi Pasar Jaya.`;
          try {
            if (navigator.share) await navigator.share({ title: cur.no, text });
            else { await navigator.clipboard.writeText(text); setInfo("Teks verifikasi disalin. Tempel di pesan ke bank."); }
          } catch {}
        };
        return (
          <>
            <header className="bg-pj px-[18px] pt-[calc(20px+env(safe-area-inset-top))] pb-[18px] text-white">
              <div className="text-xs text-pj-soft">{p.nama} · {p.id}</div>
              <h1 className="text-lg font-bold">Dompet Dokumen</h1>
              <div className="mt-1 text-[12.5px] text-[#E1EEE7]">{terbit.length} terbit{docs.length > terbit.length ? ` · ${docs.length - terbit.length} menunggu TTE` : ""}</div>
            </header>
            <main className="flex flex-1 flex-col gap-2.5 px-4 py-3.5">
              {docs.length === 0 && <Empty>Belum ada dokumen. e-SHPTU atau e-SIPTU muncul di sini setelah Anda tercatat di sebuah tempat usaha dan dokumen ditandatangani Direksi.</Empty>}
              {docs.map((d) => {
                const on = d.no === cur?.no;
                return (
                  <button key={d.no} disabled={d.status !== "terbit"} onClick={() => { setPick(d.no); setInfo(""); }} aria-pressed={on}
                    className={`flex w-full items-center justify-between gap-2.5 rounded-xl bg-white px-3.5 py-3 text-left ${on ? "border-2 border-pj" : "border border-line"}`}>
                    <span className="min-w-0"><span className="block text-sm font-bold">{d.jenis} · {d.tuId}</span><span className="block truncate font-mono text-xs text-muted">{d.no}</span></span>
                    <span className={`shrink-0 text-xs font-semibold ${d.status === "terbit" ? "text-[#2F6B4F]" : "text-[#9A5B0E]"}`}>{d.status !== "terbit" ? "Menunggu TTE" : on ? "Dibuka" : "Lihat QR ›"}</span>
                  </button>
                );
              })}
              {cur && (
                <section className="flex flex-col items-center gap-2.5 rounded-[14px] border-2 border-pj bg-white p-4">
                  <div className="text-xs font-bold tracking-[.06em] text-muted">{cur.jenis} · {cur.tuId}</div>
                  <DocQR no={cur.no} />
                  <div className="font-mono text-[13.5px] font-medium">{cur.no}</div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    <span className="rounded-full bg-mint px-[9px] py-1 text-[11.5px] font-bold text-mint-ink">✓ TTE Pasar Jaya · {cur.terbit}</span>
                    <span className="rounded-full bg-[#ECEDE7] px-[9px] py-1 text-[11.5px] font-bold text-ink-2">Berlaku {cur.berlaku}</span>
                  </div>
                  <div className="w-full text-[13px] leading-relaxed text-ink-2">{cur.keterangan}</div>
                  <div className="grid w-full grid-cols-2 gap-2">
                    <button onClick={bagikan} className="min-h-[46px] rounded-lg bg-pj text-[13px] font-semibold text-white">Bagikan ke bank</button>
                    <Link href={`/verifikasi/?no=${cur.no}`} className="flex min-h-[46px] items-center justify-center rounded-lg border border-line-2 bg-white text-[13px] font-semibold">Cek di portal</Link>
                  </div>
                  {info && <div className="text-center text-xs font-semibold text-mint-ink" aria-live="polite">{info}</div>}
                </section>
              )}
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}

export default function Page() {
  return <Suspense><Dompet /></Suspense>;
}
