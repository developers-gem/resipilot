let token = null;
export function setToken(t) { token = t; }

async function request(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  get:    (p)    => request('GET', p),
  post:   (p, b) => request('POST', p, b),
  patch:  (p, b) => request('PATCH', p, b),
  delete: (p)    => request('DELETE', p),
};
