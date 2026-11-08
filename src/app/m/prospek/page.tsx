"use client";

import Link from "next/link";
import { useState } from "react";
import { MPage, MKpi, Tag, mbtn, mchip, mgrid, panel } from "@/components/mitra-ui";
import { TAHAP, majukanPelanggan, tambahProspek } from "@/lib/mitra";

const ASAL = ["Instagram", "TikTok", "Walk-in", "Referensi", "Pameran"];

export default function Prospek() {
  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [asal, setAsal] = useState("Instagram");
  const [kol, setKol] = useState(0);
  return (
    <MPage judul="Prospek Biru (pedagang baru)" sub="Tanpa undian · siapa cepat dia dapat · harga umum">
      {({ s, staf }) => {
        const biru = s.pelanggan.filter((p) => p.kat === "B");
        const st = [0, 1, 2, 3, 4].map((t) => biru.filter((p) => (t === 4 ? p.tahap >= 4 : p.tahap === t)));
        const sumber = ASAL.map((a) => [a, biru.filter((p) => p.asal === a).length] as const);
        const maxS = Math.max(...sumber.map((x) => x[1]), 1);
        return (
          <>
            <section className={mgrid}>
              <MKpi l="Prospek aktif" v={st[0].length + st[1].length + st[2].length} s="684 total sejak peluncuran (ilustrasi)" />
              <MKpi l="Booking fee" v={st[2].length} s="Rp5 jt · unit ditahan 7 hari" />
              <MKpi l="e-SPTU Biru" v={st[3].length + st[4].length} s={`dari 129 alokasi`} />
              <MKpi l="Konversi" v={`${Math.round(((st[3].length + st[4].length) / Math.max(1, biru.length)) * 100)}%`} s="prospek → e-SPTU" />
            </section>
            <div className="flex flex-wrap gap-1.5">{["Prospek", "Kunjungan", "Booking fee", "e-SPTU proses", "e-SPTU sah"].map((l, i) => <button key={l} onClick={() => setKol(i)} className={mchip(kol === i)}>{l} · {st[i].length}</button>)}</div>
            <section className={`${panel} flex flex-col`}>
              {st[kol].slice(0, 40).map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-2 border-t border-[#EFECE4] py-2 text-[13px] first:border-0">
                  <Link href={`/m/crm/?id=${p.id}`} className="min-w-0 flex-1"><b>{p.nama}</b><br /><span className="text-xs text-[#5B6168]">{p.id} · {p.asal} · PIC {p.pic}</span></Link>
                  {kol < 2 && <button onClick={() => majukanPelanggan(p.id, staf.nama)} className="rounded-lg bg-[#DCEFEA] px-3 py-2 text-xs font-semibold text-[#0A5249]">→ {TAHAP.biru[p.tahap + 1]}</button>}
                  {kol === 2 && <Link href={`/m/pesanan/?p=${p.id}`} className="rounded-lg bg-[#0E6E63] px-3 py-2 text-xs font-semibold text-white">Pilih unit & e-SPTU</Link>}
                  {kol >= 3 && <Tag tone="bg-[#DCEFEA] text-[#0A5249]">{s.units.find((u) => u.pelangganId === p.id)?.code ?? ""}</Tag>}
                </div>
              ))}
            </section>
            <section className="grid gap-3 md:grid-cols-2">
              <form onSubmit={(e) => { e.preventDefault(); if (nama.trim().length > 2) { tambahProspek(nama.trim(), hp, asal, staf.nama); setNama(""); setHp(""); setKol(0); } }} className={`${panel} flex flex-col gap-2`}>
                <h2 className="text-[15px] font-bold">Tambah prospek</h2>
                <input aria-label="Nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama / badan usaha" className="min-h-11 rounded-lg border border-[#CFCABD] px-3" />
                <input aria-label="No HP" value={hp} onChange={(e) => setHp(e.target.value)} placeholder="No HP (terdaftar PaJaKu)" inputMode="tel" className="min-h-11 rounded-lg border border-[#CFCABD] px-3" />
                <div className="flex flex-wrap gap-1.5">{ASAL.map((a) => <button type="button" key={a} onClick={() => setAsal(a)} className={mchip(asal === a)}>{a}</button>)}</div>
                <button className={mbtn}>Simpan prospek</button>
              </form>
              <div className={`${panel} flex flex-col gap-2`}>
                <h2 className="text-[15px] font-bold">Sumber prospek</h2>
                {sumber.map(([a, n]) => <div key={a} className="grid grid-cols-[90px_1fr_30px] items-center gap-2 text-[13px]"><span>{a}</span><div className="h-3 rounded bg-[#EFECE4]"><div className="h-3 rounded bg-[#2D4B8E]" style={{ width: `${(n / maxS) * 100}%` }} /></div><b className="text-right">{n}</b></div>)}
              </div>
            </section>
          </>
        );
      }}
    </MPage>
  );
}
