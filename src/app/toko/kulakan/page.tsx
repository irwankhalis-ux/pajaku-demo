"use client";

import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { btn, chip } from "@/components/kit";
import { useTokoAktif } from "@/components/toko";
import { PEMASOK, type Kulakan, type Pedagang, type State } from "@/lib/model";
import { kategoriOf, majukanKulakan, pesanKulakan, pesanKulakanPJ, rp } from "@/lib/store";
import { KATALOG, hargaTier, perUnit } from "@/lib/kulakan";

// Sinkron dengan aplikasi pemasok KulakanPatrol: katalog, harga bertingkat & pembiayaan DO Bank Jakarta yang sama.
const BAYAR_PJ: [Kulakan["bayar"], string][] = [["qris", "QRIS"], ["tunai", "Bayar saat terima"], ["do30", "DO 30 hari"], ["do60", "DO 60 hari"], ["do90", "DO 90 hari"]];
const LABEL: Record<string, string> = { tunai: "bayar saat terima", tempo: "tempo", qris: "QRIS", do30: "DO Bank Jakarta 30 hari", do60: "DO Bank Jakarta 60 hari", do90: "DO Bank Jakarta 90 hari" };

export default function Page() {
  return <PedagangPage>{({ s, p }) => <Isi s={s} p={p} />}</PedagangPage>;
}

