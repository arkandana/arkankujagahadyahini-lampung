# Website Undangan Pernikahan

## Struktur
- index.html — halaman utama
- css/style.css — tampilan, ornamen, animasi
- js/config.js — SEMUA data yang perlu diubah (nama, acara, rekening, alamat, URL spreadsheet)
- js/main.js — logika (musik, countdown, animasi, RSVP)
- assets/images — foto & ilustrasi; assets/music/music.mp3 — musik latar
- google-apps-script/Code.gs — backend Google Sheets

## Cara pakai
1. Edit js/config.js. Ganti foto di assets/images. Taruh musik di assets/music/music.mp3.
2. Jalankan lokal: `python3 -m http.server` lalu buka http://localhost:8000
3. Nama tamu: tambahkan `?to=Nama+Tamu` di akhir link.

## Hubungkan RSVP ke Google Sheets
1. Buat Google Sheet baru > Extensions > Apps Script > tempel isi Code.gs > Save.
2. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
3. Salin URL Web App ke `scriptUrl` di js/config.js.

## Hosting
Upload seluruh folder ke Netlify, Vercel, GitHub Pages, atau hosting biasa.
Catatan: musik diputar saat tombol "Buka Undangan" diklik (browser memblokir autoplay tanpa interaksi).
