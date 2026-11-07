"use client";

import Link from "next/link";
import { PedagangPage, dokUntuk, statusTU } from "@/components/pedagang";
import { Bar, Empty, card, statusDok } from "@/components/ui";
import { KATEGORI } from "@/lib/model";
import { pedagangById } from "@/lib/store";

export default function Beranda() {
  return (
    <PedagangPage>
      {({ s, p, kat, tus }) => {
        const k = KATEGORI[kat];
        const docs = tus.flatMap((t) => { const d = dokUntuk(s, p, t); return [d.milik ? d.sh : undefined, d.pakai ? d.si : undefined]; });
        const perlu = tus.reduce((n, t) => n + (t.pemilikId === p.id ? 1 : 0) + (t.pemakaiId === p.id ? 1 : 0), 0);
        const terbit = docs.filter((d) => d?.status === "terbit").length;
        const balasan = s.tiket.filter((t) => t.pedagangId === p.id && t.msgs[t.msgs.length - 1].dari === "s").length;
        return (
          <>
            <header className="flex flex-col gap-3.5 px-[18px] pt-[calc(20px+env(safe-area-inset-top))] pb-[22px] text-white" style={{ background: k.grad }}>
              <div><div className="text-[12.5px] opacity-85">Selamat datang,</div><div className="text-lg font-bold">{p.nama}</div></div>
              <div className="flex flex-col gap-2 rounded-xl bg-white/14 p-3.5">
                <span className="self-start rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[.06em] text-[#13241C] uppercase" style={{ background: k.chip }}>◆ {k.nama} ({k.id}) · {k.peran}</span>
                <div className="text-[11.5px] opacity-85">ID Pelanggan</div>
                <div className="font-mono text-xl font-medium tracking-[.05em]">{p.id}</div>
                <div className="text-[12.5px] opacity-90">{tus.length ? `${tus.length} TU · Pasar Johar Baru` : p.daftar ? `Terdaftar ${p.daftar}` : "Belum tercatat di TU"}</div>
              </div>
            </header>
            <main className="flex flex-1 flex-col gap-3.5 p-4">
              {balasan > 0 && <Link href="/layanan/" className="rounded-xl bg-mint px-3.5 py-3 text-[13px] font-semibold text-mint-ink">💬 {balasan} tanggapan dari kantor pasar · lihat di Layanan ›</Link>}
              {perlu > 0 && (
                <section className={`${card} flex flex-col gap-2.5 p-3.5`}>
                  <div className="flex items-baseline justify-between gap-2"><h2 className="text-[15px] font-bold">Status dokumen elektronik</h2><span className="text-[12.5px] font-semibold text-[#2F6B4F]">{terbit} dari {perlu}</span></div>
                  <Bar value={(terbit / perlu) * 100} />
                  <p className="text-[13px] leading-normal text-ink-2">{terbit === perlu ? "Semua dokumen Anda sudah terbit dan ditandatangani elektronik Pasar Jaya." : "Sebagian dokumen masih dalam proses migrasi. Status tiap TU ada di bawah."}</p>
                </section>
              )}
              <h2 className="px-0.5 text-[15px] font-bold">Tempat usaha saya</h2>
              {tus.map((t) => {
                const d = dokUntuk(s, p, t);
                const [ss, sc] = statusDok(d.sh?.status), [is, ic] = statusDok(d.si?.status);
                const peran = d.milik && d.pakai ? "Anda pemilik & pemakai" : d.milik ? `Pemakai: ${pedagangById(s, t.pemakaiId)?.nama}${t.buka ? "" : " (TU kosong)"}` : `Pemilik: ${pedagangById(s, t.pemilikId)?.nama}`;
                return (
                  <Link key={t.id} href={`/tu/?id=${t.id}`} className={`${card} flex flex-col gap-2 px-3.5 py-3`}>
                    <span className="flex justify-between gap-2"><span className="font-mono text-[13px] font-medium">{t.id}</span><span className="text-xs font-semibold text-ink-2">{t.jenis} · {t.luas} m²</span></span>
                    <span className="text-[13px] text-muted">Blok {t.blok} · {t.lantai === "B" ? "Basah" : `Lt. ${t.lantai.slice(1)}`} · {t.buka ? t.dagangan : "Kosong"}</span>
                    <span className="text-[13px]">{peran}</span>
                    <span className="grid grid-cols-2 gap-1.5">
                      <span className={`rounded-md px-2 py-1.5 text-xs font-semibold ${d.milik ? sc : "bg-[#ECEDE7] text-[#4B5650]"}`}>e-SHPTU · {d.milik ? ss : "milik Pemilik"}</span>
                      <span className={`rounded-md px-2 py-1.5 text-xs font-semibold ${d.pakai || (d.milik && !t.buka) ? ic : "bg-[#ECEDE7] text-[#4B5650]"}`}>e-SIPTU · {d.pakai ? is : `a.n. ${pedagangById(s, t.pemakaiId)?.nama.split(" ")[0]}`}</span>
                    </span>
                    {t.status !== "terbit" && <span className="text-xs text-[#9A5B0E]">{statusTU[t.status]}</span>}
                  </Link>
                );
              })}
              {tus.length === 0 && (
                <Empty>
                  <b>Belum ada tempat usaha atas nama Anda.</b><br />Dua cara mulai berdagang di Pasar Jaya:<br />1. Sewa atau ambil TU kosong yang ditawarkan di JaKios.<br />2. Ditunjuk Pemilik TU sebagai Pengelola (Gold) — datang bersama Pemilik ke kantor pasar membawa KTP.
                </Empty>
              )}
              <section className={`${card} flex flex-col gap-1.5 p-3.5`}>
                <h2 className="text-[15px] font-bold">Jadwal pendataan ulang</h2>
                <p className="text-[13px] leading-relaxed text-ink-2">Pasar Johar Baru · s.d. 30 Nov 2026, 08.00–15.00. Siapkan KTP, SHPTU dan SIPTU kertas. Petugas datang ke TU Anda.</p>
              </section>
              <div className="px-0.5 text-[11.5px] text-[#6B7670]">Tagihan BPP &amp; layanan lain hadir di tahap berikutnya.</div>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
