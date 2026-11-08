"use client";

import Link from "next/link";
import { useState } from "react";
import { KPage, ST, kbtn, kchip, kpanel } from "@/components/kulakan-ui";
import { WithQ } from "@/components/kit";
import { BANK, BAYAR, isDO, konfirmasi, m, rp, simulasiPesanan, skuBy, tokoBy, tolak, totalP, ubahQty, type KState, type Staf } from "@/lib/kulakan";

export default function Page() {
  return <WithQ>{(q) => <KPage judul={q("id") ? "" : "Pesanan dari TokoPaja"} sub={q("id") ? "" : "Pedagang ber-e-SIPTU memesan lewat menu Kulakan di aplikasi TokoPaja"}>{({ s, staf }) => (q("id") ? <Detail s={s} staf={staf} id={q("id")} /> : <List s={s} staf={staf} />)}</KPage>}</WithQ>;
}

function List({ s, staf }: { s: KState; staf: Staf }) {
  const [f, setF] = useState<string>("baru");
  const list = s.pesanan.filter((p) => p.status === f && (!staf.grup || skuBy(s, p.items[0].sku)?.grup === staf.grup));
  return (
    <>
      <div className="flex flex-wrap gap-1.5">{["baru", "dikonfirmasi", "dikirim", "diterima", "ditolak"].map((k) => <button key={k} onClick={() => setF(k)} className={kchip(f === k)}>{k} · {s.pesanan.filter((p) => p.status === k && (!staf.grup || skuBy(s, p.items[0].sku)?.grup === staf.grup)).length}</button>)}</div>
      <section className={`${kpanel} flex flex-col p-2`}>
        {list.map((p) => { const t = tokoBy(s, p.tokoId)!; return (
          <Link key={p.id} href={`/kp/pesanan/?id=${p.id}`} className="flex flex-col gap-0.5 rounded-lg p-2.5 text-[13px]">
            <span className="flex justify-between gap-2"><b>{t.nama}</b><span className="font-mono text-xs text-[#4B5563]">{p.id}</span></span>
            <span className="text-xs text-[#4B5563]">{t.pasar} · {t.kios} · {p.t} · {p.agent}</span>
            <span>{p.items.map((i) => `${skuBy(s, i.sku)?.nama} × ${i.qty}`).join(", ")} · <b>{m(totalP(p))}</b> · {BAYAR[p.bayar]}{p.doStatus ? ` (${p.doStatus})` : ""}</span>
          </Link>
        ); })}
        {!list.length && <div className="p-3 text-[13px] text-[#4B5563]">Kosong.</div>}
      </section>
      <button onClick={() => simulasiPesanan()} className="self-start rounded-lg border border-dashed border-[#9CA3AF] bg-white px-3 py-2 text-xs font-semibold">Simulasi: toko TokoPaja memesan</button>
    </>
  );
}

