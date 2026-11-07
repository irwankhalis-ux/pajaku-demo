"use client";

import { useRouter } from "next/navigation";
import { PedagangPage } from "@/components/pedagang";
import { card } from "@/components/ui";
import { KATEGORI, type Kategori } from "@/lib/model";
import { keluar, pedagangById } from "@/lib/store";

export default function Akun() {
  const router = useRouter();
  return (
    <PedagangPage>
      {({ s, p, kat, tus }) => {
        const k = KATEGORI[kat];
        const pengelola = tus.filter((t) => t.pemilikId === p.id && t.pemakaiId !== p.id);
        const pemilikLain = tus.filter((t) => t.pemakaiId === p.id && t.pemilikId !== p.id);
        return (
          <>
            <header className="px-4 pt-[calc(22px+env(safe-area-inset-top))] pb-2"><h1 className="text-xl font-bold">Akun saya</h1></header>
            <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
              <section className={`${card} flex items-center gap-3 p-3.5`}>
                <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: k.warna }}>{p.nama.replace(/^(H|Hj)\. /, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                <div className="min-w-0"><div className="text-base font-bold">{p.nama}</div><div className="font-mono text-[12.5px] text-muted">{p.id}</div><div className="text-[12.5px] text-muted">{p.hp.slice(0, 4)}••••{p.hp.slice(-4)} · NIK {p.nik.slice(0, 4)}••••••••{p.nik.slice(-4)}</div></div>
              </section>
              <section className={`${card} flex flex-col gap-2.5 p-3.5`}>
                <h2 className="text-[15px] font-bold">Kategori pedagang</h2>
                <div className="grid grid-cols-4 gap-[5px]">
                  {(Object.keys(KATEGORI) as Kategori[]).map((x) => (
                    <div key={x} className={`flex flex-col items-center gap-1 rounded-[10px] border-2 px-0.5 py-2 text-[11px] leading-tight font-bold ${x === kat ? "border-ink bg-white" : "border-transparent bg-paper text-muted"}`}>
                      <span className="size-5 rounded-full" style={{ background: KATEGORI[x].grad }} />{KATEGORI[x].nama}<span className="text-[9.5px] font-semibold">{KATEGORI[x].id}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-[10px] bg-paper p-3 text-[13px] leading-relaxed"><b>{k.nama} ({k.id}) · {k.peran}</b><br />{k.desc}</div>
                <div className="text-xs text-muted">Kategori = peran tertinggi Anda atas TU mana pun, dibaca dari e-SHPTU dan e-SIPTU.</div>
              </section>
              {(pengelola.length > 0 || pemilikLain.length > 0) && (
                <section className={`${card} flex flex-col gap-1.5 p-3.5`}>
                  <h2 className="text-[15px] font-bold">Pengelola</h2>
                  {pengelola.map((t) => <p key={t.id} className="text-[13px] text-ink-2"><b>{t.id}</b> · dikelola {pedagangById(s, t.pemakaiId)?.nama}. Anda tetap penjamin BPP.</p>)}
                  {pemilikLain.map((t) => <p key={t.id} className="text-[13px] text-ink-2"><b>{t.id}</b> · Anda Pengelola atas persetujuan Pemilik {pedagangById(s, t.pemilikId)?.nama}.</p>)}
                </section>
              )}
              <div className="rounded-xl bg-mint px-3.5 py-3 text-[12.5px] leading-relaxed text-mint-ink">Data Anda dikelola Perumda Pasar Jaya dan hanya dibagikan ke pihak lain (mis. bank) atas permintaan Anda.</div>
              <button onClick={() => { keluar(); router.replace("/"); }} className="min-h-[46px] rounded-lg border border-line-2 bg-white text-sm font-semibold text-[#7A2E24]">Keluar</button>
              <div className="text-center text-[11.5px] text-[#6B7670]">PaJaKu 0.2 · Powered by Patrol Indonesia Raya</div>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
