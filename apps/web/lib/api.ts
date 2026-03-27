const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

export function getToken() { return typeof window !== 'undefined' ? localStorage.getItem('fc_access_token') : null; }
export function getRefreshToken() { return typeof window !== 'undefined' ? localStorage.getItem('fc_refresh_token') : null; }
export function setTokens(access: string, refresh: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fc_access_token', access);
    localStorage.setItem('fc_refresh_token', refresh);
  }
}
export function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fc_access_token');
    localStorage.removeItem('fc_refresh_token');
  }
}

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function refreshTokens(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token');
  const res = await fetch(`${BASE}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: refresh }) });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE}${endpoint}`;
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && getRefreshToken()) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((newToken) => {
          headers['Authorization'] = `Bearer ${newToken}`;
          fetch(url, { ...options, headers }).then(r => r.json()).then(resolve).catch(reject);
        });
      });
    }
    isRefreshing = true;
    try {
      const newToken = await refreshTokens();
      refreshQueue.forEach(cb => cb(newToken));
      refreshQueue = [];
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    } catch {
      clearTokens();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Session expired');
    } finally {
      isRefreshing = false;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json: any = await res.json();
    return json.success && json.data !== undefined ? json.data : json;
  }
  return res.text() as any;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body: any) =>
    request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request<any>('/auth/me'),
  logout: () => {
    const rt = getRefreshToken();
    return request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: rt }) });
  },
  refresh: () => refreshTokens(),

  // Generic
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: any) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: any) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

  // Donations
  getDonations: (query = '') => request<any>(`/donations?${query}`),
  createDonation: (body: any) => request<any>('/donations', { method: 'POST', body: JSON.stringify(body) }),
  getDonation: (id: string) => request<any>(`/donations/${id}`),
  acceptDonation: (donationId: string, ngoId: string) =>
    request<any>(`/donations/${donationId}/accept`, { method: 'PATCH', body: JSON.stringify({ ngoId }) }),
  rejectDonation: (donationId: string, reason: string) =>
    request<any>(`/donations/${donationId}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  getRecommendations: (donationId: string) => request<any>(`/matching/${donationId}`),

  // NGOs
  getNgos: (query = '') => request<any>(`/ngos?${query}`),
  getMyNgo: () => request<any>('/ngos/mine'),
  getNgo: (id: string) => request<any>(`/ngos/${id}`),
  updateMyNgo: (body: any) => request<any>('/ngos/mine', { method: 'PATCH', body: JSON.stringify(body) }),

  // Hotspots
  getHotspots: (query = '') => request<any>(`/hotspots?${query}`),

  // Volunteers
  getMyVolunteer: () => request<any>('/volunteers/mine'),
  getVolunteerRoutes: () => request<any>('/routes?mine=true'),

  // Analytics
  getAdminAnalytics: () => request<any>('/analytics/admin').catch(() => ({})),
  getDonorAnalytics: () => request<any>('/analytics/donor').catch(() => ({})),

  // Donors
  getMyDonor: () => request<any>('/donors/mine').catch(() => null),
};
