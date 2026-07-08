/* ============================================================
   Inquiry form handler
   ------------------------------------------------------------
   To make this form actually save submissions, connect it to
   Supabase:

   1. In your Supabase project, create a table called "inquiries"
      with columns: id (uuid, auto), created_at (timestamptz, auto),
      name (text), email (text), project_type (text),
      timeline (text), location (text), message (text).

   2. Add an RLS policy on that table that allows INSERT for the
      "anon" role only (no SELECT/UPDATE/DELETE for anon) — this
      keeps the public form safe to expose a public key for.

   3. Fill in SUPABASE_URL and SUPABASE_ANON_KEY below with the
      values from Project Settings > API in your Supabase dashboard.

   Until those two values are filled in, the form will show a
   friendly message directing people to email you directly instead
   of failing silently.
   ============================================================ */

const SUPABASE_URL = ''; // e.g. 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = ''; // the "anon" public key, not the service key

const form = document.getElementById('inquireForm');
const statusEl = document.getElementById('formStatus');

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = 'form-status visible ' + type;
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      project_type: form.projectType.value,
      timeline: form.timeline.value,
      location: form.location.value.trim(),
      message: form.message.value.trim(),
    };

    if (!payload.name || !payload.email || !payload.project_type || !payload.message) {
      showStatus('Please fill in your name, email, project type, and a short message.', 'err');
      return;
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      showStatus(
        "This form isn't fully connected yet — please email info@beyondelectrical.ca directly for now and we'll get right back to you.",
        'err'
      );
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Request failed: ' + res.status);

      form.reset();
      showStatus("Thanks — that's on its way to us. We'll follow up within two business days.", 'ok');
    } catch (err) {
      showStatus(
        "Something went wrong sending that. Please email info@beyondelectrical.ca directly and we'll get right back to you.",
        'err'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Inquiry';
    }
  });
}
