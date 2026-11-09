// Data Command Center TPID DKI & War Room Direksi Perumda Pasar Jaya — dari canvas "Display Command Center TPID Provinsi".
// SEMUA DATA CONTOH (dummy). Struktur Direksi mengikuti SK Direksi 172/2022 (5 direktur).

export type Lv = "r" | "a" | "g" | "t";
export const WARNA: Record<Lv | "n", string> = { r: "#F07A63", a: "#F2C14E", g: "#63C79A", t: "#2BB3A3", n: "#E6EDF2" };
export const TANGGAL = "Sabtu, 24 Oktober 2026";

// ---------- EIS HP 5 Direktur ----------
export type Keputusan = { id: string; title: string; why: string; impact: string; due: string; lvl: Lv; to: string };
export type Direktorat = { kode: Dir; role: string; scope: string; alert: string; kpis: [string, string, string, Lv][]; barTitle: string; barNote: string; bars: [string, string, number, Lv][]; decs: Keputusan[]; warns: [string, string, Lv][]; warnNote: string };
export type Dir = "dirut" | "keuangan" | "properti" | "perkulakan" | "adum";

export const DIREKSI: Direktorat[] = [
  { kode: "dirut", role: "Direktur Utama", scope: "Kinerja korporasi, KPI BUMD, penugasan Pemprov", alert: "Pendapatan YTD 86% dari target RKAP s.d. Oktober. Kolektibilitas BPP 77% menarik ke bawah; harga cabai rawit naik di 55 dari 156 pasar.",
    kpis: [["Pendapatan YTD", "Rp612 M", "86% target RKAP s.d. Okt", "a"], ["Laba usaha YTD", "Rp48,3 M", "91% target", "g"], ["Okupansi TU", "84,1%", "target 86%", "a"], ["Skor KPI BUMD", "82,4", "proyeksi kategori Baik", "t"]],
    barTitle: "Capaian RKAP per direktorat (YTD)", barNote: "Persen capaian target s.d. Oktober.",
    bars: [["Properti dan Perpasaran", "83%", 83, "a"], ["Perkulakan dan Retail", "94%", 94, "g"], ["Keuangan (kolektibilitas)", "77%", 77, "r"], ["Administrasi dan Umum", "88%", 88, "g"], ["Penugasan TPID", "96%", 96, "g"]],
    decs: [
      { id: "d1", title: "Tunda sanksi BPP di Serdang dan Pramuka", why: "Usulan Dir. Properti: dialog dan restrukturisasi lebih dulu. Risiko sosial tinggi pasca kebakaran dan riwayat protes.", impact: "Hindari eskalasi ke DPRD dan Ombudsman", due: "Hari ini", lvl: "r", to: "Dir. Properti" },
      { id: "d2", title: "Laporan TPID mingguan ke Gubernur", why: "Cabai rawit +9,2% di Jakut. Draf memuat usulan operasi pasar 15 ton bersama Food Station.", impact: "Rakor TPID Senin 26 Okt", due: "Besok", lvl: "a", to: "Dir. Perkulakan" },
      { id: "d3", title: "Persetujuan prinsip KSO revitalisasi Kramat Jaya", why: "Hasil beauty contest mitra selesai. Perlu persetujuan prinsip sebelum diajukan ke Badan Pengawas.", impact: "Investasi mitra Rp186 M", due: "7 hari", lvl: "t", to: "Dir. Properti" },
    ],
    warns: [["Piutang macet naik 6% bulan ini", "Rp171,4 M di status 5; 1.730 TU", "r"], ["Isu media: keluhan pedagang TPS Muara Karang", "3 berita daring, 1 audiensi DPRD dijadwalkan", "r"], ["Serah terima Senen Blok 6 molor", "96 pedagang belum dapat unit", "a"], ["Migrasi e-SHPTU 68% signed in", "target 80% akhir Desember", "a"], ["Temuan audit SPI ditindaklanjuti 74%", "batas waktu 30 November", "t"]],
    warnNote: "Ambang peringatan mengikuti KPI BUMD dan RKAP; perlu disesuaikan dengan kontrak manajemen Direksi." },
  { kode: "keuangan", role: "Direktur Keuangan", scope: "Kas, piutang, anggaran, pajak, pengadaan", alert: "Penerimaan BPP Oktober baru 72% dari target dengan 7 hari tersisa. Proyeksi kas akhir bulan Rp96 M, di atas batas minimum Rp75 M.",
    kpis: [["Saldo kas", "Rp118 M", "proyeksi akhir Okt Rp96 M", "g"], ["Piutang BPP", "Rp258,1 M", ">12 bln Rp171,4 M", "r"], ["Serapan capex", "41%", "dari Rp312 M RKAP", "a"], ["Bayar digital", "71%", "naik 4 poin dari Sep", "t"]],
    barTitle: "Pendapatan YTD per sumber", barNote: "Persen capaian terhadap target RKAP s.d. Oktober.",
    bars: [["BPP pengelolaan", "77%", 77, "r"], ["HPTU (hak pakai)", "92%", 92, "g"], ["Sewa dan KSO", "88%", 88, "g"], ["Perkulakan dan ritel", "94%", 94, "g"], ["Parkir dan lainnya", "81%", 81, "a"]],
    decs: [
      { id: "k1", title: "Program cicilan 1.240 TU status 3–4", why: "Cicilan 6 bulan dan pembebasan denda bila lunas tepat waktu. Arus kas bergeser, tetapi tertagih naik.", impact: "Proyeksi tertagih Rp9,4 M dalam 6 bulan", due: "Hari ini", lvl: "a", to: "Kadiv Keuangan" },
      { id: "k2", title: "Usulan penghapusbukuan piutang Rp12,8 M", why: "TU tanpa SIPTU aktif, macet lebih dari 5 tahun, pemilik tidak ditemukan. Perlu kajian hukum dan persetujuan Badan Pengawas.", impact: "Rasio piutang bersih membaik 5%", due: "14 hari", lvl: "t", to: "Biro Hukum" },
      { id: "k3", title: "Pembayaran termin 2 mitra IT PaJaKu", why: "Migrasi tahap 1A: 68% TU signed in, sisanya dibayar 175 ribu per TU sesuai kontrak.", impact: "Rp21,4 M sesuai BAST", due: "5 hari", lvl: "a", to: "Kadiv Pengadaan" },
    ],
    warns: [["Penerimaan BPP Oktober di bawah tren", "Rp5,2 M dari Rp7,4 M target", "r"], ["Laporan keuangan Q3 belum final", "batas penyampaian ke BP BUMD 31 Okt", "a"], ["3 paket pengadaan terlambat", "nilai Rp14,6 M; capex rendah", "a"], ["SPT Masa PPN Oktober", "jatuh tempo 30 November", "t"], ["Deposito Rp40 M jatuh tempo", "28 Okt; usul perpanjangan", "t"]],
    warnNote: "Batas kas minimum dan ambang piutang adalah contoh; sesuaikan dengan kebijakan keuangan Pasar Jaya." },
  { kode: "properti", role: "Direktur Properti dan Perpasaran", scope: "Okupansi, operasional 156 pasar, BPP, revitalisasi", alert: "54 TU melewati tenggat SP 3 dan menunggu keputusan penutupan sementara. Muara Karang: keluhan banjir rob di TPS, omzet pedagang turun 30%.",
    kpis: [["Okupansi", "84,1%", "2.840 kios tutup", "a"], ["TU macet", "1.730", "naik 6% bulan ini", "r"], ["Tiket CRM terbuka", "412", "38 melewati SLA", "a"], ["Pedagang di TPS", "1.406", "4 pasar revitalisasi", "a"]],
    barTitle: "Okupansi per wilayah", barNote: "Kios aktif dibanding total TU.",
    bars: [["Jakarta Pusat", "88,7%", 88.7, "g"], ["Jakarta Selatan", "86,2%", 86.2, "g"], ["Jakarta Timur", "86,0%", 86, "g"], ["Jakarta Barat", "84,5%", 84.5, "a"], ["Jakarta Utara", "84,1%", 84.1, "a"]],
    decs: [
      { id: "p1", title: "Penutupan sementara 54 TU (SP 3 lewat)", why: "Tidak merespons SP 3, kios tutup lebih dari 6 bulan, bukan pasar revitalisasi. Dasar Perda 7/2018 Pasal 20 huruf b.", impact: "Tunggakan terkait Rp6,1 M", due: "Hari ini", lvl: "r", to: "Kadiv Operasional Pasar" },
      { id: "p2", title: "Pembatalan 31 TU dan pemasaran ulang", why: "Macet lebih dari 24 bulan, sudah melewati penutupan sementara. Kios ditawarkan ke anggota Blue lewat JaKios.", impact: "Potensi HPTU baru Rp4,8 M", due: "7 hari", lvl: "a", to: "Divisi Kerjasama Bisnis" },
      { id: "p3", title: "Relokasi sebagian TPS Muara Karang", why: "Pindahkan 120 lapak ke titik yang tidak tergenang rob. Biaya ditanggung mitra sesuai perjanjian.", impact: "Turunkan keluhan dan risiko DPRD", due: "3 hari", lvl: "a", to: "Divisi Perencanaan" },
    ],
    warns: [["38 tiket CRM melewati SLA", "terbanyak atap bocor dan listrik", "r"], ["Senen Blok 6: 96 pedagang belum dapat unit", "target serah terima November", "a"], ["Blok A Fatmawati: 22 bulan di penampungan", "perizinan belum terbit", "r"], ["Input harga TPID 149 dari 156 pasar", "7 pasar belum lapor pukul 10.00", "a"], ["Kramat Jaya: kios kosong 31%", "skema pedagang baru sedang dikaji", "t"]],
    warnNote: "Detail ada di War Room layar 1 dan 3." },
  { kode: "perkulakan", role: "Direktur Perkulakan dan Retail", scope: "Fungsi komersial: grosir, ritel, distribusi, pangan bersubsidi", alert: "Stok cabai rawit gerai grosir tinggal 2,1 hari. Usulan operasi pasar 15 ton di Jakut dan Jaktim butuh pasokan tambahan dari Food Station dan KAD.",
    kpis: [["Penjualan YTD", "Rp284 M", "94% target RKAP", "g"], ["Margin kotor", "8,6%", "target 9,0%", "a"], ["Hari stok beras", "18 hari", "aman di atas 14 hari", "g"], ["Pangan bersubsidi", "97%", "kuota Oktober tersalur", "g"]],
    barTitle: "Hari stok komoditas TPID", barNote: "Batas aman 7 hari untuk komoditas segar, 14 hari untuk beras dan minyak.",
    bars: [["Beras", "18 hari", 90, "g"], ["Minyak goreng", "16 hari", 80, "g"], ["Gula pasir", "12 hari", 60, "a"], ["Bawang merah", "5 hari", 35, "a"], ["Cabai rawit", "2,1 hari", 15, "r"]],
    decs: [
      { id: "c1", title: "Operasi pasar cabai rawit 15 ton", why: "Lewat gerai grosir dan 412 pedagang cabai terdaftar di Jakut dan Jaktim, 2 minggu.", impact: "Tekan harga 8–12% di pasar sasaran", due: "Hari ini", lvl: "r", to: "Divisi Operasional Perkulakan" },
      { id: "c2", title: "Kontrak KAD cabai 20 ton per minggu", why: "Kerja sama antar daerah dengan sentra Magelang–Temanggung untuk 3 bulan.", impact: "Pasokan stabil sampai Nataru", due: "3 hari", lvl: "a", to: "Divisi Merchandising" },
      { id: "c3", title: "Promo minyak goreng di 24 gerai", why: "Stok berlebih 16 hari, mendekati batas simpan. Harga promo tetap di atas HPP.", impact: "Perputaran stok naik, margin turun 0,2%", due: "7 hari", lvl: "t", to: "Divisi Marketing" },
    ],
    warns: [["Cabai rawit di bawah batas aman", "2,1 hari stok; pasokan Kramat Jati turun 27%", "r"], ["Bawang merah mendekati batas", "5 hari stok", "a"], ["Selisih stok gerai Cempaka Putih", "Rp186 juta; audit stok dijadwalkan", "a"], ["Kuota pangan bersubsidi November", "alokasi Pemprov belum turun", "t"], ["Mini DC Pulogadung kapasitas 92%", "perlu tambahan gudang sebelum Nataru", "a"]],
    warnNote: "Pasar Jaya tidak punya Direktur Komersial; fungsi komersial ada di direktorat ini. Realisasi operasi pasar tercatat di KulakanPaja (menu Penugasan TPID)." },
  { kode: "adum", role: "Direktur Administrasi dan Umum", scope: "TI dan PaJaKu, aset, SDM, kepatuhan data", alert: "Migrasi e-SHPTU dan e-SIPTU: 68% TU signed in. Tim pendamping lapangan perlu ditambah di Jakbar dan Jakut untuk kejar target 80%.",
    kpis: [["TU signed in PaJaKu", "68%", "72.900 dari 107.200", "a"], ["Uptime layanan", "99,7%", "30 hari terakhir", "g"], ["Sertifikat lahan", "138/156", "18 pasar dalam proses", "a"], ["Kesiapan UU PDP", "74%", "wajib 16 Jan 2027", "a"]],
    barTitle: "Migrasi PaJaKu per wilayah (signed in)", barNote: "Target 80% pada 31 Desember 2026.",
    bars: [["Jakarta Pusat", "78%", 78, "g"], ["Jakarta Selatan", "73%", 73, "a"], ["Jakarta Timur", "67%", 67, "a"], ["Jakarta Utara", "61%", 61, "r"], ["Jakarta Barat", "59%", 59, "r"]],
    decs: [
      { id: "a1", title: "Tambah 40 pendamping lapangan migrasi", why: "Jakbar dan Jakut tertinggal. Biaya pendampingan sudah termasuk dalam harga per TU dari PATROL.", impact: "Proyeksi signed in 80% pada Desember", due: "Hari ini", lvl: "a", to: "Divisi TI" },
      { id: "a2", title: "Go-live modul notifikasi BPP otomatis", why: "Pengingat WA status 2 dan tanda LUNAS otomatis. Uji coba di 12 pasar lulus.", impact: "Turunkan beban juru tagih 20%", due: "5 hari", lvl: "t", to: "Divisi TI" },
      { id: "a3", title: "Penunjukan Pejabat Pelindungan Data", why: "Persyaratan UU PDP sebelum 16 Januari 2027, termasuk DPIA untuk data pedagang.", impact: "Kepatuhan regulasi", due: "14 hari", lvl: "a", to: "Sekretaris Perusahaan" },
    ],
    warns: [["Jakbar migrasi 59%", "di bawah jalur target", "r"], ["18 sertifikat lahan pasar belum terbit", "koordinasi BPN dan BPAD", "a"], ["Pemutakhiran data tenant 92%", "8% tanpa NIK valid", "a"], ["Rekrutmen 120 juru tagih/AO", "76% terisi", "t"], ["Uji penetrasi PaJaKu", "dijadwalkan 4 November", "t"]],
    warnNote: "Divisi TI dan Divisi Administrasi dan Pengelolaan Aset ada di bawah direktorat ini." },
];
export const dirBy = (k: string) => DIREKSI.find((d) => d.kode === k) ?? DIREKSI[0];

