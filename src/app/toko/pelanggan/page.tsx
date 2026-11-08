"use client";

import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { useTokoAktif } from "@/components/toko";
import type { Pedagang, State } from "@/lib/model";
import { rp, totalPesanan } from "@/lib/store";

export default function Page() {
  return <PedagangPage>{({ s, p }) => <Isi s={s} p={p} />}</PedagangPage>;
}

function Isi({ s, p }: { s: State; p: Pedagang }) {
  const [toko] = useTokoAktif(s, p.id);
  const [kirim, setKirim] = useState<string[]>([]);
  const ps = s.pesanan.filter((o) => o.tokoId === toko?.id && !o.batal);
  const map = new Map<string, { n: number; total: number; akhir: string; nilai: number[]; hp: string; fav: Record<string, number> }>();
  for (const o of ps) {
    const c = map.get(o.pembeli) ?? { n: 0, total: 0, akhir: o.jam, nilai: [], hp: o.hpPembeli, fav: {} };
    c.n++; if (o.tahap === 4) c.total += totalPesanan(o); if (o.nilai) c.nilai.push(o.nilai);
    o.items.forEach((i) => (c.fav[i.nama] = (c.fav[i.nama] ?? 0) + 1));
    map.set(o.pembeli, c);
  }
  const list = [...map.entries()].sort((a, b) => b[1].n - a[1].n);
  return (
    <>
      <BackHeader href="/toko/" title="Pelanggan" sub="CRM sederhana toko Anda" />
      <main className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
        {list.length === 0 && <Empty>Pelanggan muncul setelah ada pesanan.</Empty>}
        {list.map(([nama, c]) => {
          const fav = Object.entries(c.fav).sort((a, b) => b[1] - a[1])[0]?.[0];
          return (
            <div key={nama} className={`${card} flex flex-col gap-1.5 p-3.5`}>
              <div className="flex items-center justify-between"><b className="text-sm">{nama}</b><span className="text-xs text-muted">{c.hp}</span></div>
              <div className="text-[12.5px] text-ink-2">{c.n} pesanan · belanja selesai {rp(c.total)} · terakhir {c.akhir}{c.nilai.length ? ` · ★ ${(c.nilai.reduce((a, b) => a + b, 0) / c.nilai.length).toFixed(1)}` : ""}</div>
              {fav && <div className="text-xs text-muted">Sering beli: {fav}</div>}
              <button disabled={kirim.includes(nama)} onClick={() => setKirim([...kirim, nama])} className="self-start rounded-lg bg-mint px-3 py-2 text-xs font-semibold text-mint-ink disabled:opacity-60">{kirim.includes(nama) ? "Info harga terkirim ✓" : `Kirim info harga ${fav ?? "hari ini"}`}</button>
            </div>
          );
        })}
      </main>
    </>
  );
}
