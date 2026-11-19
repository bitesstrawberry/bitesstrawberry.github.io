# BITE'S Strawberry — Admin CMS Setup

## What's included
- Customer site retains its existing React/Vite sections and ordering flow.
- Official logo supplied by the owner is served as `/bites-logo.png`.
- `/admin` contains a protected Supabase Auth login and admin CMS.
- Products, outlets, gallery, promos, activity log, and account password/profile settings use Supabase.
- Image uploads go to the public-read `bites-media` Storage bucket; writes/deletes require the admin claim.
- Public visitors can read active CMS records only. Admin permissions use trusted `app_metadata.role`, never user-editable `user_metadata`.

## Supabase project
The project is already configured in `src/lib/supabase.ts` with the project's public URL and publishable key. Those values are safe for browser use. Never add a `service_role` or secret key to this repository.

The SQL migration is `supabase/migrations/20261119000100_admin_cms.sql`. It creates the CMS tables, RLS policies, Storage bucket/policies, and seeds the existing products, outlets, gallery entries, and promotion. The migration has already been applied to the connected Supabase project when this package was prepared.

## Create the first admin (no public registration)
1. Open Supabase Dashboard → Authentication → Users → Add user → Create new user.
2. Enter the owner's email and a strong password. Confirm the user/email as appropriate for the project.
3. Open SQL Editor and run the following query after replacing the email. This grants admin using the server-managed `raw_app_meta_data` claim and creates the profile row.

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where lower(email) = lower('OWNER_EMAIL_HERE');

insert into public.admin_profiles (id, display_name)
select id, 'Admin BITE''S'
from auth.users
where lower(email) = lower('OWNER_EMAIL_HERE')
on conflict (id) do nothing;
```

4. Sign out of any previous session and sign in again at `https://bitesstrawberry.github.io/admin` so the new JWT includes the updated `app_metadata` claim.
5. Do not grant this role to a general visitor. There is no public signup form in the application.

## Local development
```bash
cp .env.example .env.local
npm ci
npm run dev
```
Open `http://localhost:3000` for the customer site and `http://localhost:3000/admin` for the admin login.

## Deployment
The GitHub Actions workflow builds from the repository root, copies `dist/index.html` to `dist/404.html` to support direct `/admin` access on GitHub Pages, then deploys the `dist` artifact. A push to `main` triggers deployment.

## Security notes
- `VITE_SUPABASE_*` variables are public browser config; do not use service-role/secret keys.
- RLS is the authorization boundary. Hiding admin UI is not treated as security.
- Admin authorization reads only `auth.jwt() -> 'app_metadata' ->> 'role'`.
- Public reads are restricted to active content; inserts/updates/deletes and Storage mutations require authenticated admin claim.
- The existing `orders` table and its policies are not modified by this CMS migration.
