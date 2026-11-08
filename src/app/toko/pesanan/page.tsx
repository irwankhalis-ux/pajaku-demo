"use client";

import Link from "next/link";
import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { WithQ, btn, chip } from "@/components/kit";
import { BIAYA_LAYANAN, TAHAP, useTokoAktif } from "@/components/toko";
import type { Pedagang, Pesanan, State } from "@/lib/model";
import { batalPesanan, chatPesanan, majukanPesanan, rentang, rp, totalPesanan } from "@/lib/store";

export default function Page() {
  return <WithQ>{(q) => <PedagangPage>{({ s, p }) => <Isi s={s} p={p} id={q("id")} />}</PedagangPage>}</WithQ>;
}

const cat = (o: Pesanan) => (o.batal ? 3 : o.tahap === 0 ? 0 : o.tahap <= 2 ? 1 : o.tahap === 3 ? 2 : 3);

function Isi({ s, p, id }: { s: State; p: Pedagang; id: string }) {
  const [toko] = useTokoAktif(s, p.id);
  const [tab, setTab] = useState(0);
  const o = s.pesanan.find((x) => x.id === id && s.toko.some((t) => t.id === x.tokoId && t.pedagangId === p.id));
  if (o) return <Detail o={o} />;
  const list = s.pesanan.filter((x) => x.tokoId === toko?.id);
  const tabs = ["Baru", "Diproses", "Dikirim", "Selesai"];
  return (
    <>
      <BackHeader href="/toko/" title="Pesanan" sub={toko?.nama} />
      <main className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
        <div className="grid grid-cols-4 gap-1 rounded-[10px] bg-[#ECEDE7] p-1">{tabs.map((l, i) => <button key={l} onClick={() => setTab(i)} className={`min-h-10 rounded-lg text-[12.5px] font-semibold ${tab === i ? "bg-white" : "text-muted"}`}>{l} {list.filter((x) => cat(x) === i).length}</button>)}</div>
        {list.filter((x) => cat(x) === tab).length === 0 && <Empty>Tidak ada pesanan di sini.</Empty>}
        {list.filter((x) => cat(x) === tab).map((x) => (
          <Link key={x.id} href={`/toko/pesanan/?id=${x.id}`} className={`${card} flex flex-col gap-1 p-3.5`}>
            <span className="flex justify-between gap-2"><span className="font-mono text-xs text-muted">{x.id} · {x.jam}</span><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${x.batal ? "bg-[#FBE3D9] text-[#8A2B1B]" : TAHAP[x.tahap].tone}`}>{x.batal ? "Dibatalkan" : TAHAP[x.tahap].label}</span></span>
            <span className="text-sm font-bold">{x.pembeli} · {x.kirim === "antar" ? "Antar ke rumah" : "Ambil di kios"}</span>
            <span className="text-[13px] text-ink-2">{x.items.map((i) => `${i.nama} ${i.qty} ${i.sat}`).join(", ")}</span>
            <span className="text-[13px] font-bold">{x.tahap === 0 ? rentang(x.items.reduce((n, i) => n + i.hMin * i.qty, 0) + x.ongkir, x.items.reduce((n, i) => n + i.hMax * i.qty, 0) + x.ongkir) : rp(totalPesanan(x) + x.ongkir)}{x.nilai ? ` · ★ ${x.nilai}/5` : ""}</span>
          </Link>
        ))}
      </main>
    </>
  );
}

function Detail({ o }: { o: Pesanan }) {
  const [items, setItems] = useState(o.items.map((i) => ({ ...i, harga: i.harga || i.hMax })));
  const [teks, setTeks] = useState("");
  const kunci = o.tahap > 0 || !!o.batal;
  const cur = kunci ? o.items : items;
  const sub = cur.filter((i) => i.ada).reduce((n, i) => n + i.harga * i.qty, 0);
  const T = TAHAP[o.tahap];
  return (
    <>
      <BackHeader href="/toko/pesanan/" title={`Pesanan ${o.pembeli}`} sub={`${o.id} · ${o.jam}`} />
      <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
        <div className={`rounded-xl px-3.5 py-3 text-[13px] ${o.batal ? "bg-[#FBE3D9] text-[#8A2B1B]" : T.tone}`}><b>{o.batal ? "Dibatalkan" : T.label}</b><br />{o.batal ? "Pembeli menerima notifikasi pembatalan." : T.hint}</div>
        <section className={`${card} flex flex-col gap-2.5 p-3.5`}>
          <div className="flex justify-between text-sm"><b>{o.kirim === "antar" ? "Antar ke rumah" : "Ambil di kios"}</b><span className="text-muted">{o.hpPembeli}</span></div>
          {o.alamat && <div className="-mt-1.5 text-xs text-muted">{o.alamat}</div>}
          {cur.map((i, idx) => {
            const opsi = i.hMin === i.hMax ? [i.hMin] : [i.hMin, Math.round((i.hMin + i.hMax) / 2 / 250) * 250, i.hMax];
            return (
              <div key={idx} className="border-t border-[#EFF0EA] pt-2.5">
                <div className="flex items-center justify-between gap-2"><span><b className="text-sm">{i.nama}</b> <span className="text-xs text-muted">{i.qty} {i.sat} · {rentang(i.hMin, i.hMax)}</span></span>
                  <button disabled={kunci} onClick={() => setItems(items.map((x, j) => (j === idx ? { ...x, ada: !x.ada } : x)))} className={`rounded-full px-2 py-1 text-[11px] font-bold ${i.ada ? "bg-[#DDF2E8] text-[#0B5A40]" : "bg-[#FBE3D9] text-[#8A2B1B]"}`}>{i.ada ? "Tersedia" : "Stok habis"}</button></div>
                {!kunci && i.ada && opsi.length > 1 && <div className="mt-1.5 flex gap-1.5">{opsi.map((h) => <button key={h} onClick={() => setItems(items.map((x, j) => (j === idx ? { ...x, harga: h } : x)))} className={chip(i.harga === h)}>{h.toLocaleString("id-ID")}</button>)}</div>}
                <div className="mt-1 text-xs text-ink-2">{i.ada ? `${i.qty} × ${rp(i.harga)} = ${rp(i.qty * i.harga)}` : "Tidak ditagihkan"}</div>
              </div>
            );
          })}
        </section>
        <section className={`${card} flex flex-col gap-1.5 p-3.5 text-[13px]`}>
          <b className="text-sm">Rincian dana</b>
          <div className="flex justify-between"><span className="text-muted">Barang</span><b>{rp(sub)}</b></div>
          {o.ongkir > 0 && <div className="flex justify-between"><span className="text-muted">Ongkos kurir mitra (dibayar pembeli)</span><b>{rp(o.ongkir)}</b></div>}
          <div className="flex justify-between"><span className="text-muted">Biaya layanan TokoPaja (usulan 2%)</span><b>−{rp(sub * BIAYA_LAYANAN)}</b></div>
          <div className="flex justify-between border-t border-[#EFF0EA] pt-1.5 text-[15px]"><b>Diterima pedagang</b><b className="text-pj">{rp(sub * (1 - BIAYA_LAYANAN))}</b></div>
          <span className="text-[11.5px] text-muted">Dana ditahan di rekening penampung bank mitra dan diteruskan setelah pembeli konfirmasi terima.</span>
        </section>
        <section className={`${card} flex flex-col gap-2 p-3.5`}>
          <b className="text-sm">Percakapan</b>
          {o.chat.map((m, i) => <div key={i} className={`flex ${m.who === "t" ? "justify-end" : m.who === "s" ? "justify-center" : "justify-start"}`}><div className={`max-w-[85%] rounded-xl px-3 py-2 text-[12.5px] ${m.who === "t" ? "bg-pj text-white" : m.who === "s" ? "bg-paper text-muted" : "border border-line bg-white"}`}>{m.text}</div></div>)}
          {!o.batal && o.tahap < 4 && (<>
            <div className="flex gap-1.5 overflow-x-auto">{["Harga sudah saya pastikan, silakan dibayar ya.", "Pesanan sedang disiapkan.", "Maaf, stok habis hari ini."].map((q) => <button key={q} onClick={() => chatPesanan(o.id, q)} className="shrink-0 rounded-full border border-line-2 bg-white px-2.5 py-1.5 text-[11.5px]">{q}</button>)}</div>
            <form onSubmit={(e) => { e.preventDefault(); if (teks.trim()) { chatPesanan(o.id, teks.trim()); setTeks(""); } }} className="flex gap-2"><label htmlFor="ct" className="sr-only">Pesan ke pembeli</label><input id="ct" value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Tulis pesan" className="min-h-11 min-w-0 flex-1 rounded-lg border border-line-2 px-3 text-sm" /><button className="rounded-lg bg-pj px-4 text-sm font-semibold text-white">Kirim</button></form>
          </>)}
        </section>
        {o.tahap === 4 && o.nilai && <div className="rounded-xl bg-[#DDF2E8] p-3.5 text-[13px] text-[#0B4A35]"><b>Selesai · ★ {o.nilai}/5</b><br />“{o.ulasan}”</div>}
        {!o.batal && o.tahap < 4 && (
          <div className="flex gap-2">
            {o.tahap === 0 && <button onClick={() => batalPesanan(o.id)} className="min-h-12 flex-1 rounded-[10px] border border-line-2 bg-white text-sm font-semibold">Tolak</button>}
            <button disabled={o.tahap === 0 && !items.some((i) => i.ada)} onClick={() => majukanPesanan(o.id, o.tahap === 0 ? items : undefined)} className={`${btn} flex-[2]`}>{T.act}</button>
          </div>
        )}
      </main>
    </>
  );
}
