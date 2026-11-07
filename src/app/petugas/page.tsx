"use client";

import { useMemo, useState } from "react";
import { Guard, StafHeader, Tabs, card, Empty } from "@/components/ui";
import { useData, stafById, pedagangById, kirimPendataan } from "@/lib/store";
import { DAGANGAN, type Jenis, type TU } from "@/lib/model";

const NAMES = ["Cocokkan arsip", "Foto & lokasi", "Pemakai & NIK", "Jenis TU & dagangan", "Kirim"];
const JENIS: Jenis[] = ["Toko", "Kios", "Counter", "Lapak"];

function Pendataan({ t, petugas, selesai }: { t: TU; petugas: string; selesai: (terkirim?: boolean) => void }) {
  const s = useData();
  const pemilik = pedagangById(s, t.pemilikId)!, pemakai = pedagangById(s, t.pemakaiId)!;
  const [step, setStep] = useState(1);
  const [foto, setFoto] = useState<Record<string, boolean>>({});
  const [nama, setNama] = useState(pemakai.nama);
  const [nik, setNik] = useState(pemakai.nik);
  const [owner, setOwner] = useState(0);
  const [jenis, setJenis] = useState<Jenis>(t.jenis);
  const [dag, setDag] = useState(t.buka ? t.dagangan : DAGANGAN[0]);
  const [buka, setBuka] = useState(t.buka);
  const beda = nama.trim() !== pemakai.nama;
  const nFoto = Object.values(foto).filter(Boolean).length;
  const bisaLanjut = step !== 3 || (nik.replace(/\D/g, "").length === 16 && (!beda || owner === 2));
  const btn = (on: boolean) => (on ? "border border-pj bg-pj text-white" : "border border-line-2 bg-white text-ink");
  const box = "rounded-xl border border-line bg-white flex flex-col gap-2.5 p-3.5";

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex flex-col gap-2.5 bg-[#0F2A20] px-[18px] pt-[calc(18px+env(safe-area-inset-top))] pb-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <div><div className="text-xs text-[#9DB5A8]">Petugas Pendataan · {petugas}</div><div className="text-[17px] font-bold">Pendataan ulang TU</div></div>
          <button onClick={() => selesai()} className="rounded-lg bg-[#183A2D] px-3 py-2 text-xs font-semibold text-[#C9D8CF]">Batal</button>
        </div>
        <div className="grid grid-cols-5 gap-1">{NAMES.map((_, i) => <div key={i} className={`h-[5px] rounded ${i < step ? "bg-[#F2C27A]" : "bg-[#2B4D3F]"}`} />)}</div>
        <div className="text-[12.5px] text-[#C9D8CF]">Langkah {step} dari 5 · {NAMES[step - 1]}</div>
      </header>
      <main className="flex flex-1 flex-col gap-3 p-4">
        <div className={`${card} flex items-center justify-between gap-2 px-3.5 py-3`}><div><div className="font-mono text-[13px] font-medium">{t.id}</div><div className="text-[12.5px] text-muted">Pasar Johar Baru · Blok {t.blok}</div></div><span className="text-xs font-semibold text-[#2F6B4F]">QR fisik ✓</span></div>
        {t.catatan && <div className="rounded-[10px] bg-[#F7E3E0] px-3 py-2.5 text-[13px] text-[#7A2E24]">Dikembalikan Kepala Pasar: {t.catatan}</div>}
        {step === 1 && <div className={box}><div className="text-[15px] font-bold">Data dari arsip</div><div className="text-[13.5px] leading-[1.7]">Pemilik (SHPTU): <b>{pemilik.nama}</b><br />Pemakai (SIPTU): <b>{pemakai.nama}</b><br />Jenis TU: <b>{t.jenis}</b> · {t.ukuran}<br />Jenis dagangan: <b>{t.dagangan}</b><br />Masa hak: <b>{t.masaHak}</b></div><div className="text-[12.5px] text-muted">Cocokkan dengan kondisi di lapangan pada langkah berikutnya.</div></div>}
        {step === 2 && (
          <div className={box}>
            <div className="text-[15px] font-bold">Foto &amp; lokasi</div>
            {[["a", "Foto depan TU"], ["b", "Foto KTP pemakai"], ["c", "Foto dagangan"]].map(([k, l]) => (
              <label key={k} className={`flex min-h-[52px] cursor-pointer items-center justify-between rounded-[10px] px-3.5 ${foto[k] ? "border border-pj-soft bg-mint text-mint-ink" : "border border-line-2 bg-white"}`}>
                <span className="text-sm font-semibold">{l}</span><span className="text-[13px] font-semibold">{foto[k] ? "✓ Tersimpan" : "Ambil foto"}</span>
                <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => e.target.files?.[0] && setFoto({ ...foto, [k]: true })} />
              </label>
            ))}
            <div className="text-[12.5px] text-muted">GPS dicatat otomatis saat foto diambil.</div>
          </div>
        )}
        {step === 3 && (
          <div className={box}>
            <div className="text-[15px] font-bold">Siapa yang berdagang di TU ini?</div>
            <label className="flex flex-col gap-1 text-[13px] text-muted">Nama pemakai di lapangan<input value={nama} onChange={(e) => { setNama(e.target.value); setOwner(0); }} className="min-h-11 rounded-lg border border-line-2 px-3 text-[15px] text-ink" /></label>
            <label className="flex flex-col gap-1 text-[13px] text-muted">NIK (16 angka, dari KTP)<input value={nik} onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))} inputMode="numeric" className="min-h-11 rounded-lg border border-line-2 px-3 font-mono text-[15px] text-ink" /></label>
            {beda && (
              <>
                <div className="rounded-[10px] bg-[#FBEFD9] px-3 py-2.5 text-[13px] text-[#6E4A12]">Pemakai bukan nama di arsip. Pengelola (Gold) hanya tercatat di e-SIPTU setelah Pemilik <b>{pemilik.nama}</b> setuju.</div>
                <button onClick={() => setOwner(Math.min(2, owner + 1))} className={`min-h-[46px] rounded-lg text-sm font-semibold ${owner === 2 ? "border border-pj-soft bg-mint text-mint-ink" : owner === 1 ? "border border-[#EBCB93] bg-[#FBEFD9] text-[#6E4A12]" : "bg-pj text-white"}`}>
                  {["Kirim permintaan persetujuan ke Pemilik (OTP)", "Menunggu Pemilik… (ketuk: simulasi setuju)", `✓ Disetujui ${pemilik.nama}`][owner]}
                </button>
              </>
            )}
          </div>
        )}
        {step === 4 && (
          <div className={box}>
            <div className="text-[15px] font-bold">Jenis TU, dagangan &amp; status</div>
            <div className="text-[13px] text-muted">Jenis TU</div>
            <div className="grid grid-cols-4 gap-1.5">{JENIS.map((j) => <button key={j} aria-pressed={jenis === j} onClick={() => setJenis(j)} className={`min-h-11 rounded-lg text-[13px] font-semibold ${btn(jenis === j)}`}>{j}</button>)}</div>
            <div className="text-[13px] text-muted">Status hari ini</div>
            <div className="grid grid-cols-2 gap-1.5">{[[true, "Buka"], [false, "Tutup / kosong"]].map(([v, l]) => <button key={String(v)} aria-pressed={buka === v} onClick={() => setBuka(v as boolean)} className={`min-h-11 rounded-lg text-[13px] font-semibold ${btn(buka === v)}`}>{l as string}</button>)}</div>
            {buka && <><div className="text-[13px] text-muted">Kelompok dagangan</div><div className="grid grid-cols-2 gap-1.5">{DAGANGAN.map((g) => <button key={g} aria-pressed={dag === g} onClick={() => setDag(g)} className={`min-h-11 rounded-lg text-[13px] font-semibold ${btn(dag === g)}`}>{g}</button>)}</div></>}
          </div>
        )}
        {step === 5 && (
          <div className={box}>
            <div className="text-[15px] font-bold">Ringkasan</div>
            <div className="text-[13.5px] leading-[1.7]">Pemilik: <b>{pemilik.nama}</b><br />Pemakai: <b>{nama}</b>{beda ? " (Pengelola · disetujui Pemilik)" : ""}<br />Jenis TU: <b>{jenis}</b> · {buka ? <>Dagangan: <b>{dag}</b></> : <b>TU kosong</b>}<br />Foto: <b>{nFoto}/3</b></div>
            {nFoto < 3 && <div className="text-[12.5px] text-[#9A5B0E]">Foto belum lengkap; Kepala Pasar bisa mengembalikan data ini.</div>}
          </div>
        )}
      </main>
      <footer className="sticky bottom-0 flex gap-2 border-t border-line bg-white px-4 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))]">
        <button onClick={() => (step > 1 ? setStep(step - 1) : selesai())} className="min-h-12 flex-1 rounded-lg border border-line-2 bg-white text-sm font-semibold">‹ Kembali</button>
        <button disabled={!bisaLanjut} onClick={() => {
          if (step < 5) return setStep(step + 1);
          kirimPendataan(t.id, { pemakaiNama: nama.trim(), pemakaiNik: nik, jenis, dagangan: buka ? dag : "—", buka, foto: nFoto, ownerOk: !beda || owner === 2, petugas });
          selesai(true);
        }} className="min-h-12 flex-[2] rounded-lg text-sm font-semibold enabled:bg-pj enabled:text-white disabled:bg-line disabled:text-[#6B7670]">{step < 5 ? "Lanjut ›" : "Kirim untuk validasi"}</button>
      </footer>
    </div>
  );
}

