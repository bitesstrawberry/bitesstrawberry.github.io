# Panduan mengunggah source BITE'S ke GitHub

1. Ekstrak `bites-strawberry-website-ready.zip`.
2. Unggah seluruh isi folder hasil ekstrak ke root repository `bitesstrawberry/bitesstrawberry.github.io` pada branch `main` (termasuk folder tersembunyi `.github`).
3. Buat commit. Workflow `Deploy website to GitHub Pages` akan otomatis menjalankan `npm ci`, `npm run build`, lalu menerbitkan `dist`.
4. Pastikan **Settings → Pages → Build and deployment → Source** menggunakan **GitHub Actions**.
5. Setelah workflow berstatus sukses, situs tersedia di `https://bitesstrawberry.github.io`.

## Koneksi Supabase

Form order mengirim baris ke `public.orders` menggunakan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`. Nilai publik proyek yang telah disiapkan sudah menjadi fallback di `src/lib/supabase.ts`, sehingga tidak wajib menambahkan GitHub Actions Secrets untuk build ini. `.env.example` tersedia bila ingin mengganti target proyek untuk lingkungan lain.

Jangan pernah memasukkan `service_role` atau `sb_secret` ke source frontend. Keamanan penulisan order mengandalkan RLS policy `Public can submit orders` yang sudah ada.

## Catatan

Folder `node_modules` tidak disertakan. Dependencies dipasang bersih oleh `npm ci` pada GitHub Actions. Tidak ada perubahan visual yang disengaja pada komponen, data, atau foto situs.
