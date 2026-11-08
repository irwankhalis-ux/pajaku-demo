"use client";

import Link from "next/link";
import { useState } from "react";
import { MPage, Tag, mbtn2, mchip, panel } from "@/components/mitra-ui";
import { KAT, LANTAI, TAHAP, imporUndian, jadwalUndian, majukanPelanggan, unitBy } from "@/lib/mitra";

export default function Eksisting() {
  const [tab, setTab] = useState(0);
  const [msg, setMsg] = useState("");
  return (
    <MPage judul="Hak pemilik eksisting" sub="Emerald & Platinum · registrasi PaJaKu → undian zoning → e-SPTU harga eksisting">
      {({ s, staf }) => {
        const eks = s.pelanggan.filter((p) => p.kat === "E" || p.kat === "P");
        const n = (t: number) => eks.filter((p) => p.tahap >= t).length;
        const kr = s.kredit.length;
        const list = eks.filter((p) => p.tahap === tab).slice(0, 40);
        return (
          <>
            <section className={`${panel} flex flex-col gap-2`}>
              <h2 className="text-[15px] font-bold">Alur 7 langkah · {eks.length} pemilik (Emerald {eks.filter((p) => p.kat === "E").length} · Platinum {eks.filter((p) => p.kat === "P").length})</h2>
              {TAHAP.eks.map((t, i) => {
                const v = i === 5 ? kr : i === 6 ? 0 : n(i + 1);
                return <div key={t} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 text-[13px]"><span className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold ${v ? "bg-[#DCEFEA] text-[#0A5249]" : "bg-[#EFECE4] text-[#5B6168]"}`}>{i + 1}</span><span>{t}</span><b className="font-mono">{v}</b></div>;
              })}
            </section>
            <section className={`${panel} flex flex-col gap-2.5`}>
              <h2 className="text-[15px] font-bold">Undian sesuai zoning</h2>
              <p className="text-[12.5px] text-[#5B6168]">Undian digelar terbuka per zona (disaksikan Pasar Jaya & notaris), hasilnya diimpor ke sini lalu disahkan Pasar Jaya. Setelah sah, e-SPTU otomatis dikirim ke aplikasi PaJaKu pemenang.</p>
              {s.undian.map((u) => (
                <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#F4F2EC] p-3 text-[13px]">
                  <span><b>{u.id} · {u.zona}</b><br /><span className="text-[#5B6168]">{u.t} · {u.peserta} peserta</span></span>
                  <span className="flex items-center gap-2">
                    <Tag tone={u.status === "disahkan" ? "bg-[#DCEFEA] text-[#0A5249]" : u.status === "diimpor" ? "bg-[#E1E8F6] text-[#233C73]" : "bg-[#FBE8D2] text-[#7A3E0B]"}>{u.status === "diimpor" ? "menunggu pengesahan Pasar Jaya" : u.status}</Tag>
                    {u.status === "dijadwalkan" && <label className="inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-[#0E6E63] px-3 text-xs font-semibold text-white">Impor hasil (CSV)<input type="file" accept=".csv,.xlsx" className="sr-only" onChange={() => setMsg(`${imporUndian(u.id, staf.nama)} pemenang dicocokkan ke unit zona ${u.zona}. Menunggu pengesahan Pasar Jaya.`)} /></label>}
                  </span>
                </div>
              ))}
              {msg && <div role="status" className="text-[13px] text-[#0A5249]">{msg}</div>}
              <div className="flex flex-wrap gap-2">{Object.values(LANTAI).filter((l, i, a) => a.findIndex((x) => x.zona === l.zona) === i).map((l) => <button key={l.zona} onClick={() => jadwalUndian(`${l.zona} (sesi berikut)`, staf.nama)} className={mbtn2}>+ Jadwalkan undian {l.zona}</button>)}</div>
            </section>
            <section className={`${panel} flex flex-col gap-2`}>
              <div className="flex flex-wrap gap-1.5">{["Belum registrasi", "Registrasi", "Terverifikasi (siap undian)", "Sudah e-SPTU"].map((l, i) => <button key={l} onClick={() => setTab(i === 3 ? 4 : i)} className={mchip(tab === (i === 3 ? 4 : i))}>{l} · {eks.filter((p) => p.tahap === (i === 3 ? 4 : i)).length}</button>)}</div>
              {list.map((p) => {
                const u = s.units.find((x) => x.pelangganId === p.id);
                return (
                  <div key={p.id} className="flex flex-wrap items-center gap-2 border-t border-[#EFECE4] py-2 text-[13px]">
                    <Link href={`/m/crm/?id=${p.id}`} className="min-w-0 flex-1"><b>{p.nama}</b> <Tag tone={KAT[p.kat].tone}>{KAT[p.kat].nama}</Tag><br /><span className="font-mono text-xs text-[#5B6168]">{p.id} · TU lama {p.tuLama} · zona {p.zona}{u ? ` · unit ${u.code}` : ""}{u && unitBy(s, u.code)?.status === "alokasi" ? " (hasil undian)" : ""}</span></Link>
                    {p.tahap < 2 && <button onClick={() => majukanPelanggan(p.id, staf.nama)} className="rounded-lg bg-[#DCEFEA] px-3 py-2 text-xs font-semibold text-[#0A5249]">{p.tahap === 0 ? "Kirim undangan registrasi" : "Verifikasi e-SHPTU"}</button>}
                  </div>
                );
              })}
            </section>
            <p className="text-xs text-[#5B6168]">Aturan: luas unit setara TU lama (kelebihan dibayar harga umum) · tanpa booking fee · hak yang tidak diambil sampai batas registrasi dilepas ke stok Biru · pengalihan hak sebelum serah terima wajib persetujuan Pasar Jaya.</p>
          </>
        );
      }}
    </MPage>
  );
}
