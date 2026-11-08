"use client";

import { useState } from "react";
import type { State, Toko } from "@/lib/model";
import { tokoOf } from "@/lib/store";

/** Toko aktif pedagang (bisa lebih dari satu bila punya beberapa e-SIPTU). */
export function useTokoAktif(s: State, pid: string): [Toko | undefined, Toko[], (id: string) => void] {
  const list = tokoOf(s, pid);
  const [id, setId] = useState<string>("");
  return [list.find((t) => t.id === id) ?? list[0], list, setId];
}

export const TAHAP = [
  { label: "Pesanan baru", tone: "bg-[#FFE7B0] text-[#5A4300]", act: "Konfirmasi harga & kirim tagihan", hint: "Konfirmasi dalam 12 menit agar pesanan tidak batal otomatis." },
  { label: "Menunggu bayar", tone: "bg-[#E3ECF7] text-[#1F3F66]", act: "Simulasi: pembeli membayar QRIS", hint: "Tagihan terkirim ke pembeli lewat QRIS." },
  { label: "Dibayar · siapkan", tone: "bg-[#DDF2E8] text-[#0B5A40]", act: "Barang siap, serahkan", hint: "Dana ditahan di rekening penampung bank mitra. Siapkan barang." },
  { label: "Diantar / siap diambil", tone: "bg-[#E3ECF7] text-[#1F3F66]", act: "Pembeli konfirmasi terima", hint: "Serah terima dengan kode 4 digit dari pembeli." },
  { label: "Selesai", tone: "bg-[#16211C] text-white", act: "", hint: "Dana diteruskan ke rekening Anda." },
];
export const BIAYA_LAYANAN = 0.02; // usulan 2% (lihat model fee PATROL)
