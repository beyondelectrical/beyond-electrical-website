/* ============================================================
   Inquiry form handler
   ------------------------------------------------------------
   Submits to /api/inquire — a Vercel serverless function that
   saves to Supabase and/or emails via Resend. No API keys live
   in this file or anywhere else in the browser-visible code.

   See api/inquire.js for the environment variables that need to
   be set in Vercel for this to actually save/send anything.
   ============================================================ */

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

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