function Detail({ s, staf, id }: { s: KState; staf: Staf; id: string }) {
  const p = s.pesanan.find((x) => x.id === id);
  if (!p) return <div className={kpanel}>Pesanan tidak ditemukan.</div>;
  const t = tokoBy(s, p.tokoId)!;
  const tot = totalP(p);
  const langkah = ["DO dibuat", "Bank setuju", "Diterima kios", "Bank bayar"];
  const n = p.doStatus === "dibayar" ? 4 : p.status === "diterima" ? 3 : p.doStatus === "disetujui" ? 2 : 1;
  const edit = p.status === "baru" && staf.peran !== "delivery";
  return (
    <>
      <div className="flex items-center gap-2"><Link href="/kp/pesanan/" aria-label="Kembali" className="flex size-11 items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white">‹</Link><div><div className="text-[17px] font-extrabold">Pesanan {p.id}</div><div className="text-xs text-[#4B5563]">Ditangani {p.agent} · <span className={`rounded-full px-2 py-0.5 font-bold ${ST[p.status]}`}>{p.status}</span></div></div></div>
      {p.status === "dikonfirmasi" && <div className="rounded-[14px] bg-[#DCFCE7] px-3.5 py-3 text-sm font-bold text-[#14532D]">Dikonfirmasi · masuk rute {p.hub}, {p.slot}</div>}
      {p.doStatus === "melebihi plafon" && <div className="rounded-[14px] bg-[#FEE2E2] px-3.5 py-3 text-sm font-bold text-[#991B1B]">Melebihi plafon DO Bank Jakarta — kurangi jumlah atau minta pembeli bayar QRIS/VA</div>}
      <section className={`${kpanel} flex flex-col gap-1.5`}>
        <div className="text-xs font-bold text-[#4B5563]">Pembeli · TokoPaja</div>
        <div className="flex items-center justify-between gap-2"><span><b className="text-base">{t.nama}</b><br /><span className="text-xs text-[#4B5563]">Kios {t.kios} · {t.pasar}</span></span><span className="rounded-full bg-[#DCFCE7] px-2 py-1 text-[11px] font-bold text-[#14532D]">e-SIPTU aktif</span></div>
        <div className="flex flex-wrap gap-1.5 text-xs"><span className="rounded-md bg-[#F3F4F6] px-2 py-1">Pelanggan sejak {t.sejak}</span><span className="rounded-md bg-[#F3F4F6] px-2 py-1">{t.pesanan} pesanan · 0 retur</span><span className="rounded-md bg-[#F3F4F6] px-2 py-1">{({ E: "Emerald", P: "Platinum", G: "Gold", B: "Biru" })[t.kat]}</span></div>
      </section>
      <section className={`${kpanel} flex flex-col gap-2.5`}>
        <b className="text-sm">Barang</b>
        {p.items.map((i) => { const k = skuBy(s, i.sku)!; return (
          <div key={i.sku} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2"><span><b className="text-sm">{k.nama} · {k.satuan} {k.isi}</b><br /><span className={`text-xs font-semibold ${k.stok >= i.qty ? "text-[#15803D]" : "text-[#B91C1C]"}`}>Stok Jakgrosir {k.stok.toLocaleString("id-ID")} {k.satuan} · {k.stok >= i.qty ? "cukup" : "kurang"}</span></span>
              {edit ? <span className="flex items-center rounded-[10px] border border-[#D1D5DB]"><button onClick={() => ubahQty(p.id, i.sku, i.qty - 1)} aria-label="Kurangi" className="h-11 w-10 text-lg">−</button><b className="w-7 text-center">{i.qty}</b><button onClick={() => ubahQty(p.id, i.sku, i.qty + 1)} aria-label="Tambah" className="h-11 w-10 text-lg">+</button></span> : <b>× {i.qty}</b>}
            </div>
            <div className="flex justify-between text-[13px] text-[#4B5563]"><span>Harga tingkat {k.tiers.map(([mn]) => mn).reverse().find((mn) => i.qty >= mn)}+ {k.satuan}</span><span>{rp(i.harga)}</span></div>
          </div>
        ); })}
        <div className="flex justify-between border-t border-[#F3F4F6] pt-2 text-base font-extrabold"><span>Total</span><span>{rp(tot)}</span></div>
      </section>
      <section className={`${kpanel} flex flex-col gap-1.5 text-sm`}>
        <div className="flex items-center justify-between"><b>Pembayaran: {isDO(p.bayar) ? "pembiayaan DO" : BAYAR[p.bayar]}</b>{p.doStatus && <span className="rounded-full bg-[#DCFCE7] px-2 py-1 text-[11px] font-bold text-[#14532D]">{p.doStatus === "diajukan" ? `diajukan ke ${BANK}` : p.doStatus}</span>}</div>
        {isDO(p.bayar) ? (<>
          {[["Pembeli", t.kat === "E" ? "Emerald · layak pembiayaan" : "Bukan Emerald — tidak layak DO"], ["Akad dipilih pedagang", BAYAR[p.bayar].replace("Pembiayaan DO · ", "Bayar tunda ")], ["Pasar Jaya terima", `Tunai penuh dari ${BANK}`], ["Waktu cair", "H+1 setelah DO diterima"]].map(([a, b]) => <div key={a} className="flex justify-between gap-2"><span className="text-[#4B5563]">{a}</span><b className="text-right">{b}</b></div>)}
          <div className="my-1 grid grid-cols-4 gap-1">{langkah.map((l, i) => <div key={l} className={`rounded-md px-1 py-1.5 text-center text-[11px] font-bold ${i < n ? "bg-[#14532D] text-white" : "bg-[#E5E7EB] text-[#374151]"}`}>{l}</div>)}</div>
          <div className="text-xs text-[#4B5563]">Pedagang mengangsur ke {BANK} sesuai akad. Risiko gagal bayar di bank tanpa regres ke Pasar Jaya (usulan PKS); dana tidak melewati PATROL.</div>
        </>) : <div className="text-[#4B5563]">{p.bayar === "tempo14" ? "Piutang tempo sendiri — ditagih tim Collection." : "Dibayar pembeli lewat aplikasi TokoPaja."}</div>}
        <div className="flex justify-between gap-2"><span className="text-[#4B5563]">Kirim ke</span><b>{p.hub}</b></div>
        <div className="flex justify-between gap-2"><span className="text-[#4B5563]">Slot</span><b>{p.slot}</b></div>
      </section>
      {edit && <div className="flex gap-2.5"><button onClick={() => tolak(p.id, staf.nama)} className="min-h-[52px] flex-1 rounded-xl border border-[#D1D5DB] bg-white text-sm font-bold text-[#B91C1C]">Tolak</button><button onClick={() => konfirmasi(p.id, staf.nama)} className={`${kbtn} min-h-[52px] flex-[2] text-[15px]`}>Konfirmasi pesanan</button></div>}
    </>
  );
}
