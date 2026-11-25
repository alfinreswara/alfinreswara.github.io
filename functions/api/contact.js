const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECIPIENT_EMAIL = 'alfinreswara@gmail.com';

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...extraHeaders
    }
  });
}

function validateContactPayload({ name, email, message }) {
  if (!name) {
    return 'Nama wajib diisi.';
  }
  if (name.length > 100) {
    return 'Nama maksimal 100 karakter.';
  }
  if (!email || email.length > 254 || /[\r\n]/.test(email) || !EMAIL_REGEX.test(email)) {
    return 'Format email tidak valid.';
  }
  if (!message || message.length < 10) {
    return 'Pesan minimal 10 karakter.';
  }
  if (message.length > 3000) {
    return 'Pesan maksimal 3000 karakter.';
  }
  return null;
}

function buildPlainTextMessage({ name, email, message }) {
  return [
    'Pesan Baru dari Portfolio Contact Form',
    '',
    `Nama: ${name}`,
    `Email: ${email}`,
    '',
    'Pesan:',
    message
  ].join('\n');
}

async function sendTelegramNotification(env, text) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return false;
  }

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return Boolean(result && result.ok);
  } catch {
    return false;
  }
}

async function sendResendEmail(env, { name, email, text }) {
  if (!env.RESEND_API_KEY) {
    return;
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [RECIPIENT_EMAIL],
        reply_to: email,
        subject: `Portfolio Contact: ${name}`,
        text
      })
    });
  } catch {
    // Resend bersifat opsional; kegagalan email tidak boleh menggagalkan request
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return jsonResponse(
      { ok: false, error: 'Method not allowed.' },
      405,
      { Allow: 'POST' }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON payload.' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ ok: false, error: 'Invalid request body.' }, 400);
  }

  const website = typeof body.website === 'string' ? body.website.trim() : '';
  if (website.length > 0) {
    return jsonResponse({ ok: true }, 200);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  const validationError = validateContactPayload({ name, email, message });
  if (validationError) {
    return jsonResponse({ ok: false, error: validationError }, 400);
  }

  const plainText = buildPlainTextMessage({ name, email, message });
  const telegramSent = await sendTelegramNotification(env, plainText);

  if (!telegramSent) {
    return jsonResponse(
      { ok: false, error: 'Gagal mengirim pesan ke Telegram.' },
      502
    );
  }

  await sendResendEmail(env, { name, email, text: plainText });

  return jsonResponse({ ok: true }, 200);
}
