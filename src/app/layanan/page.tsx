"use client";

import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { Empty, card } from "@/components/ui";
import { aduan, balasTiket, tanya } from "@/lib/store";
import { chip } from "@/components/kit";

const STATUS: Record<string, [string, string]> = {
  terbuka: ["Diproses", "bg-[#FBEFD9] text-[#6E4A12]"], disetujui: ["Disetujui", "bg-mint text-mint-ink"], ditolak: ["Ditolak", "bg-[#F7E3E0] text-[#7A2E24]"],
  dijawab: ["Dijawab", "bg-mint text-mint-ink"], selesai: ["Selesai", "bg-mint text-mint-ink"],
};

export default function Layanan() {
  const [buka, setBuka] = useState<string | null>(null);
  const [baru, setBaru] = useState("");
  const [balas, setBalas] = useState("");
  const [mode, setMode] = useState<"tanya" | "aduan">("tanya");
  const [kat, setKat] = useState("Kebersihan");
  return (
    <PedagangPage>
      {({ s, p, tus }) => {
        const list = s.tiket.filter((t) => t.pedagangId === p.id);
        return (
          <>
            <header className="px-4 pt-[calc(22px+env(safe-area-inset-top))] pb-2"><h1 className="text-xl font-bold">Layanan</h1><p className="text-[13px] text-muted">Pertanyaan, pengaduan &amp; koreksi data ke kantor Pasar Johar Baru</p></header>
            <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <a href="tel:112" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#A3361C] text-sm font-bold text-white">🚨 Darurat 112</a>
                <a href="tel:02142878060" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line-2 bg-white text-sm font-semibold">📞 Kantor pasar</a>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (baru.trim()) { if (mode === "tanya") tanya(p.id, baru.trim()); else aduan(p.id, kat, baru.trim(), tus[0]?.id); setBaru(""); } }} className={`${card} flex flex-col gap-2 p-3.5`}>
                <div className="flex gap-2"><button type="button" onClick={() => setMode("tanya")} className={chip(mode === "tanya")}>Pertanyaan</button><button type="button" onClick={() => setMode("aduan")} className={chip(mode === "aduan")}>Pengaduan</button></div>
                {mode === "aduan" && <div className="flex flex-wrap gap-1.5">{["Kebersihan", "Keamanan", "Listrik & air", "Fasilitas rusak", "Pungutan liar"].map((k) => <button type="button" key={k} onClick={() => setKat(k)} className={chip(kat === k)}>{k}</button>)}</div>}
                <label htmlFor="tanya" className="text-sm font-bold">{mode === "tanya" ? "Ajukan pertanyaan" : `Laporkan: ${kat}`}</label>
                <textarea id="tanya" rows={2} value={baru} onChange={(e) => setBaru(e.target.value)} placeholder="Tulis pertanyaan Anda" className="resize-none rounded-lg border border-line-2 px-3 py-2 text-sm" />
                <button disabled={!baru.trim()} className="min-h-11 rounded-lg text-sm font-semibold enabled:bg-pj enabled:text-white disabled:bg-line disabled:text-[#6B7670]">Kirim</button>
              </form>
              {list.length === 0 && <Empty>Belum ada koreksi atau pertanyaan. Koreksi data diajukan dari Detail TU.</Empty>}
              {list.map((t) => {
                const [sl, sc] = STATUS[t.status];
                const open = buka === t.id;
                return (
                  <div key={t.id} className={`${card} flex flex-col gap-2 p-3.5`}>
                    <button onClick={() => setBuka(open ? null : t.id)} className="flex w-full items-start justify-between gap-2 text-left">
                      <span className="min-w-0"><span className="block font-mono text-xs text-muted">{t.id}{t.tuId ? ` · ${t.tuId}` : ""}</span><span className="block text-sm font-semibold">{t.jenis === "koreksi" ? "Koreksi: " : t.jenis === "aduan" ? "Aduan · " : ""}{t.topik}</span></span>
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${sc}`}>{sl}</span>
                    </button>
                    {open && (
                      <>
                        <div className="flex flex-col gap-2 rounded-[10px] bg-paper p-2.5">
                          {t.msgs.map((m, i) => <div key={i} className={`flex ${m.dari === "p" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] ${m.dari === "p" ? "bg-pj text-white" : "border border-line bg-white"}`}>{m.teks}<div className="mt-0.5 text-[10.5px] opacity-70">{m.dari === "s" ? "Kantor pasar · " : ""}{m.t}</div></div></div>)}
                        </div>
                        {t.status === "terbuka" || t.status === "dijawab" ? (
                          <form onSubmit={(e) => { e.preventDefault(); if (balas.trim()) { balasTiket(t.id, balas.trim(), "p"); setBalas(""); } }} className="flex gap-2">
                            <label htmlFor={`b-${t.id}`} className="sr-only">Balas</label>
                            <input id={`b-${t.id}`} value={balas} onChange={(e) => setBalas(e.target.value)} placeholder="Balas" className="min-h-11 min-w-0 flex-1 rounded-lg border border-line-2 px-3 text-sm" />
                            <button className="min-h-11 rounded-lg bg-pj px-4 text-sm font-semibold text-white">Kirim</button>
                          </form>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              })}
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
