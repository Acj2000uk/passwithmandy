import { createHash, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const FALLBACK = {
  month: 'November',
  year: 2026,
  updatedAt: null
};

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  }
});

function passwordMatches(candidate, expected) {
  const candidateBuffer = Buffer.from(String(candidate || ''));
  const expectedBuffer = Buffer.from(String(expected || ''));
  if (candidateBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

function attemptKey(request) {
  const address = request.headers.get('x-nf-client-connection-ip')
    || request.headers.get('x-forwarded-for')
    || 'unknown';
  return `login-${createHash('sha256').update(address).digest('hex')}`;
}

export default async (request) => {
  const store = getStore('pass-with-mandy-settings');

  if (request.method === 'GET') {
    const saved = await store.get('availability', { type: 'json' });
    return json(saved || FALLBACK);
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return json({ error: 'Admin password has not been configured.' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const loginKey = attemptKey(request);
  const attempts = await store.get(loginKey, { type: 'json' }) || { count: 0, lockedUntil: 0 };
  if (attempts.lockedUntil > Date.now()) {
    return json({ error: 'Too many attempts. Wait 15 minutes and try again.' }, 429);
  }

  if (!passwordMatches(body.password, expectedPassword)) {
    const count = attempts.count + 1;
    await store.setJSON(loginKey, {
      count,
      lockedUntil: count >= 5 ? Date.now() + (15 * 60 * 1000) : 0
    });
    return json({ error: 'Incorrect password.' }, 401);
  }

  await store.delete(loginKey);

  if (body.action === 'verify') {
    return json({ authenticated: true });
  }

  if (body.action !== 'update') {
    return json({ error: 'Invalid action.' }, 400);
  }

  const month = String(body.month || '');
  const year = Number(body.year);
  const thisYear = new Date().getFullYear();

  if (!MONTHS.includes(month) || !Number.isInteger(year) || year < thisYear || year > thisYear + 4) {
    return json({ error: 'Choose a valid month and year.' }, 400);
  }

  const availability = {
    month,
    year,
    updatedAt: new Date().toISOString()
  };

  await store.setJSON('availability', availability);
  return json(availability);
};

export const config = {
  path: '/api/availability'
};
