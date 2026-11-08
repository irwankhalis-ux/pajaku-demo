"use client";

import { useState } from "react";
import { KPage, kbtnO } from "@/components/kulakan-ui";
import { laporTPID, realisasiTPID, rp } from "@/lib/kulakan";

export default function Tpid() {
  const [sent, setSent] = useState(false);
  return (
    <KPage judul="Penugasan Gubernur · TPID" sub="Komoditas penugasan atas rekomendasi TPID DKI Jakarta · Perda 7/2018 Ps. 16 (stabilisasi harga)">
      {({ s, staf }) => (
        <>
          {s.tugas.map((t) => {
            const pct = Math.round((t.realisasi / t.volume) * 100);
            return (
              <section key={t.id} className="flex flex-col gap-2 rounded-[14px] border-2 border-[#FDBA74] bg-white p-4 text-[13px]">
                <div className="flex flex-wrap items-center justify-between gap-2"><b className="text-[15px]">{t.komoditas}</b><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${t.status === "selesai" ? "bg-[#E0F2FE] text-[#075985]" : t.status === "pasokan kurang" ? "bg-[#FFEDD5] text-[#9A3412]" : "bg-[#DCFCE7] text-[#14532D]"}`}>{t.status}</span></div>
                <div className="flex justify-between"><span>Realisasi {t.realisasi.toLocaleString("id-ID")} / {t.volume.toLocaleString("id-ID")} {t.satuan}</span><b>{pct}%</b></div>
                <div className="h-2 rounded bg-[#F3F4F6]"><div className="h-2 rounded" style={{ width: `${pct}%`, background: t.status === "pasokan kurang" ? "#C2410C" : "#14532D" }} /></div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <span className="text-[#4B5563]">Harga jual ke pedagang</span><b>{rp(t.hargaJual)}</b>
                  <span className="text-[#4B5563]">Acuan HET/HAP</span><b>{rp(t.acuan)}</b>
                  <span className="text-[#4B5563]">Eceran pasar sasaran</span><b>{rp(t.sebelum)} → <span className={t.sesudah <= t.acuan ? "text-[#15803D]" : "text-[#B45309]"}>{rp(t.sesudah)}</span></b>
                  <span className="text-[#4B5563]">Pasar sasaran</span><b>{t.pasar} pasar</b>
                </div>
                {t.status !== "selesai" && (staf.peran === "merch" || staf.peran === "direktur") && <button onClick={() => realisasiTPID(t.id, Math.round(t.volume * 0.1), staf.nama)} className="self-start rounded-lg bg-[#14532D] px-3 py-2 text-xs font-bold text-white">Catat distribusi +10%</button>}
              </section>
            );
          })}
          <p className="text-xs text-[#4B5563]">Harga eceran pasar sasaran sebelum → sesudah penugasan diambil dari harga harian yang dicatat kasir/AO di Konsol Pasar Jaya dan harga toko TokoPaja. Nomor instruksi Gubernur, volume, acuan harga & skema penggantian selisih = placeholder.</p>
          <button onClick={() => { laporTPID(staf.nama); setSent(true); }} className={kbtnO}>{sent ? "Laporan terkirim ke TPID ✓" : "Kirim laporan ke TPID DKI Jakarta"}</button>
        </>
      )}
    </KPage>
  );
}