// ---------- Gubernur DKI ----------
export const KOM_GUB = ["Cabai rawit", "Cabai merah", "Bawang merah", "Beras medium", "Telur ayam", "Daging ayam"] as const;
export type KomGub = (typeof KOM_GUB)[number];
/** [kota, jumlah pasar, kolom grid, baris grid, {komoditas: [% 7 hari, pasar merah]}] */
export const KOTA: [string, number, string, string, Record<KomGub, [number, number]>][] = [
  ["Jakarta Utara", 24, "1 / 4", "1", { "Cabai rawit": [9.2, 14], "Cabai merah": [5.8, 8], "Bawang merah": [3.1, 3], "Beras medium": [0.9, 0], "Telur ayam": [2.4, 2], "Daging ayam": [1.6, 1] }],
  ["Jakarta Barat", 33, "1", "2", { "Cabai rawit": [5.1, 9], "Cabai merah": [4.2, 6], "Bawang merah": [2.6, 2], "Beras medium": [0.6, 0], "Telur ayam": [1.4, 1], "Daging ayam": [1.1, 0] }],
  ["Jakarta Pusat", 28, "2", "2", { "Cabai rawit": [6.8, 11], "Cabai merah": [5.3, 7], "Bawang merah": [4.4, 5], "Beras medium": [0.7, 0], "Telur ayam": [1.9, 1], "Daging ayam": [2.2, 2] }],
  ["Jakarta Timur", 35, "3", "2 / 4", { "Cabai rawit": [7.6, 15], "Cabai merah": [6.1, 10], "Bawang merah": [3.6, 4], "Beras medium": [1.2, 1], "Telur ayam": [2.8, 3], "Daging ayam": [1.4, 1] }],
  ["Jakarta Selatan", 36, "1 / 3", "3", { "Cabai rawit": [4.3, 6], "Cabai merah": [3.9, 4], "Bawang merah": [2.1, 1], "Beras medium": [0.5, 0], "Telur ayam": [1.2, 0], "Daging ayam": [0.9, 0] }],
];
/** [pasar, pengali kenaikan, pedagang komoditas, aktif hari ini] */
export const PASAR_KOTA: Record<string, [string, number, number, number][]> = {
  "Jakarta Utara": [["Pasar Koja Baru", 1.35, 42, 37], ["Pasar Muara Karang", 1.2, 31, 28], ["Pasar Kramat Jaya", 1.15, 36, 30], ["Pasar Pademangan", 1.05, 22, 21], ["Pasar Rawa Badak", 0.95, 27, 25], ["Pasar Sunter Podomoro", 0.8, 19, 19]],
  "Jakarta Barat": [["Pasar Cengkareng", 1.25, 48, 44], ["Pasar Grogol", 1.1, 33, 31], ["Pasar Palmerah", 1.0, 29, 27], ["Pasar Glodok", 0.85, 12, 12], ["Pasar Kalideres", 0.9, 30, 28], ["Pasar Kebon Jeruk", 0.7, 25, 25]],
  "Jakarta Pusat": [["Pasar Senen", 1.3, 55, 47], ["Pasar Johar Baru", 1.2, 26, 23], ["Pasar Gondangdia", 1.0, 14, 14], ["Pasar Tanah Abang", 0.6, 9, 9], ["Pasar Kenari", 0.9, 18, 17], ["Pasar Serdang", 1.1, 21, 19]],
  "Jakarta Timur": [["Pasar Induk Kramat Jati", 1.4, 186, 151], ["Pasar Jatinegara", 1.25, 64, 56], ["Pasar Pramuka", 0.7, 11, 11], ["Pasar Rawamangun", 1.1, 38, 34], ["Pasar Klender", 1.05, 41, 37], ["Pasar Ciracas", 0.9, 33, 31]],
  "Jakarta Selatan": [["Pasar Minggu", 1.3, 71, 64], ["Pasar Kebayoran Lama", 1.2, 58, 52], ["Pasar Mayestik", 0.8, 24, 24], ["Pasar Rumput", 1.0, 29, 27], ["Pasar Tebet Barat", 0.9, 22, 21], ["Pasar Jagakarsa", 1.1, 35, 32]],
};
export const PENYEBAB: Record<string, string> = {
  "Jakarta Timur": "Pasokan cabai rawit ke Pasar Induk Kramat Jati turun 27% karena hujan di sentra Jabar dan Jateng; 19% pedagang cabai terdaftar di pasar induk tidak berjualan. Kenaikan menjalar ke pasar eceran Jakarta Timur dan Utara dalam 2–3 hari.",
  "Jakarta Utara": "Pasar di Jakarta Utara mengambil pasokan dari Kramat Jati; harga naik 2–3 hari setelah pasar induk. Biaya angkut naik karena banjir rob di jalur Koja–Pademangan.",
  "Jakarta Pusat": "Kenaikan mengikuti pasar induk; Pasar Senen mencatat penurunan pedagang cabai aktif 15%. Permintaan katering jelang akhir tahun mulai naik.",
  "Jakarta Barat": "Kenaikan lebih rendah karena sebagian pasokan masuk lewat Tangerang. Pantau Cengkareng: pedagang aktif turun 8%.",
  "Jakarta Selatan": "Kenaikan paling rendah; pasar Selatan dipasok sebagian dari Depok dan Bogor. Belum perlu intervensi, cukup pemantauan.",
};
/** Keputusan Gubernur. `terkait` = keputusan Direksi Pasar Jaya yang ikut bergerak (sinkron). */
export const KEP_GUB = [
  { id: "op", title: "Operasi pasar cabai rawit 15 ton lewat Food Station", detail: "14 pasar merah di Jakarta Utara dan Timur · disalurkan lewat 412 pedagang cabai terdaftar PaJaKu", sim: "Simulasi: menahan kenaikan 5–8 poin", terkait: "c1" },
  { id: "kad", title: "Kerja sama antardaerah cabai 20 ton/minggu", detail: "Pemasok Kab. Magelang dan Temanggung (Jateng) → Pasar Induk Kramat Jati · 4 minggu", sim: "Simulasi: pasokan kembali 90% normal", terkait: "c2" },
  { id: "gpm", title: "Gerakan pangan murah 10 pasar akhir pekan", detail: "Koja Baru, Senen, Jatinegara, Klender, Cengkareng dan 5 pasar lain · bersama Dharma Jaya dan Food Station", sim: "Anggaran Rp650 jt · BTT provinsi", terkait: "" },
];
export const PASOKAN: [string, number, number][] = [["Cabai rawit · PI Kramat Jati", 38, 52], ["Cabai merah · PI Kramat Jati", 61, 70], ["Bawang merah · PI Kramat Jati", 95, 102], ["Telur ayam · pasar induk", 118, 120], ["Beras · PIBC", 3150, 3000]];
export const RISIKO: [string, string, string, string][] = [["Cabai rawit", "Jakarta Timur", "+12–19%", "pasokan pasar induk"], ["Cabai rawit", "Jakarta Utara", "+11–17%", "menjalar dari induk"], ["Cabai merah", "Jakarta Pusat", "+8–12%", "permintaan Nataru"], ["Bawang merah", "Jakarta Pusat", "+6–9%", "pasokan Brebes"], ["Telur ayam", "Jakarta Timur", "+4–6%", "harga pakan"]];

