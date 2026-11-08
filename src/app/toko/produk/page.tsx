"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { Field, WithQ, btn, chip, input } from "@/components/kit";
import { useTokoAktif } from "@/components/toko";
import { KOMODITAS, type Pedagang, type Produk, type State } from "@/lib/model";
import { hapusProduk, rentang, simpanProduk } from "@/lib/store";

export default function Page() {
  return <WithQ>{(q) => <PedagangPage nav={false}>{({ s, p }) => <Form s={s} p={p} id={q("id")} />}</PedagangPage>}</WithQ>;
}

function Form({ s, p, id }: { s: State; p: Pedagang; id: string }) {
  const router = useRouter();
  const [toko] = useTokoAktif(s, p.id);
  const lama = s.produk.find((x) => x.id === id);
  const kel = s.tu.find((t) => t.id === (lama ? s.toko.find((t) => t.id === lama.tokoId)?.tuId : toko?.tuId))?.dagangan ?? "Pangan Kering";
  const kom = KOMODITAS[kel] ?? KOMODITAS["Pangan Kering"];
  const [k, setK] = useState(lama ? Math.max(0, kom.findIndex((x) => x[0] === lama.nama)) : 0);
  const [sat, setSat] = useState(lama?.satuan ?? kom[0][1]);
  const [mode, setMode] = useState<Produk["mode"]>(lama?.mode ?? "rentang");
  const [hMin, setHMin] = useState(String(lama?.hMin ?? kom[0][2]));
  const [hMax, setHMax] = useState(String(lama?.hMax ?? kom[0][3]));
  const [grosir, setGrosir] = useState(lama?.grosir ?? true);
  const [stok, setStok] = useState(lama?.stok ?? true);
  const [err, setErr] = useState("");
  if (!toko && !lama) return <><BackHeader href="/toko/" title="Tambah produk" /><main className="px-4"><Empty>Aktifkan toko dulu.</Empty></main></>;
  const a = parseInt(hMin.replace(/\D/g, ""), 10) || 0, b = mode === "tetap" ? a : parseInt(hMax.replace(/\D/g, ""), 10) || 0;
  const [nm, , rMin, rMax] = kom[k];
  const satuan = [...new Set([kom[k][1], "kg", "liter", "pak", "ikat", "pcs", "karung"])];
  const simpan = () => {
    if (!a || b < a) return setErr("Periksa harga: isi angka, harga atas tidak boleh di bawah harga bawah.");
    simpanProduk({ id: lama?.id, tokoId: lama?.tokoId ?? toko!.id, nama: nm, satuan: sat, mode, hMin: a, hMax: b, grosir, stok });
    router.replace("/toko/");
  };
  return (
    <>
      <BackHeader href="/toko/" title={lama ? "Ubah produk" : "Tambah produk & harga"} sub={`Kelompok e-SIPTU: ${kel}`} />
      <main className="flex flex-1 flex-col gap-3.5 px-4 pb-6">
        <span className="text-[13px] font-semibold text-ink-2">Komoditas</span>
        <div className="flex flex-wrap gap-1.5">{kom.map(([n, s1, x, y], i) => <button key={n} onClick={() => { setK(i); setSat(s1); setHMin(String(x)); setHMax(String(y)); }} className={chip(k === i)}>{n}</button>)}</div>
        <span className="text-[13px] font-semibold text-ink-2">Satuan</span>
        <div className="flex flex-wrap gap-1.5">{satuan.map((x) => <button key={x} onClick={() => setSat(x)} className={chip(sat === x)}>{x}</button>)}</div>
        <span className="text-[13px] font-semibold text-ink-2">Cara menampilkan harga</span>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode("rentang")} className={`${card} border-2 p-3 text-left ${mode === "rentang" ? "border-pj" : ""}`}><b className="block text-sm">Harga rentang</b><span className="text-xs text-muted">Dipastikan saat pesanan masuk, ikut harga pasar</span></button>
          <button onClick={() => setMode("tetap")} className={`${card} border-2 p-3 text-left ${mode === "tetap" ? "border-pj" : ""}`}><b className="block text-sm">Harga tetap</b><span className="text-xs text-muted">Pembeli langsung bayar</span></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label={mode === "tetap" ? `Harga / ${sat}` : "Harga bawah"} id="hmin"><input id="hmin" inputMode="numeric" value={hMin} onChange={(e) => setHMin(e.target.value.replace(/\D/g, ""))} className={`${input} font-mono`} /></Field>
          {mode === "rentang" && <Field label="Harga atas" id="hmax"><input id="hmax" inputMode="numeric" value={hMax} onChange={(e) => setHMax(e.target.value.replace(/\D/g, ""))} className={`${input} font-mono`} /></Field>}
        </div>
        <div className="rounded-xl bg-mint px-3 py-2.5 text-[12.5px] text-mint-ink">Referensi harga Pasar Johar Baru hari ini: {rentang(rMin, rMax)} / {kom[k][1]} (contoh)</div>
        <label className="flex items-center justify-between text-[13.5px]"><span>Harga grosir (≥10 {sat}): <b>{a ? rentang(Math.round((a * 0.96) / 50) * 50, Math.round((a * 0.96) / 50) * 50) : "–"}</b></span><input type="checkbox" checked={grosir} onChange={(e) => setGrosir(e.target.checked)} className="size-5 accent-pj" /></label>
        <label className="flex items-center justify-between text-[13.5px]">Stok tersedia<input type="checkbox" checked={stok} onChange={(e) => setStok(e.target.checked)} className="size-5 accent-pj" /></label>
        <div className="flex flex-col gap-1.5"><span className="text-xs font-bold text-muted">Tampilan di aplikasi pembeli</span>
          <div className={`${card} flex items-center gap-3 p-3`}><div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#EFE9DA] text-xs font-bold text-[#6B5A2E]">FOTO</div><div><b className="block text-sm">{nm}</b><b className="text-base text-[#0E5E43]">{a ? rentang(a, b) : "Rp…"}</b> <span className="text-xs text-muted">/ {sat}</span><div className="text-[11.5px] text-muted">{toko?.nama} · Kios {toko?.tuId} · Johar Baru</div></div></div>
        </div>
        {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
        <button onClick={simpan} className={`${btn} mt-auto`}>Simpan ke e-Katalog</button>
        {lama && <button onClick={() => { hapusProduk(lama.id); router.replace("/toko/"); }} className="text-[13px] font-semibold text-[#7A2E24] underline">Hapus produk</button>}
      </main>
    </>
  );
}
