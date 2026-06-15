# Admin / content editor setup

The hidden `/admin` page lets you edit site content and upload your résumé, backed by
Supabase. Secrets never go in the repo — the anon key is baked into the built site (safe;
Row-Level Security protects writes), and you keep it in `.env.local` locally + GitHub
Actions secrets for deploys.

## 1. Create a Supabase project
1. Go to https://supabase.com → New project (free tier is fine).
2. After it provisions, open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Ignore the `service_role` key — never use it in this project.)

## 2. Create the database + storage
1. Supabase dashboard → **SQL Editor → New query**.
2. Paste the contents of [`supabase/schema.sql`](../supabase/schema.sql) and **Run**.
   This creates the `site_content` table, the `assets` storage bucket, and the
   read/write policies.

## 3. Create your admin login
1. Dashboard → **Authentication → Users → Add user** → enter your email + a password.
2. Dashboard → **Authentication → Providers → Email** → turn **off**
   "Allow new users to sign up" (so only you can log in).

## 4. Local development
1. `cp .env.example .env.local`
2. Fill in the two values from step 1. `.env.local` is gitignored — it is never committed.
3. `npm run dev`, open `http://localhost:3000/admin`, log in, edit, **Save**.

## 5. Production (GitHub Pages)
The site is a static export, so the values are needed at **build time**:
1. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**.
2. Add two secrets with the same names/values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Re-run the deploy (push to `main` or run the workflow). The deploy workflow
   already passes these into the build.

## Notes
- The live site reads content from Supabase on load and falls back to the built-in
  defaults if Supabase is unreachable or unconfigured — it never breaks.
- Editable live from `/admin`: profile, home headline/subline, featured + selected work,
  about intro, work & education entries, skills, project summaries, and the résumé.
- **Not** live-editable (still needs a `git push` to rebuild): full project case-study
  page bodies and adding brand-new project pages, because those pages are statically
  generated from files in `src/app/work/projects`.
- `/admin` is intentionally not linked anywhere in the site navigation.
