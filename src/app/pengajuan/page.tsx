"use client";

import Link from "next/link";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { Pill, Timeline, WithQ, btn2 } from "@/components/kit";
import { simulasiProsesKantor, pedagangById } from "@/lib/store";
import type { Pengajuan } from "@/lib/model";

// tahap minimal agar langkah dianggap selesai
const ALUR: Record<Pengajuan["jenis"], [string, string, number][]> = {
  migrasi: [["Data & foto dikirim dari aplikasi", "Menggantikan antre di loket", 2], ["Verifikasi Kepala Pasar", "Cek SHPTU kertas, NIK & kesesuaian kios", 3], ["Tanda tangan elektronik Direksi", "TTE tersertifikasi", 4], ["e-SHPTU & e-SIPTU terbit", "Masuk Dompet Dokumen", 4]],
  pengelola: [["Pengajuan terkirim", "", 1], ["Persetujuan Pemilik (PIN)", "Lewat aplikasi Pemilik · batas 3×24 jam", 2], ["Verifikasi Kepala Pasar", "Cek NIK & kesesuaian penghuni kios", 3], ["e-SIPTU dialihkan ke nama Anda", "Aktif sebagai Pengelola · Gold · BPP ditagihkan ke Anda", 4]],
  perpanjangan: [["Syarat dicek otomatis", "BPP lancar · NIK terverifikasi", 3], ["Tanda tangan elektronik Direksi", "", 4], ["e-SIPTU baru berlaku s.d. 31 Des 2027", "", 4]],
  program: [["Minat terkirim", "", 1], ["Dihubungi mitra lewat aplikasi", "Bank DKI / Dinas PPKUKM", 2]],
};

export default function Page() {
  return <WithQ>{(q) => <Detail id={q("id")} />}</WithQ>;
}

function Detail({ id }: { id: string }) {
  return (
    <PedagangPage>
      {({ s, p }) => {
        const mine = s.pengajuan.filter((x) => x.pedagangId === p.id || x.data.pemilik === p.id);
        const x = mine.find((y) => y.id === id);
        if (!x) return (
          <>
            <BackHeader href="/beranda/" title="Pengajuan saya" sub={`${mine.length} pengajuan`} />
            <main className="flex flex-1 flex-col gap-2 px-4 pb-4">
              {mine.length === 0 && <Empty>Belum ada pengajuan. Migrasi SHPTU, registrasi Pengelola, perpanjangan e-SIPTU dan program muncul di sini.</Empty>}
              {mine.map((y) => <Link key={y.id} href={`/pengajuan/?id=${y.id}`} className={`${card} flex items-center justify-between gap-2 p-3.5`}><span className="min-w-0"><span className="block font-mono text-xs text-muted">{y.id} · {y.dibuat}</span><span className="block text-sm font-semibold">{y.judul}</span></span><St x={y} /></Link>)}
            </main>
          </>
        );
        const items = ALUR[x.jenis].map(([t, sub, min], i, arr) => ({ t, s: sub, done: x.tahap >= min && (x.status === "disetujui" || i < arr.length - 1 || x.tahap >= 4), now: x.status === "proses" && x.tahap < min && (i === 0 || x.tahap >= arr[i - 1][2]) }));
        const pemohon = x.pedagangId !== p.id ? pedagangById(s, x.pedagangId)?.nama : null;
        return (
          <>
            <BackHeader href="/pengajuan/" title={x.judul} sub={x.id} />
            <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
              <div className="flex items-center gap-2"><St x={x} /><span className="text-xs text-muted">Diajukan {x.dibuat}{pemohon ? ` oleh ${pemohon}` : ""}</span></div>
              <section className={`${card} p-4`}><Timeline items={items} /></section>
              <section className={`${card} p-3.5`}>
                <h2 className="mb-1.5 text-sm font-bold">Riwayat</h2>
                {x.riwayat.map((r, i) => <div key={i} className="border-t border-[#EFF0EA] py-1.5 text-[13px] first:border-0"><b>{r.t}</b> · {r.apa}</div>)}
              </section>
              {x.status === "disetujui" && x.tuId && <Link href="/dokumen/" className={btn2}>Buka Dompet Dokumen</Link>}
              {x.status === "proses" && x.jenis !== "program" && !(x.jenis === "pengelola" && x.tahap < 2 && x.pedagangId !== p.id) && (
                <div className="rounded-xl border border-dashed border-[#B9BFB6] bg-white p-3.5 text-[12.5px] leading-relaxed text-ink-2">
                  <b>Mode uji coba tanpa server.</b> Di lapangan, langkah berikut dikerjakan Kepala Pasar &amp; Direksi lewat aplikasi Konsol Pasar Jaya. Untuk demo di satu HP:
                  <button onClick={() => simulasiProsesKantor(x.id)} className="mt-2 flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0F2A20] text-[13.5px] font-semibold text-white">Simulasikan proses kantor &amp; TTE</button>
                </div>
              )}
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}

function St({ x }: { x: Pengajuan }) {
  if (x.status === "disetujui") return <Pill>Selesai</Pill>;
  if (x.status === "ditolak") return <Pill tone="bg-[#F7E3E0] text-[#7A2E24]">Ditolak / perlu dilengkapi</Pill>;
  return <Pill tone="bg-[#FBEFD9] text-[#6E4A12]">Diproses</Pill>;
}
