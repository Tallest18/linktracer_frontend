const BASE = process.env.REACT_APP_API_URL || '';

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  getStaff:    ()     => req('GET',    '/api/staff'),
  getStats:    ()     => req('GET',    '/api/stats'),
  addStaff:    (name) => req('POST',   '/api/staff', { name }),
  deleteStaff: (id)   => req('DELETE', `/api/staff/${id}`),
  resetClicks: (id)   => req('POST',   `/api/staff/${id}/reset`),
  getClickLog: (id)   => req('GET',    `/api/clicks/${id}`),
};

export function trackingUrl(slug) {
  const origin = process.env.REACT_APP_BASE_URL || window.location.origin;
  return `${origin}/ref/${slug}`;
}
