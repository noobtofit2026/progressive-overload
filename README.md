# NOOBTOFIT — Progressive NOOBTOFIT Tracker

A workout tracker: log exercise, weight, reps, and date per set. Each person
signs in with just their email (no password) and their log is tied to that
email forever — sign in from any device and it's all there.

Stack: **Next.js 14** (App Router) + **Supabase** (Postgres + email auth) +
**Tailwind** + **Recharts**. Deploys straight to **Vercel**.

---

## 1. Create your Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → New project.
2. Pick a name, a database password (save it somewhere), and a region.
3. Once it's created, open **SQL Editor** → **New query**, paste the contents
   of `supabase/schema.sql` from this project, and click **Run**.
   This creates the `sets` table and locks it down with row-level security,
   so every user can only ever see their own rows.
4. Go to **Project Settings → API**. You'll need two values from this page:
   - **Project URL**
   - **anon public** key

5. Go to **Authentication → URL Configuration** and set:
   - **Site URL**: `http://localhost:3000` for now (you'll add your real
     domain after deploying).
   - **Redirect URLs**: add `http://localhost:3000/auth/callback` and, after
     you deploy, also add `https://YOUR-VERCEL-DOMAIN/auth/callback`.

   Email sign-in (magic link) is on by default under
   **Authentication → Providers → Email** — nothing else to switch on.

---

## 2. Run it locally

```bash
npm install
cp .env.local.example .env.local
```

Open `.env.local` and paste in your Project URL and anon key from step 1.

```bash
npm run dev
```

Visit `http://localhost:3000`, enter your email, and check your inbox for
the sign-in link.

---

## 3. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repo.
3. In the **Environment Variables** step, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   (same values as your `.env.local`)
4. Click **Deploy**.
5. Once it's live, copy your Vercel URL (e.g. `https://NOOBTOFIT.vercel.app`)
   and add `https://NOOBTOFIT.vercel.app/auth/callback` to Supabase's
   **Redirect URLs** (Authentication → URL Configuration), and update
   **Site URL** to your real domain too.

That's it — anyone who visits your site can sign in with their email and
start logging sets, and their data stays theirs.

---

## Selling this (taking payment)

This project handles accounts and data, not billing. The common next step is
**Stripe Checkout**: gate `/dashboard` behind a `subscribed` flag on the
user's row (set by a Stripe webhook when they pay), so signed-up-but-unpaid
users see a "subscribe to continue" screen instead of the tracker. Happy to
wire that up next if you want — it's a self-contained addition on top of what's
here.

## What's here vs. what's next

Included: email auth, add/view/delete sets, per-exercise progress chart,
PR badges, responsive layout, row-level security so data is private per user.

Reasonable next additions: editing a logged set (currently: delete and
re-add), workout templates/routines, body-weight tracking, CSV export,
Stripe billing.
