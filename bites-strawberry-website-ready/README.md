# BITE'S Strawberry Website

Website katalog dan pemesanan BITE'S Strawberry. Dibangun menggunakan React, TypeScript, Vite, dan Tailwind CSS. Tampilan, konten, aset foto, katalog, lokasi outlet, FAQ, dan alur WhatsApp dipertahankan dari source website.

## Menjalankan secara lokal

**Persyaratan:** Node.js 22 atau lebih baru.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Supabase

Form pemesanan menyimpan order ke tabel `public.orders`, kemudian tetap membuka WhatsApp BITE'S seperti alur sebelumnya. Project URL dan publishable key yang digunakan adalah konfigurasi publik frontend. Tabel telah menggunakan Row Level Security (RLS) dan kebijakan `Public can submit orders` hanya mengizinkan INSERT bagi pengunjung anonim; pengunjung tidak diberi akses membaca pesanan.

Jangan pernah menaruh `service_role` atau secret key Supabase di frontend, `.env.example`, atau repository.

## Deploy

Repository ini menggunakan GitHub Actions untuk membangun folder `dist` dan menerbitkannya ke GitHub Pages setiap kali ada push ke branch `main`.

Alamat GitHub Pages: https://bitesstrawberry.github.io

Workflow: `.github/workflows/deploy.yml`.