// ---------- War Room layar 1 ----------
export type Wil = { tu: number; aktif: number; kosong: number; tutup: number; pasar: number; t: number; r: number; tiers: number[]; ews: number[] };
export const WIL: Record<string, Wil> = {
  "Jakarta Pusat": { tu: 20120, aktif: 17840, kosong: 1810, tutup: 470, pasar: 28, t: 9.6, r: 7.4, tiers: [7120, 3980, 6740, 2210], ews: [13620, 2410, 980, 520, 310] },
  "Jakarta Utara": { tu: 18950, aktif: 15930, kosong: 2410, tutup: 610, pasar: 24, t: 7.9, r: 5.2, tiers: [6010, 3720, 6200, 1960], ews: [11840, 2290, 1050, 470, 280] },
  "Jakarta Barat": { tu: 22410, aktif: 19870, kosong: 2040, tutup: 500, pasar: 33, t: 9.2, r: 6.9, tiers: [7940, 4370, 7560, 2480], ews: [15260, 2680, 1110, 520, 300] },
  "Jakarta Selatan": { tu: 24060, aktif: 21590, kosong: 1940, tutup: 530, pasar: 36, t: 9.8, r: 7.8, tiers: [8730, 4610, 8250, 2690], ews: [17390, 2470, 950, 470, 310] },
  "Jakarta Timur": { tu: 25300, aktif: 21770, kosong: 2800, tutup: 730, pasar: 35, t: 9.7, r: 6.6, tiers: [8200, 4320, 9250, 2660], ews: [15820, 3140, 1490, 790, 530] },
};
export const CRM_WR: [string, number, number][] = [["Atap bocor & drainase", 486, 78], ["Listrik & penerangan", 402, 88], ["Kebersihan & sampah", 371, 91], ["Keamanan", 214, 94], ["Administrasi SIPTU/BPP", 529, 83]];
export const REVIT_WR: [string, string, number, string][] = [["Pasar Pramuka", "Pemasaran", 62, "401 hak pedagang lama · 219 unit dijual · terjual 136 (MitraPaja)"], ["Pasar Muara Karang", "Konstruksi", 45, "progres fisik 45% · relokasi sementara berjalan"], ["Pasar Kramat Jaya", "Perencanaan", 15, "pendataan ulang pedagang 88%"], ["Pasar Serdang", "Serah terima", 92, "e-SHPTU baru terbit 512 dari 556"]];

