"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PedagangPage, dokUntuk, statusTU } from "@/components/pedagang";
import { BackHeader, card } from "@/components/ui";
import { pedagangById } from "@/lib/store";

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <div className={`${card} px-3.5 py-1`}>
      {rows.map(([k, v], i) => (
        <div key={k} className={`flex justify-between gap-2.5 py-2.5 text-[13.5px] ${i < rows.length - 1 ? "border-b border-[#EFF0EA]" : ""}`}><span className="text-muted">{k}</span><b className="text-right">{v}</b></div>
      ))}
    </div>
  );
}

function Detail() {
  const id = useSearchParams().get("id") ?? "";
  return (
    <PedagangPage>
      {({ s, p, tus }) => {
        const t = tus.find((x) => x.id === id);
        if (!t) return (<><BackHeader href="/beranda/" title="Detail tempat usaha" sub={id} /><main className="flex-1 px-4 text-sm text-ink-2">TU ini tidak tercatat atas nama Anda.</main></>);
        const d = dokUntuk(s, p, t);
        const riwayat = s.log.filter((l) => l.tuId === t.id).slice(0, 6);
        return (
          <>
            <BackHeader href="/beranda/" title="Detail tempat usaha" sub={t.id} />
            <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
              <Rows rows={[["No. tempat usaha", t.noTU], ["Pasar", "Pasar Johar Baru"], ["Lokasi", `Blok ${t.blok} · ${t.lantai === "B" ? "Basah" : "Lt. " + t.lantai.slice(1)} · No. ${t.id.slice(-3)}`], ["Jenis TU · ukuran", `${t.jenis} · ${t.ukuran} (${t.luas} m²)`], ["Zona · dagangan", `${t.zona} · ${t.buka ? t.dagangan : "Kosong"}`], ["Status migrasi", statusTU[t.status]]]} />
              <Rows rows={[["Pemilik (e-SHPTU)", pedagangById(s, t.pemilikId)?.nama ?? "—"], ["Pemakai (e-SIPTU)", pedagangById(s, t.pemakaiId)?.nama ?? "—"], ["Masa hak", t.masaHak], ["Karyawan", t.karyawan]]} />
              <div className="grid grid-cols-2 gap-2">
                {([["e-SHPTU", d.sh], ["e-SIPTU", d.si]] as const).map(([k, doc]) => (
                  <Link key={k} href={doc ? `/dokumen/?no=${doc.no}` : "#"} className={`${card} p-3`}>
                    <span className="block text-sm font-bold">{k}</span>
                    <span className={`block text-xs ${doc?.status === "terbit" ? "text-[#2F6B4F]" : "text-muted"}`}>{doc ? (doc.status === "terbit" ? `Terbit · ${doc.berlaku}` : "Menunggu TTE Direksi") : "Belum terbit"}{doc ? " ›" : ""}</span>
                  </Link>
                ))}
              </div>
              {riwayat.length > 0 && (
                <section className={`${card} p-3.5`}>
                  <h2 className="mb-2 text-sm font-bold">Riwayat terbaru</h2>
                  {riwayat.map((l, i) => <div key={i} className="py-1 text-[13px]"><b>{l.t}</b> · {l.apa}</div>)}
                </section>
              )}
              <Link href={`/koreksi/?id=${t.id}`} className="block rounded-[10px] border-[1.5px] border-pj bg-white p-3.5 text-center text-sm font-semibold text-pj">Data tidak sesuai? Ajukan koreksi</Link>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}

export default function Page() {
  return <Suspense><Detail /></Suspense>;
}
