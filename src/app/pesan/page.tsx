"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PedagangPage } from "@/components/pedagang";
import { BackHeader, Empty, card } from "@/components/ui";
import { bacaNotif, notifOf } from "@/lib/store";

export default function Pesan() {
  return (
    <PedagangPage>
      {({ s, p }) => <List items={notifOf(s, p.id)} pid={p.id} />}
    </PedagangPage>
  );
}

function List({ items, pid }: { items: ReturnType<typeof notifOf>; pid: string }) {
  const belum = items.some((n) => !n.baca);
  useEffect(() => { if (belum) { const t = setTimeout(() => bacaNotif(pid), 1500); return () => clearTimeout(t); } }, [belum, pid]);
  return (
    <>
      <BackHeader href="/beranda/" title="Pesan & notifikasi" sub={`${items.filter((n) => !n.baca).length} belum dibaca`} />
      <main className="flex flex-1 flex-col gap-2 px-4 pb-4">
        {items.length === 0 && <Empty>Belum ada pesan.</Empty>}
        {items.map((n) => {
          const body = <><div className="flex items-start justify-between gap-2"><span className="text-sm font-bold">{!n.baca && <span className="mr-1.5 inline-block size-2 rounded-full bg-[#F2A541]" />}{n.judul}</span><span className="shrink-0 text-[11px] text-muted">{n.t}</span></div><div className="mt-0.5 text-[13px] text-ink-2">{n.isi}</div></>;
          return n.href ? <Link key={n.id} href={n.href} className={`${card} p-3.5`}>{body}</Link> : <div key={n.id} className={`${card} p-3.5`}>{body}</div>;
        })}
      </main>
    </>
  );
}
