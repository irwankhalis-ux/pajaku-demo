"use client";

import Link from "next/link";
import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { PinInput, WithQ, btn } from "@/components/kit";
import { pedagangById, putuskanPengelolaPemilik, tuById } from "@/lib/store";

export default function Page() {
  return <WithQ>{(q) => <Persetujuan id={q("id")} />}</WithQ>;
}

function Persetujuan({ id }: { id: string }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <PedagangPage nav={false}>
      {({ s, p }) => {
        const x = s.pengajuan.find((y) => y.id === id && y.data.pemilik === p.id);
        if (!x) return <><BackHeader href="/beranda/" title="Persetujuan Pengelola" /><main className="px-4"><Empty>Pengajuan tidak ditemukan.</Empty></main></>;
        const t = tuById(s, x.tuId!)!;
        const c = pedagangById(s, x.pedagangId)!;
        if (x.tahap > 1 || x.status !== "proses") return (
          <><BackHeader href="/beranda/" title="Persetujuan Pengelola" sub={x.id} /><main className="flex flex-col gap-3 px-4"><div className="rounded-xl bg-mint p-3.5 text-[13.5px] text-mint-ink">{x.status === "ditolak" ? "Anda menolak pengajuan ini." : `Anda sudah menyetujui ${c.nama}. Status: ${x.riwayat[x.riwayat.length - 1].apa}.`}</div><Link href={`/pengajuan/?id=${x.id}`} className="text-sm font-semibold text-pj underline">Lacak pengajuan</Link></main></>
        );
        return (
          <>
            <BackHeader href="/beranda/" title="Persetujuan Pengelola" sub={x.id} />
            <main className="flex flex-1 flex-col gap-3 px-4 pb-6">
              <section className={`${card} flex flex-col gap-1 p-3.5`}>
                <div className="text-[15px] font-bold">{c.nama} ingin menjadi Pengelola</div>
                <div className="text-xs text-muted">{c.id} · NIK terverifikasi · untuk <b className="font-mono">{t.id}</b></div>
                <div className="mt-2 text-[13px]">Periode: <b>{x.data.periode}</b><br />Dagangan: <b>{x.data.dagangan}</b></div>
              </section>
              <p className="rounded-xl bg-paper p-3 text-[13px] leading-relaxed text-ink-2 ring-1 ring-line">{t.buka ? "" : "Kios ini kosong, jadi e-SIPTU & BPP saat ini ditanggung Anda. "}Setelah disetujui, <b>e-SIPTU beralih</b> ke Pengelola dan <b>BPP, listrik &amp; air</b> ditagihkan kepadanya. e-SHPTU (kepemilikan) tetap atas nama Anda; Anda menjadi penjamin.</p>
              <PinInput value={pin} onChange={(v) => { setPin(v); setErr(""); }} label="Setujui dengan PIN PaJaKu" />
              {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
              <div className="mt-auto flex gap-2">
                <button onClick={() => putuskanPengelolaPemilik(x.id, false, "")} className="min-h-12 flex-1 rounded-[10px] bg-mint font-semibold text-mint-ink">Tolak</button>
                <button disabled={pin.length < 6} onClick={() => { const m = putuskanPengelolaPemilik(x.id, true, pin); if (m) setErr(m); }} className={`${btn} flex-[2]`}>Setujui</button>
              </div>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
