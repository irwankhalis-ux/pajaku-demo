"use client";

import Link from "next/link";
import { useState } from "react";
import { BoPage, Kpi, grid, panel } from "@/components/bo";
import { Pill } from "@/components/kit";
import { Tabs } from "@/components/ui";
import { pedagangById, setujuiPengajuan, statistik, tolakPengajuan, tuById, pct } from "@/lib/store";

export default function Migrasi() {
  const [tab, setTab] = useState<"aplikasi" | "corong" | "anomali">("aplikasi");
  const [alasan, setAlasan] = useState<Record<string, string>>({});
  return (
    <BoPage judul="Migrasi & TTE">
      {({ s, staf }) => {
        const st = statistik(s);
        const antre = s.pengajuan.filter((p) => (p.jenis === "migrasi" || p.jenis === "pengelola") && p.status === "proses");
        const corong = [["Arsip / belum didata", st.belum, "#B9BFB6"], ["Didata, menunggu validasi", st.validasi, "#F2C27A"], ["Divalidasi, menunggu TTE", s.tu.filter((t) => t.status === "divalidasi").length, "#E08A2E"], ["Dokumen terbit", s.tu.filter((t) => t.status === "terbit").length, "#1E9E5A"]] as const;
        return (
          <>
            <section className={grid}>
              <Kpi l="Pengajuan dari aplikasi" v={antre.length} s="migrasi mandiri & Pengelola" />
              <Kpi l="Validasi lapangan" v={st.validasi} s="didata petugas/mandiri" />
              <Kpi l="Antrean TTE" v={st.menunggu.length} s="dokumen menunggu Direksi" />
              <Kpi l="Progres pilot" v={`${pct(s.tu.filter((t) => t.status === "terbit").length, st.total)}%`} s={`${st.terbitSh} e-SHPTU · ${st.terbitSi} e-SIPTU`} />
            </section>
            <Tabs value={tab} onChange={setTab} items={[["aplikasi", `Dari aplikasi (${antre.length})`], ["corong", "Corong migrasi"], ["anomali", `Anomali (${st.anomali})`]]} />
            {tab === "aplikasi" && (
              <div className="flex flex-col gap-2.5">
                {antre.length === 0 && <div className={panel}>Tidak ada pengajuan yang menunggu.</div>}
                {antre.map((p) => {
                  const t = p.tuId ? tuById(s, p.tuId) : undefined;
                  const bisa = p.tahap === 2;
                  return (
                    <div key={p.id} className={`${panel} flex flex-col gap-2`}>
                      <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-mono text-xs text-muted">{p.id} · {p.dibuat}</span><Pill tone={p.jenis === "migrasi" ? "bg-[#E7EFFC] text-[#2659B8]" : "bg-[#FBEFD9] text-[#6E4A12]"}>{p.jenis === "migrasi" ? "Migrasi mandiri" : "Registrasi Pengelola"}</Pill></div>
                      <b className="text-[15px]">{p.judul}</b>
                      <div className="text-[13px] text-ink-2">Pemohon: <b>{pedagangById(s, p.pedagangId)?.nama}</b> ({p.pedagangId}){t && <> · {t.jenis} {t.luas} m² · Pemilik arsip: {pedagangById(s, t.pemilikId)?.nama}</>}</div>
                      <div className="flex flex-wrap gap-1.5 text-[12px]">{Object.entries(p.data).filter(([k]) => k !== "pemilik").map(([k, v]) => <span key={k} className="rounded-md bg-paper px-2 py-1"><b>{k}</b>: {v}</span>)}{p.jenis === "migrasi" && t?.lapangan && <span className="rounded-md bg-paper px-2 py-1"><b>foto</b>: {t.lapangan.foto} · QR+GPS cocok</span>}</div>
                      <div className="text-xs text-muted">Terakhir: {p.riwayat[p.riwayat.length - 1].apa}</div>
                      {bisa ? (
                        <div className="flex flex-wrap gap-2">
                          <label htmlFor={`a-${p.id}`} className="sr-only">Catatan pengembalian</label>
                          <input id={`a-${p.id}`} value={alasan[p.id] ?? ""} onChange={(e) => setAlasan({ ...alasan, [p.id]: e.target.value })} placeholder="Catatan bila dikembalikan" className="min-h-11 w-full rounded-lg border border-line-2 px-3 text-sm" />
                          <button disabled={!(alasan[p.id] ?? "").trim()} onClick={() => tolakPengajuan(p.id, alasan[p.id], staf.nama)} className="min-h-11 flex-1 rounded-lg border border-line-2 bg-white px-3 text-sm font-semibold disabled:opacity-50">Kembalikan</button>
                          <button onClick={() => setujuiPengajuan(p.id, staf.nama)} className="min-h-11 flex-[2] rounded-lg bg-pj px-4 text-sm font-semibold text-white">Setujui → antrean TTE</button>
                        </div>
                      ) : <div className="text-[12.5px] font-semibold text-[#9A5B0E]">{p.tahap < 2 ? "Menunggu persetujuan Pemilik di aplikasinya" : "Menunggu TTE Direksi"}</div>}
                    </div>
                  );
                })}
                {({ kepala: ["/kepala/", "Validasi lapangan ›"], direksi: ["/direksi/", "TTE batch ›"], petugas: ["/petugas/", "Pendataan lapangan ›"] } as Record<string, [string, string]>)[staf.peran] && <Link href={({ kepala: "/kepala/", direksi: "/direksi/", petugas: "/petugas/" } as Record<string, string>)[staf.peran]} className="self-start rounded-lg bg-mint px-3 py-2 text-[13px] font-semibold text-mint-ink">{({ kepala: "Validasi lapangan ›", direksi: "TTE batch ›", petugas: "Pendataan lapangan ›" } as Record<string, string>)[staf.peran]}</Link>}
              </div>
            )}
            {tab === "corong" && (
              <div className={`${panel} flex flex-col gap-3`}>
                {corong.map(([l, n, c]) => <div key={l}><div className="flex justify-between text-[13px]"><span>{l}</span><b className="font-mono">{n}</b></div><div className="mt-1 h-3 rounded bg-[#EEF0EA]"><div className="h-3 rounded" style={{ width: `${pct(n, st.total)}%`, background: c }} /></div></div>)}
                <p className="text-xs text-muted">Jalur mandiri (aplikasi TokoPaja) dan jalur petugas berujung di antrean validasi Kepala Pasar yang sama.</p>
              </div>
            )}
            {tab === "anomali" && (
              <div className="flex flex-col gap-2">
                {s.anomali.map((a) => <div key={a.id} className={`${panel} text-[13px]`}><div className="flex justify-between gap-2"><b>{a.jenis}</b><Pill tone={a.status === "selesai" ? "bg-mint text-mint-ink" : a.status === "eskalasi" ? "bg-[#F7E3E0] text-[#7A2E24]" : "bg-[#FBEFD9] text-[#6E4A12]"}>{a.status}</Pill></div><div className="font-mono text-xs text-muted">{a.id} · {a.tuId} · {a.umur} hari · {a.pic}</div><div className="mt-1">{a.temuan}</div>{a.keputusan && <div className="mt-1 text-xs text-muted">Keputusan: {a.keputusan}</div>}</div>)}
                {staf.peran === "manager" && <Link href="/manager/" className="self-start rounded-lg bg-mint px-3 py-2 text-[13px] font-semibold text-mint-ink">Tindak lanjut anomali ›</Link>}
              </div>
            )}
          </>
        );
      }}
    </BoPage>
  );
}
