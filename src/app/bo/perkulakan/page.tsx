"use client";

import { BoPage, Kpi, grid, panel } from "@/components/bo";
import { EIS, KATALOG, perUnit, seed as kseed } from "@/lib/kulakan";
import { rp } from "@/lib/store";

// Ringkasan Direktorat Perkulakan dan Ritel di Konsol Pasar Jaya — data yang sama dengan aplikasi pemasok KulakanPaja.
const K = kseed();

export default function Perkulakan() {
  return (
    <BoPage judul="Perkulakan & Ritel">
      {({ s }) => {
        const tot = EIS.komposisi.reduce((n, k) => n + k[2], 0), tgt = EIS.komposisi.reduce((n, k) => n + k[3], 0);
        const jhb = s.kulakan.filter((k) => k.pemasok.includes("Pasar Jaya"));
        return (
          <>
            <div className="text-[12.5px] text-muted">Direktorat Perkulakan dan Ritel memasok toko TokoPaja lewat aplikasi <b>KulakanPaja</b> (Jakgrosir Kramat Jati). Angka ilustrasi Okt 2026.</div>
            <section className={grid}>
              <Kpi l="Sales value Okt" v={`Rp${tot.toLocaleString("id-ID")} M`} s={`${Math.round((tot / tgt) * 100)}% dari target Rp${tgt.toLocaleString("id-ID")} M`} />
              <Kpi l="Pembiayaan DO Bank Jakarta" v={`Rp${String(EIS.doBank.dibiayai).replace(".", ",")} M`} s={`${EIS.doBank.pakai} pedagang Emerald`} />
              <Kpi l="Pesanan dari Johar Baru" v={jhb.length + K.pesanan.filter((p) => p.tokoId.includes("JHB")).length} s="toko TokoPaja pilot" />
              <Kpi l="Piutang tempo > 30 hari" v={`Rp${EIS.tagihan.lebih30} jt`} s="12 toko" />
            </section>
            <section className={panel}>
              <h2 className="mb-2 text-[15px] font-bold">Penugasan Gubernur / TPID</h2>
              {K.tugas.map((t) => <div key={t.id} className="border-t border-[#EEF0EA] py-2 text-[13px] first:border-0"><div className="flex justify-between"><b>{t.komoditas}</b><span>{Math.round((t.realisasi / t.volume) * 100)}% · {t.status}</span></div><div className="text-xs text-muted">jual ke pedagang {rp(t.hargaJual)} · acuan {rp(t.acuan)} · eceran {rp(t.sebelum)} → {rp(t.sesudah)} · {t.pasar} pasar</div></div>)}
            </section>
            <section className={panel}>
              <h2 className="mb-1 text-[15px] font-bold">Harga kulakan vs harga eceran Johar Baru</h2>
              <p className="mb-2 text-xs text-muted">Harga eceran dari input harian kasir/AO (menu Operasi & Harga) — dipakai KulakanPaja menentukan pasar sasaran TPID.</p>
              {KATALOG.filter((k) => !k.tpid || k.id !== "MGR").map((k) => { const h = s.harga.find((x) => k.nama.toLowerCase().startsWith(x.komoditas.toLowerCase().split(" ")[0])); const pu = perUnit(k, k.tiers[0][1]); return <div key={k.id} className="grid grid-cols-[1fr_auto_auto] gap-3 border-t border-[#EEF0EA] py-1.5 text-[13px] first:border-0"><span>{k.nama.split(" (")[0]}</span><span className="text-muted">kulakan {rp(pu)}/{k.perUnit}</span><b>{h ? `eceran ${rp(h.hariIni)}` : "—"}</b></div>; })}
            </section>
          </>
        );
      }}
    </BoPage>
  );
}
