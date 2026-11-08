"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, card } from "@/components/ui";
import { Field, PinInput, Steps, WithQ, btn, chip, input } from "@/components/kit";
import { DAGANGAN, PIN_DEMO } from "@/lib/model";
import { load as _l } from "@/lib/store";
import { migrasiMandiri, tuById } from "@/lib/store";

const FOTO = ["SHPTU kertas (halaman depan)", "SIPTU kertas", "Kwitansi BPP terakhir", "Foto kios tampak depan"];

export default function Page() {
  return <WithQ>{(q) => <Migrasi tuAwal={q("tu")} />}</WithQ>;
}

function Migrasi({ tuAwal }: { tuAwal: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tuId, setTuId] = useState(tuAwal);
  const [shptu, setShptu] = useState("");
  const [foto, setFoto] = useState<boolean[]>([false, false, false, false]);
  const [scan, setScan] = useState(false);
  const [buka, setBuka] = useState(true);
  const [dag, setDag] = useState("");
  const [kelola, setKelola] = useState<"sendiri" | "orang">("sendiri");
  const [pNama, setPNama] = useState("");
  const [pNik, setPNik] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  return (
    <PedagangPage nav={false}>
      {({ s, p, tus }) => {
        const milikArsip = tus.filter((t) => t.pemilikId === p.id && (t.status === "arsip" || t.status === "dikembalikan"));
        const t = tuById(s, tuId.trim().toUpperCase());
        const nFoto = foto.filter(Boolean).length;
        const next = () => {
          setErr("");
          if (step === 1) {
            if (!t) return setErr("ID Kios tidak ditemukan. Contoh: JHB-B-L2-045 (lihat stiker QR di kios).");
            if (t.status !== "arsip" && t.status !== "dikembalikan") return setErr("TU ini sudah didata / dokumennya sudah terbit.");
            if (!dag) setDag(t.dagangan === "—" ? "Pangan Kering" : t.dagangan);
          }
          if (step === 3) { if (shptu.trim().length < 5) return setErr("Isi nomor SHPTU kertas."); if (nFoto < 2) return setErr("Minimal foto SHPTU kertas dan kwitansi BPP."); }
          if (step === 4) { if (!scan) return setErr("Pindai QR di kios atau aktifkan lokasi saat berada di kios."); if (kelola === "orang" && (pNama.trim().length < 3 || pNik.length !== 16)) return setErr("Isi nama dan NIK Pengelola (16 angka)."); }
          if (step === 5) {
            if (pin !== PIN_DEMO) return setErr("PIN salah.");
            const m = migrasiMandiri(p.id, t!.id, { shptu, foto: nFoto, dagangan: dag, buka, ...(kelola === "orang" ? { pengelola: pNama.trim(), pengelolaNik: pNik } : {}) });
            if (m) return setErr(m);
            const id = _l().pengajuan.find((x) => x.tuId === t!.id && x.jenis === "migrasi")?.id;
            return router.replace(`/pengajuan/?id=${id}`);
          }
          setStep(step + 1);
        };
        return (
          <>
            <BackHeader href="/beranda/" title="Migrasi digital SHPTU" sub="SHPTU kertas → e-SHPTU & e-SIPTU" />
            <main className="flex flex-1 flex-col gap-3.5 px-4 pb-6">
              <Steps n={step} of={5} labels={["Kios", "Identitas", "Dokumen", "Lokasi", "Kirim"]} />
              {step === 1 && (
                <>
                  <p className="text-[13.5px] leading-relaxed text-ink-2">Hanya data yang dibutuhkan untuk menerbitkan dokumen dan menagih BPP. Proses ini menggantikan antre di loket; petugas tetap siap membantu di kantor pasar.</p>
                  {milikArsip.length > 0 && (
                    <div className="flex flex-col gap-1.5"><span className="text-[13px] font-semibold text-ink-2">TU Anda yang belum dimigrasi</span>
                      {milikArsip.map((x) => <button key={x.id} onClick={() => setTuId(x.id)} className={`${card} border-2 p-3 text-left ${tuId === x.id ? "border-pj" : ""}`}><span className="block font-mono text-sm">{x.id}</span><span className="block text-xs text-muted">{x.jenis} {x.luas} m² · Blok {x.blok} · {x.status === "dikembalikan" ? `perlu dilengkapi: ${x.catatan}` : "SHPTU kertas"}</span></button>)}
                    </div>
                  )}
                  <Field label="ID Kios (tertera di stiker QR kios / SHPTU)" id="tu"><input id="tu" value={tuId} onChange={(e) => setTuId(e.target.value)} placeholder="JHB-B-L2-045" className={`${input} font-mono uppercase`} /></Field>
                  {t && <div className={`${card} p-3 text-[13px]`}><b>{t.id}</b> · {t.jenis} {t.ukuran} · Blok {t.blok} · masa hak {t.masaHak}<br /><span className="text-muted">Pemilik di arsip: {s.pedagang.find((x) => x.id === t.pemilikId)?.nama.replace(/(?<=^.).+?(?=.$)/, (m) => "•".repeat(m.length))}{t.pemilikId !== p.id ? " · bukan Anda — kantor pasar akan mencocokkan SHPTU kertas" : " · Anda"}</span></div>}
                </>
              )}
              {step === 2 && (
                <div className="flex flex-col gap-2">
                  {[["Nomor HP", `${p.hp.slice(0, 4)}••••${p.hp.slice(-4)} · OTP terverifikasi`], ["NIK + swafoto", `${p.nik.slice(0, 4)} •••• •••• ${p.nik.slice(-4)} · cocok Dukcapil`], ["Nama", p.nama]].map(([a, b]) => (
                    <div key={a} className={`${card} flex items-center gap-3 p-3`}><span className="flex size-10 items-center justify-center rounded-xl bg-[#E3F5EA] text-[#157A44]">✓</span><span><span className="block text-sm font-bold">{a}</span><span className="block text-xs text-muted">{b}</span></span></div>
                  ))}
                  <p className="text-xs text-muted">Nama di SHPTU kertas berbeda (mis. ahli waris)? Lanjutkan; kantor pasar akan meminta surat keterangan waris saat verifikasi.</p>
                </div>
              )}
              {step === 3 && (
                <>
                  <Field label="Nomor SHPTU kertas" id="shptu"><input id="shptu" value={shptu} onChange={(e) => setShptu(e.target.value)} placeholder="SHPTU/JHB/2016/0045" className={`${input} font-mono`} /></Field>
                  <button type="button" onClick={() => setShptu(`SHPTU/JHB/${(t?.masaHak ?? "2016").slice(0, 4)}/0${t?.id.slice(-3) ?? "045"}`)} className="-mt-2 self-start text-[12.5px] font-semibold text-pj underline">Isi contoh</button>
                  <span className="text-[13px] font-semibold text-ink-2">Foto dokumen lama ({nFoto}/4)</span>
                  {FOTO.map((f, i) => (
                    <button key={f} onClick={() => setFoto(foto.map((v, j) => (j === i ? true : v)))} className={`${card} flex items-center gap-3 p-3 text-left`}>
                      <span className={`flex size-10 items-center justify-center rounded-xl ${foto[i] ? "bg-pj text-white" : "bg-mint"}`}>{foto[i] ? "✓" : "📷"}</span>
                      <span className="flex-1 text-sm font-semibold">{f}{i < 1 || i === 2 ? " *" : ""}</span><span className="text-[13px] font-semibold text-pj">{foto[i] ? "Ulang" : "Foto"}</span>
                    </button>
                  ))}
                </>
              )}
              {step === 4 && (
                <>
                  <button onClick={() => setScan(true)} className={`${card} flex items-center gap-3 p-3.5 text-left ${scan ? "border-2 border-pj" : ""}`}>
                    <span className={`flex size-11 items-center justify-center rounded-xl text-lg ${scan ? "bg-pj text-white" : "bg-mint"}`}>{scan ? "✓" : "⌖"}</span>
                    <span className="flex-1"><span className="block text-sm font-bold">{scan ? `QR ${t?.id} cocok · GPS di Pasar Johar Baru` : "Pindai QR #KiosID di kios"}</span><span className="block text-xs text-muted">{scan ? "-6.1846, 106.8571 · akurasi 8 m (simulasi)" : "Foto + lokasi diambil saat Anda berada di kios"}</span></span>
                  </button>
                  <span className="text-[13px] font-semibold text-ink-2">Kondisi kios saat ini</span>
                  <div className="flex gap-2"><button onClick={() => setBuka(true)} className={chip(buka)}>Buka, berdagang</button><button onClick={() => setBuka(false)} className={chip(!buka)}>Kosong</button></div>
                  {buka && (<>
                    <span className="text-[13px] font-semibold text-ink-2">Kelompok dagangan</span>
                    <div className="flex flex-wrap gap-1.5">{DAGANGAN.map((d) => <button key={d} onClick={() => setDag(d)} className={chip(dag === d)}>{d}</button>)}</div>
                    <span className="text-[13px] font-semibold text-ink-2">Siapa yang berdagang?</span>
                    <div className="flex gap-2"><button onClick={() => setKelola("sendiri")} className={chip(kelola === "sendiri")}>Saya sendiri</button><button onClick={() => setKelola("orang")} className={chip(kelola === "orang")}>Keluarga / penyewa</button></div>
                    {kelola === "orang" && (<>
                      <Field label="Nama Pengelola" id="pn"><input id="pn" value={pNama} onChange={(e) => setPNama(e.target.value)} className={input} /></Field>
                      <Field label="NIK Pengelola" id="pk" hint="Pengelola jadi Gold; e-SIPTU & tagihan BPP atas namanya, Anda penjamin. Lampirkan KK bila keluarga."><input id="pk" value={pNik} onChange={(e) => setPNik(e.target.value.replace(/\D/g, "").slice(0, 16))} inputMode="numeric" className={`${input} font-mono`} /></Field>
                    </>)}
                  </>)}
                </>
              )}
              {step === 5 && t && (
                <>
                  <div className={`${card} px-3.5 py-1`}>
                    {[["Kios", `${t.id} · ${t.jenis} ${t.luas} m²`], ["SHPTU kertas", shptu], ["Foto", `${nFoto} terlampir`], ["Lokasi", "QR & GPS cocok"], ["Kondisi", buka ? `Buka · ${dag}` : "Kosong (BPP ditanggung Anda)"], ["Pemakai (e-SIPTU)", kelola === "orang" && buka ? `${pNama} (Pengelola · Gold)` : p.nama]].map(([a, b], i, arr) => (
                      <div key={a} className={`flex justify-between gap-3 py-2.5 text-[13.5px] ${i < arr.length - 1 ? "border-b border-[#EFF0EA]" : ""}`}><span className="text-muted">{a}</span><b className="text-right">{b}</b></div>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-muted">Setelah dikirim: Kepala Pasar memverifikasi (target 3 hari kerja), lalu Direksi menandatangani elektronik. e-SHPTU dan e-SIPTU muncul di Dompet Dokumen.</p>
                  <PinInput value={pin} onChange={setPin} label="Konfirmasi dengan PIN PaJaKu" />
                </>
              )}
              {err && <div role="alert" className="text-[13px] text-[#7A2E24]">{err}</div>}
              <div className="mt-auto flex gap-2">
                {step > 1 && <button onClick={() => { setErr(""); setStep(step - 1); }} className="min-h-12 flex-1 rounded-[10px] border border-line-2 bg-white font-semibold">Kembali</button>}
                <button onClick={next} className={`${btn} flex-[2]`}>{step === 5 ? "Kirim ke kantor pasar" : "Lanjut"}</button>
              </div>
            </main>
          </>
        );
      }}
    </PedagangPage>
  );
}
