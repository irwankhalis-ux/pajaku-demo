"use client";

import { useState, type ReactNode } from "react";
import { ingatkanAO, putuskan, useCC } from "@/lib/cc";
import {
  ALUR_TPID, ANOMALI, BELUM_LAPOR, CRM_WR, HARGA_TPID, KEP_GUB, KIOS_TUTUP, KOM_GUB, KOTA, KOTA_F, PASAR_KOTA, PASOKAN, PATUH, PENYEBAB, REKOM, REVIT, REVIT_WR, RISIKO, TAHAP_SANKSI, TUNGGAKAN_KAT, WARNA, WIL, fmt, idn, rpx, type KomGub,
} from "@/lib/direksi";
import { Badge, LogoPJ } from "./cc-ui";

const C = "rounded-xl border border-[#22394A] bg-[#122230]";
const M = "text-[#9FB1BF]";
const pill = (on: boolean) => `min-h-9 rounded-full px-3.5 text-[14px] ${on ? "border border-[#2BB3A3] bg-[#2BB3A3] font-semibold text-[#0B1620]" : "border border-[#3A5060] text-[#C9D5DE]"}`;
const warna3 = (v: number, a = 5, b = 2) => (v >= a ? WARNA.r : v >= b ? WARNA.a : WARNA.g);

