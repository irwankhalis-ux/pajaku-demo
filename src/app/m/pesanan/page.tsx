"use client";

import { useState } from "react";
import { MPage, Tag, ESTONE, mbtn, mchip, panel } from "@/components/mitra-ui";
import { WithQ } from "@/components/kit";
import { BANK, JALUR, KAT, batalESPTU, buatPesanan, hargaUnit, jt, majukanESPTU, plg, unitBy, type ESPTU, type MState, type Staf } from "@/lib/mitra";

export default function Page() {
  return <WithQ>{(q) => <MPage judul="Pemesanan tiga jalur & e-SPTU" sub="Eksisting (hasil undian) · Gold (undangan) · Biru (FCFS)">{({ s, staf }) => <Isi s={s} staf={staf} unitAwal={q("unit")} pAwal={q("p")} />}</MPage>}</WithQ>;
}

function Isi({ s, staf, unitAwal, pAwal }: { s: MState; staf: Staf; unitAwal: string; pAwal: string }) {
  const u0 = unitBy(s, unitAwal);
  const [unit, setUnit] = useState(unitAwal);
  const [pid, setPid] = useState(pAwal || u0?.pelangganId || "");
  const [cari, setCari] = useState("");
  const [skema, setSkema] = useState<ESPTU["skema"]>("cicilan");
  const [bank, setBank] = useState("Bank Jakarta");
  const [msg, setMsg] = useState("");
  const [f, setF] = useState<ESPTU["status"] | "semua">("semua");
  const p = plg(s, pid);
  const u = unitBy(s, unit);
  const j = p ? KAT[p.kat].jalur : undefined;
  const calon = s.pelanggan.filter((x) => x.tahap >= 1 && x.tahap <= 2 && (!cari || x.nama.toLowerCase().includes(cari.toLowerCase()) || x.id.includes(cari))).slice(0, 8);
  const unitCocok = j ? s.units.filter((x) => x.alokasi === j && (x.status === "tersedia" || (x.status === "alokasi" && x.pelangganId === pid) || (x.status === "ditahan" && x.pelangganId === pid))).slice(0, 30) : [];
  const list = s.esptu.filter((e) => (f === "semua" ? e.status !== "sah" : e.status === f)).slice(0, 30);
  const pj = staf.peran === "pj";
  return (
    <>
      {!pj && (
        <section className={`${panel} flex flex-col gap-2.5`}>
          <h2 className="text-[15px] font-bold">Buat pesanan (satu formulir, tiga jalur)</h2>
          <label className="text-[13px] font-semibold">Pemesan (ID Pelanggan PaJaKu)
            <input value={p ? `${p.id} · ${p.nama}` : cari} onChange={(e) => { setPid(""); setCari(e.target.value); }} placeholder="Cari nama atau PJK-…" className="mt-1 min-h-11 w-full rounded-lg border border-[#CFCABD] px-3 font-normal" />
          </label>
          {!p && <div className="flex flex-wrap gap-1.5">{calon.map((x) => <button key={x.id} onClick={() => setPid(x.id)} className="rounded-full border border-[#CFCABD] bg-white px-2.5 py-1 text-xs">{x.nama} · {KAT[x.kat].nama}</button>)}</div>}
          {p && j && (<>
            <div className="text-[12.5px]">Jalur <b>{JALUR[j]}</b> ({KAT[p.kat].nama}) · {j === "eks" ? "unit dari hasil undian, harga eksisting, tanpa booking fee" : j === "gold" ? "pilih dari alokasi Gold, harga kebijakan Mitra, ditahan 14 hari" : "pilih unit tersedia, booking fee Rp5 jt, harga umum"}</div>
            <div className="flex flex-wrap gap-1.5">{unitCocok.map((x) => <button key={x.code} onClick={() => setUnit(x.code)} className={`rounded-md px-2 py-1 font-mono text-[11px] ${unit === x.code ? "bg-[#12302B] text-white" : "bg-[#F4F2EC]"}`}>{x.code.slice(4)}</button>)}{!unitCocok.length && <span className="text-xs text-[#7E231C]">{j === "eks" ? "Belum ada unit hasil undian untuk pemilik ini." : "Tidak ada unit tersedia di alokasi ini."}</span>}</div>
          </>)}
          {u && j && (
            <div className="rounded-lg bg-[#F4F2EC] p-3 text-[13px]"><b className="font-mono">{u.code}</b> · {u.jenis} {u.m2} m² · harga <b>{jt(hargaUnit(s, u, j))}</b></div>
          )}
          <div className="flex flex-wrap gap-1.5">{(["tunai", "cicilan", "kpr"] as const).map((k) => <button key={k} onClick={() => setSkema(k)} className={mchip(skema === k)}>{k === "tunai" ? "Tunai" : k === "cicilan" ? "Cicilan bertahap (masa konstruksi)" : "Kredit bank mitra"}</button>)}</div>
          {skema === "kpr" && <div className="flex flex-wrap gap-1.5">{BANK.map((b) => <button key={b.nama} onClick={() => setBank(b.nama)} className={mchip(bank === b.nama)}>{b.nama} · {String(b.rate).replace(".", ",")}%</button>)}</div>}
          <button disabled={!p || !u} onClick={() => { const r = buatPesanan(pid, unit, skema, bank, staf.nama); setMsg(r && r.startsWith("eSPTU") ? `${r} dibuat sebagai draf. Kirim ke aplikasi pedagang di daftar bawah.` : r ?? ""); if (r?.startsWith("eSPTU")) { setUnit(""); setPid(""); setCari(""); } }} className={mbtn}>Buat e-SPTU (draf)</button>
          {msg && <div role="status" className="text-[13px] text-[#0A5249]">{msg}</div>}
        </section>
      )}
      <div className="flex flex-wrap gap-1.5">{(["semua", "draf", "ttd-pedagang", "tte-pj", "sah"] as const).map((k) => <button key={k} onClick={() => setF(k)} className={mchip(f === k)}>{k === "semua" ? "Dalam proses" : ESTONE[k][0]} · {k === "semua" ? s.esptu.filter((e) => e.status !== "sah").length : s.esptu.filter((e) => e.status === k).length}</button>)}</div>
      <section className={`${panel} flex flex-col`}>
        {list.map((e) => {
          const q = plg(s, e.pelangganId);
          const aksi = e.status === "draf" ? (pj ? "" : "Kirim ke aplikasi pedagang") : e.status === "ttd-pedagang" ? "Simulasi: pedagang tanda tangan" : e.status === "tte-pj" ? (pj ? "TTE Pasar Jaya (sahkan)" : "") : "";
          return (
            <div key={e.no} className="flex flex-wrap items-center gap-2 border-t border-[#EFECE4] py-2.5 text-[13px] first:border-0">
              <span className="min-w-0 flex-1"><b className="font-mono text-[12px]">{e.no}</b> <Tag tone={ESTONE[e.status][1]}>{ESTONE[e.status][0]}</Tag><br />{q?.nama} · {JALUR[e.jalur]} · {e.unit} · {jt(e.harga)} · {e.skema}{e.bank ? ` ${e.bank}` : ""}</span>
              {aksi && <button onClick={() => majukanESPTU(e.no, staf.nama)} className="rounded-lg bg-[#0E6E63] px-3 py-2 text-xs font-semibold text-white">{aksi}</button>}
              {e.status === "draf" && !pj && <button onClick={() => batalESPTU(e.no, staf.nama)} className="rounded-lg border border-[#CFCABD] px-3 py-2 text-xs font-semibold">Batal</button>}
              {e.status === "tte-pj" && !pj && <span className="text-xs text-[#233C73]">di antrean pengawas Pasar Jaya</span>}
            </div>
          );
        })}
        {!list.length && <div className="text-[13px] text-[#5B6168]">Kosong.</div>}
      </section>
      <p className="text-xs text-[#5B6168]">e-SPTU (Surat Pemesanan Tempat Usaha) memuat lokasi unit, harga sesuai jalur, skema bayar dan opsi bank. Ditandatangani pedagang di PaJaKu, lalu TTE Pasar Jaya — baru sah.</p>
    </>
  );
}
