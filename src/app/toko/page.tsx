"use client";

import Link from "next/link";
import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { Empty, card } from "@/components/ui";
import { Pill, btn, btn2, btnSm2 } from "@/components/kit";
import { useTokoAktif } from "@/components/toko";
import { aturToko, rentang, rp, simulasiPesanan, simpanProduk, siptuAktif } from "@/lib/store";
import type { State, Pedagang } from "@/lib/model";

export default function TokoSaya() {
  return <PedagangPage>{({ s, p }) => <Isi s={s} p={p} />}</PedagangPage>;
}

function Isi({ s, p }: { s: State; p: Pedagang }) {
  const [toko, list, pilih] = useTokoAktif(s, p.id);
  const [msg, setMsg] = useState("");
  const layak = siptuAktif(s, p.id).filter((d) => !s.toko.some((t) => t.tuId === d.tuId));
  if (!toko) return (
    <>
      <header className="bg-[#0E5E43] px-5 pt-[calc(20px+env(safe-area-inset-top))] pb-5 text-white"><div className="text-[11px] font-bold tracking-[.1em] text-gold">TOKOPAJA</div><h1 className="text-2xl font-bold">Toko online pedagang pasar</h1><p className="mt-1 text-[13.5px] text-[#CDE5DA]">Pemegang e-SIPTU aktif otomatis berhak punya toko. Satu e-SIPTU = satu toko; data kios &amp; jenis dagangan diambil dari e-SIPTU.</p></header>
      <main className="flex flex-1 flex-col gap-3 p-4">
        {["Pembeli sekitar pesan dari HP, ambil di kios atau diantar", "Harga boleh rentang (harga pasar), dikonfirmasi saat pesanan masuk", "Bayar QRIS, dana aman di rekening penampung bank mitra", "Kulakan langsung dari Food Station & pasar induk, bisa tempo"].map((x) => <div key={x} className="flex gap-2 text-[13.5px]"><span className="text-pj">✓</span>{x}</div>)}
        {layak.length ? (
          <>{layak.map((d) => <Link key={d.no} href={`/toko/aktivasi/?tu=${d.tuId}`} className={`${card} flex items-center justify-between p-3.5`}><span><span className="block font-mono text-xs text-muted">{d.no}</span><span className="block text-sm font-bold">Kios {d.tuId}</span></span><span className="text-sm font-semibold text-pj">Buka toko ›</span></Link>)}</>
        ) : (
          <Empty>TokoPaja memerlukan <b>e-SIPTU aktif atas nama Anda</b>. {s.tu.some((t) => t.pemilikId === p.id) ? "e-SIPTU kios Anda dipegang Pengelola, atau masih dalam proses migrasi." : "Selesaikan migrasi SHPTU atau registrasi Pengelola dulu."} <Link href="/beranda/" className="font-semibold text-pj underline">Ke Beranda</Link></Empty>
        )}
      </main>
    </>
  );
  const produk = s.produk.filter((x) => x.tokoId === toko.id);
  const pesanan = s.pesanan.filter((x) => x.tokoId === toko.id);
  const baru = pesanan.filter((x) => x.tahap === 0 && !x.batal).length;
  const proses = pesanan.filter((x) => x.tahap > 0 && x.tahap < 4 && !x.batal).length;
  const nilai = pesanan.filter((x) => x.nilai);
  const kel = s.tu.find((t) => t.id === toko.tuId)?.dagangan ?? "";
  return (
    <>
      <header className="bg-[#0E5E43] px-5 pt-[calc(18px+env(safe-area-inset-top))] pb-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0"><div className="text-[11px] font-bold tracking-[.1em] text-gold">TOKOPAJA · {toko.buka ? "BUKA" : "TUTUP"}</div><h1 className="truncate text-xl font-bold">{toko.nama}</h1><div className="font-mono text-[11.5px] text-[#CDE5DA]">{toko.id} · Kios {toko.tuId}</div></div>
          <button onClick={() => aturToko(toko.id, { buka: !toko.buka })} aria-pressed={toko.buka} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${toko.buka ? "bg-gold text-[#16211C]" : "bg-[#2F7A5F] text-white"}`}>{toko.buka ? "Tutup toko" : "Buka toko"}</button>
        </div>
        {list.length > 1 && <div className="mt-2 flex gap-1.5">{list.map((t) => <button key={t.id} onClick={() => pilih(t.id)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.id === toko.id ? "bg-white text-[#0E5E43]" : "bg-[#2F7A5F]"}`}>{t.tuId}</button>)}</div>}
        <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
          {[[rp(toko.omzet).replace("Rp", "Rp "), "omzet bln ini"], [toko.transaksi, "transaksi"], [baru, "pesanan baru"], [nilai.length ? (nilai.reduce((n, x) => n + (x.nilai ?? 0), 0) / nilai.length).toFixed(1) : "–", "nilai"]].map(([v, l]) => <div key={l as string} className="rounded-xl bg-white/12 px-1 py-2"><div className="truncate text-[13.5px] font-bold">{v}</div><div className="text-[10px] text-[#CDE5DA]">{l}</div></div>)}
        </div>
        <div className="mt-2.5 text-[11.5px] text-[#CDE5DA]">Lencana pembeli: <span className="rounded-full bg-[#DDF2E8] px-2 py-0.5 font-bold text-[#0B5A40]">Kios terverifikasi e-SIPTU</span></div>
      </header>
      <main className="flex flex-1 flex-col gap-3.5 p-4">
        <nav className="grid grid-cols-4 gap-2" aria-label="Menu toko">
          {[["/toko/pesanan/", "🧾", "Pesanan", baru + proses], ["/toko/produk/", "➕", "Tambah produk", 0], ["/toko/pelanggan/", "👥", "Pelanggan", 0], ["/toko/kulakan/", "📦", "Kulakan", s.kulakan.filter((k) => k.tokoId === toko.id && k.status !== "diterima").length]].map(([h, ic, l, b]) => (
            <Link key={h as string} href={h as string} className="relative flex flex-col items-center gap-1.5 rounded-xl bg-white px-1 py-2.5 text-center text-[11.5px] font-semibold text-ink-2"><span className="flex size-10 items-center justify-center rounded-xl bg-mint text-lg" aria-hidden="true">{ic}</span>{l}{(b as number) > 0 && <span className="absolute top-1.5 right-2 rounded-full bg-[#C8781E] px-1.5 text-[10px] font-bold text-white">{b}</span>}</Link>
          ))}
        </nav>
        {baru > 0 && <Link href="/toko/pesanan/" className="rounded-xl border-2 border-[#F2A541] bg-white px-3.5 py-3 text-[13.5px] font-bold">🔔 {baru} pesanan baru menunggu konfirmasi harga ›</Link>}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5"><h2 className="text-[15px] font-bold">e-Katalog <span className="text-xs font-semibold text-muted">· {produk.length} produk · {kel}</span></h2><Link href="/toko/produk/" className="text-[13px] font-semibold text-pj">+ Tambah</Link></div>
          {produk.length === 0 && <Empty>Belum ada produk. Tambahkan produk pertama; komoditas mengikuti kelompok dagangan di e-SIPTU ({kel}).</Empty>}
          {produk.map((x) => (
            <div key={x.id} className={`${card} flex items-center gap-3 p-3`}>
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#EFE9DA] text-[10px] font-bold text-[#6B5A2E]">FOTO</div>
              <Link href={`/toko/produk/?id=${x.id}`} className="min-w-0 flex-1"><span className="block text-sm font-bold">{x.nama}</span><span className="block text-[14px] font-bold text-[#0E5E43]">{rentang(x.hMin, x.hMax)} <span className="text-xs font-semibold text-muted">/ {x.satuan}</span></span>{x.grosir && <span className="text-[11px] text-muted">Harga grosir tersedia</span>}</Link>
              <button onClick={() => simpanProduk({ ...x, stok: !x.stok })} aria-pressed={x.stok} className={`shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-bold ${x.stok ? "bg-[#DDF2E8] text-[#0B5A40]" : "bg-[#FBE3D9] text-[#8A2B1B]"}`}>{x.stok ? "Tersedia" : "Habis"}</button>
            </div>
          ))}
        </section>
        <section className={`${card} flex flex-col gap-2 p-3.5`}>
          <h2 className="text-sm font-bold">Layanan toko</h2>
          {([["ambil", "Ambil di kios"], ["antar", "Antar ke rumah (kurir mitra)"], ["kulakan", "Terima tawaran kulakan pemasok"]] as const).map(([k, l]) => (
            <label key={k} className="flex items-center justify-between gap-2 text-[13.5px]">{l}<input type="checkbox" checked={toko[k]} onChange={(e) => aturToko(toko.id, { [k]: e.target.checked })} className="size-5 accent-pj" /></label>
          ))}
        </section>
        <div className="rounded-xl border border-dashed border-[#B9BFB6] bg-white p-3.5 text-[12.5px] text-ink-2">
          <b>Uji coba tanpa aplikasi pembeli:</b> buat pesanan contoh dari produk yang tersedia.
          <button onClick={() => { const r = simulasiPesanan(toko.id); setMsg(r && !r.startsWith("PN-") ? r : "Pesanan contoh masuk."); }} className={`${btnSm2} mt-2 w-full`}>Simulasikan pembeli memesan</button>
          {msg && <div className="mt-1.5 text-[12.5px]" role="status">{msg}</div>}
        </div>
        <div className="grid grid-cols-2 gap-2"><Link href="/toko/pesanan/" className={btn}>Pesanan</Link><Link href="/toko/kulakan/" className={btn2}>Kulakan</Link></div>
        <p className="text-center text-[11.5px] text-muted">Biaya layanan TokoPaja: usulan 2% per transaksi selesai <Pill tone="bg-[#ECEDE7] text-[#4B5650]">ilustrasi</Pill></p>
      </main>
    </>
  );
}
