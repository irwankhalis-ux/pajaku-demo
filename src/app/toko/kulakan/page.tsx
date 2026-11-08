"use client";

import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { btn, chip } from "@/components/kit";
import { useTokoAktif } from "@/components/toko";
import { PEMASOK, type Pedagang, type State } from "@/lib/model";
import { majukanKulakan, pesanKulakan, rp } from "@/lib/store";

export default function Page() {
  return <PedagangPage>{({ s, p }) => <Isi s={s} p={p} />}</PedagangPage>;
}

function Isi({ s, p }: { s: State; p: Pedagang }) {
  const [toko] = useTokoAktif(s, p.id);
  const [pm, setPm] = useState(PEMASOK[0].id);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [bayar, setBayar] = useState<"tunai" | "tempo">("tunai");
  const [msg, setMsg] = useState("");
  if (!toko) return <><BackHeader href="/toko/" title="Kulakan" /><main className="px-4"><Empty>Kulakan tersedia setelah toko aktif.</Empty></main></>;
  const P = PEMASOK.find((x) => x.id === pm)!;
  const total = P.items.reduce((n, [nm, , h]) => n + (qty[nm] ?? 0) * h, 0);
  const riwayat = s.kulakan.filter((k) => k.tokoId === toko.id);
  const step = (nm: string, d: number) => setQty({ ...qty, [nm]: Math.max(0, (qty[nm] ?? 0) + d) });
  return (
    <>
      <BackHeader href="/toko/" title="Kulakan (B2B)" sub={`Belanja stok untuk ${toko.nama}`} />
      <main className="flex flex-1 flex-col gap-3 px-4 pb-4">
        <div className="flex flex-wrap gap-1.5">{PEMASOK.map((x) => <button key={x.id} onClick={() => { setPm(x.id); setQty({}); setMsg(""); }} className={chip(pm === x.id)}>{x.nama.split(" ").slice(0, 2).join(" ")}</button>)}</div>
        <section className={`${card} flex flex-col gap-2 p-3.5`}>
          <div><b className="text-sm">{P.nama}</b><div className="text-xs text-muted">{P.ket}</div></div>
          {P.items.map(([nm, sat, h]) => (
            <div key={nm} className="flex items-center justify-between gap-2 border-t border-[#EFF0EA] pt-2">
              <span><b className="block text-[13.5px]">{nm}</b><span className="text-xs text-muted">{rp(h)} / {sat}</span></span>
              <span className="flex items-center gap-2"><button aria-label={`Kurangi ${nm}`} onClick={() => step(nm, -1)} className="size-9 rounded-lg border border-line-2 bg-white font-bold">−</button><span className="w-6 text-center font-mono">{qty[nm] ?? 0}</span><button aria-label={`Tambah ${nm}`} onClick={() => step(nm, 1)} className="size-9 rounded-lg bg-pj font-bold text-white">+</button></span>
            </div>
          ))}
        </section>
        <div className="flex gap-2"><button onClick={() => setBayar("tunai")} className={chip(bayar === "tunai")}>Bayar saat terima</button>{pm === "FS" && <button onClick={() => setBayar("tempo")} className={chip(bayar === "tempo")}>Tempo 14 hari (SCF Bank DKI)</button>}</div>
        {bayar === "tempo" && <p className="text-xs text-muted">Pembiayaan rantai pasok: Bank DKI membayar Food Station di muka, Anda melunasi 14 hari kemudian. Limit dihitung dari omzet TokoPaja &amp; riwayat BPP.</p>}
        <button disabled={!total} onClick={() => { const m = pesanKulakan(toko.id, pm, qty, bayar); setMsg(m ?? "Pesanan kulakan terkirim ke pemasok."); if (!m) setQty({}); }} className={btn}>Pesan {total ? rp(total) : ""}</button>
        {msg && <div role="status" className="text-[13px] text-mint-ink">{msg}</div>}
        <h2 className="mt-1 text-[15px] font-bold">Riwayat kulakan</h2>
        {riwayat.length === 0 && <Empty>Belum ada kulakan.</Empty>}
        {riwayat.map((k) => (
          <div key={k.id} className={`${card} flex flex-col gap-1 p-3.5`}>
            <div className="flex justify-between gap-2"><span className="font-mono text-xs text-muted">{k.id} · {k.tgl}</span><span className="rounded-full bg-mint px-2 py-0.5 text-[11px] font-bold text-mint-ink">{k.status}</span></div>
            <b className="text-[13.5px]">{k.pemasok}</b>
            <span className="text-[12.5px] text-ink-2">{k.items.map((i) => `${i.nama} ${i.qty} ${i.sat}`).join(", ")} · {rp(k.items.reduce((n, i) => n + i.qty * i.harga, 0))} · {k.bayar === "tempo" ? "tempo 14 hari" : "bayar saat terima"}</span>
            {k.status !== "diterima" && <button onClick={() => majukanKulakan(k.id)} className="mt-1 self-start rounded-lg bg-mint px-3 py-2 text-xs font-semibold text-mint-ink">{k.status === "dipesan" ? "Simulasi: pemasok mengirim" : "Konfirmasi barang diterima"}</button>}
          </div>
        ))}
      </main>
    </>
  );
}
