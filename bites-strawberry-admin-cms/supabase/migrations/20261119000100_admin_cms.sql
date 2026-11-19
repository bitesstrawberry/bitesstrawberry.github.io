-- BITE'S Strawberry CMS. Admin authorization is based only on trusted app_metadata.
create or replace function public.is_bites_admin()
returns boolean
language sql stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Admin BITE''S',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_products (
  id text primary key default gen_random_uuid()::text,
  name text not null check (char_length(name) between 1 and 120),
  category text not null default 'fresh' check (category in ('fresh','package','frozen')),
  price integer not null check (price >= 0),
  original_price integer check (original_price is null or original_price >= 0),
  unit text not null default 'pcs' check (char_length(unit) <= 30),
  description text not null default '',
  advantages jsonb not null default '[]'::jsonb,
  badges jsonb not null default '[]'::jsonb,
  image_url text,
  rating numeric(2,1) not null default 5,
  reviews_count integer not null default 0,
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_outlets (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  short_name text not null default '',
  tagline text not null default 'Outlet BITE''S',
  address text not null,
  landmark text not null default '',
  maps_url text not null default '',
  opening_hours text not null default '06.00 – 17.00 WIB',
  status text not null default 'Buka Setiap Hari',
  phone text not null default '',
  image_url text,
  is_open boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_gallery (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  caption text not null default '',
  category text not null default 'Dokumentasi',
  image_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_promos (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null default '',
  label text not null default 'PROMO',
  banner_url text,
  starts_at date,
  ends_at date,
  product_id text references public.site_products(id) on delete set null,
  product_preset text,
  accent_color text not null default '#F28C18',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_activity_logs (
  id bigint generated always as identity primary key,
  admin_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  entity text not null,
  entity_id text,
  entity_name text,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;
alter table public.site_products enable row level security;
alter table public.site_outlets enable row level security;
alter table public.site_gallery enable row level security;
alter table public.site_promos enable row level security;
alter table public.admin_activity_logs enable row level security;

-- Remove prior policies with these names before creating the intended policies.
drop policy if exists "public reads active products" on public.site_products;
drop policy if exists "admins manage products" on public.site_products;
create policy "public reads active products" on public.site_products for select to anon, authenticated using (is_active = true or public.is_bites_admin());
create policy "admins manage products" on public.site_products for all to authenticated using (public.is_bites_admin()) with check (public.is_bites_admin());

drop policy if exists "public reads active outlets" on public.site_outlets;
drop policy if exists "admins manage outlets" on public.site_outlets;
create policy "public reads active outlets" on public.site_outlets for select to anon, authenticated using (is_active = true or public.is_bites_admin());
create policy "admins manage outlets" on public.site_outlets for all to authenticated using (public.is_bites_admin()) with check (public.is_bites_admin());

drop policy if exists "public reads active gallery" on public.site_gallery;
drop policy if exists "admins manage gallery" on public.site_gallery;
create policy "public reads active gallery" on public.site_gallery for select to anon, authenticated using (is_active = true or public.is_bites_admin());
create policy "admins manage gallery" on public.site_gallery for all to authenticated using (public.is_bites_admin()) with check (public.is_bites_admin());

drop policy if exists "public reads active promos" on public.site_promos;
drop policy if exists "admins manage promos" on public.site_promos;
create policy "public reads active promos" on public.site_promos for select to anon, authenticated using (is_active = true or public.is_bites_admin());
create policy "admins manage promos" on public.site_promos for all to authenticated using (public.is_bites_admin()) with check (public.is_bites_admin());

drop policy if exists "admin reads own profile" on public.admin_profiles;
drop policy if exists "admin inserts own profile" on public.admin_profiles;
drop policy if exists "admin updates own profile" on public.admin_profiles;
create policy "admin reads own profile" on public.admin_profiles for select to authenticated using (id = (select auth.uid()) and public.is_bites_admin());
create policy "admin inserts own profile" on public.admin_profiles for insert to authenticated with check (id = (select auth.uid()) and public.is_bites_admin());
create policy "admin updates own profile" on public.admin_profiles for update to authenticated using (id = (select auth.uid()) and public.is_bites_admin()) with check (id = (select auth.uid()) and public.is_bites_admin());

create policy "admins read activity" on public.admin_activity_logs for select to authenticated using (public.is_bites_admin());
create policy "admins insert activity" on public.admin_activity_logs for insert to authenticated with check (public.is_bites_admin() and admin_id = (select auth.uid()));

grant select on public.site_products, public.site_outlets, public.site_gallery, public.site_promos to anon, authenticated;
grant insert, update, delete on public.site_products, public.site_outlets, public.site_gallery, public.site_promos to authenticated;
grant select, update on public.admin_profiles to authenticated;
grant select, insert on public.admin_activity_logs to authenticated;

-- Publicly readable images; all writes require a trusted admin app_metadata claim.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bites-media', 'bites-media', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 8388608, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads Bites media" on storage.objects;
drop policy if exists "admins upload Bites media" on storage.objects;
drop policy if exists "admins update Bites media" on storage.objects;
drop policy if exists "admins delete Bites media" on storage.objects;
create policy "public reads Bites media" on storage.objects for select to anon, authenticated using (bucket_id = 'bites-media');
create policy "admins upload Bites media" on storage.objects for insert to authenticated with check (bucket_id = 'bites-media' and public.is_bites_admin());
create policy "admins update Bites media" on storage.objects for update to authenticated using (bucket_id = 'bites-media' and public.is_bites_admin()) with check (bucket_id = 'bites-media' and public.is_bites_admin());
create policy "admins delete Bites media" on storage.objects for delete to authenticated using (bucket_id = 'bites-media' and public.is_bites_admin());

-- Preserve the current catalog as the initial CMS content. Existing local photos remain fallback assets.
insert into public.site_products (id,name,category,price,original_price,unit,description,advantages,badges,rating,reviews_count,is_best_seller)
values
('prod-1','Strawberry Pack Besar','fresh',16000,null,'250gr','Buah pilihan berukuran jumbo, manis segar, merah merona, dan dipetik langsung setiap pagi dari kebun lokal pilihan.','["Dipetik segar dari kebun lokal","Buah pilihan berukuran jumbo"]','["FRESH","BEST SELLER"]',4.9,250,true),
('prod-2','Strawberry Pack Kecil','fresh',4000,null,'66,67gr','Pengalaman seru stroberi organik segar kualitas prima dengan tangkai utuh, manis asam seimbang dan wangi alami.','["Porsi praktis dan ekonomis","Rasa manis-asam yang seimbang"]','["FRESH","ORGANIK"]',4.9,142,false),
('prod-3','Jus Strawberry','package',12000,12000,'250 ml','Paket segar favorit keluarga, porsi pas dan ramah di kantong, sangat cocok untuk camilan harian dan sajian meja makan.','["Dibuat dari stroberi segar","Siap dinikmati dengan praktis"]','["FRESH","HEMAT"]',4.9,210,true),
('prod-4','Stroberi Manis Grade A','fresh',80000,null,'/kg','Ukuran besar, bentuk sempurna, warna merah merata, kualitas terbaik.','["Grade A dengan ukuran besar","Warna merah merata dan menarik"]','["FRESH","FAVORIT"]',4.8,96,false),
('prod-7','Stroberi Manis Grade AB','fresh',70000,null,'/kg','Ukuran sedang-bentuk sempurna, warna merah merata, kualitas terbaik','["Grade AB pilihan","Kualitas segar dengan harga bersahabat"]','["FRESH","PREMIUM"]',4.7,90,false),
('prod-5','Stroberi Manis Grade ABC','package',60000,null,'/kg','Ukuran bervariasi, bentuk sempurna, warna merah menarik, kualitas terbaik.','["Pilihan hemat untuk kebutuhan banyak","Cocok untuk olahan dan konsumsi harian"]','["HEMAT","BEST DEAL"]',4.9,115,true),
('prod-6','Strawberry Frozen','frozen',40000,null,'/kg','Stroberi utuh beku higienis tanpa tangkai, siap blender untuk jus segar, smoothie bowl, selai homemade, atau topping dessert.','["Praktis untuk stok di rumah","Siap digunakan untuk jus dan dessert"]','["PRAKTIS","BEKU SEGAR"]',4.8,68,false)
on conflict (id) do nothing;

insert into public.site_outlets (id,name,short_name,tagline,address,landmark,maps_url,opening_hours,status,phone)
values
('outlet-1','Outlet 1 — Samping Polres Salatiga','Outlet Polres Salatiga','Outlet Utama & Stand Fresh','Jl. Sukowati (Tepat di samping Polres Salatiga), Kalicacing, Kec. Sidorejo, Kota Salatiga, Jawa Tengah','Samping Polres Salatiga','https://maps.app.goo.gl/73vit83r3MYn9Jha8','06.00 – 17.00 WIB','Buka Setiap Hari','081818193311'),
('outlet-2','Outlet 2 — Seberang BRI Nanggulan Salatiga','Outlet BRI Nanggulan','Stand Fresh Harian','Area BRI Unit Nanggulan, Jl. Raya Tingkir - Suruh, Nanggulan, Kota Salatiga, Jawa Tengah','BRI Unit Nanggulan Salatiga','https://maps.app.goo.gl/T1UZW6tY3XUHHHSs5','06.00 – 17.00 WIB','Buka Setiap Hari','081818193311'),
('outlet-3','Outlet 3 — Pangsar Ambarawa SDN Panjang 03','Outlet Ambarawa','Stand Fresh Harian','Pangsar Ambarawa, SDN Panjang 03, Ambarawa, Kab. Semarang, Jawa Tengah','Pangsar Ambarawa SDN Panjang 03','https://maps.app.goo.gl/qGBFgi2st61bVaAd6','07.00 – 17.00 WIB','Buka Setiap Hari','081818193311')
on conflict (id) do nothing;

insert into public.site_gallery (id,title,caption,category,image_url)
values
('gal-0','Tim & Kru BITE''S Salatiga','Senyum hangat kru dan keluarga besar BITE''S Healthy Food siap menyambutmu di outlet.','Tim & Outlet','/src/assets/images/tim-bites-asli.jpeg'),
('gal-1','Stroberi Segar Berkilau','Warna merah cerah merona hasil panen pagi hari dengan tekstur juicy dan manis.','Buah Segar','https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1000&q=80'),
('gal-3','Kemasan Rapi & Higienis','Kemas mika transparan menjaga buah tetap bernapas dan tidak mudah memar.','Kemasan','/src/assets/images/kemasanstroberi.jpeg')
on conflict (id) do nothing;

insert into public.site_promos (id,title,description,label,product_preset,accent_color)
values ('promo-2','Gratis Pengantaran Area Salatiga Kota','Pesan minimal 3 box stroberi varian apa saja, tim BITE''S siap antar langsung ke depan rumah kamu tanpa ongkir tambahan.','SPECIAL DEALS','Paket Hemat Keluarga','#F28C18')
on conflict (id) do nothing;
