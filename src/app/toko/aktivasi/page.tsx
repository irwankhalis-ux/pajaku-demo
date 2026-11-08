"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, card } from "@/components/ui";
import { Field, PinInput, Steps, WithQ, btn, input } from "@/components/kit";
import { KATEGORI } from "@/lib/model";
import { aktivasiToko, siptuAktif, tuById } from "@/lib/store";

export default function Page() {
  return <WithQ>{(q) => <Aktivasi tuAwal={q("tu")} />}</WithQ>;
}

function Aktivasi({ tuAwal }: { tuAwal: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [siptu, setSiptu] = useState("");
  const [nama, setNama] = useState("");
  const [opsi, setOpsi] = useState({ ambil: true, antar: true, kulakan: true });
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <PedagangPage nav={false}>
      {({ s, p, kat }) => {
        const list = siptuAktif(s, p.id).filter((d) => !s.toko.some((t) => t.tuId === d.tuId));
        const awal = list.find((d) => d.tuId === tuAwal) ?? list[0];
        const no = siptu || awal?.no || "";
        const d = list.find((x) => x.no === no.trim());
        const t = d && tuById(s, d.tuId);
        const namaToko = nama || `Toko ${p.nama.replace(/^(H|Hj)\. /, "").split(" ")[0]} ${t?.dagangan.split(" ")[0] ?? ""}`.trim();
        const go = () => {
          setErr("");
          if (step === 0 && !d) return setErr("Nomor e-SIPTU tidak ditemukan atau bukan atas nama Anda.");
          if (step === 2) { const m = aktivasiToko(p.id, no, namaToko, opsi, pin); if (m) return setErr(m); }
          setStep(step + 1);
        };
        return (
          <>
            <BackHeader href="/toko/" title="Buka toko online" sub="TokoPaja · aktivasi dari e-SIPTU" />
            <main className="flex flex-1 flex-col gap-3.5 px-4 pb-6">
              <Steps n={step + 1} of={4} labels={["e-SIPTU", "Kelayakan", "Toko", "Aktif"]} />
              {step === 0 && (
                <>
                  <h2 className="text-xl font-bold">Buka toko online pakai e-SIPTU Anda</h2>
                  <Field label="Nomor e-SIPTU" id="siptu"><input id="siptu" value={no} onChange={(e) => setSiptu(e.target.value)} className={`${input} font-mono`} /></Field>
                  {list.length > 1 && <div className="flex flex-wrap gap-1.5">{list.map((x) => <button key={x.no} onClick={() => setSiptu(x.no)} className="rounded-full border border-line-2 bg-white px-2.5 py-1 font-mono text-[11px]">{x.tuId}</button>)}</div>}
                  <div className="rounded-xl bg-[#FFF6E0] p-3 text-[12.5px] leading-relaxed text-[#5A4300]">Satu e-SIPTU = satu toko. Pedagang dengan beberapa kios bisa punya beberapa toko dalam satu ID Pelanggan. Pindai QR di Dompet Dokumen juga bisa.</div>
                </>
              )}
              {step === 1 && t && d && (
                <>
                  <h2 className="text-xl font-bold">Data dari e-SIPTU</h2>
                  <div className={`${card} grid grid-cols-2 gap-x-3 gap-y-2.5 p-3.5`}>
                    <div className="col-span-2 flex items-start justify-between"><span><b className="block text-base">{p.nama}</b><span className="text-xs text-muted">ID Pelanggan {p.id}</span></span><span className="rounded-full bg-[#DDF2E8] px-2.5 py-1 text-[11px] font-bold text-[#0B5A40]">{KATEGORI[kat].nama}</span></div>
                    {[["Pasar", "Pasar Johar Baru"], ["ID Kios", t.id], ["e-SIPTU", d.no], ["Kelompok dagangan", t.dagangan]].map(([a, b]) => <div key={a}><div className="text-[11px] text-muted">{a}</div><div className="text-[13px] font-semibold break-all">{b}</div></div>)}
                  </div>
                  <div className={`${card} flex flex-col gap-2 p-3.5`}>
                    <span className="text-[13px] font-bold">Syarat akun TokoPaja</span>
                    {["e-SIPTU aktif atas nama Anda", "NIK terverifikasi di PaJaKu", "Kios berstatus buka", "Jenis dagangan tercatat"].map((c) => <div key={c} className="flex items-center gap-2 text-[13.5px]"><span className="flex size-5 items-center justify-center rounded-full bg-pj text-[11px] text-white">✓</span>{c}</div>)}
                  </div>
                  <p className="text-xs text-muted">Produk hanya dari kelompok dagangan di e-SIPTU. Ingin menambah jenis dagangan? Ajukan perubahan lewat Layanan.</p>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold">Atur toko Anda</h2>
                  <Field label="Nama toko" id="nama" hint={`Tampil ke pembeli bersama lokasi kios ${t?.id}`}><input id="nama" value={namaToko} onChange={(e) => setNama(e.target.value)} className={input} /></Field>
                  <span className="text-[13px] font-semibold text-ink-2">Layanan toko</span>
                  {([["ambil", "Ambil di kios", "Pembeli pesan, ambil sendiri di kios"], ["antar", "Antar ke rumah", "Kurir mitra atau antar sendiri"], ["kulakan", "Terima tawaran kulakan", "Pemasok bisa menawarkan stok ke toko"]] as const).map(([k, l, sub]) => (
                    <button key={k} onClick={() => setOpsi({ ...opsi, [k]: !opsi[k] })} aria-pressed={opsi[k]} className={`${card} flex items-center gap-3 p-3 text-left`}>
                      <span className={`flex size-[22px] items-center justify-center rounded-md text-[12px] text-white ${opsi[k] ? "bg-pj" : "border-2 border-[#9AA39C]"}`}>{opsi[k] ? "✓" : ""}</span>
                      <span><b className="block text-sm">{l}</b><span className="text-xs text-muted">{sub}</span></span>
                    </button>
                  ))}
                  <PinInput value={pin} onChange={setPin} label="Konfirmasi dengan PIN PaJaKu" />
                </>
              )}
              {step === 3 && (
                <div className="flex flex-col items-center gap-3 pt-4 text-center">
                  <div className="flex size-[76px] items-center justify-center rounded-full bg-[#DDF2E8] text-4xl text-pj">✓</div>
                  <h2 className="text-2xl font-bold">Toko Anda sudah aktif</h2>
                  <p className="text-sm text-ink-2">{namaToko} sekarang bisa dilihat pembeli dan pemasok kulakan.</p>
                  <div className={`${card} w-full px-3.5 py-1 text-left`}>{[["ID Toko", `TP-${t?.id}`], ["Terhubung ke", no], ["Lencana pembeli", "Kios terverifikasi e-SIPTU"]].map(([a, b]) => <div key={a} className="flex justify-between gap-2 border-b border-[#EFF0EA] py-2.5 text-[13px] last:border-0"><span className="text-muted">{a}</span><b className="text-right break-all">{b}</b></div>)}</div>
                </div>
              )}
              {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
              <div className="mt-auto flex gap-2">
                {step === 3 ? (<>
                  <button onClick={() => router.replace("/toko/produk/")} className={`${btn} flex-1`}>Tambah produk pertama</button>
                  <button onClick={() => router.replace("/toko/")} className="min-h-12 flex-1 rounded-[10px] border-[1.5px] border-pj bg-white font-semibold text-pj">Toko saya</button>
                </>) : (<>
                  {step > 0 && <button onClick={() => setStep(step - 1)} className="min-h-12 flex-1 rounded-[10px] border border-line-2 bg-white font-semibold">Kembali</button>}
                  <button onClick={go} className={`${btn} flex-[2]`}>{["Cek kelayakan", "Data benar, lanjut", "Aktifkan toko"][step]}</button>
                </>)}
              </div>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
