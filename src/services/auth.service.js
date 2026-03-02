const BASE = "/api/auth";

async function request(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}

export async function register({ name, email, password }) {
  return request(`${BASE}/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login({ email, password }) {
  return request(`${BASE}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return request(`${BASE}/logout`, { method: "POST" });
}

export async function me() {
  // current route sits under /auth/me; keep consistency
  return request(`${BASE}/me`);
}