function Frame({ judul, sub, kanan, children }: { judul: string; sub: string; kanan?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-[1080px] w-[1920px] flex-col gap-4 bg-[#0B1620] px-8 py-6 text-[#E6EDF2]">
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <LogoPJ h="h-11" />
          <div><div className="text-[26px] font-semibold">{judul}</div><div className={`text-[15px] ${M}`}>{sub}</div></div>
        </div>
        <div className="flex items-center gap-3">{kanan}<span className="rounded-md bg-[#F2A93B] px-3 py-1.5 text-[14px] font-semibold text-[#0B1620]">DATA CONTOH</span><span className={`rounded-md border border-[#2A3B48] px-3 py-1.5 text-[14px] ${M}`}>PaJaKu · Powered by PATROL</span></div>
      </header>
      {children}
    </div>
  );
}
function Kpi({ l, v, n, c, s = 40 }: { l: string; v: ReactNode; n: string; c?: string; s?: number }) {
  return <div className={`${C} flex flex-col gap-1.5 px-5 py-4`}><div className={`text-[15px] ${M}`}>{l}</div><div className="font-mono font-semibold" style={{ fontSize: s, color: c }}>{v}</div><div className={`text-[14px] ${M}`}>{n}</div></div>;
}
function Tombol({ id, judul, siapa, ke, alt = ["rev", "Minta kajian"] }: { id: string; judul: string; siapa: string; ke?: string; alt?: ["rev" | "hold", string] }) {
  const s = useCC();
  const v = s.dec[id];
  if (v) return <Badge v={v} ke={ke} />;
  return <div className="flex gap-2"><button onClick={() => putuskan(id, "ok", siapa, judul)} className="min-h-10 rounded-lg bg-[#2BB3A3] px-4 text-[14px] font-semibold text-[#0B1620]">Setujui</button><button onClick={() => putuskan(id, alt[0], siapa, judul)} className="min-h-10 rounded-lg border border-[#4A6172] px-4 text-[14px]">{alt[1]}</button></div>;
}

// ================= Gubernur DKI =================
export function WallGub({ siapa }: { siapa: string }) {
  const [sel, setSel] = useState<KomGub>("Cabai rawit");
  const [kota, setKota] = useState("Jakarta Timur");
  const red = KOTA.reduce((n, k) => n + k[4][sel][1], 0);
  const kd = KOTA.find((k) => k[0] === kota)!;
  const base = kd[4][sel][0];
  // grafik cabai rawit 90 hari + prakiraan 28 hari
  const n = 90, f = 28, x0 = 52, x1 = 510, tot = n + f;
  const X = (i: number) => x0 + ((x1 - x0) * i) / (tot - 1), Y = (v: number) => 200 - ((v - 20000) * 180) / 60000;
  const dki: number[][] = [], nat: number[][] = [];
  for (let i = 0; i < n; i++) { dki.push([X(i), Y(47000 + 2200 * Math.sin(i / 8) + (i > 68 ? (i - 68) * 700 : 0) + 800 * Math.sin(i * 1.9))]); nat.push([X(i), Y(43000 + 2000 * Math.sin(i / 11) + (i > 70 ? (i - 70) * 420 : 0))]); }
  const last = 47000 + 2200 * Math.sin((n - 1) / 8) + (n - 1 - 68) * 700;
  const fc = [[X(n - 1), Y(last)]], upB: number[][] = [], loB: number[][] = [];
  for (let j = 1; j <= f; j++) { const mid = last + j * 280; fc.push([X(n - 1 + j), Y(mid)]); upB.push([X(n - 1 + j), Y(mid + j * 150)]); loB.push([X(n - 1 + j), Y(mid - j * 150)]); }
  const pts = (a: number[][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const tx = X(n - 1);
  return (
    <Frame judul="Command Center TPID · Provinsi DKI Jakarta" sub={`Halaman Gubernur · 156 pasar Perumda Pasar Jaya di 5 kota administrasi · Sabtu, 24 Oktober 2026 · 07.30 WIB`}>
      <section className="grid grid-cols-5 gap-4">
        <Kpi l="Inflasi DKI Jakarta (Sep 2026)" v={<>2,74% <span className={`text-[18px] ${M}`}>yoy</span></>} n="mtm 0,18% · nasional 2,86% · batas atas 3,5%" />
        <Kpi l="IPH DKI minggu ini" v="+0,62%" c={WARNA.a} n="minggu lalu +0,22% · penyumbang: cabai rawit, cabai merah" />
        <Kpi l={`Pasar merah · ${sel.toLowerCase()}`} v={<>{red} <span className={`text-[18px] ${M}`}>dari 156</span></>} c={WARNA.r} n="kenaikan ≥5% seminggu di pasar" />
        <Kpi l="Pasokan cabai rawit · PI Kramat Jati" v="−27%" c={WARNA.r} n="38 ton/hari vs normal 52 ton" />
        <Kpi l="Registri pedagang PaJaKu" v={<>97.000 <span className={`text-[18px] ${M}`}>TU</span></>} n="e-SHPTU/e-SIPTU · 468 responden harga/hari" />
      </section>
      <div className="flex min-h-0 flex-1 gap-4">
        <section className={`${C} flex w-[600px] shrink-0 flex-col gap-2.5 px-5 py-4`}>
          <div className="flex items-baseline justify-between"><h2 className="text-[20px] font-semibold">5 kota administrasi · perubahan 7 hari</h2><div className={`text-[13px] ${M}`}>Pilih kota</div></div>
          <div className="flex flex-wrap gap-2">{KOM_GUB.map((c) => <button key={c} onClick={() => setSel(c)} className={pill(c === sel)}>{c}</button>)}</div>
          <div className="grid grid-cols-3 grid-rows-[repeat(3,84px)] gap-2">
            {KOTA.map((k) => { const [v, r] = k[4][sel]; return (
              <button key={k[0]} onClick={() => setKota(k[0])} style={{ gridColumn: k[2], gridRow: k[3], background: warna3(v), borderColor: k[0] === kota ? "#E6EDF2" : "transparent" }} className="flex flex-col items-start justify-between rounded-[10px] border-[3px] px-3 py-1.5 text-left text-[#0B1620]">
                <span className="text-[15px] font-semibold">{k[0]}</span><span className="font-mono text-[22px] font-semibold">+{fmt(v)}%</span><span className="text-[12px]">{r} dari {k[1]} pasar merah</span>
              </button>); })}
          </div>
          <div className="flex items-center gap-4 text-[13px] text-[#C9D5DE]">{([[WARNA.r, "≥5%"], [WARNA.a, "2–5%"], [WARNA.g, "<2%"]] as const).map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className="size-3.5 rounded-sm" style={{ background: c }} />{l}</span>)}<span className={`ml-auto ${M}`}>Kep. Seribu tidak ditampilkan</span></div>
        </section>
        <section className={`${C} flex min-h-0 w-[560px] shrink-0 flex-col gap-2 overflow-hidden px-5 py-4`}>
          <div className="flex items-baseline justify-between"><h2 className="text-[20px] font-semibold">{kota} · pasar dengan sinyal</h2><div className={`text-[13px] ${M}`}>{kd[1]} pasar Pasar Jaya</div></div>
          <div className="grid grid-cols-[minmax(0,1.6fr)_84px_96px_110px] items-center gap-x-3 text-[14px]">
            {["Pasar", "7 hari", `Pedagang ${sel.startsWith("Beras") ? "beras" : sel.toLowerCase()}`, "Aktif hari ini"].map((h, i) => <div key={h} className={`py-1 text-[12px] ${M} ${i ? "text-right" : ""}`}>{h}</div>)}
            {PASAR_KOTA[kota].map(([nm, k, tr, ak]) => { const v = base * k, drop = Math.round((1 - ak / tr) * 100); return [
              <div key={nm + 1} className="border-t border-[#1E3242] py-2 font-semibold">{nm}</div>,
              <div key={nm + 2} className="border-t border-[#1E3242] py-2 text-right font-mono font-semibold" style={{ color: v >= 5 ? WARNA.r : v >= 2 ? WARNA.a : "#C9D5DE" }}>+{fmt(v)}%</div>,
              <div key={nm + 3} className="border-t border-[#1E3242] py-2 text-right font-mono">{tr}</div>,
              <div key={nm + 4} className="border-t border-[#1E3242] py-2 text-right font-mono" style={{ color: drop >= 10 ? WARNA.r : "#C9D5DE" }}>{ak}{drop > 0 ? ` (−${drop}%)` : ""}</div>,
            ]; })}
          </div>
          <div className="mt-auto flex flex-col gap-1.5 rounded-[10px] bg-[#0E1D29] px-3.5 py-3"><div className="text-[13px] font-semibold text-[#7FD3C7]">ANALISIS PENYEBAB (AI)</div><div className="text-[14px] leading-normal">{PENYEBAB[kota]}</div></div>
        </section>
        <section className={`${C} flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 overflow-y-auto border-2 border-[#F2A93B] px-5 py-4`}>
          <h2 className="text-[20px] font-semibold">Perlu keputusan Gubernur</h2>
          {KEP_GUB.map((d) => (
            <div key={d.id} className="flex flex-col gap-1.5 rounded-[10px] border border-[#2A3B48] bg-[#0E1D29] px-3.5 py-2.5">
              <div className="text-[15px] font-semibold">{d.title}</div><div className="text-[13px] text-[#C9D5DE]">{d.detail}</div>
              <div className="flex flex-wrap items-center gap-2"><Tombol id={d.id} judul={d.title} siapa={siapa} ke="TPID" /><span className={`ml-auto text-[12px] ${M}`}>{d.sim}</span></div>
            </div>
          ))}
        </section>
      </div>
      <div className="flex h-[300px] gap-4">
        <section className={`${C} flex w-[600px] shrink-0 flex-col gap-2.5 px-5 py-4`}>
          <div className="flex items-baseline justify-between"><h2 className="text-[18px] font-semibold">Pasokan pasar induk vs normal (ton/hari)</h2><span className="rounded bg-[#2BB3A3] px-2 py-0.5 text-[12px] font-semibold text-[#0B1620]">AI NERACA</span></div>
          {PASOKAN.map(([nm, a, b]) => { const r = a / b, c = r < 0.85 ? WARNA.r : r < 0.95 ? WARNA.a : WARNA.g; return (
            <div key={nm} className="grid grid-cols-[170px_minmax(0,1fr)_110px] items-center gap-2.5 text-[14px]"><div>{nm}</div><div className="relative h-3.5 rounded-full bg-[#1E3242]"><div className="absolute top-0 left-0 h-3.5 rounded-full" style={{ width: `${Math.min(100, Math.round(r * 80))}%`, background: c }} /><div className="absolute -top-[3px] -bottom-[3px] left-[80%] w-0.5 bg-[#E6EDF2]" /></div><div className="text-right font-mono font-semibold" style={{ color: c }}>{idn(a)} / {idn(b)}</div></div>); })}
          <div className={`mt-auto text-[13px] ${M}`}>Garis putih = pasokan normal. Cabai dari Jabar, Jateng, Jatim; bawang merah dari Brebes. Beras: stok PIBC (Food Station) 38.500 ton, aman.</div>
        </section>
        <section className={`${C} flex w-[560px] shrink-0 flex-col gap-2 px-5 py-4`}>
          <h2 className="text-[18px] font-semibold">Cabai rawit · 90 hari + prakiraan 4 minggu</h2>
          <svg width="520" height="230" viewBox="0 0 520 230" role="img" aria-label="Harga cabai rawit Jakarta naik dalam tiga minggu terakhir">
            {[20, 80, 140, 200].map((y, i) => <g key={y}><line x1="52" y1={y} x2="510" y2={y} stroke="#22394A" /><text x="46" y={y + 4} textAnchor="end" fontSize="12" fill="#9FB1BF">{["80 rb", "60 rb", "40 rb", "20 rb"][i]}</text></g>)}
            <polygon points={pts([[tx, Y(last)], ...upB, ...[...loB].reverse()])} fill="#F2A93B" fillOpacity="0.18" />
            <polyline points={pts(nat)} fill="none" stroke="#8FA3B3" strokeWidth="2" />
            <polyline points={pts(dki)} fill="none" stroke="#2BB3A3" strokeWidth="3" />
            <polyline points={pts(fc)} fill="none" stroke="#F2A93B" strokeWidth="2.5" strokeDasharray="6 5" />
            <line x1={tx} y1="16" x2={tx} y2="204" stroke="#E6EDF2" strokeDasharray="3 4" />
            <text x={tx - 26} y="14" fontSize="12" fill="#E6EDF2">Hari ini</text>
            <text x="56" y="222" fontSize="12" fill="#9FB1BF">27 Jul</text><text x={tx - 26} y="222" fontSize="12" fill="#9FB1BF">24 Okt</text><text x="470" y="222" fontSize="12" fill="#9FB1BF">21 Nov</text>
          </svg>
          <div className="flex gap-3.5 text-[12px] text-[#C9D5DE]"><span className="flex items-center gap-1.5"><span className="h-[3px] w-4 bg-[#2BB3A3]" />DKI Jakarta</span><span className="flex items-center gap-1.5"><span className="h-[3px] w-4 bg-[#8FA3B3]" />Nasional</span><span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-[#F2A93B]" />Prakiraan AI</span></div>
        </section>
        <section className="flex min-w-0 flex-1 flex-col gap-2 rounded-xl border border-[#2BB3A3] bg-[#10283A] px-5 py-4">
          <div className="flex items-baseline justify-between"><h2 className="text-[18px] font-semibold">Risiko 2–4 minggu</h2><span className="rounded bg-[#2BB3A3] px-2 py-0.5 text-[12px] font-semibold text-[#0B1620]">AI PRAKIRAAN</span></div>
          {RISIKO.map(([k, kt, e, c]) => { const hi = parseInt(e.split("–")[1], 10); return <div key={k + kt} className="grid grid-cols-[minmax(0,1fr)_84px] gap-2 border-t border-[#1E3A4F] py-1 text-[14px]"><div><b>{k}</b> · {kt} <span className={`text-[12px] ${M}`}>· {c}</span></div><div className="text-right font-mono font-semibold" style={{ color: hi >= 12 ? WARNA.r : hi >= 8 ? WARNA.a : "#E6EDF2" }}>{e}</div></div>; })}
          <div className={`mt-auto text-[12px] ${M}`}>Sumber: input harian juru tagih/AO di Konsol Pasar Jaya (156 pasar, 3 responden/komoditas), terintegrasi dengan Info Pangan Jakarta, PIHPS BI, IPH BPS–Kemendag</div>
        </section>
      </div>
    </Frame>
  );
}

// ================= War Room 1: bisnis & layanan =================
const AREAS = ["Semua", "Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur"];
export function WallWR1() {
  const s = useCC();
  const [area, setArea] = useState("Semua");
  const keys = AREAS.slice(1);
  const sum = (f: (d: (typeof WIL)[string]) => number) => keys.reduce((n, k) => n + f(WIL[k]), 0);
  const cur = area === "Semua" ? { tu: sum((d) => d.tu), aktif: sum((d) => d.aktif), kosong: sum((d) => d.kosong), tutup: sum((d) => d.tutup), pasar: 156, t: sum((d) => d.t), r: sum((d) => d.r), tiers: [0, 1, 2, 3].map((i) => sum((d) => d.tiers[i])), ews: [0, 1, 2, 3, 4].map((i) => sum((d) => d.ews[i])) } : WIL[area];
  const pc = (a: number, b: number) => `${fmt((100 * a) / b)}%`;
  const rp = (n: number) => `Rp${fmt(n)} M`;
  const exp = (cur.t * 24) / 31;
  const opOk = s.dec.op === "ok" || s.dec.c1 === "ok";
  const alerts: [string, string, string][] = [
    ["r", "BPP Jakarta Utara di bawah target", "realisasi 66% dari seharusnya; 3 pasar menyumbang 41% selisih"],
    ["r", "Kios kosong Pasar Kramat Jaya 31%", "naik dari 24% · usulkan promosi JaKios dan harga sewa khusus"],
    ["a", "Atap bocor Pasar Jatinegara", "23 tiket lewat SLA · musim hujan, perlu anggaran darurat"],
    ["a", `${7 - Object.keys(s.ingat).length} pasar belum input harga TPID`, "AO terkait diingatkan dari layar 2"],
    opOk ? ["g", "Pemprov menyetujui operasi pasar cabai", "disalurkan lewat 412 pedagang cabai di Jakut & Jaktim, mulai Senin"] : ["a", "Usulan operasi pasar cabai menunggu Gubernur", "15 ton lewat Food Station · lihat Command Center DKI"],
  ];
  return (
    <Frame judul="War Room Direksi · Perumda Pasar Jaya" sub="Layar 1 · tenancy, okupansi, penagihan BPP, layanan tenant · Sabtu, 24 Oktober 2026 · 07.30 WIB"
      kanan={<div className="flex gap-1.5">{AREAS.map((a) => <button key={a} onClick={() => setArea(a)} className={pill(a === area)}>{a === "Semua" ? a : a.replace("Jakarta ", "Jak")}</button>)}</div>}>
      <section className="grid grid-cols-6 gap-3.5">
        <Kpi s={30} l="Okupansi" v={pc(cur.aktif, cur.tu)} n={`${idn(cur.aktif)} aktif dari ${idn(cur.tu)} TU · ${cur.pasar} pasar`} />
        <Kpi s={30} l="Kios kosong" v={idn(cur.kosong)} c={WARNA.a} n="tayang di JaKios: 82% · 1.240 peminat Blue" />
        <Kpi s={30} l="BPP Oktober s.d. hari ini" v={rp(cur.r)} c={cur.r / exp < 0.95 ? WARNA.r : WARNA.g} n={`${pc(cur.r, cur.t)} dari target ${rp(cur.t)} · seharusnya ${pc(exp, cur.t)}`} />
        <Kpi s={30} l="TU menunggak (status 3–5)" v={idn(cur.ews[2] + cur.ews[3] + cur.ews[4])} c={WARNA.r} n={`macet ${idn(cur.ews[4])} TU · naik 6% dari bulan lalu`} />
        <Kpi s={30} l="Tiket CRM terbuka" v="412" n="SLA tercapai 86% · terlambat 58 tiket" />
        <Kpi s={30} l="Input harga TPID hari ini" v="149/156" c={WARNA.g} n="pasar sudah lapor · lihat layar 2" />
      </section>
      <div className="flex min-h-0 flex-1 gap-3.5">
        <section className={`${C} flex w-[600px] shrink-0 flex-col gap-3 px-5 py-4`}>
          <h2 className="text-[19px] font-semibold">Okupansi tempat usaha per wilayah</h2>
          {keys.map((k) => { const d = WIL[k]; const w = (x: number) => `${((100 * x) / d.tu).toFixed(1)}%`; return (
            <div key={k} className="grid grid-cols-[130px_minmax(0,1fr)_64px] items-center gap-2.5 text-[14px]"><div className={area === k ? "font-semibold text-[#7FD3C7]" : ""}>{k}</div><div className="flex h-[18px] overflow-hidden rounded"><div style={{ width: w(d.aktif), background: "#2BB3A3" }} /><div style={{ width: w(d.kosong), background: "#F2C14E" }} /><div style={{ width: w(d.tutup), background: "#5B6E7C" }} /></div><div className="text-right font-mono font-semibold">{pc(d.aktif, d.tu)}</div></div>); })}
          <div className="flex gap-4 text-[12px] text-[#C9D5DE]">{([["#2BB3A3", "Aktif"], ["#F2C14E", "Kosong"], ["#5B6E7C", "Tutup"]] as const).map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: c }} />{l}</span>)}</div>
          <div className="flex flex-col gap-2 border-t border-[#22394A] pt-3">
            <h3 className="text-[16px] font-semibold">Kategori tenant · {area === "Semua" ? "semua wilayah" : area}</h3>
            <div className="grid grid-cols-4 gap-2">{([["Emerald", "pemilik berdagang", "#2BB3A3"], ["Platinum", "pemilik saja", "#9FB1BF"], ["Gold", "pengelola/penyewa", "#F2C14E"], ["Blue", "anggota/calon", "#5AA9E6"]] as const).map(([nm, d, c], i) => <div key={nm} className="flex flex-col gap-0.5 rounded-lg px-2.5 py-2 text-[#0B1620]" style={{ background: c }}><div className="text-[13px] font-semibold">{nm}</div><div className="font-mono text-[22px] font-semibold">{idn(cur.tiers[i])}</div><div className="text-[11px]">{d}</div></div>)}</div>
            <div className={`text-[13px] ${M}`}>Migrasi e-SHPTU/e-SIPTU: {idn(cur.aktif * 0.87)} TU sudah sign in · Emerald = sasaran program Pemprov dan bank</div>
          </div>
        </section>
        <section className={`${C} flex w-[640px] shrink-0 flex-col gap-3 px-5 py-4`}>
          <div className="flex items-baseline justify-between"><h2 className="text-[19px] font-semibold">Penagihan BPP Oktober · target vs realisasi</h2><div className={`text-[13px] ${M}`}>Rp miliar · garis = target s.d. hari ini</div></div>
          {keys.map((k) => { const d = WIL[k]; const ok = d.r / ((d.t * 24) / 31) >= 0.95; return (
            <div key={k} className="grid grid-cols-[130px_minmax(0,1fr)_120px] items-center gap-2.5 text-[14px]"><div className={area === k ? "font-semibold text-[#7FD3C7]" : ""}>{k}</div><div className="relative h-[18px] rounded bg-[#1E3242]"><div className="absolute top-0 left-0 h-[18px] rounded" style={{ width: `${((100 * d.r) / d.t).toFixed(1)}%`, background: ok ? "#2BB3A3" : "#F07A63" }} /><div className="absolute -top-[3px] -bottom-[3px] w-0.5 bg-[#E6EDF2]" style={{ left: `${((100 * 24) / 31).toFixed(1)}%` }} /></div><div className="text-right font-mono"><b>{fmt(d.r)}</b> / {fmt(d.t)}</div></div>); })}
          <div className="flex flex-col gap-2 border-t border-[#22394A] pt-3">
            <div className="flex items-baseline justify-between"><h3 className="text-[16px] font-semibold">Peringatan dini tunggakan · {area === "Semua" ? "semua wilayah" : area}</h3><span className={`text-[12px] ${M}`}>jumlah TU · juru tagih hanya ke status 3–5</span></div>
            <div className="grid grid-cols-5 gap-2">{([["1 Lancar", "otomatis LUNAS", "#2BB3A3"], ["2 Perhatian", "pengingat WA", "#63C79A"], ["3 Kurang lancar", "kunjungan AO", "#F2C14E"], ["4 Diragukan", "surat teguran", "#F2A93B"], ["5 Macet", "eskalasi", "#F07A63"]] as const).map(([nm, d, c], i) => <div key={nm} className="flex flex-col gap-0.5 rounded-lg px-2.5 py-2 text-[#0B1620]" style={{ background: c }}><div className="text-[12px] font-semibold">{nm}</div><div className="font-mono text-[22px] font-semibold">{idn(cur.ews[i])}</div><div className="text-[11px]">{d}</div></div>)}</div>
            <div className="grid grid-cols-4 gap-2 text-[13px]">{([["Piutang lama", "Rp258,1 M", ""], [">12 bulan", "Rp171,4 M", WARNA.r], ["Tertagih YTD", "Rp14,9 M", WARNA.g], ["Bayar digital", "71%", ""]] as const).map(([l, v, c]) => <div key={l} className="rounded-lg bg-[#0E1D29] px-2.5 py-2"><div className={`text-[12px] ${M}`}>{l}</div><div className="font-mono font-semibold" style={{ color: c || undefined }}>{v}</div></div>)}</div>
          </div>
        </section>
        <section className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className={`${C} flex flex-col gap-2.5 px-5 py-4`}>
            <div className="flex items-baseline justify-between"><h2 className="text-[19px] font-semibold">CRM tenant · Oktober</h2><span className={`text-[13px] ${M}`}>2.318 tiket · NPS +31</span></div>
            {CRM_WR.map(([nm, n, sla]) => <div key={nm} className="grid grid-cols-[minmax(0,1fr)_54px_92px] items-center gap-2.5 text-[14px]"><div>{nm}</div><div className="text-right font-mono">{n}</div><div className="text-right font-mono font-semibold" style={{ color: sla >= 90 ? WARNA.g : sla >= 85 ? WARNA.a : WARNA.r }}>SLA {sla}%</div></div>)}
          </div>
          <div className={`${C} flex min-h-0 flex-1 flex-col gap-2 border-2 border-[#F2A93B] px-5 py-4`}>
            <h2 className="text-[19px] font-semibold">Perlu perhatian Direksi</h2>
            {alerts.map(([c, t, d]) => <div key={t} className="grid grid-cols-[10px_minmax(0,1fr)] items-start gap-2.5 border-t border-[#22394A] py-1.5 text-[14px]"><span className="mt-[5px] size-2.5 rounded-full" style={{ background: WARNA[c as "r"] }} /><div><b>{t}</b> <span className="text-[#C9D5DE]">· {d}</span></div></div>)}
          </div>
        </section>
      </div>
      <section className={`${C} flex h-[120px] items-stretch gap-[18px] px-5 py-3.5`}>
        <div className="flex w-[200px] shrink-0 flex-col justify-center gap-1"><h2 className="text-[18px] font-semibold">Revitalisasi pasar</h2><div className={`text-[13px] ${M}`}>Mitra Pengembang · penjualan TU</div></div>
        {REVIT_WR.map(([nm, st, p, note]) => <div key={nm} className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[10px] bg-[#0E1D29] px-3.5 py-2.5"><div className="flex justify-between text-[14px]"><b>{nm}</b><span className={M}>{st}</span></div><div className="h-2 rounded bg-[#1E3242]"><div className="h-2 rounded bg-[#2BB3A3]" style={{ width: `${p}%` }} /></div><div className="truncate text-[12px] text-[#C9D5DE]">{note}</div></div>)}
      </section>
    </Frame>
  );
}

// ================= War Room 2: harga TPID =================
export function WallWR2({ siapa }: { siapa: string }) {
  const s = useCC();
  const [sel, setSel] = useState("Cabai rawit");
  const d = HARGA_TPID.find((x) => x[0] === sel)!;
  const [lo, hi] = [d[4], d[5]], span = hi - lo;
  const k = (n: number) => `${fmt(n / 1000, n >= 100000 ? 0 : 1)} rb`;
  const sudah = Object.keys(s.ingat).length;
  const flagOpen = 37 - ANOMALI.filter((a) => s.dec[a[0]]).length;
  return (
    <Frame judul="War Room Direksi · Harga komoditas TPID dari 156 pasar" sub="Layar 2 · diinput juru tagih/AO di Konsol Pasar Jaya sesuai penugasan pasar · Sabtu, 24 Oktober 2026 · 10.30 WIB">
      <section className="grid grid-cols-5 gap-2.5">
        {ALUR_TPID.map(([no, t, j, n, st]) => <div key={no} className={`flex flex-col gap-1 rounded-[10px] px-3.5 py-2.5 ${st === "done" ? "border border-[#2BB3A3] bg-[#12313A]" : st === "now" ? "border-2 border-[#F2C14E] bg-[#3A3220]" : "border border-[#22394A] bg-[#122230] text-[#C9D5DE]"}`}><div className="flex justify-between text-[13px]"><b>Langkah {no}</b><span className="font-mono">{t}</span></div><div className="text-[15px] font-semibold">{j}</div><div className="text-[12px]">{n}</div></div>)}
      </section>
      <section className="grid grid-cols-5 gap-3.5">
        <Kpi s={30} l="Pasar sudah lapor" v="149/156" c={WARNA.g} n="tepat waktu 141 · terlambat 8" />
        <Kpi s={30} l="Entri harga masuk" v="6.214" n="dari 6.552 (14 komoditas × 3 responden × 156 pasar)" />
        <Kpi s={30} l="Juru tagih/AO bertugas" v="312" n="2 per pasar · input di rute penagihan" />
        <Kpi s={30} l="Entri ditandai validasi" v={flagOpen} c={WARNA.a} n="menyimpang >25% dari median pasar sekitar" />
        <div className={`${C} px-[18px] py-3.5`}><div className={`text-[14px] ${M}`}>Terkirim ke</div><div className="text-[17px] leading-snug font-semibold">Command Center Gubernur · Info Pangan Jakarta</div><div className={`text-[13px] ${M}`}>10.30 WIB · format IPH/rakor</div></div>
      </section>
      <div className="flex min-h-0 flex-1 gap-3.5">
        <section className={`${C} flex w-[820px] shrink-0 flex-col gap-2.5 px-5 py-4`}>
          <div className="flex items-baseline justify-between"><h2 className="text-[19px] font-semibold">14 komoditas TPID · rata-rata 156 pasar Pasar Jaya</h2><div className={`text-[13px] ${M}`}>Pilih baris untuk sebaran per kota</div></div>
          <div className="grid grid-cols-[minmax(0,1.4fr)_110px_80px_120px_150px] items-center gap-x-3 text-[14px]">
            {["Komoditas", "Hari ini", "vs kemarin", "Info Pangan Jkt", "Rentang antarpasar"].map((h, i) => <div key={h} className={`py-0.5 text-[12px] ${M} ${i ? "text-right" : ""}`}>{h}</div>)}
            {HARGA_TPID.map(([nm, h, c, ipj, a, b]) => [
              <button key={nm + 0} onClick={() => setSel(nm)} className={`min-h-[30px] rounded border-t border-[#1E3242] px-2 text-left ${nm === sel ? "bg-[#2BB3A3] font-semibold text-[#0B1620]" : ""}`}>{nm}</button>,
              <div key={nm + 1} className="border-t border-[#1E3242] py-1 text-right font-mono">{rpx(h)}</div>,
              <div key={nm + 2} className="border-t border-[#1E3242] py-1 text-right font-mono font-semibold" style={{ color: c >= 2 ? WARNA.r : c >= 0.5 ? WARNA.a : "#C9D5DE" }}>{c > 0 ? "+" : ""}{fmt(c)}%</div>,
              <div key={nm + 3} className="border-t border-[#1E3242] py-1 text-right font-mono text-[#C9D5DE]">{rpx(ipj)}</div>,
              <div key={nm + 4} className="border-t border-[#1E3242] py-1 text-right font-mono text-[#C9D5DE]">{k(a)}–{k(b)}</div>,
            ])}
          </div>
        </section>
        <section className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="flex flex-col gap-2.5 rounded-xl border border-[#2BB3A3] bg-[#10283A] px-5 py-4">
            <h2 className="text-[18px] font-semibold">{sel} · sebaran harga per kota (Rp/kg)</h2>
            {KOTA_F.map(([nm, f, r0, r1]) => { const med = Math.min(hi, Math.max(lo, d[1] * f)); const a = lo + span * (1 - r0) * 0.6, b = lo + span * r1; const p = (v: number) => (100 * (v - lo)) / span; return (
              <div key={nm} className="grid grid-cols-[130px_minmax(0,1fr)_90px] items-center gap-2.5 text-[14px]"><div>{nm}</div><div className="relative h-4"><div className="absolute inset-x-0 top-[7px] h-0.5 bg-[#22394A]" /><div className="absolute top-[5px] h-1.5 rounded bg-[#2BB3A3] opacity-55" style={{ left: `${p(a)}%`, width: `${p(b) - p(a)}%` }} /><div className="absolute top-0.5 -ml-1.5 size-3 rounded-full bg-[#E6EDF2]" style={{ left: `${p(med)}%` }} /></div><div className="text-right font-mono font-semibold">{rpx(med)}</div></div>); })}
            <div className={`text-[12px] ${M}`}>Garis = harga terendah–tertinggi antarpasar di kota itu; titik = median</div>
          </div>
          <div className={`${C} flex flex-col gap-2 px-5 py-4`}>
            <h2 className="text-[18px] font-semibold">Kepatuhan input per kota</h2>
            {PATUH.map(([nm, a, b, c, t]) => <div key={nm} className="grid grid-cols-[130px_minmax(0,1fr)_70px] items-center gap-2.5 text-[14px]"><div>{nm}</div><div className="flex h-3.5 overflow-hidden rounded-sm"><div style={{ width: `${(100 * a) / t}%`, background: "#2BB3A3" }} /><div style={{ width: `${(100 * b) / t}%`, background: "#F2C14E" }} /><div style={{ width: `${(100 * c) / t}%`, background: "#F07A63" }} /></div><div className="text-right font-mono">{a + b}/{t}</div></div>)}
            <div className="flex gap-3.5 text-[12px] text-[#C9D5DE]">{([["#2BB3A3", "Tepat waktu"], ["#F2C14E", "Terlambat"], ["#F07A63", "Belum"]] as const).map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: c }} />{l}</span>)}</div>
          </div>
        </section>
        <section className="flex min-h-0 w-[440px] shrink-0 flex-col gap-3">
          <div className={`${C} flex flex-col gap-1.5 border-2 border-[#F07A63] px-[18px] py-3.5`}>
            <h2 className="text-[18px] font-semibold">Pasar belum lapor · {7 - sudah} belum diingatkan</h2>
            {BELUM_LAPOR.map(([p, kt, ao]) => <div key={p} className="grid grid-cols-[minmax(0,1fr)_70px_104px] items-center gap-2 text-[13px]"><div><b>{p}</b> <span className={M}>· {kt}</span></div><div className={`font-mono ${M}`}>{ao}</div>{s.ingat[p] ? <span className="text-[12px] font-semibold text-[#63C79A]">Terkirim</span> : <button onClick={() => ingatkanAO(p, ao, siapa)} className="min-h-8 rounded-md border border-[#4A6172] text-[12px]">Ingatkan AO</button>}</div>)}
          </div>
          <div className={`${C} flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto border-[#F2C14E] px-[18px] py-3`}>
            <div className="flex items-baseline justify-between"><h2 className="text-[18px] font-semibold">Validasi otomatis</h2><span className="rounded bg-[#2BB3A3] px-1.5 py-0.5 text-[11px] font-semibold text-[#0B1620]">AI ANOMALI</span></div>
            {ANOMALI.map(([id, kom, p, ao, det]) => { const v = s.dec[id]; return (
              <div key={id} className="flex flex-col gap-1.5 border-t border-[#22394A] py-1.5">
                <div className="text-[13px]"><b>{kom} · {p}</b> <span className={M}>· {ao}</span></div><div className="text-[12px] text-[#C9D5DE]">{det}</div>
                {v ? <span className={`self-start rounded px-2 py-1 text-[12px] font-semibold ${v === "ok" ? "bg-[#2BB3A3] text-[#0B1620]" : "bg-[#3A5060]"}`}>{v === "ok" ? "Dikonfirmasi · dipakai" : `Input ulang diminta ke ${ao}`}</span> : <div className="flex gap-2"><button onClick={() => putuskan(id, "ok", siapa, `harga ${kom} ${p} benar`)} className="min-h-9 rounded-md bg-[#2BB3A3] px-3 text-[12px] font-semibold text-[#0B1620]">Konfirmasi benar</button><button onClick={() => putuskan(id, "redo", siapa, `harga ${kom} ${p}`)} className="min-h-9 rounded-md border border-[#4A6172] px-3 text-[12px]">Minta input ulang</button></div>}
              </div>); })}
          </div>
        </section>
      </div>
    </Frame>
  );
}

