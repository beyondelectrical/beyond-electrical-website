# Beyond Electrical Solutions — Website

Static site (HTML/CSS/JS) plus one small serverless function for the
contact form. No build step for the site itself — open index.html and
it works, or deploy the whole folder as-is.

## Folder structure
```
beyond-electrical/
├── index.html          Home
├── portfolio.html
├── specialties.html
├── standards.html
├── inquire.html
├── css/styles.css
├── js/main.js            (nav + scroll animations)
├── js/inquire-form.js     (posts the contact form to /api/inquire)
├── api/inquire.js         (serverless function — saves to Supabase, emails via Resend)
└── assets/                (logo + favicon)
```

## Deploying to Vercel (free staging URL, no domain changes)

**Option A — hand this folder to Claude Code** and ask it to push to a
new GitHub repo and deploy to Vercel. It has terminal + network access
to do this directly.

**Option B — do it yourself, no terminal needed:**
1. github.com → New repository → name it `beyond-electrical-website` →
   Create (leave it empty, don't add a README there).
2. On the repo page, click "uploading an existing file" and drag in
   everything from this folder. Commit.
3. vercel.com → Add New → Project → Import the repo → Deploy.
   The `/api` folder is automatically detected as a serverless function
   — nothing extra to configure.
4. You'll get a URL like `beyond-electrical-website.vercel.app` — safe
   to share, your real domain isn't touched.

Keep this as its own separate GitHub repo and Vercel project so it
never interferes with your other project. Reusing your existing
Supabase project is fine — just add a new table there (see below).

## Connecting your real domain (only when you're ready)
Vercel project → Settings → Domains → add your domain → it shows you
1–2 DNS records to add at your registrar. Add those, wait for DNS to
propagate, and the real domain starts serving the site.

## Making the Inquire form actually save + notify you

The form posts to `/api/inquire`, a serverless function that can do two
things independently — set up either or both:

### A. Save submissions to Supabase
1. In Supabase, create a table called `inquiries` with columns:
   `name` (text), `email` (text), `project_type` (text), `timeline`
   (text), `location` (text), `message` (text). `id` / `created_at` can
   stay as Supabase's defaults.
2. You do **not** need an RLS policy for this — the function uses your
   `service_role` key, which bypasses RLS. Keep that key secret (it
   only ever lives in Vercel's environment variables, never in the code).

### B. Email you when someone submits (via Resend)
1. In Resend, verify a sending domain (your registrar will need 1–2 DNS
   records added, same idea as the Vercel domain step — you can do this
   any time, doesn't affect the live site).
2. Create an API key in Resend.
3. Decide on a "from" address on your verified domain, e.g.
   `Beyond Electrical <inquiries@beyondelectrical.ca>`.

### Set the environment variables in Vercel
Project → Settings → Environment Variables → add:

| Name | Value |
|---|---|
| `SUPABASE_URL` | from Supabase Project Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase Project Settings → API → `service_role` (secret) |
| `RESEND_API_KEY` | from Resend → API Keys |
| `RESEND_FROM_EMAIL` | e.g. `Beyond Electrical <inquiries@beyondelectrical.ca>` |
| `NOTIFY_EMAIL` | optional, defaults to `info@beyondelectrical.ca` |

Redeploy after adding env vars (Vercel → Deployments → ⋯ → Redeploy) —
they only take effect on the next deploy. You can set up A, B, or both;
whichever isn't configured is just skipped rather than breaking the form.

## Still to fill in
- `standards.html` — license number and insurance/WCB details (currently
  placeholder text in the Credentials section).
- Real project photography to replace the "in progress" plates on the
  Home and Portfolio pages.
- A real client testimonial on the Home page, whenever you have one.

## SEO (next step, once the domain is live)
Structured data, Open Graph tags, sitemap.xml, and robots.txt still need
to be added — ask Claude to add these to the project, then submit the
sitemap in Google Search Console once the real domain is connected.
