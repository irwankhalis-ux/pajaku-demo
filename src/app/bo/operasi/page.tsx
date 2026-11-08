"use client";

import { useState } from "react";
import { BoPage, MiniBar, panel } from "@/components/bo";
import { Pill } from "@/components/kit";
import { Tabs } from "@/components/ui";
import { pedagangById, pct, rp, selesaikanTiket, ubahHarga } from "@/lib/store";

const RUTIN = ["Kebersihan los Blok A pagi", "Kebersihan saluran Blok C (basah)", "Patroli keamanan malam", "Cek APAR & hidran", "Pengangkutan sampah TPS", "Cek panel listrik Lt. 2"];

export default function Operasi() {
  const [tab, setTab] = useState<"harga" | "aduan" | "pasar">("harga");
  const [edit, setEdit] = useState<Record<string, string>>({});
  const [cek, setCek] = useState<string[]>([]);
  const [txt, setTxt] = useState<Record<string, string>>({});
  return (
    <BoPage judul="Operasi & Harga">
      {({ s, staf }) => {
        const aduan = s.tiket.filter((t) => t.jenis === "aduan");
        return (
          <>
            <Tabs value={tab} onChange={setTab} items={[["harga", "Harga harian"], ["aduan", `Aduan (${aduan.filter((a) => a.status === "terbuka").length})`], ["pasar", "Kondisi pasar"]]} />
            {tab === "harga" && (
              <>
                <p className="text-[13px] text-ink-2">Kasir/AO mencatat harga sembako tiap pagi. Langsung tampil di aplikasi pedagang (Info harga) dan diteruskan ke Command Center TPID Pemprov DKI.</p>
                <div className="overflow-hidden rounded-xl border border-line bg-white">
                  {s.harga.map((h) => {
                    const d = h.hariIni - h.kemarin;
                    return (
                      <div key={h.komoditas} className="flex flex-wrap items-center gap-2 border-t border-[#EEF0EA] px-3.5 py-2.5 first:border-0">
                        <span className="min-w-0 flex-1"><b className="block text-sm">{h.komoditas}</b><span className="text-xs text-muted">{h.kelompok} · /{h.satuan} · {h.t}</span></span>
                        <span className={`w-20 text-right text-xs font-semibold ${d > 0 ? "text-[#B5531B]" : d < 0 ? "text-[#157A44]" : "text-muted"}`}>{d > 0 ? "▲" : d < 0 ? "▼" : "="} {rp(Math.abs(d))}</span>
                        <label htmlFor={`h-${h.komoditas}`} className="sr-only">Harga {h.komoditas}</label>
                        <input id={`h-${h.komoditas}`} inputMode="numeric" value={edit[h.komoditas] ?? String(h.hariIni)} onChange={(e) => setEdit({ ...edit, [h.komoditas]: e.target.value.replace(/\D/g, "") })} className="min-h-10 w-24 rounded-lg border border-line-2 px-2 text-right font-mono text-sm" />
                        <button disabled={!edit[h.komoditas] || +edit[h.komoditas] === h.hariIni} onClick={() => { ubahHarga(h.komoditas, +edit[h.komoditas], staf.nama); setEdit({ ...edit, [h.komoditas]: "" }); }} className="min-h-10 rounded-lg bg-pj px-3 text-xs font-semibold text-white disabled:bg-line disabled:text-muted">Simpan</button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {tab === "aduan" && (
              <div className="flex flex-col gap-2.5">
                {aduan.length === 0 && <div className={panel}>Belum ada aduan. Pedagang mengirim aduan dari menu Layanan di aplikasi TokoPaja.</div>}
                {aduan.map((a) => (
                  <div key={a.id} className={`${panel} flex flex-col gap-1.5 text-[13px]`}>
                    <div className="flex justify-between gap-2"><b>{a.topik}</b><Pill tone={a.status === "selesai" ? "bg-mint text-mint-ink" : "bg-[#F7E3E0] text-[#7A2E24]"}>{a.status}</Pill></div>
                    <div className="font-mono text-xs text-muted">{a.id} · {a.dibuat} · {pedagangById(s, a.pedagangId)?.nama}{a.tuId ? ` · ${a.tuId}` : ""}</div>
                    <div>{a.msgs[0].teks}</div>
                    {a.status === "terbuka" && <div className="flex gap-2"><input aria-label="Tindak lanjut" value={txt[a.id] ?? ""} onChange={(e) => setTxt({ ...txt, [a.id]: e.target.value })} placeholder="Tindak lanjut (mis. petugas kebersihan dikirim 10.00)" className="min-h-11 min-w-0 flex-1 rounded-lg border border-line-2 px-3 text-sm" /><button disabled={!(txt[a.id] ?? "").trim()} onClick={() => selesaikanTiket(a.id, txt[a.id], staf.nama)} className="rounded-lg bg-pj px-3 text-sm font-semibold text-white disabled:bg-line">Selesai</button></div>}
                  </div>
                ))}
              </div>
            )}
            {tab === "pasar" && (
              <>
                <section className={panel}>
                  <h2 className="mb-2 text-[15px] font-bold">Okupansi per blok</h2>
                  {[...new Set(s.tu.map((t) => `${t.blok}-${t.lantai}`))].map((b) => { const tu = s.tu.filter((t) => `${t.blok}-${t.lantai}` === b); return <div key={b} className="grid grid-cols-[70px_1fr] items-center gap-2 py-1 text-[13px]"><b>{b.replace("-", " ")}</b><MiniBar v={pct(tu.filter((t) => t.buka).length, tu.length)} /></div>; })}
                </section>
                <section className={panel}>
                  <h2 className="mb-1 text-[15px] font-bold">Laporan rutin hari ini</h2>
                  <p className="mb-2 text-xs text-muted">Dicentang petugas kebersihan & keamanan dari HP (foto bukti di versi server).</p>
                  {RUTIN.map((r) => <label key={r} className="flex items-center gap-2.5 border-t border-[#EEF0EA] py-2.5 text-[13.5px] first:border-0"><input type="checkbox" checked={cek.includes(r)} onChange={() => setCek(cek.includes(r) ? cek.filter((x) => x !== r) : [...cek, r])} className="size-5 accent-pj" />{r}</label>)}
                  <div className="mt-2 text-xs text-muted">{cek.length}/{RUTIN.length} selesai</div>
                </section>
              </>
            )}
          </>
        );
      }}
    </BoPage>
  );
}