function Petugas() {
  const s = useData();
  const me = stafById(s.sesi!.userId)!;
  const [tab, setTab] = useState<"antrean" | "terkirim">("antrean");
  const [q, setQ] = useState("");
  const [aktif, setAktif] = useState<string | null>(null);
  const [info, setInfo] = useState("");
  const antre = useMemo(() => s.tu.filter((t) => t.status === "arsip" || t.status === "dikembalikan").sort((a, b) => (a.status === "dikembalikan" ? -1 : 0) - (b.status === "dikembalikan" ? -1 : 0) || (a.id === "JHB-B-L2-045" ? -1 : 0) - (b.id === "JHB-B-L2-045" ? -1 : 0)), [s.tu]);
  const terkirim = s.log.filter((l) => l.siapa === me.nama && l.tuId);
  const t = aktif ? s.tu.find((x) => x.id === aktif) : null;
  if (t) return <Pendataan t={t} petugas={me.nama} selesai={(ok) => { setAktif(null); setInfo(ok ? `✓ ${t.id} terkirim ke antrean validasi Kepala Pasar` : ""); }} />;
  const list = antre.filter((x) => !q || (x.id + " " + pedagangById(s, x.pemilikId)?.nama).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="flex min-h-dvh flex-col">
      <StafHeader jabatan={`L5 · ${me.jabatan} · ${me.nama}`} judul="Pendataan ulang TU">
        <Tabs dark value={tab} onChange={setTab} items={[["antrean", `Belum didata · ${antre.length}`], ["terkirim", `Terkirim · ${terkirim.length}`]]} />
      </StafHeader>
      <main className="flex flex-1 flex-col gap-2 p-4">
        {info && <div className="rounded-[10px] bg-mint px-3 py-2.5 text-[13px] font-semibold text-mint-ink">{info}</div>}
        {tab === "antrean" ? (
          <>
            <label className="sr-only" htmlFor="cari">Cari TU</label>
            <input id="cari" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nomor TU atau nama pemilik" className="min-h-11 rounded-lg border border-line-2 bg-white px-3 text-sm" />
            {list.slice(0, 40).map((x) => (
              <button key={x.id} onClick={() => setAktif(x.id)} className={`${card} flex items-center justify-between gap-2 px-3.5 py-3 text-left`}>
                <span className="min-w-0"><span className="block font-mono text-[13px] font-medium">{x.id} · {x.jenis}</span><span className="block truncate text-[12.5px] text-muted">{pedagangById(s, x.pemilikId)?.nama} · {x.dagangan}</span></span>
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${x.status === "dikembalikan" ? "bg-[#F7E3E0] text-[#7A2E24]" : "bg-[#ECEDE7] text-[#4B5650]"}`}>{x.status === "dikembalikan" ? "Dikembalikan" : "Data ›"}</span>
              </button>
            ))}
            {list.length > 40 && <div className="text-center text-xs text-muted">+{list.length - 40} TU lain · gunakan pencarian</div>}
            {list.length === 0 && <Empty>Tidak ada TU yang perlu didata.</Empty>}
          </>
        ) : terkirim.length ? terkirim.map((l, i) => <div key={i} className={`${card} px-3.5 py-2.5 text-[13px]`}><b className="font-mono">{l.tuId}</b> · {l.apa}<div className="text-xs text-muted">{l.t}</div></div>) : <Empty>Belum ada pendataan yang dikirim dari akun ini.</Empty>}
      </main>
    </div>
  );
}

export default function Page() {
  return <Guard peran="petugas"><Petugas /></Guard>;
}