function Isi({ s, p }: { s: State; p: Pedagang }) {
  const [toko] = useTokoAktif(s, p.id);
  const [pm, setPm] = useState("PJ");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [bayar, setBayar] = useState<Kulakan["bayar"]>("qris");
  const [msg, setMsg] = useState("");
  if (!toko) return <><BackHeader href="/toko/" title="Kulakan" /><main className="px-4"><Empty>Kulakan tersedia setelah toko aktif.</Empty></main></>;
  const emerald = kategoriOf(s, p.id) === "E";
  const step = (k: string, d: number) => setQty({ ...qty, [k]: Math.max(0, (qty[k] ?? 0) + d) });
  const P = PEMASOK.find((x) => x.id === pm);
  const pjItems = KATALOG.filter((k) => k.tayang).map((k) => ({ k, q: qty[k.id] ?? 0, h: hargaTier(k, qty[k.id] ?? 1) }));
  const total = pm === "PJ" ? pjItems.reduce((n, x) => n + x.q * x.h, 0) : (P?.items ?? []).reduce((n, [nm, , h]) => n + (qty[nm] ?? 0) * h, 0);
  const riwayat = s.kulakan.filter((k) => k.tokoId === toko.id);
  return (
    <>
      <BackHeader href="/toko/" title="Kulakan (B2B)" sub={`Belanja stok untuk ${toko.nama}`} />
      <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
        <div className="flex flex-wrap gap-1.5"><button onClick={() => { setPm("PJ"); setQty({}); setMsg(""); }} className={chip(pm === "PJ")}>Pasar Jaya Perkulakan</button>{PEMASOK.filter((x) => x.id !== "KOP").map((x) => <button key={x.id} onClick={() => { setPm(x.id); setQty({}); setMsg(""); setBayar("tunai"); }} className={chip(pm === x.id)}>{x.nama.split(" ").slice(0, 2).join(" ")}</button>)}</div>
        {pm === "PJ" ? (
          <section className={`${card} flex flex-col gap-2 p-3.5`}>
            <div><b className="text-sm">Perumda Pasar Jaya · Direktorat Perkulakan dan Ritel</b><div className="text-xs text-muted">Jakgrosir Kramat Jati · kirim ke hub pasar Anda subuh · lewat KulakanPatrol</div></div>
            {pjItems.map(({ k, q, h }) => (
              <div key={k.id} className="flex items-center justify-between gap-2 border-t border-[#EFF0EA] pt-2">
                <span className="min-w-0"><b className="block text-[13.5px]">{k.nama}{k.tpid ? " 🏷️" : ""}</b><span className="text-xs text-muted">{rp(h)} / {k.satuan} ({k.isi}) · ≈{rp(perUnit(k, h))}/{k.perUnit}{k.tiers.length > 1 ? ` · ≥${k.tiers[1][0]} ${k.satuan} ${rp(k.tiers[1][1])}` : ""}</span></span>
                <span className="flex shrink-0 items-center gap-2"><button aria-label={`Kurangi ${k.nama}`} onClick={() => step(k.id, -1)} className="size-9 rounded-lg border border-line-2 bg-white font-bold">−</button><span className="w-6 text-center font-mono">{q}</span><button aria-label={`Tambah ${k.nama}`} onClick={() => step(k.id, 1)} className="size-9 rounded-lg bg-pj font-bold text-white">+</button></span>
              </div>
            ))}
            <div className="text-[11.5px] text-muted">🏷️ = komoditas penugasan Gubernur/TPID, harga di bawah acuan HET.</div>
          </section>
        ) : P && (
          <section className={`${card} flex flex-col gap-2 p-3.5`}>
            <div><b className="text-sm">{P.nama}</b><div className="text-xs text-muted">{P.ket}</div></div>
            {P.items.map(([nm, sat, h]) => (
              <div key={nm} className="flex items-center justify-between gap-2 border-t border-[#EFF0EA] pt-2">
                <span><b className="block text-[13.5px]">{nm}</b><span className="text-xs text-muted">{rp(h)} / {sat}</span></span>
                <span className="flex items-center gap-2"><button aria-label={`Kurangi ${nm}`} onClick={() => step(nm, -1)} className="size-9 rounded-lg border border-line-2 bg-white font-bold">−</button><span className="w-6 text-center font-mono">{qty[nm] ?? 0}</span><button aria-label={`Tambah ${nm}`} onClick={() => step(nm, 1)} className="size-9 rounded-lg bg-pj font-bold text-white">+</button></span>
              </div>
            ))}
          </section>
        )}
        {pm === "PJ" && (<>
          <div className="flex flex-wrap gap-1.5">{BAYAR_PJ.filter(([b]) => emerald || !b.startsWith("do")).map(([b, l]) => <button key={b} onClick={() => setBayar(b)} className={chip(bayar === b)}>{l}</button>)}</div>
          {bayar.startsWith("do") ? <p className="text-xs leading-relaxed text-muted">Pembiayaan DO Bank Jakarta (khusus Emerald): bank membayar Pasar Jaya tunai H+1 setelah barang diterima; Anda mengangsur ke Bank Jakarta sesuai akad {bayar.slice(2)} hari.</p> : !emerald && <p className="text-xs text-muted">Pembiayaan DO Bank Jakarta tersedia untuk pedagang Emerald (pemilik & pemakai kios).</p>}
        </>)}
        <button disabled={!total} onClick={() => {
          let m: string | null;
          if (pm === "PJ") m = pesanKulakanPJ(toko.id, pjItems.filter((x) => x.q > 0).map(({ k, q, h }) => ({ nama: k.nama, qty: q, sat: k.satuan, harga: h })), bayar);
          else m = pesanKulakan(toko.id, pm, qty, "tunai");
          setMsg(m ?? (pm === "PJ" ? "Pesanan masuk ke Sales Agent KulakanPatrol untuk dikonfirmasi." : "Pesanan terkirim ke pemasok.")); if (!m) setQty({});
        }} className={btn}>Pesan {total ? rp(total) : ""}</button>
        {msg && <div role="status" className="text-[13px] text-mint-ink">{msg}</div>}
        <h2 className="mt-1 text-[15px] font-bold">Riwayat kulakan</h2>
        {riwayat.length === 0 && <Empty>Belum ada kulakan.</Empty>}
        {riwayat.map((k) => (
          <div key={k.id} className={`${card} flex flex-col gap-1 p-3.5`}>
            <div className="flex justify-between gap-2"><span className="font-mono text-xs text-muted">{k.id} · {k.tgl}</span><span className="rounded-full bg-mint px-2 py-0.5 text-[11px] font-bold text-mint-ink">{k.status}</span></div>
            <b className="text-[13.5px]">{k.pemasok}</b>
            <span className="text-[12.5px] text-ink-2">{k.items.map((i) => `${i.nama} ${i.qty} ${i.sat}`).join(", ")} · {rp(k.items.reduce((n, i) => n + i.qty * i.harga, 0))} · {LABEL[k.bayar]}</span>
            {k.status !== "diterima" && <button onClick={() => majukanKulakan(k.id)} className="mt-1 self-start rounded-lg bg-mint px-3 py-2 text-xs font-semibold text-mint-ink">{k.status === "dipesan" ? "Simulasi: Sales Agent konfirmasi" : k.status === "dikonfirmasi" ? "Simulasi: barang dikirim" : "Pindai QR kurir · barang diterima"}</button>}
          </div>
        ))}
      </main>
    </>
  );
}