// ================= War Room 3: kios tutup, penegakan BPP, revitalisasi =================
export function WallWR3({ siapa }: { siapa: string }) {
  const [rv, setRv] = useState("Pasar Serdang");
  const tps = REVIT.reduce((n, r) => n + r[4], 0);
  const cur = REVIT.find((r) => r[0] === rv)!;
  return (
    <Frame judul="War Room Direksi · Kios tutup, penegakan BPP, revitalisasi" sub="Layar 3 · tahapan sanksi mengikuti Perda DKI 7/2018 Pasal 20: surat peringatan → penutupan sementara → pembatalan perjanjian">
      <section className="grid grid-cols-6 gap-3.5">
        <Kpi s={28} l="Kios tutup" v="2.840" c={WARNA.a} n="2,6% dari 110.840 TU · 1.870 tutup >12 bln" />
        <Kpi s={28} l="TU kurang lancar (status 3)" v="7.080" c={WARNA.a} n="tunggak 3–6 bulan · Rp21,6 M" />
        <Kpi s={28} l="TU diragukan (status 4)" v="2.770" c="#F2A93B" n="tunggak 6–12 bulan · Rp31,9 M" />
        <Kpi s={28} l="TU macet (status 5)" v="1.730" c={WARNA.r} n="tunggak >12 bulan · Rp171,4 M · naik 6%" />
        <Kpi s={28} l="Dalam proses sanksi" v="1.214" n="SP 1–3, penutupan sementara, pembatalan" />
        <Kpi s={28} l="Pedagang di penampungan" v={idn(tps)} c={WARNA.a} n="6 pasar revitalisasi dengan mitra" />
      </section>
      <div className="flex min-h-0 flex-1 gap-3.5">
        <section className={`${C} flex w-[560px] shrink-0 flex-col gap-2.5 px-5 py-4`}>
          <h2 className="text-[19px] font-semibold">Kios tutup · penyebab dan lama tutup</h2>
          {KIOS_TUTUP.map(([nm, n, a, b, c]) => <div key={nm} className="grid grid-cols-[minmax(0,1fr)_64px_200px] items-center gap-2.5 text-[14px]"><div>{nm}</div><div className="text-right font-mono font-semibold">{idn(n)}</div><div className="flex h-3.5 overflow-hidden rounded-sm"><div style={{ width: `${a}%`, background: WARNA.g }} /><div style={{ width: `${b}%`, background: WARNA.a }} /><div style={{ width: `${c}%`, background: WARNA.r }} /></div></div>)}
          <div className="flex gap-3.5 text-[12px] text-[#C9D5DE]">{([[WARNA.g, "<3 bln"], [WARNA.a, "3–12 bln"], [WARNA.r, ">12 bln"]] as const).map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: c }} />{l}</span>)}</div>
          <div className="flex flex-col gap-1.5 border-t border-[#22394A] pt-2.5">
            <h3 className="text-[16px] font-semibold">Tunggakan BPP status 3–5 per kategori tenant</h3>
            <div className="grid grid-cols-[minmax(0,1fr)_80px_80px_80px_96px] items-center gap-x-2.5 gap-y-1 text-[13px]">
              {["Kategori", "Kurang lancar", "Diragukan", "Macet", "Nilai"].map((h, i) => <div key={h} className={`text-[12px] ${M} ${i ? "text-right" : ""}`}>{h}</div>)}
              {TUNGGAKAN_KAT.map(([nm, a, b, c, v]) => [<b key={nm}>{nm}</b>, <div key={nm + 1} className="text-right font-mono">{a}</div>, <div key={nm + 2} className="text-right font-mono">{b}</div>, <div key={nm + 3} className="text-right font-mono font-semibold text-[#F07A63]">{c}</div>, <div key={nm + 4} className="text-right font-mono">{v}</div>])}
            </div>
            <div className={`text-[12px] ${M}`}>Kios kosong/tutup: BPP tetap tanggungan pemilik (SIPTU). 1.870 TU tutup &gt;12 bulan masih menumpuk tunggakan.</div>
          </div>
        </section>
        <section className={`${C} flex w-[600px] shrink-0 flex-col gap-2.5 px-5 py-4`}>
          <div className="flex items-baseline justify-between"><h2 className="text-[19px] font-semibold">Alur penegakan BPP · posisi TU saat ini</h2><span className={`text-[12px] ${M}`}>jumlah TU · lewat tenggat</span></div>
          {TAHAP_SANKSI.map(([no, nm, rule, n, over, c]) => <div key={no} className="grid grid-cols-[26px_minmax(0,1fr)_70px_90px] items-center gap-2.5 text-[14px]"><div className="flex size-[26px] items-center justify-center rounded-full text-[13px] font-semibold text-[#0B1620]" style={{ background: c === "g" ? "#2BB3A3" : WARNA[c] }}>{no}</div><div><div className="font-semibold">{nm}</div><div className={`text-[12px] ${M}`}>{rule}</div></div><div className="text-right font-mono font-semibold">{idn(n)}</div><div className="text-right font-mono text-[13px]" style={{ color: over ? WARNA.r : "#9FB1BF" }}>{over ? `${over} lewat` : "—"}</div></div>)}
          <div className={`mt-auto text-[12px] ${M}`}>Dasar: Perda DKI 7/2018 Pasal 9 ayat (2) huruf c, Pasal 20 (sanksi berjenjang), Pasal 21 (kewenangan Direksi). Rincian SP dan tenggat mengikuti Keputusan Direksi — perlu dikonfirmasi.</div>
        </section>
        <section className={`${C} flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-y-auto border-2 border-[#F2A93B] px-5 py-3.5`}>
          <div className="flex items-baseline justify-between"><h2 className="text-[19px] font-semibold">Rekomendasi keputusan Direksi</h2><span className="rounded bg-[#2BB3A3] px-2 py-0.5 text-[12px] font-semibold text-[#0B1620]">AI REKOMENDASI</span></div>
          {REKOM.map((r) => (
            <div key={r.id} className="flex flex-col gap-1 rounded-[10px] border border-[#2A3B48] bg-[#0E1D29] px-3 py-2">
              <div className="flex justify-between gap-2"><span className="text-[14px] font-semibold">{r.title}</span><span className="shrink-0 self-start rounded px-1.5 py-0.5 text-[11px] font-semibold text-[#0B1620]" style={{ background: WARNA[r.lvl] }}>{r.risk}</span></div>
              <div className="text-[12px] text-[#C9D5DE]">{r.detail}</div>
              <div className="flex items-center gap-2"><Tombol id={r.id} judul={r.title} siapa={siapa} ke="Kadiv terkait" alt={["hold", "Tunda / kaji"]} /><span className={`ml-auto text-[12px] ${M}`}>{r.impact}</span></div>
            </div>
          ))}
        </section>
      </div>
      <section className={`${C} flex h-[262px] gap-[18px] px-5 py-3.5`}>
        <div className="flex w-[1140px] shrink-0 flex-col gap-1.5">
          <div className="flex items-baseline justify-between"><h2 className="text-[18px] font-semibold">Pasar dalam kerja sama revitalisasi dengan pihak ketiga</h2><span className={`text-[13px] ${M}`}>Pedagang di tempat penampungan sementara: <b className="text-[#F2C14E]">{idn(tps)}</b> · pilih baris</span></div>
          <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_120px_90px_110px_100px] items-center gap-x-3 text-[13px]">
            {["Pasar", "Mitra · skema", "Tahap", "Hak lama", "Di penampungan", "Lama"].map((h, i) => <div key={h} className={`py-0.5 text-[12px] ${M} ${i >= 3 ? "text-right" : ""}`}>{h}</div>)}
            {REVIT.map((r) => [
              <button key={r[0]} onClick={() => setRv(r[0])} className={`min-h-[30px] rounded border-t border-[#1E3242] px-2 text-left font-semibold ${r[0] === rv ? "bg-[#2BB3A3] text-[#0B1620]" : ""}`}>{r[0]}</button>,
              <div key={r[0] + 1} className="border-t border-[#1E3242] py-1 text-[#C9D5DE]">{r[1]}</div>,
              <div key={r[0] + 2} className="border-t border-[#1E3242] py-1">{r[2]}</div>,
              <div key={r[0] + 3} className="border-t border-[#1E3242] py-1 text-right font-mono">{r[3]}</div>,
              <div key={r[0] + 4} className="border-t border-[#1E3242] py-1 text-right font-mono font-semibold" style={{ color: r[4] ? WARNA.a : "#9FB1BF" }}>{r[4] || "—"}</div>,
              <div key={r[0] + 5} className="border-t border-[#1E3242] py-1 text-right font-mono" style={{ color: r[5] > 12 ? WARNA.r : "#C9D5DE" }}>{r[5] ? `${r[5]} bln` : "—"}</div>,
            ])}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[10px] border border-[#2BB3A3] bg-[#10283A] px-4 py-3">
          <div className="text-[12px] font-semibold text-[#7FD3C7]">DETAIL · {cur[0]}</div>
          <div className="text-[14px]"><b>Penampungan:</b> {cur[6]}</div><div className="text-[14px]"><b>Target kembali:</b> {cur[7]}</div><div className="text-[14px]"><b>Status hak:</b> {cur[8]}</div><div className="text-[14px] text-[#F2C14E]"><b>Isu:</b> {cur[9]}</div>
          <div className={`mt-auto text-[12px] ${M}`}>Progres unit dan penjualan TU pasar revitalisasi dilaporkan mitra lewat MitraPaja.</div>
        </div>
      </section>
    </Frame>
  );
}