// ---------- War Room layar 2: harga TPID ----------
/** [komoditas, hari ini, % vs kemarin, Info Pangan Jakarta, terendah, tertinggi] */
export const HARGA_TPID: [string, number, number, number, number, number][] = [
  ["Beras medium", 13800, 0.0, 13750, 13100, 14600], ["Beras premium", 15600, 0.1, 15500, 14800, 16500], ["Cabai merah", 51200, 2.4, 50800, 44000, 60000], ["Cabai rawit", 66400, 3.1, 65900, 56000, 78000],
  ["Bawang merah", 43900, 1.2, 43500, 38000, 50000], ["Bawang putih", 39500, 0.0, 39800, 36000, 43000], ["Daging ayam", 38900, 0.3, 38600, 35000, 42000], ["Telur ayam", 30100, 0.6, 29900, 28000, 32500],
  ["Daging sapi", 138000, 0.0, 137500, 128000, 150000], ["Minyakita (l)", 17900, 0.0, 17800, 17000, 19000], ["Gula pasir", 18300, 0.0, 18200, 17500, 19500], ["Tepung terigu", 12300, 0.0, 12200, 11500, 13000],
  ["Kedelai", 11500, 0.2, 11400, 10800, 12500], ["Ikan kembung", 41000, 0.8, 40500, 36000, 46000],
];
export const ALUR_TPID: [string, string, string, string, "done" | "now" | "next"][] = [["1", "07.00–10.00", "Input di HP (Konsol)", "Juru tagih/AO: 14 komoditas, 3 responden, foto", "done"], ["2", "10.00", "Validasi otomatis", "Bandingkan dengan median pasar sekitar", "done"], ["3", "10.00–10.20", "Verifikasi kepala pasar", "Konfirmasi entri yang ditandai", "now"], ["4", "10.30", "Kirim data", "War Room, Command Center Gubernur, Info Pangan Jakarta", "next"], ["5", "13.00", "Laporan harian Direksi", "Ringkasan harga dan pasokan", "next"]];
export const KOTA_F: [string, number, number, number][] = [["Jakarta Utara", 1.05, 0.9, 1.0], ["Jakarta Timur", 1.03, 0.85, 1.0], ["Jakarta Pusat", 1.01, 0.8, 0.95], ["Jakarta Barat", 0.98, 0.75, 0.9], ["Jakarta Selatan", 0.96, 0.7, 0.85]];
export const PATUH: [string, number, number, number, number][] = [["Jakarta Pusat", 26, 1, 1, 28], ["Jakarta Utara", 20, 2, 2, 24], ["Jakarta Barat", 31, 1, 1, 33], ["Jakarta Selatan", 34, 1, 1, 36], ["Jakarta Timur", 30, 3, 2, 35]];
export const BELUM_LAPOR: [string, string, string][] = [["Pasar Pademangan", "Jakut", "AO-JU-07"], ["Pasar Rawa Badak", "Jakut", "AO-JU-12"], ["Pasar Kenari", "Jakpus", "AO-JP-04"], ["Pasar Kalideres", "Jakbar", "AO-JB-19"], ["Pasar Jagakarsa", "Jaksel", "AO-JS-22"], ["Pasar Ciracas", "Jaktim", "AO-JT-15"], ["Pasar Klender", "Jaktim", "AO-JT-09"]];
export const ANOMALI: [string, string, string, string, string][] = [["f1", "Cabai rawit", "Pasar Koja Baru", "AO-JU-03", "Rp95.000 vs median sekitar Rp68.000 (+40%); foto timbangan terlampir"], ["f2", "Telur ayam", "Pasar Glodok", "AO-JB-02", "Rp21.000 vs median Rp30.000 (−30%); kemungkinan salah satuan (per 10 butir)"], ["f3", "Bawang merah", "Pasar Senen", "AO-JP-01", "Rp58.000 vs median Rp44.000 (+32%); 2 dari 3 responden sama"]];

