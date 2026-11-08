"use client";

import Link from "next/link";
import { useState } from "react";
import { BoPage, panel } from "@/components/bo";
import { Pill, Sheet, WithQ, chip, input } from "@/components/kit";
import { Tabs } from "@/components/ui";
import { KATEGORI, type Kategori, type Staf, type State } from "@/lib/model";
import {
  balasTiket, catatInteraksi, kategoriOf, kirimPengumuman, kirimPesanKe, kirimUlangOtp, pedagangById, putuskanKoreksi,
  rp, sasaranPengumuman, selesaikanTiket, tokoOf, tuOf,
} from "@/lib/store";

export default function Page() {
  return <WithQ>{(q) => <BoPage judul="CRM Tenant 360">{({ s, staf }) => <Crm s={s} staf={staf} id={q("id")} />}</BoPage>}</WithQ>;
}

const KAT_TONE: Record<Kategori, string> = { E: "bg-[#D5F5E8] text-[#047857]", P: "bg-[#E9EEF1] text-[#3E5260]", G: "bg-[#FBEFD9] text-[#6E4A12]", B: "bg-[#E7EFFC] text-[#2659B8]" };

function Crm({ s, staf, id }: { s: State; staf: Staf; id: string }) {
  const [tab, setTab] = useState<"tenant" | "tiket" | "umum" | "aktivasi">("tenant");
  if (id) return <Profil s={s} staf={staf} id={id} />;
  const tiket = s.tiket.filter((t) => t.status === "terbuka" || t.status === "dijawab");
  return (
    <>
      <Tabs value={tab} onChange={setTab} items={[["tenant", "Tenant 360"], ["tiket", `Tiket (${tiket.length})`], ["umum", "Pengumuman"], ["aktivasi", "Aktivasi"]]} />
      {tab === "tenant" && <Daftar s={s} />}
      {tab === "tiket" && <Tiket s={s} staf={staf} />}
      {tab === "umum" && <Umum s={s} staf={staf} />}
      {tab === "aktivasi" && <Aktivasi s={s} staf={staf} />}
    </>
  );
}

