"use client";

import { KPage, kpanel } from "@/components/kulakan-ui";
import { STAF } from "@/lib/kulakan";

const STRUKTUR = [["L1 · Direktur Perkulakan dan Ritel", "EIS, persetujuan harga di atas HET, penugasan TPID"], ["Divisi Marketing & Pengembangan Bisnis", "Sales Manager (setujui broadcast, diskon ≤1%) · Sales Agent per grup komoditas"], ["Divisi Merchandising / Pengadaan", "Category Manager, Buyer · menetapkan harga jual · Petugas PSO/TPID"], ["Divisi Operasional Perkulakan & Ritel", "Kepala Gudang Jakgrosir, Kepala Mini DC, Delivery per hub"], ["Fungsi Keuangan", "Finance & Accounting, Collection, rekonsiliasi DO Bank Jakarta"]];
const DASAR = [["Ps. 11 (2) b", "kerja sama dengan pihak lain (PATROL, Bank Jakarta)"], ["Ps. 11 (2) c", "pusat distribusi daerah & perkulakan (Jakgrosir, Mini DC)"], ["Ps. 15 (1)–(2)", "kerja sama BUMD/pihak lain menyediakan bahan pokok (multi-pemasok)"], ["Ps. 16", "stabilisasi pasokan & harga (penugasan TPID)"], ["Ps. 18 (3) c", "penerimaan hasil usaha perkulakan"]];

export default function Organisasi() {
  return (
    <KPage judul="Organisasi, peran & hak akses" sub="Struktur indikatif · ditetapkan lewat anggaran dasar/Pergub SOTK Pasar Jaya">
      {() => (
        <>
          <section className={`${kpanel} flex flex-col`}>{STRUKTUR.map(([a, b]) => <div key={a} className="border-t border-[#F3F4F6] py-2 text-[13px] first:border-0"><b>{a}</b><br /><span className="text-[#4B5563]">{b}</span></div>)}</section>
          <section className={`${kpanel} flex flex-col`}><b className="mb-1 text-[15px]">Akun uji coba</b>{STAF.map((s) => <div key={s.id} className="flex justify-between gap-2 border-t border-[#F3F4F6] py-1.5 text-[13px] first:border-0"><span>{s.jabatan}</span><span className="text-[#4B5563]">{s.nama}</span></div>)}</section>
          <section className={`${kpanel} flex flex-col`}><b className="mb-1 text-[15px]">Dasar hukum · Perda DKI 7/2018</b>{DASAR.map(([a, b]) => <div key={a} className="grid grid-cols-[100px_1fr] gap-2 border-t border-[#F3F4F6] py-1.5 text-[13px] first:border-0"><b>{a}</b><span>{b}</span></div>)}<span className="mt-1 text-xs text-[#4B5563]">Bukan nasihat hukum — cocokkan dengan naskah resmi JDIH DKI.</span></section>
        </>
      )}
    </KPage>
  );
}
