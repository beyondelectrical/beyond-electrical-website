# Beyond Electrical Solutions — Website

Plain static site (HTML/CSS/JS). No build step, no framework — just open
index.html in a browser and it works, or deploy the whole folder as-is.

## Folder structure
```
beyond-electrical/
├── index.html          Home
├── portfolio.html
├── specialties.html
├── standards.html
├── inquire.html
├── css/styles.css
├── js/main.js           (nav + scroll animations)
├── js/inquire-form.js    (contact form — needs Supabase config, see below)
└── assets/               (logo + favicon)
```

## Deploying to Vercel (get a free preview URL, no domain changes)

**Option A — hand this folder to Claude Code** and ask it to:
> "Push this to a new GitHub repo and deploy it to Vercel"
It has terminal + network access to run the commands directly.

**Option B — do it yourself, no terminal needed:**
1. Go to github.com → New repository → name it `beyond-electrical` → Create.
2. On the new repo page, click "uploading an existing file" and drag in
   every file/folder from this project. Commit.
3. Go to vercel.com → Add New → Project → Import the `beyond-electrical`
   GitHub repo → Deploy. No settings need to change (it's a static site).
4. Vercel gives you a URL like `beyond-electrical.vercel.app` — that's your
   safe-to-share staging link. Your real domain is untouched.

## Connecting your real domain (only when you're ready)
In the Vercel project → Settings → Domains → add your domain. Vercel will
show you 1–2 DNS records to add at your domain registrar (wherever you
bought the domain). Add those, wait a few minutes to a few hours for DNS
to propagate, and the real domain will start serving the site.

## Wiring up the Inquire form (optional but recommended)
Right now the form validates input but doesn't save it anywhere — it just
tells visitors to email you directly. To make it save submissions:

1. In Supabase, create a table called `inquiries` with columns:
   `name` (text), `email` (text), `project_type` (text), `timeline` (text),
   `location` (text), `message` (text) — `id` and `created_at` can stay
   as Supabase's defaults.
2. Add a Row Level Security policy allowing `INSERT` for the `anon` role
   only (no read/update/delete for anon) — keeps it safe to expose publicly.
3. Open `js/inquire-form.js` and fill in `SUPABASE_URL` and
   `SUPABASE_ANON_KEY` near the top (from Project Settings → API in your
   Supabase dashboard).
4. Redeploy (push to GitHub — Vercel auto-redeploys on every push).

## Still to fill in
- `standards.html` — license number and insurance/WCB details (currently
  placeholder text in the Credentials section).
- Real project photography to replace the "in progress" plates on the
  Home and Portfolio pages.
- A real client testimonial on the Home page, whenever you have one.
