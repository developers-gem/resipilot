const API_BASE = import.meta.env.VITE_API_URL || '/api';

let token = null;

export function setToken(t) {
  token = t;
}

async function request(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    body: body
      ? JSON.stringify(body)
      : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({
      error: res.statusText,
    }));

    throw new Error(
      err.error || 'Request failed'
    );
  }

  return res.json();
}

// NEW
async function upload(
  path,
  formData
) {
  const res = await fetch(
    `${API_BASE}${path}`,
    {
      method: 'POST',
      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({
      error: res.statusText,
    }));

    throw new Error(
      err.error || 'Upload failed'
    );
  }

  return res.json();
}

export const api = {
  get: p => request('GET', p),
  post: (p, b) =>
    request('POST', p, b),
  patch: (p, b) =>
    request('PATCH', p, b),
  delete: p =>
    request('DELETE', p),

  upload,
};