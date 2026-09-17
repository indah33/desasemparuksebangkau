# Panduan Database Pengaduan + Login Admin

## 1. Google Sheets
Buat satu Google Spreadsheet. Tidak perlu membuat tabel manual.

## 2. Google Apps Script
Buka Extensions > Apps Script dari spreadsheet tersebut.
Hapus kode lama jika ini akan menjadi database baru, lalu salin isi `Code.gs` ke Apps Script.

Jalankan fungsi `setupDatabase()` sekali. Beri izin yang diminta.

## 3. Password admin
Di Apps Script buka Project Settings > Script Properties.
Buat:
- `ADMIN_USERNAME` = admin
- `ADMIN_PASSWORD` = buat-password-kamu

Jangan memakai password contoh `GANTI_PASSWORD_ADMIN`.

## 4. Deploy
Deploy > New deployment > Web app.
- Execute as: Me
- Who has access: Anyone

Salin URL yang berakhir `/exec`.

## 5. Hubungkan website
Buka `api-config.js` dan ubah:
`GANTI_DENGAN_URL_WEB_APP_APPS_SCRIPT`
menjadi URL Web App kamu.

Contoh:
`const API_URL = "https://script.google.com/macros/s/...../exec";`

## 6. Upload ke GitHub Pages
Salin seluruh isi folder `desasemparuksebangkau-main` ke repository GitHub kamu.

## 7. Alur penggunaan
Masyarakat:
Saran & Masukan/Pengaduan > isi form > mendapatkan ID > Cek Pengaduan.

Admin:
Login Admin > melihat daftar pengaduan > tulis tanggapan dan pilih Tanggapi atau Tolak.

Catatan:
- Password admin tidak diletakkan di HTML.
- Data pengaduan masuk ke Google Sheets.
- Status dan tanggapan admin dibaca kembali dari Google Sheets.
- Tampilan halaman lama tidak dirombak; sistem baru ditambahkan sebagai fitur.