function Daftar({ s }: { s: State }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("Semua");
  const pakai = new Set(s.tu.flatMap((t) => [t.pemilikId, t.pemakaiId]));
  const rows = s.pedagang.filter((p) => pakai.has(p.id) || p.daftar).map((p) => {
    const tus = tuOf(s, p.id);
    return { p, k: kategoriOf(s, p.id), tus, tung: Math.max(0, ...tus.filter((t) => (t.buka ? t.pemakaiId : t.pemilikId) === p.id).map((t) => t.tunggakan)) };
  });
  const qq = q.trim().toLowerCase();
  const list = rows.filter((r) => (f === "Semua" || (f === "Menunggak" ? r.tung > 0 : KATEGORI[r.k].nama === f)) && (!qq || r.p.nama.toLowerCase().includes(qq) || r.p.id.toLowerCase().includes(qq) || r.p.hp.includes(qq) || r.tus.some((t) => t.id.toLowerCase().includes(qq))))
    .sort((a, b) => b.tung - a.tung || a.p.nama.localeCompare(b.p.nama));
  return (
    <>
      <label htmlFor="cari" className="sr-only">Cari tenant</label>
      <input id="cari" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nama, ID Pelanggan (PJK-…), ID Kios (JHB-…), no. HP" className={input} />
      <div className="flex flex-wrap gap-1.5">{["Semua", "Emerald", "Platinum", "Gold", "Blue", "Menunggak"].map((x) => <button key={x} onClick={() => setF(x)} className={chip(f === x)}>{x}</button>)}</div>
      <div className="text-xs text-muted">{list.length} tenant · urut risiko tertinggi{list.length > 60 ? " · 60 pertama" : ""}</div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {list.slice(0, 60).map((r) => (
          <Link key={r.p.id} href={`/bo/crm/?id=${r.p.id}`} className="grid grid-cols-[1fr_auto] gap-x-2.5 gap-y-0.5 border-t border-[#EEF0EA] px-3.5 py-3 first:border-0">
            <b className="text-sm">{r.p.nama}</b>
            <span className={`self-start rounded-full px-2 py-0.5 text-[11px] font-semibold ${KAT_TONE[r.k]}`}>{KATEGORI[r.k].nama}</span>
            <span className="truncate font-mono text-xs text-muted">{r.p.id} · {r.tus.map((t) => t.id).join(", ") || "belum ada TU"}</span>
            <span className={`text-right text-xs font-semibold ${r.tung >= 2 ? "text-[#A3361C]" : r.tung === 1 ? "text-[#9A5B0E]" : "text-[#157A44]"}`}>{r.tung >= 3 ? "Macet" : r.tung === 2 ? "Waspada" : r.tung === 1 ? "DPK" : "Lancar"}{!r.p.aktif && " · belum aktif"}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

function Profil({ s, staf, id }: { s: State; staf: Staf; id: string }) {
  const p = pedagangById(s, id);
  const [sheet, setSheet] = useState<"" | "pesan" | "catat">("");
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [kanal, setKanal] = useState("Telepon");
  if (!p) return <div className={panel}>Tenant tidak ditemukan. <Link href="/bo/crm/" className="font-semibold text-pj underline">Kembali</Link></div>;
  const k = kategoriOf(s, p.id);
  const tus = tuOf(s, p.id);
  const toko = tokoOf(s, p.id);
  const tagihan = s.tagihan.filter((t) => t.pedagangId === p.id);
  const tiket = s.tiket.filter((t) => t.pedagangId === p.id);
  const timeline = [
    ...s.interaksi.filter((x) => x.pedagangId === p.id).map((x) => ({ t: x.t, judul: `${x.kanal} · ${x.oleh}`, isi: x.catatan })),
    ...s.log.filter((l) => l.siapa === p.nama || (l.tuId && tus.some((t) => t.id === l.tuId))).slice(0, 12).map((l) => ({ t: l.t, judul: l.siapa, isi: l.apa + (l.tuId ? ` (${l.tuId})` : "") })),
    ...s.pengajuan.filter((x) => x.pedagangId === p.id).map((x) => ({ t: x.dibuat, judul: "Pengajuan aplikasi", isi: `${x.judul} · ${x.status}` })),
  ];
  return (
    <>
      <Link href="/bo/crm/" className="self-start text-[13px] font-semibold text-pj">‹ Daftar tenant</Link>
      <section className={`${panel} flex flex-wrap items-center gap-3.5`}>
        <div className="flex size-14 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: KATEGORI[k].warna }}>{p.nama.replace(/^(H|Hj)\. /, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{p.nama}</h2><span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${KAT_TONE[k]}`}>{KATEGORI[k].nama} · {KATEGORI[k].id}</span>{!p.aktif && <Pill tone="bg-[#FBEFD9] text-[#6E4A12]">Belum aktivasi</Pill>}</div>
          <div className="font-mono text-xs text-muted">{p.id} · NIK {p.nik.slice(0, 4)}••••{p.nik.slice(-4)} · {p.hp.slice(0, 4)}-••••-{p.hp.slice(-4)}</div>
          <div className="text-xs text-muted">{KATEGORI[k].desc} · poin {(s.poin[p.id] ?? 0).toLocaleString("id-ID")}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`https://wa.me/62${p.hp.slice(1)}`} className="rounded-lg border border-line-2 bg-white px-3 py-2.5 text-[13px] font-semibold">WhatsApp</a>
          <button onClick={() => setSheet("catat")} className="rounded-lg border border-line-2 bg-white px-3 py-2.5 text-[13px] font-semibold">Catat interaksi</button>
          <button onClick={() => setSheet("pesan")} className="rounded-lg bg-pj px-3 py-2.5 text-[13px] font-semibold text-white">Kirim pesan aplikasi</button>
        </div>
      </section>
      <section className={panel}>
        <h3 className="text-[15px] font-bold">Kios &amp; dokumen</h3>
        <p className="mb-2 text-xs text-muted">Setiap kios punya e-SHPTU (kepemilikan → HPTU) dan e-SIPTU (pengelolaan → BPP).</p>
        <div className="flex flex-col gap-2">
          {tus.length === 0 && <div className="text-[13px] text-muted">Belum tercatat di TU mana pun.</div>}
          {tus.map((t) => {
            const docs = s.dok.filter((d) => d.tuId === t.id && d.status !== "batal");
            return (
              <div key={t.id} className="rounded-[10px] border border-line p-3 text-[13px]">
                <div className="flex flex-wrap justify-between gap-2"><b className="font-mono">{t.id}</b><span className={`font-semibold ${t.tunggakan >= 2 ? "text-[#A3361C]" : t.tunggakan ? "text-[#9A5B0E]" : "text-[#157A44]"}`}>BPP {t.tunggakan ? `tunggak ${t.tunggakan} bln` : "lancar"} · HPTU {t.hptu.toLowerCase()}</span></div>
                <div className="text-muted">{t.jenis} {t.luas} m² · {t.buka ? t.dagangan : "kosong"} · Pemilik {pedagangById(s, t.pemilikId)?.nama} · Pemakai {pedagangById(s, t.pemakaiId)?.nama}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">{docs.map((d) => <span key={d.no} className={`rounded-md px-2 py-0.5 font-mono text-[11px] ${d.status === "terbit" ? "bg-mint text-mint-ink" : "bg-[#FBEFD9] text-[#6E4A12]"}`}>{d.no} · {d.status}</span>)}{!docs.length && <span className="text-xs text-[#9A5B0E]">dokumen belum terbit ({t.status})</span>}</div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="grid gap-3.5 md:grid-cols-2">
        <div className={panel}>
          <h3 className="mb-2 text-[15px] font-bold">Tagihan &amp; TokoPaja</h3>
          {tagihan.map((t) => <div key={t.id} className="flex justify-between border-t border-[#EEF0EA] py-1.5 text-[13px] first:border-0"><span>{t.jenis} {t.periode} · {t.tuId}</span><b className={t.status === "lunas" ? "text-[#157A44]" : t.status === "terlambat" ? "text-[#A3361C]" : ""}>{rp(t.jumlah)} · {t.status}</b></div>)}
          {!tagihan.length && <div className="text-[13px] text-muted">Tagihan per TU ada di modul Tagihan.</div>}
          {toko.map((t) => <div key={t.id} className="mt-2 rounded-lg bg-paper p-2.5 text-[13px]"><b>🏪 {t.nama}</b> · omzet {rp(t.omzet)} · {t.transaksi} transaksi · {s.produk.filter((x) => x.tokoId === t.id).length} produk</div>)}
        </div>
        <div className={panel}>
          <h3 className="mb-2 text-[15px] font-bold">Riwayat interaksi</h3>
          {timeline.length === 0 && <div className="text-[13px] text-muted">Belum ada interaksi.</div>}
          {timeline.slice(0, 14).map((e, i) => <div key={i} className="grid grid-cols-[84px_1fr] gap-2.5 border-t border-[#EEF0EA] py-2 first:border-0"><span className="font-mono text-[11.5px] text-muted">{e.t}</span><span><b className="block text-[13px]">{e.judul}</b><span className="text-[12.5px] text-ink-2">{e.isi}</span></span></div>)}
        </div>
      </section>
      {tiket.length > 0 && <section className={panel}><h3 className="mb-2 text-[15px] font-bold">Tiket</h3>{tiket.map((t) => <div key={t.id} className="flex justify-between border-t border-[#EEF0EA] py-1.5 text-[13px] first:border-0"><span>{t.id} · {t.topik}</span><b>{t.status}</b></div>)}</section>}
      <Sheet open={sheet === "pesan"} onClose={() => setSheet("")} title={`Pesan ke aplikasi ${p.nama}`}>
        <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul" aria-label="Judul" className={input} />
        <textarea value={isi} onChange={(e) => setIsi(e.target.value)} rows={3} placeholder="Isi pesan" aria-label="Isi pesan" className="rounded-lg border border-line-2 p-3 text-sm" />
        <button disabled={!judul.trim() || !isi.trim()} onClick={() => { kirimPesanKe(p.id, judul.trim(), isi.trim(), staf.nama); setSheet(""); setJudul(""); setIsi(""); }} className="min-h-12 rounded-lg bg-pj font-semibold text-white disabled:bg-line">Kirim</button>
      </Sheet>
      <Sheet open={sheet === "catat"} onClose={() => setSheet("")} title="Catat interaksi">
        <div className="flex flex-wrap gap-1.5">{["Telepon", "WhatsApp", "Kunjungan", "Loket"].map((x) => <button key={x} onClick={() => setKanal(x)} className={chip(kanal === x)}>{x}</button>)}</div>
        <textarea value={isi} onChange={(e) => setIsi(e.target.value)} rows={3} placeholder="Ringkasan percakapan & janji tindak lanjut" aria-label="Catatan" className="rounded-lg border border-line-2 p-3 text-sm" />
        <button disabled={!isi.trim()} onClick={() => { catatInteraksi(p.id, kanal, isi.trim(), staf.nama); setSheet(""); setIsi(""); }} className="min-h-12 rounded-lg bg-pj font-semibold text-white disabled:bg-line">Simpan</button>
      </Sheet>
    </>
  );
}

function Tiket({ s, staf }: { s: State; staf: Staf }) {
  const [txt, setTxt] = useState<Record<string, string>>({});
  const list = s.tiket.filter((t) => t.status === "terbuka" || t.status === "dijawab");
  return (
    <div className="flex flex-col gap-2.5">
      {list.length === 0 && <div className={panel}>Semua tiket sudah ditangani.</div>}
      {list.map((t) => (
        <div key={t.id} className={`${panel} flex flex-col gap-2`}>
          <div className="flex flex-wrap justify-between gap-2"><span className="font-mono text-xs text-muted">{t.id} · {t.dibuat}{t.tuId ? ` · ${t.tuId}` : ""}</span><Pill tone={t.jenis === "aduan" ? "bg-[#F7E3E0] text-[#7A2E24]" : t.jenis === "koreksi" ? "bg-[#E7EFFC] text-[#2659B8]" : "bg-mint text-mint-ink"}>{t.jenis}</Pill></div>
          <b className="text-[14px]">{t.topik}</b>
          <Link href={`/bo/crm/?id=${t.pedagangId}`} className="text-[12.5px] font-semibold text-pj">{pedagangById(s, t.pedagangId)?.nama} · profil 360 ›</Link>
          <div className="rounded-lg bg-paper p-2.5 text-[13px]">{t.msgs.map((m, i) => <div key={i}><b>{m.dari === "p" ? "Pedagang" : "Kantor"}:</b> {m.teks}</div>)}</div>
          {t.jenis === "koreksi" ? (
            <div className="flex gap-2"><button onClick={() => putuskanKoreksi(t.id, false, staf.nama)} className="min-h-11 flex-1 rounded-lg border border-line-2 bg-white text-sm font-semibold">Tolak</button><button onClick={() => putuskanKoreksi(t.id, true, staf.nama)} className="min-h-11 flex-[2] rounded-lg bg-pj text-sm font-semibold text-white">Setujui → revisi ke antrean TTE</button></div>
          ) : (
            <div className="flex gap-2">
              <label htmlFor={`t-${t.id}`} className="sr-only">Balasan</label>
              <input id={`t-${t.id}`} value={txt[t.id] ?? ""} onChange={(e) => setTxt({ ...txt, [t.id]: e.target.value })} placeholder={t.jenis === "aduan" ? "Tindak lanjut" : "Jawaban"} className="min-h-11 min-w-0 flex-1 rounded-lg border border-line-2 px-3 text-sm" />
              <button disabled={!(txt[t.id] ?? "").trim()} onClick={() => { if (t.jenis === "aduan") selesaikanTiket(t.id, txt[t.id], staf.nama); else balasTiket(t.id, txt[t.id], "s"); setTxt({ ...txt, [t.id]: "" }); }} className="min-h-11 rounded-lg bg-pj px-4 text-sm font-semibold text-white disabled:bg-line">{t.jenis === "aduan" ? "Selesaikan" : "Jawab"}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Umum({ s, staf }: { s: State; staf: Staf }) {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [sas, setSas] = useState("Semua pedagang");
  return (
    <>
      <div className={`${panel} flex flex-col gap-2.5`}>
        <h3 className="text-[15px] font-bold">Kirim pengumuman ke aplikasi pedagang</h3>
        <div className="flex flex-wrap gap-1.5">{["Semua pedagang", "Blok A", "Blok B", "Blok C", "Emerald", "Platinum", "Gold", "Blue"].map((x) => <button key={x} onClick={() => setSas(x)} className={chip(sas === x)}>{x}</button>)}</div>
        <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul" aria-label="Judul" className={input} />
        <textarea value={isi} onChange={(e) => setIsi(e.target.value)} rows={3} placeholder="Isi pengumuman" aria-label="Isi" className="rounded-lg border border-line-2 p-3 text-sm" />
        <button disabled={!judul.trim() || !isi.trim()} onClick={() => { kirimPengumuman(judul.trim(), isi.trim(), sas, staf.nama); setJudul(""); setIsi(""); }} className="min-h-12 rounded-lg bg-pj font-semibold text-white disabled:bg-line">Kirim ke {sasaranPengumuman(s, sas)} pedagang</button>
      </div>
      {s.pengumuman.map((g) => <div key={g.id} className={`${panel} text-[13px]`}><div className="flex justify-between gap-2"><b>{g.judul}</b><span className="text-xs text-muted">{g.t}</span></div><div className="text-ink-2">{g.isi}</div><div className="mt-1 text-xs text-muted">{g.sasaran} · {g.terkirim} penerima · {g.oleh}</div></div>)}
    </>
  );
}

function Aktivasi({ s, staf }: { s: State; staf: Staf }) {
  const pakai = new Set(s.tu.filter((t) => t.buka).map((t) => t.pemakaiId));
  const list = s.pedagang.filter((p) => !p.aktif && pakai.has(p.id));
  const sudah = new Set(s.interaksi.filter((x) => x.kanal === "SMS" || x.kanal === "Kunjungan").map((x) => x.pedagangId));
  return (
    <>
      <div className="text-[13px] text-ink-2"><b>{list.length}</b> pemakai TU belum mengaktifkan aplikasi. Kirim ulang tautan &amp; OTP, atau jadwalkan kunjungan petugas.</div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {list.slice(0, 40).map((p) => (
          <div key={p.id} className="flex items-center gap-2 border-t border-[#EEF0EA] px-3.5 py-2.5 first:border-0">
            <Link href={`/bo/crm/?id=${p.id}`} className="min-w-0 flex-1"><b className="block text-sm">{p.nama}</b><span className="font-mono text-xs text-muted">{p.id} · {p.hp.slice(0, 4)}••••{p.hp.slice(-4)}</span></Link>
            {sudah.has(p.id) ? <Pill>Dihubungi</Pill> : (<>
              <button onClick={() => kirimUlangOtp(p.id, staf.nama)} className="rounded-lg bg-mint px-2.5 py-2 text-xs font-semibold text-mint-ink">Kirim SMS</button>
              <button onClick={() => catatInteraksi(p.id, "Kunjungan", "Dijadwalkan kunjungan petugas untuk aktivasi aplikasi", staf.nama)} className="rounded-lg border border-line-2 px-2.5 py-2 text-xs font-semibold">Kunjungi</button>
            </>)}
          </div>
        ))}
      </div>
    </>
  );
}
