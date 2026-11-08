"use client";

import { PedagangPage } from "@/components/pedagang";
import { BackHeader, card } from "@/components/ui";
import { Pill } from "@/components/kit";
import { PROGRAM, KATEGORI } from "@/lib/model";
import { ajukanProgram } from "@/lib/store";

export default function Program() {
  return (
    <PedagangPage>
      {({ s, p, kat }) => (
        <>
          <BackHeader href="/beranda/" title="Kredit & program" sub={`Untuk ${KATEGORI[kat].nama} · ${KATEGORI[kat].peran}`} />
          <main className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
            {PROGRAM.map((pr) => {
              const boleh = pr.untuk.includes(kat);
              const sudah = s.pengajuan.some((x) => x.jenis === "program" && x.pedagangId === p.id && x.data.program === pr.id);
              return (
                <div key={pr.id} className={`${card} flex items-center gap-3 p-3.5 ${boleh ? "" : "opacity-60"}`}>
                  <div className="min-w-0 flex-1"><div className="text-sm font-bold">{pr.judul}</div><div className="text-xs text-muted">{pr.ket}</div>{!boleh && <div className="mt-1 text-[11.5px] text-muted">Untuk {pr.untuk.map((x) => KATEGORI[x as keyof typeof KATEGORI].nama).join(", ")}</div>}</div>
                  {sudah ? <Pill>Terkirim</Pill> : <button disabled={!boleh} onClick={() => ajukanProgram(p.id, pr.id)} className="rounded-lg bg-pj px-3 py-2 text-xs font-semibold text-white disabled:bg-line disabled:text-muted">Ajukan</button>}
                </div>
              );
            })}
            <p className="text-xs leading-relaxed text-muted">Data dokumen dibagikan ke bank hanya atas persetujuan Anda. Riwayat bayar BPP tepat waktu memperkuat penilaian kredit.</p>
          </main>
        </>
      )}
    </PedagangPage>
  );
}
