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
  // Stats
  getStats:        ()              => req('GET',    '/api/stats'),
  // Staff
  getStaff:        ()              => req('GET',    '/api/staff'),
  addStaff:        (name)          => req('POST',   '/api/staff', { name }),
  deleteStaff:     (id)            => req('DELETE', `/api/staff/${id}`),
  // Campaigns
  getCampaigns:    ()              => req('GET',    '/api/campaigns'),
  createCampaign:  (name, url)     => req('POST',   '/api/campaigns', { name, destination_url: url }),
  deleteCampaign:  (id)            => req('DELETE', `/api/campaigns/${id}`),
  getCampaignStats:(id)            => req('GET',    `/api/campaigns/${id}/stats`),
};
