"use client";

import Link from "next/link";
import { useState } from "react";
import { Bar2, MKpi, MPage, Tag, mchip, mgrid, panel } from "@/components/mitra-ui";
import { JALUR, KAT, LANTAI, PROYEK, hargaUnit, jt, plg, ringkas, type Unit } from "@/lib/mitra";

const WARNA: Record<string, string> = { terjual: "bg-[#0E6E63] text-white border-[#0E6E63]", dipesan: "bg-[#B85C12] text-white border-[#B85C12]", ditahan: "bg-[#F2B872] text-[#3D2205] border-[#F2B872]", alokasi: "bg-[#DCEFEA] text-[#0A5249] border-[#BFDCD5]", tersedia: "bg-white text-[#1B1F24] border-[#B9B3A6]" };
const LABEL: Record<string, string> = { terjual: "Terjual (e-SPTU sah)", dipesan: "Dipesan (proses e-SPTU)", ditahan: "Ditahan (Gold 14 hari)", alokasi: "Alokasi eksisting (menunggu undian)", tersedia: "Tersedia" };

export default function Dashboard() {
  const [fk, setFk] = useState("L2");
  const [sel, setSel] = useState("");
  return (
    <MPage judul="Dashboard & unit" sub={`${PROYEK.tu} TU · ${PROYEK.lokasi} · angka ilustrasi`}>
      {({ s }) => {
        const r = ringkas(s);
        const units = s.units.filter((u) => u.fk === fk);
        const u: Unit | undefined = units.find((x) => x.code === sel) ?? units.find((x) => x.status === "tersedia");
        const alok = (j: "eks" | "gold" | "biru") => s.units.filter((x) => x.alokasi === j).length;
        return (
          <>
            <section className={mgrid}>
              <MKpi l="Unit terjual (e-SPTU)" v={`${r.terjual} / ${PROYEK.tu}`} s={`${Math.round((r.terjual / PROYEK.tu) * 100)}% · target ${PROYEK.targetUnit}%`} tone="text-[#7A3E0B]" />
              <MKpi l="Nilai kontrak" v={jt(r.nilai)} s={`target YTD ${jt(PROYEK.targetSales)}`} />
              <MKpi l="Kas masuk escrow" v={jt(r.kas)} s={`collection ${Math.round((r.kas / PROYEK.targetKas) * 100)}% dari jatuh tempo`} />
              <MKpi l="Progres konstruksi" v={`${r.progres}%`} s={`rencana ${s.rencana}% · BAST ${PROYEK.selesai}`} tone={r.progres < s.rencana ? "text-[#7A3E0B]" : "text-[#0A5249]"} />
            </section>
            <section className={`${panel} flex flex-col gap-3`}>
              <h2 className="text-[15px] font-bold">Penjualan per jalur</h2>
              {([["eks", r.eks, "#2E8B57", "Emerald & Platinum · harga eksisting dikunci Pasar Jaya"], ["gold", r.gold, "#A88A1E", "undangan via PaJaKu · harga kebijakan Mitra"], ["biru", r.biru, "#2D4B8E", "siapa cepat dia dapat · harga umum"]] as const).map(([j, n, c, d]) => (
                <div key={j}><div className="flex justify-between text-[13px]"><b>{JALUR[j]}</b><span className="font-mono">{n} / {alok(j)}</span></div><Bar2 v={(n / alok(j)) * 100} c={c} /><div className="mt-0.5 text-[11.5px] text-[#5B6168]">{d}</div></div>
              ))}
            </section>
            <section className={`${panel} flex flex-col gap-3`}>
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-[15px] font-bold">Denah unit</h2><div className="flex flex-wrap gap-1.5">{Object.keys(LANTAI).map((k) => <button key={k} onClick={() => { setFk(k); setSel(""); }} className={mchip(fk === k)}>{k === "D" ? "Dasar" : k}</button>)}</div></div>
              <div className="text-[12.5px] text-[#5B6168]">{LANTAI[fk].nama} · zona {LANTAI[fk].zona} · {units.length} unit</div>
              <div className="grid grid-cols-10 gap-1 sm:grid-cols-15" role="grid" aria-label="Denah">
                {units.map((x) => <button key={x.code} onClick={() => setSel(x.code)} aria-label={`${x.code} ${LABEL[x.status]}`} className={`flex h-7 items-center justify-center rounded border text-[9px] font-bold ${WARNA[x.status]} ${u?.code === x.code ? "ring-2 ring-[#12302B] ring-offset-1" : ""}`}>{x.alokasi === "gold" && x.status === "tersedia" ? "G" : x.no}</button>)}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11.5px]">{Object.entries(LABEL).map(([k, l]) => <span key={k} className="flex items-center gap-1"><span className={`size-3 rounded border ${WARNA[k]}`} />{l}</span>)}<span>G = alokasi Gold</span></div>
              {u && (
                <div className="rounded-[12px] bg-[#F4F2EC] p-3 text-[13px]">
                  <div className="flex flex-wrap items-center justify-between gap-2"><b className="font-mono">{u.code}</b><Tag tone={u.status === "tersedia" ? "bg-white text-[#1B1F24]" : "bg-[#DCEFEA] text-[#0A5249]"}>{LABEL[u.status]}</Tag></div>
                  <div className="mt-1">{u.jenis} {u.m2} m² · alokasi <b>{JALUR[u.alokasi]}</b> · harga {u.alokasi === "eks" ? "eksisting" : JALUR[u.alokasi]} <b>{jt(hargaUnit(s, u, u.alokasi))}</b>{u.alokasi !== "biru" && <> · Biru {jt(hargaUnit(s, u, "biru"))}</>}</div>
                  {u.pelangganId && <div className="mt-1">Pemesan: <Link href={`/m/crm/?id=${u.pelangganId}`} className="font-semibold text-[#0E6E63]">{plg(s, u.pelangganId)?.nama}</Link> · {KAT[plg(s, u.pelangganId)!.kat].nama}</div>}
                  {(u.status === "tersedia" || (u.status === "alokasi" && u.pelangganId)) && <Link href={`/m/pesanan/?unit=${u.code}`} className="mt-2 inline-flex min-h-10 items-center rounded-lg bg-[#0E6E63] px-3 text-[13px] font-semibold text-white">Buat pesanan unit ini ›</Link>}
                </div>
              )}
            </section>
          </>
        );
      }}
    </MPage>
  );
}
