// Vercel Serverless Function — POST /api/inquire
// Runs server-side only. Keys used here are never sent to the browser.
//
// Required environment variables (set in Vercel: Project → Settings →
// Environment Variables, then redeploy):
//
//   SUPABASE_URL           e.g. https://xxxxx.supabase.co
//   SUPABASE_SERVICE_KEY   Settings → API → "service_role" key (secret, NOT anon)
//   RESEND_API_KEY         from resend.com → API Keys
//   RESEND_FROM_EMAIL      a sender address on a domain you've verified in Resend
//                           e.g. "Beyond Electrical <inquiries@beyondelectrical.ca>"
//   NOTIFY_EMAIL           optional, defaults to info@beyondelectrical.ca below
//
// Saving to Supabase and emailing via Resend are both optional and
// independent — if either set of env vars is missing, that step is
// skipped rather than failing the whole request.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, project_type, timeline, location, message } = req.body || {};

  if (!name || !email || !project_type || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const {
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    RESEND_API_KEY,
    RESEND_FROM_EMAIL,
    NOTIFY_EMAIL = 'info@beyondelectrical.ca',
  } = process.env;

  const results = { saved: false, emailed: false };

  // 1. Save to Supabase
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Supabase's new sb_secret_ keys are not JWTs — send on the
          // apikey header only. (Older service_role JWT keys also work
          // fine sent this way, so this covers both key formats.)
          apikey: SUPABASE_SERVICE_KEY,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ name, email, project_type, timeline, location, message }),
      });
      results.saved = dbRes.ok;
      if (!dbRes.ok) console.error('Supabase insert failed:', await dbRes.text());
    } catch (err) {
      console.error('Supabase insert error:', err);
    }
  }

  // 2. Notify by email via Resend
  if (RESEND_API_KEY && RESEND_FROM_EMAIL) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: NOTIFY_EMAIL,
          reply_to: email,
          subject: `New inquiry — ${project_type} (${name})`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Project type: ${project_type}`,
            `Timeline: ${timeline || 'not specified'}`,
            `Location: ${location || 'not specified'}`,
            '',
            message,
          ].join('\n'),
        }),
      });
      results.emailed = emailRes.ok;
      if (!emailRes.ok) console.error('Resend send failed:', await emailRes.text());
    } catch (err) {
      console.error('Resend send error:', err);
    }
  }

  // As long as at least one channel succeeded (or neither is configured yet,
  // which shouldn't happen in production), tell the visitor it went through.
  if (!SUPABASE_URL && !RESEND_API_KEY) {
    res.status(500).json({ error: 'Form is not configured yet — no destination set.' });
    return;
  }

  if ((SUPABASE_URL && !results.saved) && (RESEND_API_KEY && !results.emailed)) {
    res.status(502).json({ error: 'Could not save or send the inquiry. Please try email instead.' });
    return;
  }

  res.status(200).json({ ok: true, ...results });
};
