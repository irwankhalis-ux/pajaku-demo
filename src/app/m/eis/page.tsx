"use client";

import Link from "next/link";
import { useState } from "react";
import { Bar2, MPage, mchip } from "@/components/mitra-ui";
import { EWS, JALUR, KAT, PROYEK, TAHAP, jt, ringkas, type Kat } from "@/lib/mitra";

const TABS = ["Ringkasan", "Penjualan", "Konstruksi", "Pelanggan", "Keuangan"] as const;

export default function Eis() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Ringkasan");
  const [kat, setKat] = useState<Kat>("E");
  return (
    <MPage judul="" hp>
      {({ s }) => {
        const r = ringkas(s);
        const aktif = s.esptu.filter((e) => e.status !== "draf" && !e.lunas);
        const telat30 = aktif.filter((e) => e.telat > 30);
        const card = "w-full rounded-[14px] border border-[#E2DED4] bg-white p-3.5";
        const heroes = [
          ["Unit terjual", Math.round((r.terjual / PROYEK.tu) * 100), `${r.terjual}/${PROYEK.tu} · target ${PROYEK.targetUnit}%`, "Penjualan"],
          ["Progres konstruksi", r.progres, `rencana ${s.rencana}%`, "Konstruksi"],
          ["Capaian sales", Math.round((r.nilai / PROYEK.targetSales) * 100), `${jt(r.nilai)} / ${jt(PROYEK.targetSales)}`, "Keuangan"],
          ["Collection", Math.round((r.kas / PROYEK.targetKas) * 100), `${jt(r.kas)} diterima`, "Keuangan"],
        ] as const;
        const pel = s.pelanggan.filter((p) => p.kat === kat);
        const j = KAT[kat].jalur;
        return (
          <div className="flex w-full max-w-[420px] flex-col gap-3">
            <div className="rounded-[14px] bg-[#12302B] p-4 text-white">
              <div className="text-[11px] tracking-[.08em] text-[#A7C3BC]">EIS DIREKSI MITRA · {PROYEK.nama.toUpperCase()}</div>
              <div className="text-xl font-extrabold">{tab}</div>
              <div className="mt-2 grid grid-cols-5 gap-1">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`rounded-lg py-1.5 text-[10.5px] font-semibold ${tab === t ? "bg-white text-[#12302B]" : "bg-[#1A3F38] text-[#D3E4DF]"}`}>{t}</button>)}</div>
            </div>
            {tab === "Ringkasan" && (<>
              <div className="grid w-full grid-cols-2 gap-2">{heroes.map(([l, v, sub, go]) => <button key={l} onClick={() => setTab(go)} className="rounded-[14px] border border-[#E2DED4] bg-white p-3 text-left"><div className="text-xs text-[#5B6168]">{l}</div><div className="text-2xl font-extrabold">{v}%</div><Bar2 v={v} c={v < 80 && l !== "Progres konstruksi" ? "#B85C12" : "#0E6E63"} /><div className="mt-1 text-[11px] text-[#5B6168]">{sub}</div></button>)}</div>
              <div className={card}><b className="text-sm">Perlu perhatian</b>
                {[r.gold / 90 < 0.5 && `Penjualan Gold ${r.gold}/90 — ${s.pelanggan.filter((p) => p.kat === "G" && p.tahap === 0).length} undangan belum direspons`, r.progres < s.rencana && `Konstruksi tertinggal ${s.rencana - r.progres}% dari rencana`, telat30.length && `${telat30.length} akun tertunggak > 30 hari`, r.menungguPJ && `${r.menungguPJ} e-SPTU menunggu TTE Pasar Jaya`].filter(Boolean).map((x) => <div key={x as string} className="mt-1.5 flex gap-2 text-[13px]"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#B85C12]" />{x}</div>)}
              </div>
            </>)}
            {tab === "Penjualan" && (<>
              {(["eks", "gold", "biru"] as const).map((jj) => { const n = s.esptu.filter((e) => e.jalur === jj && e.status !== "draf"); const al = s.units.filter((u) => u.alokasi === jj).length; return <div key={jj} className={card}><div className="flex justify-between text-sm"><b>{JALUR[jj]}</b><span className="font-mono">{n.length} / {al}</span></div><Bar2 v={(n.length / al) * 100} c={jj === "eks" ? "#2E8B57" : jj === "gold" ? "#A88A1E" : "#2D4B8E"} /><div className="mt-1 text-xs text-[#5B6168]">nilai {jt(n.reduce((a, e) => a + e.harga, 0))}</div></div>; })}
              <div className={card}><b className="text-sm">Stok tersisa</b>{["Kering", "Basah", "Semi basah"].map((z) => <div key={z} className="mt-1 flex justify-between text-[13px]"><span>{z}</span><b>{s.units.filter((u) => u.status === "tersedia" && u.alokasi !== "eks" && (u.fk === "L1" ? "Basah" : u.fk === "L3" ? "Semi basah" : "Kering") === z).length} unit</b></div>)}</div>
            </>)}
            {tab === "Konstruksi" && (<>
              <div className={card}><div className="flex justify-between text-sm"><b>Realisasi {r.progres}%</b><span>Rencana {s.rencana}% · SPI {(r.progres / s.rencana).toFixed(2).replace(".", ",")}</span></div><Bar2 v={r.progres} /><div className="mt-1 text-xs text-[#5B6168]">BAST & serah kelola ke Pasar Jaya {PROYEK.selesai}</div></div>
              <div className={card}><b className="text-sm">Update terakhir</b>{s.progres.slice(0, 3).map((p, i) => <div key={i} className="mt-1.5 text-[13px]"><b>{p.t} · {p.persen}%</b> — {p.catatan}</div>)}</div>
            </>)}
            {tab === "Pelanggan" && (<>
              <div className="flex w-full gap-1.5">{(Object.keys(KAT) as Kat[]).map((k) => <button key={k} onClick={() => setKat(k)} className={`${mchip(kat === k)} flex-1`}>{KAT[k].nama}</button>)}</div>
              <div className={card}><b className="text-sm">{KAT[kat].nama} · {pel.length} pelanggan</b>{TAHAP[j].slice(0, 5).map((t, i) => { const n = i === 4 ? s.esptu.filter((e) => e.jalur === j && !e.telat && e.status === "sah" && pel.some((p) => p.id === e.pelangganId)).length : pel.filter((p) => p.tahap >= i).length; return <div key={t} className="mt-1.5"><div className="flex justify-between text-[12.5px]"><span>{t}</span><b>{n}</b></div><Bar2 v={(n / Math.max(1, pel.length)) * 100} c={KAT[kat].warna} /></div>; })}</div>
              <div className={card}><b className="text-sm">Layanan</b><div className="mt-1 grid grid-cols-3 gap-2 text-center text-[12px]"><div><b className="block text-lg">{s.chat.filter((c) => c.tiket?.status === "terbuka").length}</b>tiket terbuka</div><div><b className="block text-lg">{s.chat.reduce((n, c) => n + c.unread, 0)}</b>chat belum dibalas</div><div><b className="block text-lg">7 mnt</b>respons rata²</div></div></div>
            </>)}
            {tab === "Keuangan" && (<>
              <div className={card}><div className="flex justify-between text-sm"><b>Sales · nilai kontrak</b><span>{Math.round((r.nilai / PROYEK.targetSales) * 100)}%</span></div><Bar2 v={(r.nilai / PROYEK.targetSales) * 100} c="#B85C12" /><div className="mt-1 text-xs text-[#5B6168]">{jt(r.nilai)} dari target YTD {jt(PROYEK.targetSales)}</div></div>
              <div className={card}><div className="flex justify-between text-sm"><b>Collection</b><span>{Math.round((r.kas / PROYEK.targetKas) * 100)}%</span></div><Bar2 v={(r.kas / PROYEK.targetKas) * 100} /><div className="mt-1 text-xs text-[#5B6168]">{jt(r.kas)} dari jatuh tempo kumulatif {jt(PROYEK.targetKas)}</div></div>
              <div className={card}><b className="text-sm">Umur piutang</b>{EWS.map((e) => <div key={e.l} className="mt-1 flex items-center gap-2 text-[12.5px]"><span className="size-2.5 rounded-sm" style={{ background: e.c }} /><span className="flex-1">{e.l} · {e.r}</span><b>{aktif.filter((x) => e.f(x.telat)).length} akun</b></div>)}</div>
              <div className="w-full rounded-[14px] bg-[#12302B] p-3.5 text-[13px] text-[#E6F0ED]"><b>Escrow & bank</b>{[["Kas masuk escrow", jt(r.kas)], ["Dicairkan ke Mitra", jt(r.cair)], ["Saldo escrow", jt(r.kas - r.cair)], ["Plafon kredit diproses", jt(s.kredit.reduce((n, k) => n + k.plafon, 0))]].map(([a, b]) => <div key={a} className="mt-1.5 flex justify-between border-t border-[#24524A] pt-1.5"><span className="text-[#C9DCD7]">{a}</span><b className="font-mono">{b}</b></div>)}</div>
            </>)}
            <Link href="/m/dashboard/" className="text-center text-xs text-[#5B6168] underline">Buka konsol lengkap</Link>
          </div>
        );
      }}
    </MPage>
  );
}
