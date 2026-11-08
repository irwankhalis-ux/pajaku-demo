"use client";

import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { PinInput, Pill, Sheet, btn, chip } from "@/components/kit";
import { bayarTagihan, rp } from "@/lib/store";
import { PIN_DEMO, type Tagihan } from "@/lib/model";

const METODE = [["QRIS", "Semua bank & e-wallet"], ["VA Bank Jakarta", "Transfer virtual account"], ["JakOne Pay", "Dompet digital Bank Jakarta"], ["Debit poin", "Potong 1.000 poin = Rp10.000"]];

export default function Keuangan() {
  const [bayar, setBayar] = useState<Tagihan | null>(null);
  const [metode, setMetode] = useState("QRIS");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"belum" | "riwayat">("belum");
  return (
    <PedagangPage>
      {({ s, p }) => {
        const all = s.tagihan.filter((t) => t.pedagangId === p.id);
        const belum = all.filter((t) => t.status !== "lunas");
        const lunas = all.filter((t) => t.status === "lunas");
        const list = tab === "belum" ? belum : lunas;
        return (
          <>
            <BackHeader href="/beranda/" title="Keuangan" sub="BPP · HPTU · poin" />
            <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
              <section className="rounded-2xl bg-[#0F2A20] p-4 text-white">
                <div className="text-xs text-[#9DB5A8]">Total belum dibayar</div>
                <div className="text-[26px] font-bold">{rp(belum.reduce((n, t) => n + t.jumlah, 0))}</div>
                <div className="mt-2 grid grid-cols-3 gap-2 border-t border-[#24493A] pt-2 text-center text-[11px] text-[#C9D8CF]">
                  <div><b className="block text-base text-white">{belum.length}</b>tagihan</div>
                  <div><b className="block text-base text-white">{lunas.length}</b>lunas</div>
                  <div><b className="block text-base text-white">{(s.poin[p.id] ?? 0).toLocaleString("id-ID")}</b>poin</div>
                </div>
              </section>
              <div className="flex gap-2"><button onClick={() => setTab("belum")} className={chip(tab === "belum")}>Belum dibayar</button><button onClick={() => setTab("riwayat")} className={chip(tab === "riwayat")}>Riwayat</button></div>
              {list.length === 0 && <Empty>{tab === "belum" ? "Tidak ada tagihan. Terima kasih sudah membayar tepat waktu." : "Belum ada pembayaran."}</Empty>}
              {list.map((t) => (
                <div key={t.id} className={`${card} flex items-center gap-3 p-3.5`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5"><span className="text-sm font-bold">{t.jenis} {t.periode}</span>{t.status === "terlambat" && <Pill tone="bg-[#F7E3E0] text-[#7A2E24]">Terlambat</Pill>}</div>
                    <div className="font-mono text-xs text-muted">{t.tuId} · {t.status === "lunas" ? `lunas ${t.bayar?.tgl} · ${t.bayar?.metode}` : `jatuh tempo ${t.jatuhTempo}`}</div>
                  </div>
                  <div className="text-right"><div className="text-sm font-bold">{rp(t.jumlah)}</div>{t.status !== "lunas" && <button onClick={() => { setBayar(t); setPin(""); setErr(""); }} className="mt-1 rounded-lg bg-pj px-3 py-1.5 text-xs font-semibold text-white">Bayar</button>}</div>
                </div>
              ))}
              <p className="text-xs leading-relaxed text-muted">BPP ditagihkan ke pemegang e-SIPTU (atau Pemilik bila kios kosong). Bayar sebelum jatuh tempo: +20 poin per tagihan.</p>
              <Sheet open={!!bayar} onClose={() => setBayar(null)} title={`Bayar ${bayar?.jenis} ${bayar?.periode}`}>
                {bayar && (<>
                  <div className="text-[26px] font-bold">{rp(bayar.jumlah)}</div>
                  <div className="flex flex-col gap-1.5">{METODE.map(([m, d]) => <button key={m} onClick={() => setMetode(m)} className={`flex items-center justify-between rounded-xl border-2 p-3 text-left ${metode === m ? "border-pj" : "border-line"}`}><span><b className="block text-sm">{m}</b><span className="text-xs text-muted">{d}</span></span>{metode === m && "✓"}</button>)}</div>
                  <PinInput value={pin} onChange={setPin} label="Konfirmasi PIN" />
                  {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
                  <button className={btn} onClick={() => { if (pin !== PIN_DEMO) return setErr("PIN salah."); bayarTagihan(bayar.id, metode); setBayar(null); }}>Bayar sekarang (simulasi)</button>
                </>)}
              </Sheet>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
