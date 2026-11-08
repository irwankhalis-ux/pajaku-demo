"use client";

import Link from "next/link";
import { useState } from "react";
import { MPage, Tag, ESTONE, mbtn, mchip, panel } from "@/components/mitra-ui";
import { WithQ } from "@/components/kit";
import { JALUR, KAT, TAHAP, alihkanChat, bacaChat, balasChat, jadikanTiket, jt, plg, tambahKonten, tutupTiket, type Chat, type MState, type Staf } from "@/lib/mitra";

export default function Page() {
  return <WithQ>{(q) => <MPage judul="CRM pelanggan 360" sub="Chat PaJaKu satu-satunya kanal interaktif · tiket ber-SLA · update media sosial">{({ s, staf }) => (q("id") ? <Profil s={s} id={q("id")} /> : <Crm s={s} staf={staf} />)}</MPage>}</WithQ>;
}

function Crm({ s, staf }: { s: MState; staf: Staf }) {
  const [tab, setTab] = useState<"chat" | "pelanggan" | "konten">("chat");
  const [peran, setPeran] = useState<"Semua" | Chat["peran"]>("Semua");
  const [sel, setSel] = useState("");
  const [teks, setTeks] = useState("");
  const [q, setQ] = useState("");
  const [kj, setKj] = useState("Progres fisik");
  const [kjud, setKjud] = useState("");
  const chats = s.chat.filter((c) => peran === "Semua" || c.peran === peran);
  const c = s.chat.find((x) => x.id === sel);
  return (
    <>
      <div className="flex flex-wrap gap-1.5">{([["chat", `Inbox chat (${s.chat.reduce((n, x) => n + x.unread, 0)})`], ["pelanggan", "Pelanggan 360"], ["konten", "Update & media sosial"]] as const).map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={mchip(tab === k)}>{l}</button>)}</div>
      {tab === "chat" && (
        <>
          <div className="flex flex-wrap gap-1.5">{(["Semua", "Sales", "Collection", "Customer relation"] as const).map((p) => <button key={p} onClick={() => setPeran(p)} className={mchip(peran === p)}>{p}</button>)}</div>
          <div className="grid gap-3 md:grid-cols-[320px_1fr]">
            <section className={`${panel} flex flex-col p-2`}>
              {chats.map((x) => { const p = plg(s, x.pelangganId); return (
                <button key={x.id} onClick={() => { setSel(x.id); bacaChat(x.id); }} className={`flex flex-col gap-0.5 rounded-lg p-2.5 text-left text-[13px] ${sel === x.id ? "bg-[#F0F8F6]" : ""}`}>
                  <span className="flex justify-between gap-2"><b>{p?.nama}</b>{x.unread > 0 && <span className="rounded-full bg-[#B85C12] px-1.5 text-[10px] font-bold text-white">{x.unread}</span>}</span>
                  <span className="text-xs text-[#5B6168]">{p && KAT[p.kat].nama} · {x.peran} · {x.kategori}{x.tiket && x.tiket.status === "terbuka" ? ` · 🎫 SLA ${x.tiket.sla} jam` : ""}</span>
                  <span className="truncate text-xs">{x.msgs[x.msgs.length - 1].teks}</span>
                </button>
              ); })}
            </section>
            {c ? (
              <section className={`${panel} flex flex-col gap-2`}>
                <div className="flex flex-wrap items-center justify-between gap-2"><Link href={`/m/crm/?id=${c.pelangganId}`} className="font-bold text-[#0E6E63]">{plg(s, c.pelangganId)?.nama} · profil 360 ›</Link><span className="flex flex-wrap gap-1.5">{(["Sales", "Collection", "Customer relation"] as const).filter((p) => p !== c.peran).map((p) => <button key={p} onClick={() => alihkanChat(c.id, p, staf.nama)} className="rounded-full border border-[#CFCABD] px-2 py-1 text-[11px]">→ {p}</button>)}</span></div>
                <div className="flex max-h-[340px] flex-col gap-2 overflow-y-auto rounded-lg bg-[#F4F2EC] p-2.5">
                  {c.msgs.map((m, i) => <div key={i} className={`flex ${m.dari === "a" ? "justify-end" : m.dari === "s" ? "justify-center" : "justify-start"}`}><div className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] ${m.dari === "a" ? "bg-[#0E6E63] text-white" : m.dari === "s" ? "text-xs text-[#5B6168]" : "border border-[#E2DED4] bg-white"}`}>{m.teks}<div className="mt-0.5 text-[10px] opacity-70">{m.t}</div></div></div>)}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (teks.trim()) { balasChat(c.id, teks.trim(), "a", staf.nama); setTeks(""); } }} className="flex gap-2"><input aria-label="Balasan" value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Balas lewat chat PaJaKu" className="min-h-11 min-w-0 flex-1 rounded-lg border border-[#CFCABD] px-3 text-sm" /><button className={mbtn}>Kirim</button></form>
                <div className="flex flex-wrap gap-2">{!c.tiket ? <button onClick={() => jadikanTiket(c.id, staf.nama)} className="rounded-lg bg-[#FBE8D2] px-3 py-2 text-xs font-semibold text-[#7A3E0B]">Jadikan tiket (SLA)</button> : c.tiket.status === "terbuka" ? <button onClick={() => tutupTiket(c.id, staf.nama)} className="rounded-lg bg-[#DCEFEA] px-3 py-2 text-xs font-semibold text-[#0A5249]">Tutup tiket {c.tiket.id}</button> : <Tag tone="bg-[#DCEFEA] text-[#0A5249]">Tiket {c.tiket.id} selesai</Tag>}<button onClick={() => balasChat(c.id, "Halo, ada pertanyaan lagi soal unit atau pembayarannya?", "p", "")} className="rounded-lg border border-dashed border-[#CFCABD] px-3 py-2 text-xs">Simulasi pesan masuk</button></div>
              </section>
            ) : <section className={`${panel} text-[13px] text-[#5B6168]`}>Pilih percakapan. Routing otomatis ke Sales / Collection / Customer relation sesuai topik; bisa dialihkan manual oleh Manager.</section>}
          </div>
        </>
      )}
      {tab === "pelanggan" && (
        <>
          <input aria-label="Cari pelanggan" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, PJK-…, unit PRM-…" className="min-h-11 rounded-lg border border-[#CFCABD] bg-white px-3" />
          <section className={`${panel} flex flex-col p-2`}>
            {s.pelanggan.filter((p) => !q || p.nama.toLowerCase().includes(q.toLowerCase()) || p.id.includes(q) || s.units.some((u) => u.pelangganId === p.id && u.code.includes(q.toUpperCase()))).slice(0, 40).map((p) => (
              <Link key={p.id} href={`/m/crm/?id=${p.id}`} className="flex items-center justify-between gap-2 rounded-lg p-2.5 text-[13px]"><span><b>{p.nama}</b><br /><span className="text-xs text-[#5B6168]">{p.id} · {TAHAP[KAT[p.kat].jalur][p.tahap]}</span></span><Tag tone={KAT[p.kat].tone}>{KAT[p.kat].nama}</Tag></Link>
            ))}
          </section>
        </>
      )}
      {tab === "konten" && (
        <>
          <form onSubmit={(e) => { e.preventDefault(); if (kjud.trim()) { tambahKonten(kj, kjud.trim(), "Instagram · TikTok · PaJaKu", staf.nama); setKjud(""); } }} className={`${panel} flex flex-col gap-2`}>
            <h2 className="text-[15px] font-bold">Update proyek ke pedagang</h2>
            <div className="flex flex-wrap gap-1.5">{["Progres fisik", "Marketing", "Pembiayaan", "Promo", "Event"].map((x) => <button type="button" key={x} onClick={() => setKj(x)} className={mchip(kj === x)}>{x}</button>)}</div>
            <input aria-label="Judul update" value={kjud} onChange={(e) => setKjud(e.target.value)} placeholder="Judul / caption singkat" className="min-h-11 rounded-lg border border-[#CFCABD] px-3" />
            <button className={mbtn}>Terbitkan (diposting manual ke akun resmi proyek)</button>
          </form>
          <section className={`${panel} flex flex-col`}>{s.konten.map((k) => <div key={k.id} className="flex justify-between gap-2 border-t border-[#EFECE4] py-2 text-[13px] first:border-0"><span><b>{k.judul}</b><br /><span className="text-xs text-[#5B6168]">{k.jenis} · {k.kanal} · {k.t}</span></span><Tag tone={k.status === "terbit" ? "bg-[#DCEFEA] text-[#0A5249]" : "bg-[#EFECE4] text-[#3A3F45]"}>{k.status}</Tag></div>)}</section>
        </>
      )}
    </>
  );
}

function Profil({ s, id }: { s: MState; id: string }) {
  const p = plg(s, id);
  if (!p) return <div className={panel}>Pelanggan tidak ditemukan.</div>;
  const j = KAT[p.kat].jalur;
  const es = s.esptu.filter((e) => e.pelangganId === id);
  const kr = s.kredit.filter((k) => k.pelangganId === id);
  const ch = s.chat.filter((c) => c.pelangganId === id);
  return (
    <>
      <Link href="/m/crm/" className="text-[13px] font-semibold text-[#0E6E63]">‹ CRM</Link>
      <section className={`${panel} flex flex-wrap items-center gap-3`}>
        <div className="flex size-14 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: KAT[p.kat].warna }}>{p.nama.replace(/^(H|Hj|PT)\.? /, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{p.nama}</h2><Tag tone={KAT[p.kat].tone}>{KAT[p.kat].nama} · jalur {JALUR[j]}</Tag></div><div className="font-mono text-xs text-[#5B6168]">{p.id} · {p.hp.slice(0, 4)}••••{p.hp.slice(-4)}{p.tuLama ? ` · TU lama ${p.tuLama}` : ""}{p.asal ? ` · sumber ${p.asal}` : ""}{p.pic ? ` · PIC ${p.pic}` : ""}</div></div>
      </section>
      <section className={`${panel} flex flex-col gap-1.5`}>
        <h3 className="font-bold">Tahapan jalur {JALUR[j]}</h3>
        {TAHAP[j].map((t, i) => <div key={t} className="flex items-center gap-2 text-[13px]"><span className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${i < p.tahap || (i === 3 && es.some((e) => e.status === "sah")) ? "bg-[#0E6E63] text-white" : i === p.tahap ? "bg-[#B85C12] text-white" : "bg-[#EFECE4] text-[#5B6168]"}`}>{i + 1}</span>{t}</div>)}
      </section>
      <section className={`${panel} flex flex-col gap-1.5`}>
        <h3 className="font-bold">e-SPTU, pembayaran & kredit</h3>
        {es.map((e) => <div key={e.no} className="text-[13px]"><b className="font-mono text-xs">{e.no}</b> <Tag tone={ESTONE[e.status][1]}>{ESTONE[e.status][0]}</Tag><br />{e.unit} · {jt(e.harga)} · dibayar {jt(e.dibayar)} ({Math.round((e.dibayar / e.harga) * 100)}%){e.lunas ? " · LUNAS" : e.telat ? ` · telat ${e.telat} hari` : ""}</div>)}
        {kr.map((k) => <div key={k.id} className="text-[13px]">Kredit {k.bank} {jt(k.plafon)} · {k.catatan}</div>)}
        {!es.length && !kr.length && <div className="text-[13px] text-[#5B6168]">Belum ada pesanan.</div>}
      </section>
      <section className={`${panel} flex flex-col gap-1.5`}>
        <h3 className="font-bold">Riwayat chat PaJaKu</h3>
        {ch.flatMap((c) => c.msgs.map((m, i) => <div key={c.id + i} className="text-[13px]"><span className="text-xs text-[#5B6168]">{m.t} · {m.dari === "p" ? "Pedagang" : m.dari === "a" ? c.peran : "Sistem"}</span><br />{m.teks}</div>))}
        {!ch.length && <div className="text-[13px] text-[#5B6168]">Belum ada percakapan.</div>}
      </section>
    </>
  );
}
