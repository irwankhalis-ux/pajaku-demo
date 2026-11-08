"use client";

import Link from "next/link";
import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { WithQ, btn } from "@/components/kit";
import { perpanjangSiptu, siptuAktif, tuById, load } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Page() {
  return <WithQ>{(q) => <Perpanjang tuAwal={q("tu")} />}</WithQ>;
}

function Perpanjang({ tuAwal }: { tuAwal: string }) {
  const router = useRouter();
  const [pilih, setPilih] = useState(tuAwal);
  const [err, setErr] = useState("");
  return (
    <PedagangPage nav={false}>
      {({ s, p }) => {
        const list = siptuAktif(s, p.id);
        const d = list.find((x) => x.tuId === pilih) ?? list[0];
        if (!d) return <><BackHeader href="/beranda/" title="Perpanjangan e-SIPTU" /><main className="px-4"><Empty>Tidak ada e-SIPTU aktif atas nama Anda.</Empty></main></>;
        const t = tuById(s, d.tuId)!;
        const proses = s.dok.some((x) => x.tuId === d.tuId && x.jenis === "e-SIPTU" && x.status === "menunggu");
        const syarat: [string, boolean][] = [["e-SIPTU aktif atas nama Anda", true], ["NIK terverifikasi", true], ["BPP lancar (tanpa tunggakan)", t.tunggakan === 0], ["Dagangan sesuai zona", true]];
        return (
          <>
            <BackHeader href="/beranda/" title="Perpanjangan e-SIPTU" sub="Perpanjang kilat 1 tahun" />
            <main className="flex flex-1 flex-col gap-3 px-4 pb-6">
              {list.length > 1 && <div className="flex flex-wrap gap-1.5">{list.map((x) => <button key={x.no} onClick={() => setPilih(x.tuId)} className={`rounded-full border px-3 py-1.5 font-mono text-xs ${x.tuId === d.tuId ? "border-pj bg-pj text-white" : "border-line-2 bg-white"}`}>{x.tuId}</button>)}</div>}
              <section className={`${card} p-3.5 text-[13.5px]`}><div className="font-mono text-xs text-muted">{d.no}</div><div className="text-[15px] font-bold">{d.tuId} · {t.jenis} {t.luas} m²</div><div className="text-muted">Berlaku {d.berlaku} → <b className="text-ink">s.d. 31 Des 2027</b></div></section>
              <section className={`${card} flex flex-col gap-2 p-3.5`}>
                <h2 className="text-sm font-bold">Syarat perpanjangan kilat</h2>
                {syarat.map(([l, v]) => <div key={l} className="flex items-center gap-2 text-[13.5px]"><span className={`flex size-5 items-center justify-center rounded-full text-[11px] text-white ${v ? "bg-pj" : "bg-[#B5531B]"}`}>{v ? "✓" : "!"}</span>{l}</div>)}
              </section>
              <p className="text-xs text-muted">Tanpa biaya administrasi selama pilot. Dokumen baru ditandatangani elektronik Direksi; dokumen lama otomatis tidak berlaku.</p>
              {t.tunggakan > 0 && <Link href="/keuangan/" className="text-sm font-semibold text-pj underline">Lunasi tunggakan BPP dulu ›</Link>}
              {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
              <button disabled={proses || t.tunggakan > 0} onClick={() => { const m = perpanjangSiptu(p.id, d.tuId); if (m) return setErr(m); router.replace(`/pengajuan/?id=${load().pengajuan[0].id}`); }} className={`${btn} mt-auto`}>{proses ? "Sedang diproses" : "Perpanjang sekarang"}</button>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
