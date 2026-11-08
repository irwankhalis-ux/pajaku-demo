"use client";

import Link from "next/link";
import { BoPage, EWS, Kpi, MiniBar, Stacked, grid, panel } from "@/components/bo";
import { KATEGORI, type Kategori } from "@/lib/model";
import { kategoriOf, pct, rp, statistik } from "@/lib/store";

// baris wilayah lain = ilustrasi menunggu data internal Pasar Jaya
const WILAYAH = [["Jakarta Pusat", 31, 21840, 88, 6, 71], ["Jakarta Utara", 27, 17260, 82, 2, 64], ["Jakarta Barat", 33, 22410, 85, 0, 69], ["Jakarta Selatan", 34, 23120, 90, 0, 74], ["Jakarta Timur", 31, 19370, 84, 0, 66]] as const;

export default function Eis() {
  return (
    <BoPage judul="EIS Direksi">
      {({ s, staf }) => {
        const st = statistik(s);
        const terisi = s.tu.filter((t) => t.buka);
        const kol = pct(terisi.filter((t) => t.tunggakan === 0).length, terisi.length);
        const kat: Record<Kategori, number> = { E: 0, P: 0, G: 0, B: 0 };
        const terlibat = new Set(s.tu.flatMap((t) => [t.pemilikId, t.pemakaiId]));
        for (const p of s.pedagang) { if (terlibat.has(p.id) || p.daftar) kat[kategoriOf(s, p.id)]++; }
        const gmv = s.toko.reduce((n, t) => n + t.omzet, 0);
        const blok = [...new Set(s.tu.map((t) => `${t.blok}-${t.lantai}`))].map((b) => {
          const tu = s.tu.filter((t) => `${t.blok}-${t.lantai}` === b);
          const isi = tu.filter((t) => t.buka);
          return { b, n: tu.length, ok: pct(isi.length, tu.length), mig: pct(tu.filter((t) => t.status === "terbit").length, tu.length), kol: pct(isi.filter((t) => t.tunggakan === 0).length, isi.length), risk: tu.filter((t) => t.tunggakan >= 2).length };
        });
        const eskal = s.anomali.filter((a) => a.status === "eskalasi" && !a.keputusan).length;
        return (
          <>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div><div className="text-[12px] tracking-[.04em] text-muted uppercase">Executive Information System</div><h1 className="text-[22px] font-bold">Ringkasan Direksi · Pilot Johar Baru</h1></div>
              <span className="rounded-md bg-[#FBEFD9] px-2.5 py-1 text-[11.5px] text-[#6E4A12]">Data contoh · angka wilayah lain ilustrasi</span>
            </div>
            <section className={grid}>
              <Kpi l="Migrasi dokumen" v={`${pct(s.tu.filter((t) => t.status === "terbit").length, st.total)}%`} s={`${s.tu.filter((t) => t.status === "terbit").length} dari ${st.total} TU terbit · target 80%`} src="live" />
              <Kpi l="Okupansi" v={`${pct(st.terisi, st.total)}%`} s={`${st.terisi} terisi · ${st.total - st.terisi} kosong`} src="live" />
              <Kpi l="Kolektibilitas BPP" v={`${kol}%`} s={`${terisi.filter((t) => t.tunggakan >= 2).length} TU waspada/macet`} tone={kol < 80 ? "text-[#A3361C]" : "text-muted"} src="live" />
              <Kpi l="Pedagang aktif aplikasi" v={`${pct(st.aktif, st.pemakai)}%`} s={`${st.aktif} dari ${st.pemakai} pemakai`} src="live" />
              <Kpi l="TokoPaja aktif" v={s.toko.length} s={`GMV bln ini ${rp(gmv)}`} src="live" />
              <Kpi l="Antrean TTE Anda" v={st.menunggu.length} s="dokumen menunggu tanda tangan" tone={st.menunggu.length ? "text-[#9A5B0E]" : "text-muted"} src="live" />
              <Kpi l="Tiket & aduan terbuka" v={st.tiket} s="CRM kantor pasar" src="live" />
              <Kpi l="Eskalasi ke Direksi" v={eskal + s.anomali.filter((a) => a.status === "eskalasi").length} s={`${st.anomali} anomali terbuka`} src="live" />
            </section>
            {staf.peran === "direksi" && (st.menunggu.length > 0 || eskal > 0) && (
              <Link href="/direksi/" className="flex items-center justify-between rounded-xl bg-[#0F2A20] px-4 py-3.5 text-white"><span><b className="block">Keputusan menunggu Anda</b><span className="text-[12.5px] text-[#C9D8CF]">{st.menunggu.length} dokumen TTE · {eskal} eskalasi</span></span><span className="rounded-lg bg-gold px-3 py-2 text-[13px] font-bold text-[#0F2A20]">Buka ›</span></Link>
            )}
            <section className="grid gap-3.5 md:grid-cols-2">
              <div className={panel}>
                <div className="mb-3 flex items-baseline justify-between gap-2"><h2 className="text-[15px] font-bold">Peringatan dini · status BPP per TU</h2><span className="text-[11px] text-muted">{terisi.length} TU terisi</span></div>
                <Stacked parts={EWS.map((e) => ({ l: e.l, c: e.c, rule: e.rule, n: terisi.filter((t) => e.f(t.tunggakan)).length }))} />
                <Link href="/bo/tagihan/" className="mt-3 inline-block text-[13px] font-semibold text-pj">Buka daftar TU Waspada–Macet →</Link>
              </div>
              <div className={panel}>
                <div className="mb-3 flex items-baseline justify-between gap-2"><h2 className="text-[15px] font-bold">Komposisi tenant per kategori</h2><span className="text-[11px] text-muted">peran tertinggi atas kios</span></div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(KATEGORI) as Kategori[]).map((k) => <div key={k} className="rounded-[10px] border border-line p-3"><div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: KATEGORI[k].grad }} /><b className="text-sm">{KATEGORI[k].nama}</b></div><div className="text-[22px] font-bold">{kat[k]}</div><div className="text-[11.5px] leading-snug text-muted">{KATEGORI[k].peran}</div></div>)}
                </div>
              </div>
            </section>
            <section className={panel}>
              <h2 className="mb-2 text-[15px] font-bold">Kinerja per blok · Pasar Johar Baru</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-[13px]">
                  <thead><tr className="text-left text-[11px] tracking-[.03em] text-muted uppercase">{["Blok", "TU", "Okupansi", "Migrasi", "Kolektibilitas", "Waspada+"].map((h) => <th key={h} className="border-b border-line px-2 py-2">{h}</th>)}</tr></thead>
                  <tbody>{blok.map((r) => <tr key={r.b}><td className="border-b border-[#EEF0EA] px-2 py-2.5 font-semibold">{r.b.replace("-", " · ")}</td><td className="border-b border-[#EEF0EA] px-2 font-mono">{r.n}</td><td className="w-[22%] border-b border-[#EEF0EA] px-2"><MiniBar v={r.ok} /></td><td className="w-[22%] border-b border-[#EEF0EA] px-2"><MiniBar v={r.mig} tone="#C8781E" /></td><td className="border-b border-[#EEF0EA] px-2">{r.kol}%</td><td className="border-b border-[#EEF0EA] px-2 font-semibold text-[#A3361C]">{r.risk}</td></tr>)}</tbody>
                </table>
              </div>
            </section>
            <section className={panel}>
              <div className="mb-2 flex items-baseline justify-between gap-2"><h2 className="text-[15px] font-bold">Kinerja per wilayah · 156 pasar</h2><span className="text-[11px] text-muted">ilustrasi · gelombang setelah pilot</span></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-[13px]">
                  <thead><tr className="text-left text-[11px] tracking-[.03em] text-muted uppercase">{["Wilayah", "Pasar", "TU", "Okupansi", "Migrasi", "Kolektibilitas"].map((h) => <th key={h} className="border-b border-line px-2 py-2">{h}</th>)}</tr></thead>
                  <tbody>{WILAYAH.map(([w, p, n, o, m, k]) => <tr key={w}><td className="border-b border-[#EEF0EA] px-2 py-2.5 font-semibold">{w}</td><td className="border-b border-[#EEF0EA] px-2 font-mono">{p}</td><td className="border-b border-[#EEF0EA] px-2 font-mono">{n.toLocaleString("id-ID")}</td><td className="w-[20%] border-b border-[#EEF0EA] px-2"><MiniBar v={o} /></td><td className="w-[20%] border-b border-[#EEF0EA] px-2"><MiniBar v={w === "Jakarta Pusat" ? Math.round((s.tu.filter((t) => t.status === "terbit").length / n) * 100) || 3 : m} tone="#C8781E" /></td><td className="border-b border-[#EEF0EA] px-2">{k}%</td></tr>)}</tbody>
                </table>
              </div>
            </section>
          </>
        );
      }}
    </BoPage>
  );
}
