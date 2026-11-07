"use client";

import { useState } from "react";
import { Guard, StafHeader, Tabs, card, Empty, Tile } from "@/components/ui";
import { useData, stafById, pedagangById, validasi, balasTiket, putuskanKoreksi, statistik } from "@/lib/store";

function Kepala() {
  const s = useData();
  const me = stafById(s.sesi!.userId)!;
  const st = statistik(s);
  const [tab, setTab] = useState<"validasi" | "tiket" | "ringkas">("validasi");
  const [sel, setSel] = useState<string | null>(null);
  const [catatan, setCatatan] = useState("");
  const [tk, setTk] = useState<string | null>(null);
  const [balas, setBalas] = useState("");
  const [info, setInfo] = useState("");

  const antre = s.tu.filter((t) => t.status === "didata").sort((a, b) => (b.lapangan?.tgl !== "Okt 2026" ? 1 : 0) - (a.lapangan?.tgl !== "Okt 2026" ? 1 : 0)); // kiriman baru dulu
  const tiket = s.tiket.filter((t) => t.status === "terbuka");
  const t = sel ? s.tu.find((x) => x.id === sel && x.status === "didata") : null;
  const tik = tk ? s.tiket.find((x) => x.id === tk) : null;

  let body;
  if (tab === "validasi" && t) {
    const lap = t.lapangan!;
    const arsipPemakai = pedagangById(s, t.pemakaiId)!.nama;
    const rows: [string, string, string][] = [
      ["Pemilik (SHPTU)", pedagangById(s, t.pemilikId)!.nama, pedagangById(s, t.pemilikId)!.nama],
      ["Pemakai (SIPTU)", arsipPemakai, lap.pemakaiNama || arsipPemakai],
      ["Jenis TU", t.jenis, lap.jenis], ["Dagangan", t.dagangan, lap.buka ? lap.dagangan : "Kosong"], ["Foto", "—", `${lap.foto}/3`],
    ];
    body = (
      <div className="flex flex-col gap-3">
        <button onClick={() => setSel(null)} className="self-start text-sm font-semibold text-pj">‹ Antrean validasi</button>
        <div className={`${card} p-3.5`}>
          <div className="font-mono text-sm text-muted">{t.id} · {t.ukuran}</div>
          <div className="text-lg font-bold">{pedagangById(s, t.pemilikId)!.nama}</div>
          <div className="text-xs text-muted">Didata {lap.petugas} · {lap.tgl}</div>
        </div>
        <div className={`${card} overflow-x-auto px-3 py-1`}>
          <table className="w-full text-[13px]"><thead><tr className="text-left text-[11px] uppercase text-muted"><th className="py-2">Data</th><th>Arsip</th><th>Lapangan</th></tr></thead>
            <tbody>{rows.map(([k, a, b]) => <tr key={k} className="border-t border-[#EFF0EA]"><td className="py-2 pr-2 text-muted">{k}</td><td className="pr-2">{a}</td><td className={`font-semibold ${a !== b && k !== "Foto" ? "text-[#9A5B0E]" : ""}`}>{b}</td></tr>)}</tbody></table>
        </div>
        {lap.pemakaiNama && lap.pemakaiNama !== arsipPemakai && <div className={`rounded-[10px] px-3 py-2.5 text-[13px] ${lap.ownerOk ? "bg-mint text-mint-ink" : "bg-[#F7E3E0] text-[#7A2E24]"}`}>{lap.ownerOk ? `✓ Pemilik menyetujui ${lap.pemakaiNama} sebagai Pengelola (Gold) lewat OTP.` : "Persetujuan Pemilik belum ada — sebaiknya dikembalikan."}</div>}
        <label className="flex flex-col gap-1 text-[13px] font-semibold">Catatan (wajib bila dikembalikan)<input value={catatan} onChange={(e) => setCatatan(e.target.value)} className="min-h-11 rounded-lg border border-line-2 px-3 font-normal" /></label>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { validasi(t.id, true, "", me.jabatan); setInfo(`✓ ${t.id} disetujui · 2 dokumen masuk antrean TTE Direksi`); setSel(null); setCatatan(""); }} className="min-h-12 rounded-lg bg-pj text-sm font-semibold text-white">Setujui</button>
          <button disabled={!catatan.trim()} onClick={() => { validasi(t.id, false, catatan.trim(), me.jabatan); setInfo(`${t.id} dikembalikan ke petugas`); setSel(null); setCatatan(""); }} className="min-h-12 rounded-lg border border-line-2 bg-white text-sm font-semibold disabled:opacity-50">Kembalikan</button>
        </div>
      </div>
    );
  } else if (tab === "validasi") {
    body = antre.length ? antre.slice(0, 40).map((x) => (
      <button key={x.id} onClick={() => { setSel(x.id); setInfo(""); }} className={`${card} flex items-center justify-between gap-2 px-3.5 py-3 text-left`}>
        <span className="min-w-0"><span className="block font-mono text-[13px] font-medium">{x.id} · {x.lapangan?.jenis}</span><span className="block truncate text-[12.5px] text-muted">{pedagangById(s, x.pemilikId)?.nama} · didata {x.lapangan?.tgl}</span></span>
        <span className="shrink-0 text-xs font-bold text-pj">Periksa ›</span>
      </button>
    )) : <Empty>Tidak ada TU menunggu validasi.</Empty>;
  } else if (tab === "tiket" && tik) {
    const p = pedagangById(s, tik.pedagangId);
    body = (
      <div className="flex flex-col gap-3">
        <button onClick={() => setTk(null)} className="self-start text-sm font-semibold text-pj">‹ Daftar tiket</button>
        <div className={`${card} p-3.5`}><div className="font-mono text-xs text-muted">{tik.id}{tik.tuId ? ` · ${tik.tuId}` : ""}</div><div className="text-[15px] font-bold">{p?.nama} · {tik.jenis === "koreksi" ? "Koreksi data" : "Pertanyaan"}</div><div className="text-[13px] text-ink-2">{tik.topik}</div></div>
        <div className="flex flex-col gap-2 rounded-[10px] bg-[#EEF0EA] p-2.5">{tik.msgs.map((m, i) => <div key={i} className={`flex ${m.dari === "s" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] ${m.dari === "s" ? "bg-pj text-white" : "border border-line bg-white"}`}>{m.teks}<div className="mt-0.5 text-[10.5px] opacity-70">{m.t}</div></div></div>)}</div>
        {tik.status === "terbuka" && tik.jenis === "koreksi" && (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { putuskanKoreksi(tik.id, true, me.jabatan); setInfo(`✓ Koreksi ${tik.id} disetujui · dokumen revisi masuk antrean TTE`); setTk(null); }} className="min-h-12 rounded-lg bg-pj text-sm font-semibold text-white">Setujui koreksi</button>
            <button onClick={() => { putuskanKoreksi(tik.id, false, me.jabatan); setTk(null); }} className="min-h-12 rounded-lg border border-line-2 bg-white text-sm font-semibold">Tolak</button>
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); if (balas.trim()) { balasTiket(tik.id, balas.trim(), "s"); setBalas(""); } }} className="flex gap-2">
          <label htmlFor="balas" className="sr-only">Balas</label>
          <input id="balas" value={balas} onChange={(e) => setBalas(e.target.value)} placeholder="Balas lewat aplikasi PaJaKu" className="min-h-11 min-w-0 flex-1 rounded-lg border border-line-2 bg-white px-3 text-sm" />
          <button className="min-h-11 rounded-lg bg-pj px-4 text-sm font-semibold text-white">Kirim</button>
        </form>
      </div>
    );
  } else if (tab === "tiket") {
    body = tiket.length ? tiket.map((x) => (
      <button key={x.id} onClick={() => { setTk(x.id); setInfo(""); }} className={`${card} flex items-center justify-between gap-2 px-3.5 py-3 text-left`}>
        <span className="min-w-0"><span className="block text-[13px] font-semibold">{pedagangById(s, x.pedagangId)?.nama} · {x.jenis === "koreksi" ? "Koreksi" : "Pertanyaan"}</span><span className="block truncate text-xs text-muted">{x.topik}</span></span>
        <span className="shrink-0 text-xs font-bold text-pj">Buka ›</span>
      </button>
    )) : <Empty>Semua tiket sudah ditangani.</Empty>;
  } else {
    const hariIni = s.log.filter((l) => l.apa.startsWith("pendataan")).length;
    body = (
      <>
        <div className="grid grid-cols-2 gap-2">
          <Tile l="Didata lapangan" v={st.didata} s={`dari ${st.total} TU`} />
          <Tile l="Menunggu validasi" v={st.validasi} />
          <Tile l="e-SHPTU terbit" v={st.terbitSh} s={`${Math.round((st.terbitSh / st.total) * 100)}% · target ≥80%`} />
          <Tile l="Akun pedagang aktif" v={st.aktif} s={`dari ${st.pemakai} pemakai`} />
        </div>
        <div className={`${card} p-3.5 text-[13px]`}>Pendataan masuk sesi ini: <b>{hariIni}</b> TU · 3 petugas di lapangan</div>
      </>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <StafHeader jabatan={`L4 · ${me.jabatan}`} judul="Hari ini di pasar">
        <Tabs dark value={tab} onChange={(v) => { setTab(v); setSel(null); setTk(null); }} items={[["validasi", `Validasi · ${antre.length}`], ["tiket", `Tiket · ${tiket.length}`], ["ringkas", "Ringkasan"]]} />
      </StafHeader>
      <main className="flex flex-1 flex-col gap-2 p-4">
        {info && <div className="rounded-[10px] bg-mint px-3 py-2.5 text-[13px] font-semibold text-mint-ink" aria-live="polite">{info}</div>}
        {body}
      </main>
    </div>
  );
}

export default function Page() {
  return <Guard peran="kepala"><Kepala /></Guard>;
}
