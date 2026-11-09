"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CCPage, Stage } from "@/components/cc-ui";
import { WallGub, WallWR1, WallWR2, WallWR3 } from "@/components/cc-wall";
import { WithQ } from "@/components/kit";
import type { StafCC } from "@/lib/cc";

const LAYAR: [string, string][] = [["gub", "Command Center DKI"], ["wr1", "War Room 1 · Bisnis"], ["wr2", "War Room 2 · Harga TPID"], ["wr3", "War Room 3 · Penegakan"]];

/** Gubernur hanya melihat layar Command Center DKI; Direksi & operator melihat keempatnya. */
const boleh = (st: StafCC) => (st.peran === "gubernur" ? LAYAR.slice(0, 1) : LAYAR);

export default function Wall() {
  return <WithQ>{(q) => <CCPage lebar>{({ staf }) => <Isi staf={staf} awal={q("l")} />}</CCPage>}</WithQ>;
}

function Isi({ staf, awal }: { staf: StafCC; awal: string }) {
  const router = useRouter();
  const daftar = boleh(staf);
  const l = daftar.some(([k]) => k === awal) ? awal : daftar[0][0];
  const [putar, setPutar] = useState(false);
  useEffect(() => {
    if (!putar || daftar.length < 2) return;
    const t = setInterval(() => { const i = daftar.findIndex(([k]) => k === l); router.replace(`/cc/wall/?l=${daftar[(i + 1) % daftar.length][0]}`); }, 20000);
    return () => clearInterval(t);
  }, [putar, l, daftar, router]);
  const layar = (
    <>
      {l === "gub" && <WallGub siapa={staf.nama} />}
      {l === "wr1" && <WallWR1 />}
      {l === "wr2" && <WallWR2 siapa={staf.nama} />}
      {l === "wr3" && <WallWR3 siapa={staf.nama} />}
    </>
  );
  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {daftar.map(([k, nm]) => <Link key={k} href={`/cc/wall/?l=${k}`} replace aria-current={k === l ? "page" : undefined} className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${k === l ? "bg-[#E6EDF2] text-[#0B1620]" : "border border-[#3A5060] text-[#C9D5DE]"}`}>{nm}</Link>)}
        {daftar.length > 1 && <button onClick={() => setPutar(!putar)} aria-pressed={putar} className={`ml-auto rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${putar ? "bg-[#F2A93B] text-[#0B1620]" : "border border-[#F2A93B] text-[#F2A93B]"}`}>{putar ? "Putar otomatis: aktif (20 dtk)" : "Putar otomatis"}</button>}
      </div>
      <div className="text-[11.5px] text-[#9FB1BF] landscape:hidden">Untuk tampilan terbaik, putar HP/tablet ke posisi mendatar atau hubungkan ke TV ruang Command Center.</div>
      <Stage>{layar}</Stage>
    </>
  );
}
