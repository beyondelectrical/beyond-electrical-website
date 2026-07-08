# Setting Up Supabase for the Inquiry Form

This connects the "Inquire" form on your site to a table in Supabase, so
every submission is saved somewhere you can see it. Takes about 10 minutes.

## Step 1 — Open Supabase

Go to [supabase.com](https://supabase.com) and log in.

You can either:
- **Reuse your existing project** (the one from your other project) — just
  add a new table to it. This is simplest and still fully safe; tables
  don't interfere with each other.
- **Or create a brand-new project** if you'd rather keep this 100%
  separate: click **New Project** → name it something like
  `beyond-electrical` → pick a region → set a database password (save
  this somewhere) → wait ~2 minutes for it to spin up.

Either way, open that project.

## Step 2 — Create the `inquiries` table

1. In the left sidebar, click **Table Editor**.
2. Click **New table**.
3. Name it exactly: `inquiries`
4. Leave **Enable Row Level Security (RLS)** turned **ON** (the default).
   You don't need to add any policies — the website talks to this table
   using a special key that bypasses RLS entirely, so leaving RLS on
   with zero policies means nobody else can read or write to this table
   from outside, which is exactly what you want.
5. Add these columns (click **+ Add column** for each). For all of them,
   set the type to **text**:
   - `name`
   - `email`
   - `project_type`
   - `timeline`
   - `location`
   - `message`

   (You'll already have `id` and `created_at` — Supabase adds those
   automatically. Leave those as-is.)
6. Click **Save**.

## Step 3 — Get your API credentials

Supabase recently renamed their keys. Depending on when your project was
created, you'll see one of two layouts under **Settings → API Keys** —
follow whichever matches what you see:

**If you see tabs for "Publishable and secret API keys" vs. "Legacy anon,
service_role API keys"** (the current version):
1. Stay on the **Publishable and secret API keys** tab.
2. Scroll to **Secret keys**, click the eye icon to reveal the `default`
   key (starts with `sb_secret_...`), then copy it. This is your
   `SUPABASE_SERVICE_KEY`. Ignore the "Publishable key" section above it
   — that one's for browser-side code, not this.
3. For the Project URL, click the **Connect** button near the top of the
   page — it shows your Project URL alongside the keys.

**If you see a single page with "Project API keys"** (the older version):
1. Copy the **Project URL** — looks like `https://xxxxxxxx.supabase.co`.
2. Under **Project API keys**, find the one labeled **`service_role`**
   (⚠️ not "anon"). Copy it.

Either way, you end up with two values:
- `SUPABASE_URL` — the project URL
- `SUPABASE_SERVICE_KEY` — the secret / `service_role` key

**Important:** this key gives full access to your database. Never paste
it into the website's HTML/JS files, never post it publicly, never put
it in a GitHub commit. It only ever goes into Vercel's environment
variables (next step), which stay private.

## Step 4 — Add the credentials to Vercel

1. Go to [vercel.com](https://vercel.com) → open your
   `beyond-electrical-website` project.
2. Click **Settings** → **Environment Variables**.
3. Add:
   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | the Project URL you copied |
   | `SUPABASE_SERVICE_KEY` | the `service_role` key you copied |
4. Leave the environment checkboxes as default (Production, Preview,
   Development all checked) and save each one.
5. Go to the **Deployments** tab → click the **⋯** menu on the most
   recent deployment → **Redeploy**. Environment variables only take
   effect on the next deploy, not retroactively.

## Step 5 — Test it

1. Open your live site → go to the **Inquire** page → fill out and
   submit the form with test info.
2. Back in Supabase → **Table Editor** → `inquiries` table → you should
   see your test submission appear as a new row within a few seconds.
3. Delete the test row once confirmed (click the row → delete).

## Viewing submissions going forward

Any time someone submits the form, check **Table Editor → inquiries**
in Supabase. You can sort, filter, or click **Export → CSV** if you ever
want to pull the list into a spreadsheet.

---

If you're also setting up Resend for email notifications, that's a
separate set of steps — see the main project README for those.
