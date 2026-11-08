"use client";

import { MPage, Tag, panel } from "@/components/mitra-ui";
import { STAF } from "@/lib/mitra";

const AKSES: [string, string][] = [
  ["Direksi Mitra", "EIS HP · persetujuan harga & promo · ajukan termin"], ["Sales & Marketing Manager", "Harga Gold/Biru · bagi tugas tim · alihkan chat · konten"], ["Sales", "Prospek Biru · pemesanan & e-SPTU · chat Sales"],
  ["Collection", "Tagihan · pengingat · catat bayar · chat Collection"], ["Customer Relation", "Chat & tiket SLA · update progres"], ["Keuangan Mitra", "Escrow · termin · rekonsiliasi VA/QRIS · kredit"],
  ["Pengawas Pasar Jaya", "Sahkan undian · TTE e-SPTU · setujui termin escrow · baca semua"],
];
const PAKET = [
  ["Basic", "Inventori & harga 3 jalur · hak eksisting & undian zoning · pemesanan & e-SPTU · tagihan VA/QRIS, escrow & peringatan dini · chat PaJaKu, tiket SLA & update progres · dashboard & serah kelola"],
  ["Tambahan", "Portal pembiayaan bank · CRM prospek Biru · broadcast & kalender media sosial · EIS Direksi HP"],
  ["Kustom", "Integrasi ERP/akuntansi Mitra · aturan & fitur khusus proyek"],
];

export default function TataKelola() {
  return (
    <MPage judul="Peran, alur & tata kelola" sub="Satu konsol untuk satu proyek · Mitra berlangganan aplikasi dari PATROL">
      {() => (
        <>
          <section className={`${panel} flex flex-col`}>
            <h2 className="mb-1 text-[15px] font-bold">Peran & hak akses</h2>
            {AKSES.map(([a, b], i) => <div key={a} className="grid grid-cols-[1fr_1.4fr] gap-2 border-t border-[#EFECE4] py-2 text-[13px] first:border-0"><b>{a}</b><span className="text-[#3A3F45]">{b}{STAF[i] ? <span className="block text-xs text-[#5B6168]">akun uji: {STAF[i].nama}</span> : null}</span></div>)}
          </section>
          <section className={`${panel} flex flex-col gap-2`}>
            <h2 className="text-[15px] font-bold">Alur persetujuan bersama Pasar Jaya</h2>
            {["Harga eksisting dikunci Pasar Jaya; harga Gold & Biru kebijakan Mitra", "Hasil undian diimpor Mitra → disahkan Pasar Jaya → e-SPTU otomatis ke pemenang", "e-SPTU: ditandatangani pedagang di PaJaKu → TTE Pasar Jaya → sah", "Dana pedagang & bank ke escrow → termin cair sesuai progres fisik dengan persetujuan Pasar Jaya", "Serah terima: lunas → BAST → e-SHPTU & e-SIPTU baru oleh Pasar Jaya → serah kelola"].map((x, i) => <div key={x} className="flex gap-2 text-[13px]"><span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#12302B] text-[10px] font-bold text-white">{i + 1}</span>{x}</div>)}
          </section>
          <section className={`${panel} flex flex-col gap-2`}>
            <h2 className="text-[15px] font-bold">Paket langganan PATROL</h2>
            {PAKET.map(([a, b]) => <div key={a} className="text-[13px]"><Tag tone="bg-[#DCEFEA] text-[#0A5249]">{a}</Tag> {b}</div>)}
            <div className="text-xs text-[#5B6168]">Biaya: fixed charge per modul + biaya per data akuisisi + implementasi per proyek (tarif menyusul).</div>
          </section>
          <section className={`${panel} text-[13px] text-[#3A3F45]`}><b>Aturan komunikasi:</b> chat PaJaKu satu-satunya kanal interaktif dengan pedagang (tanpa WhatsApp); komplain mendesak dijadikan tiket ber-SLA; media sosial untuk pengumuman satu arah.</section>
        </>
      )}
    </MPage>
  );
}
