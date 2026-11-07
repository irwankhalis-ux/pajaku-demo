# PaJaKu Demo — aplikasi Android

Membungkus demo "PaJaKu Demo" (Aplikasi Pedagang, Konsol Pasar Jaya, Konsol Mitra Pengembang) menjadi APK Android dengan Capacitor 8. Semua data ilustrasi, jalan tanpa internet. Powered by PATROL · PT Patrol Indonesia Raya.

- Isi aplikasi: `www/index.html` (satu file). Ganti file ini untuk memperbarui demo.
- App ID: `id.patrol.pajakudemo` · nama: PaJaKu Demo · Android 7.0+ (minSdk 24).

## Cara 1 — Android Studio (±10 menit)
1. Pasang Android Studio (sudah termasuk JDK & Android SDK) dan Node.js 22.
2. Di folder ini: `npm install` lalu `npx cap sync android`.
3. `npx cap open android` → tunggu Gradle selesai → menu **Build › Build App Bundle(s) / APK(s) › Build APK(s)**.
4. APK ada di `android/app/build/outputs/apk/debug/app-debug.apk`. Kirim lewat WhatsApp, pasang di HP (izinkan "pasang dari sumber tidak dikenal").

Tanpa Android Studio, cukup terminal dengan JDK 21 + Android SDK: `npm install && npx cap sync android && cd android && ./gradlew assembleDebug`.

## Cara 2 — GitHub (tanpa instalasi apa pun)
Unggah folder ini ke repositori GitHub. Workflow `.github/workflows/build-apk.yml` otomatis membangun APK; unduh dari tab **Actions › Build APK › Artifacts › PaJaKu-Demo-apk**.

## Catatan
- APK debug (bukan untuk Play Store). Untuk Play Store perlu APK/AAB rilis yang ditandatangani dengan keystore PT Patrol Indonesia Raya.
- Folder `node_modules` tidak disertakan; jalankan `npm install` dulu.

## Link publik (GitHub Pages)
Folder `docs/` berisi versi web yang sama. Aktifkan sekali di **Settings › Pages › Build and deployment › Source: Deploy from a branch › Branch: main / folder: /docs**, lalu demo bisa dibuka di `https://irwankhalis-ux.github.io/pajaku-demo/` dan dipasang ke layar utama (Android & iPhone).
