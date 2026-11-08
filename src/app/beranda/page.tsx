"use client";

import Link from "next/link";
import { PedagangPage, dokUntuk, statusTU } from "@/components/pedagang";
import { Empty, card, statusDok } from "@/components/ui";
import { MenuTile, Pill, btnSm, btnSm2 } from "@/components/kit";
import { KATEGORI } from "@/lib/model";
import { pedagangById, notifOf, tokoOf, rp, siptuAktif } from "@/lib/store";

export default function Beranda() {
  return (
    <PedagangPage>
      {({ s, p, kat, tus }) => {
        const k = KATEGORI[kat];
        const sh = s.dok.filter((d) => d.atasNamaId === p.id && d.jenis === "e-SHPTU" && d.status === "terbit").length;
        const si = siptuAktif(s, p.id).length;
        const belumBaca = notifOf(s, p.id).filter((n) => !n.baca).length;
        const tagihan = s.tagihan.filter((t) => t.pedagangId === p.id && t.status !== "lunas");
        const toko = tokoOf(s, p.id);
        const pesananBaru = s.pesanan.filter((o) => toko.some((t) => t.id === o.tokoId) && o.tahap === 0 && !o.batal);
        const persetujuan = s.pengajuan.filter((x) => x.jenis === "pengelola" && x.data.pemilik === p.id && x.tahap === 1 && x.status === "proses");
        const pengajuan = s.pengajuan.filter((x) => x.pedagangId === p.id && x.status === "proses" && x.jenis !== "program");
        const perlu: { k: string; t: string; d: string; href: string; cta: string; main?: boolean }[] = [];
        persetujuan.forEach((x) => perlu.push({ k: x.id, t: `${pedagangById(s, x.pedagangId)?.nama} ingin menjadi Pengelola ${x.tuId}`, d: `${x.data.periode} · ${x.data.dagangan}`, href: `/persetujuan/?id=${x.id}`, cta: "Tinjau", main: true }));
        tus.filter((t) => t.pemilikId === p.id && (t.status === "arsip" || t.status === "dikembalikan")).forEach((t) => perlu.push({ k: t.id, t: `Migrasi digital SHPTU ${t.id}`, d: t.status === "dikembalikan" ? `Perlu dilengkapi: ${t.catatan}` : "SHPTU kertas Anda belum jadi e-SHPTU · 5 langkah dari HP", href: `/migrasi/?tu=${t.id}`, cta: "Mulai", main: true }));
        if (pesananBaru.length) perlu.push({ k: "ps", t: `${pesananBaru.length} pesanan baru di toko Anda`, d: "Konfirmasi harga sebelum batal otomatis", href: "/toko/pesanan/", cta: "Buka" });
        if (tagihan.length) perlu.push({ k: "tg", t: `${tagihan.length} tagihan belum dibayar`, d: `Total ${rp(tagihan.reduce((n, t) => n + t.jumlah, 0))}${tagihan.some((t) => t.status === "terlambat") ? " · ada yang terlambat" : ""}`, href: "/keuangan/", cta: "Bayar" });
        siptuAktif(s, p.id).filter((d) => d.berlaku.includes("2026") && !s.dok.some((x) => x.tuId === d.tuId && x.jenis === "e-SIPTU" && x.status === "menunggu")).forEach((d) => perlu.push({ k: d.no, t: `e-SIPTU ${d.tuId} berakhir 31 Des 2026`, d: "Perpanjang kilat dari aplikasi", href: `/perpanjang/?tu=${d.tuId}`, cta: "Perpanjang" }));
        return (
          <>
            <header className="flex flex-col gap-3 px-[18px] pt-[calc(18px+env(safe-area-inset-top))] pb-5 text-white" style={{ background: k.grad }}>
              <div className="flex items-center justify-between gap-2">
                <div><div className="text-[12.5px] opacity-85">TokoPaja · Selamat datang,</div><div className="text-lg font-bold">{p.nama}</div></div>
                <Link href="/pesan/" aria-label={`Pesan, ${belumBaca} belum dibaca`} className="relative flex size-11 items-center justify-center rounded-xl bg-white/15">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 6 3 7 3 7H3s3-1 3-7M10 20a2 2 0 0 0 4 0" /></svg>
                  {belumBaca > 0 && <span className="absolute top-1.5 right-1.5 rounded-full bg-[#F2A541] px-1 text-[10px] font-bold text-[#3b2500]">{belumBaca}</span>}
                </Link>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/12 p-3.5">
                <span className="self-start rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[.06em] text-[#13241C] uppercase" style={{ background: k.chip }}>◆ {k.nama} ({k.id}) · {k.peran}</span>
                <div className="flex items-end justify-between gap-2"><div><div className="text-[11px] opacity-85">ID Pelanggan</div><div className="font-mono text-xl font-medium tracking-[.05em]">{p.id}</div></div><div className="text-right text-[11.5px] opacity-85">{p.daftar ? `Sejak ${p.daftar}` : "Pasar Johar Baru"}</div></div>
                <div className="grid grid-cols-4 border-t border-white/20 pt-2.5 text-center">
                  {[[tus.length, "TU"], [sh, "e-SHPTU"], [si, "e-SIPTU"], [(s.poin[p.id] ?? 0).toLocaleString("id-ID"), "Poin"]].map(([v, l]) => <div key={l as string}><div className="text-lg font-bold">{v}</div><div className="text-[10px] opacity-90">{l}</div></div>)}
                </div>
              </div>
            </header>
            <main className="flex flex-1 flex-col gap-3.5 p-4">
              <nav aria-label="Menu cepat" className="grid grid-cols-4 gap-2">
                <MenuTile href="/toko/" icon="🏪" label={toko.length ? "Toko saya" : "Buka toko"} badge={pesananBaru.length} />
                <MenuTile href="/keuangan/" icon="💳" label="Bayar BPP" badge={tagihan.length} />
                <MenuTile href="/migrasi/" icon="📜" label="Migrasi SHPTU" />
                <MenuTile href="/harga/" icon="📈" label="Info harga" />
                <MenuTile href="/registrasi-pengelola/" icon="🤝" label="Daftar Pengelola" />
                <MenuTile href="/pengajuan/" icon="🗂️" label="Pengajuan" badge={pengajuan.length} />
                <MenuTile href="/program/" icon="🏦" label="Kredit & program" />
                <MenuTile href="/toko/kulakan/" icon="📦" label="Kulakan" />
              </nav>

              {perlu.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h2 className="flex items-center gap-2 px-0.5 text-[15px] font-bold">Perlu tindakan Anda <Pill>{perlu.length}</Pill></h2>
                  {perlu.map((x) => (
                    <div key={x.k} className={`${card} flex items-center gap-3 px-3.5 py-3 ${x.main ? "border-2 border-[#F2A541]" : ""}`}>
                      <div className="min-w-0 flex-1"><div className="text-[13.5px] font-bold">{x.t}</div><div className="text-xs text-muted">{x.d}</div></div>
                      <Link href={x.href} className={x.main ? btnSm : btnSm2}>{x.cta}</Link>
                    </div>
                  ))}
                </section>
              )}

              {pengajuan.length > 0 && (
                <section className={`${card} flex flex-col gap-1.5 p-3.5`}>
                  <h2 className="text-[15px] font-bold">Pengajuan berjalan</h2>
                  {pengajuan.map((x) => <Link key={x.id} href={`/pengajuan/?id=${x.id}`} className="flex justify-between gap-2 py-1 text-[13px]"><span className="min-w-0 truncate">{x.judul}</span><span className="shrink-0 font-semibold text-pj">Lacak ›</span></Link>)}
                </section>
              )}

              {toko.map((t) => (
                <Link key={t.id} href="/toko/" className="flex items-center gap-3 rounded-2xl bg-[#0F2A20] p-3.5 text-white">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold text-xl" aria-hidden="true">🏪</span>
                  <span className="min-w-0 flex-1"><span className="block text-[11px] font-bold tracking-[.08em] text-gold">TOKOPAJA · {t.buka ? "BUKA" : "TUTUP"}</span><span className="block text-[15px] font-bold">{t.nama}</span><span className="block text-xs text-[#C9D8CF]">Omzet bulan ini {rp(t.omzet)} · {t.transaksi} transaksi</span></span>›
                </Link>
              ))}
              {!toko.length && si > 0 && (
                <Link href="/toko/aktivasi/" className="flex items-center gap-3 rounded-2xl p-3.5 text-white" style={{ background: "linear-gradient(155deg,#7A3E0B,#C26A16 65%,#F2A541)" }}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-xl" aria-hidden="true">🏪</span>
                  <span className="min-w-0 flex-1"><span className="block text-[11px] font-bold tracking-[.08em]">BARU · TOKOPAJA</span><span className="block text-[15px] font-bold">Buka toko online pakai e-SIPTU Anda</span><span className="block text-xs opacity-90">Gratis · data kios terisi otomatis</span></span>›
                </Link>
              )}

              <h2 className="px-0.5 text-[15px] font-bold">Tempat usaha saya</h2>
              {tus.map((t) => {
                const d = dokUntuk(s, p, t);
                const [ss, sc] = statusDok(d.sh?.status), [is, ic] = statusDok(d.si?.status);
                const peran = d.milik && d.pakai ? (t.buka ? "Anda pemilik & pemakai" : "Anda pemilik · TU kosong (BPP ditanggung Anda)") : d.milik ? `Pengelola: ${pedagangById(s, t.pemakaiId)?.nama}` : `Pemilik: ${pedagangById(s, t.pemilikId)?.nama}`;
                const warn = t.tunggakan >= 2 ? ["Waspada", "bg-[#FFF4D6] text-[#7d5800]"] : t.tunggakan === 1 ? ["Perhatian", "bg-[#FFF4D6] text-[#7d5800]"] : ["Sehat", "bg-[#E3F5EA] text-[#157A44]"];
                return (
                  <Link key={t.id} href={`/tu/?id=${t.id}`} className={`${card} relative flex flex-col gap-2 overflow-hidden py-3 pr-3.5 pl-[18px]`}>
                    <span className="absolute inset-y-0 left-0 w-[5px]" style={{ background: d.milik && d.pakai ? "#0E9F6E" : d.milik ? "#6E8794" : "#B8861F" }} />
                    <span className="flex justify-between gap-2"><span className="font-mono text-[12px] font-medium text-ink-2">ID KIOS · {t.id}</span><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${warn[1]}`}>● {warn[0]}</span></span>
                    <span className="text-[15px] font-bold">Pasar Johar Baru</span>
                    <span className="-mt-1.5 text-[12.5px] text-muted">Blok {t.blok} · {t.lantai === "B" ? "Basah" : `Lt. ${t.lantai.slice(1)}`} · {t.jenis} · {t.luas} m² · {t.buka ? t.dagangan : "Kosong"}</span>
                    <span className="text-[13px]">{peran}</span>
                    <span className="grid grid-cols-2 gap-1.5">
                      <span className={`rounded-md px-2 py-1.5 text-xs font-semibold ${d.milik ? sc : "bg-[#ECEDE7] text-[#4B5650]"}`}>e-SHPTU · {d.milik ? ss : "milik Pemilik"}</span>
                      <span className={`rounded-md px-2 py-1.5 text-xs font-semibold ${d.pakai ? ic : "bg-[#ECEDE7] text-[#4B5650]"}`}>e-SIPTU · {d.pakai ? is : `a.n. ${pedagangById(s, t.pemakaiId)?.nama.split(" ")[0]}`}</span>
                    </span>
                    {t.status !== "terbit" && <span className="text-xs text-[#9A5B0E]">{statusTU[t.status]}</span>}
                  </Link>
                );
              })}
              {tus.length === 0 && (
                <Empty>
                  <b>Belum ada tempat usaha atas nama Anda.</b><br />Punya SHPTU kertas? <Link href="/migrasi/" className="font-semibold text-pj underline">Migrasi digital</Link>. Mengelola kios orang lain? <Link href="/registrasi-pengelola/" className="font-semibold text-pj underline">Daftar sebagai Pengelola</Link>. Mencari kios? Lihat TU kosong di JaKios lewat <Link href="/program/" className="font-semibold text-pj underline">Program</Link>.
                </Empty>
              )}
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
