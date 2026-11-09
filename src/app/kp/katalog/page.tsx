"use client";

import { useState } from "react";
import { KPage, kbtnO, kchip, kpanel } from "@/components/kulakan-ui";
import { perUnit, rp, simpanSKU, type SKU } from "@/lib/kulakan";

const ZONA = ["Jakpus", "Jaktim", "Jakut", "Jaksel", "Jakbar"];

export default function Katalog() {
  const [sel, setSel] = useState("");
  const [draft, setDraft] = useState<Partial<SKU> & { tierStr?: string[] }>({});
  const [msg, setMsg] = useState("");
  return (
    <KPage judul="Katalog & harga" sub="Tampil di menu Kulakan aplikasi TokoPaja · harga di atas HET perlu persetujuan Direktorat">
      {({ s, staf }) => {
        const list = s.sku.filter((k) => staf.peran !== "agent" || k.grup === staf.grup);
        const k = list.find((x) => x.id === sel) ?? list[0];
        const tiers = draft.tierStr ?? k.tiers.map((t) => String(t[1]));
        const harga = tiers.map((v) => +v.replace(/\D/g, ""));
        const unit = perUnit(k, harga[0]);
        const atasHET = k.het > 0 && unit > k.het;
        const bolehHarga = staf.peran === "merch" || staf.peran === "direktur";
        return (
          <>
            <div className="flex flex-wrap gap-1.5">{list.map((x) => <button key={x.id} onClick={() => { setSel(x.id); setDraft({}); setMsg(""); }} className={kchip(x.id === k.id)}>{x.nama.split(" (")[0]}{x.tpid ? " · TPID" : ""}</button>)}</div>
            <section className={`${kpanel} flex flex-col gap-2.5`}>
              <div><b className="text-[15px]">{k.nama}</b><div className="text-xs text-[#4B5563]">{k.grup} · {k.satuan} isi {k.isi}</div></div>
              <b className="text-sm">Harga grosir bertingkat</b>
              {k.tiers.map(([mn], i) => <label key={mn} className="flex items-center justify-between gap-2 text-sm"><span>{mn}{k.tiers[i + 1] ? `–${k.tiers[i + 1][0] - 1}` : "+"} {k.satuan}</span><input disabled={!bolehHarga && staf.peran !== "salesmgr"} inputMode="numeric" value={tiers[i]} onChange={(e) => { const t2 = [...tiers]; t2[i] = e.target.value.replace(/\D/g, ""); setDraft({ ...draft, tierStr: t2 }); }} className="h-11 w-36 rounded-[10px] border border-[#D1D5DB] px-3 text-right font-bold disabled:bg-[#F3F4F6]" /></label>)}
              {k.het > 0 && <div className={`flex justify-between rounded-[10px] px-3 py-2 text-[13px] ${atasHET ? "bg-[#FEF2F2] text-[#991B1B]" : "bg-[#F0FDF4] text-[#14532D]"}`}><b>{rp(unit)}/{k.perUnit} · {atasHET ? "di atas" : "di bawah"} acuan HET/HAP</b><span>acuan {rp(k.het)}</span></div>}
              {staf.peran === "salesmgr" && <p className="text-xs text-[#4B5563]">Sales Manager hanya boleh diskon ≤1% dari harga Merchandising.</p>}
              {staf.peran === "agent" && <p className="text-xs text-[#4B5563]">Sales Agent mengusulkan harga; penetapan oleh Merchandising.</p>}
            </section>
            <section className={`${kpanel} flex flex-col gap-2.5`}>
              <b className="text-sm">Posisi harga di KulakanPaja</b>
              {[["Harga terendah pemasok lain", rp(Math.round(k.tiers[0][1] * 1.007))], ["Rata-rata pasar 7 hari", rp(Math.round(k.tiers[0][1] * 1.014))], ["Peringkat tampil ke TokoPaja", "#1 dari 3"]].map(([a, b]) => <div key={a} className="flex justify-between text-sm"><span className="text-[#4B5563]">{a}</span><b>{b}</b></div>)}
            </section>
            <section className={`${kpanel} flex flex-col gap-2.5`}>
              <b className="text-sm">Ketersediaan</b>
              <label className="flex items-center justify-between text-sm">Stok siap jual ({k.satuan})<input inputMode="numeric" value={draft.stok ?? k.stok} onChange={(e) => setDraft({ ...draft, stok: +e.target.value.replace(/\D/g, "") })} className="h-11 w-36 rounded-[10px] border border-[#D1D5DB] px-3 text-right font-bold" /></label>
              <div className="text-[13px] text-[#4B5563]">Wilayah layanan</div>
              <div className="flex flex-wrap gap-1.5">{ZONA.map((z) => { const zs = draft.zona ?? k.zona; return <button key={z} onClick={() => setDraft({ ...draft, zona: zs.includes(z) ? zs.filter((x) => x !== z) : [...zs, z] })} className={kchip(zs.includes(z))}>{z}</button>; })}</div>
              <label className="flex min-h-11 items-center justify-between gap-2 text-sm">Terima pembiayaan DO Bank Jakarta (Emerald)<input type="checkbox" checked={draft.doOk ?? k.doOk} onChange={(e) => setDraft({ ...draft, doOk: e.target.checked })} className="size-[22px] accent-[#14532D]" /></label>
            </section>
            {msg && <div role="status" className="text-[13px] font-semibold text-[#14532D]">{msg}</div>}
            <button disabled={atasHET && !bolehHarga} onClick={() => { const { tierStr, ...rest } = draft; simpanSKU(k.id, { ...rest, ...(tierStr ? { tiers: k.tiers.map(([mn], i) => [mn, harga[i]] as [number, number]) } : {}), tayang: true }, staf.nama); setDraft({}); setMsg("Tayang ke TokoPaja · pedagang melihat harga baru di menu Kulakan."); }} className={kbtnO}>{atasHET && !bolehHarga ? "Di atas HET — minta persetujuan Direktorat" : "Tayangkan ke TokoPaja"}</button>
          </>
        );
      }}
    </KPage>
  );
}