// ---------- War Room layar 3: penegakan BPP & revitalisasi ----------
export const KIOS_TUTUP: [string, number, number, number, number][] = [["Ditinggal pedagang (tidak berjualan)", 1240, 30, 30, 40], ["Ditutup sementara (sanksi BPP)", 410, 45, 40, 15], ["Pemilik tidak aktif, SIPTU tidak dialihkan", 620, 15, 30, 55], ["Rusak / tidak layak (atap, banjir, kebakaran)", 380, 50, 35, 15], ["Sengketa hak / ahli waris", 190, 10, 30, 60]];
export const TUNGGAKAN_KAT: [string, string, string, string, string][] = [["Emerald", "2.240", "690", "310", "Rp38,2 M"], ["Platinum", "1.860", "1.010", "880", "Rp112,6 M"], ["Gold", "2.610", "880", "420", "Rp61,3 M"], ["Tanpa SIPTU aktif", "370", "190", "120", "Rp12,8 M"]];
export const TAHAP_SANKSI: [string, string, string, number, number, Lv][] = [
  ["1", "Pengingat otomatis", "WA & aplikasi PaJaKu · status 2", 6420, 0, "g"], ["2", "Kunjungan juru tagih/AO", "status 3 · rencana bayar/cicilan", 5866, 412, "a"], ["3", "Surat peringatan 1", "tenggat 7 hari", 520, 96, "a"], ["4", "Surat peringatan 2", "tenggat 7 hari", 284, 71, "a"],
  ["5", "Surat peringatan 3", "tenggat 7 hari · panggilan Kepala Pasar", 168, 54, "r"], ["6", "Penutupan sementara TU", "Pasal 20 huruf b · segel", 410, 88, "r"], ["7", "Pembatalan perjanjian", "Pasal 20 huruf c · keputusan Direksi", 31, 31, "r"], ["8", "Pemasaran ulang TU", "JaKios · prioritas anggota Blue", 19, 0, "g"],
];
/** Rekomendasi AI di layar 3 — id disamakan dengan keputusan di EIS Direktur supaya sinkron. */
export const REKOM: { id: string; title: string; detail: string; impact: string; risk: string; lvl: Lv }[] = [
  { id: "k1", title: "Program cicilan untuk 1.240 TU status 3–4 berkinerja baik", detail: "Riwayat bayar 24 bulan baik sebelum menunggak, mayoritas Emerald. Cicilan 6 bulan + pembebasan denda bila lunas tepat waktu.", impact: "Perkiraan tertagih Rp9,4 M", risk: "Risiko rendah", lvl: "g" },
  { id: "p1", title: "Naikkan 54 TU dari SP 3 ke penutupan sementara", detail: "Tidak merespons SP 3 lewat tenggat, kios tutup >6 bulan, bukan pasar revitalisasi. Pemilik Platinum diberi tahu sebagai penanggung SIPTU.", impact: "Tunggakan terkait Rp6,1 M", risk: "Risiko sedang", lvl: "a" },
  { id: "p2", title: "Pembatalan perjanjian 31 TU dan pemasaran ulang", detail: "Macet >24 bulan, kios kosong >12 bulan, sudah melewati penutupan sementara. Tawarkan ke 1.240 anggota Blue lewat JaKios.", impact: "Potensi HPTU baru Rp4,8 M", risk: "Risiko sedang", lvl: "a" },
  { id: "d1", title: "Tunda sanksi di 2 pasar dengan isu sosial", detail: "Pasar Serdang (pasca kebakaran, revitalisasi) dan Pramuka (pengalaman protes 2025). Ganti dengan dialog dan restrukturisasi lebih dulu.", impact: "Hindari eskalasi ke DPRD/Ombudsman", risk: "Risiko sosial tinggi", lvl: "r" },
];
/** [pasar, mitra·skema, tahap, hak lama, di penampungan, lama (bln), lokasi TPS, target kembali, status hak, isu] */
export const REVIT: [string, string, string, number, number, number, string, string, string, string][] = [
  ["Pasar Serdang", "[Mitra A] · KSO", "Sosialisasi", 556, 410, 1, "Lahan parkir sisi utara, 410 lapak darurat", "Kuartal IV 2028", "Hak lama dipertahankan; harga baru Rp20.000/hari selama 20 tahun (KJPP)", "Pasca kebakaran 28 Sep 2026; pedagang minta keringanan BPP selama di penampungan"],
  ["Pasar Pramuka", "[Mitra B] · KSO", "Pra-konstruksi", 401, 0, 0, "Belum dipindah", "Kuartal II 2028", "Perpanjangan hak pakai berbasis kajian KJPP", "Riwayat protes harga perpanjangan (Nov 2025); jaga komunikasi dengan himpunan pedagang"],
  ["Pasar Muara Karang", "[Mitra C] · BGS", "Konstruksi 45%", 612, 588, 14, "TPS Jl. Pluit Karang, 588 kios sementara", "Kuartal III 2027", "Hak lama terdata 96% di registri", "Keluhan banjir rob di TPS; omzet turun 30%"],
  ["Pasar Kramat Jaya", "[Mitra D] · KSO", "Perencanaan", 498, 0, 0, "Lokasi TPS sedang dikaji", "Kuartal I 2029", "Pendataan ulang 88%", "Kios kosong 31%; perlu skema pedagang baru"],
  ["Blok A Fatmawati", "[Mitra E] · kerja sama lahan", "Perizinan", 340, 312, 22, "Penampungan sementara di sekitar lokasi", "Kuartal IV 2027", "Hak lama dijamin dalam perjanjian kerja sama", "Lama di penampungan >12 bulan; tekan jadwal perizinan"],
  ["Pasar Senen Blok 6", "[Mitra F] · KSO", "Serah terima", 720, 96, 30, "TPS sisa 96 pedagang menunggu unit", "November 2026", "e-SHPTU baru terbit 624 dari 720", "Sisa 96 pedagang belum mendapat unit; risiko keluhan ke DPRD"],
];

export const fmt = (n: number, d = 1) => n.toFixed(d).replace(".", ",");
export const idn = (n: number) => Math.round(n).toLocaleString("id-ID");
export const rpx = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
