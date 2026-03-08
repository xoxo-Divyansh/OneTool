const BASE = "/api/auth";

async function request(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    if (data?.message) {
      throw new Error(data.message);
    }

    if (!isJson) {
      throw new Error("Request failed: unexpected non-JSON server response");
    }

    throw new Error("Request failed");
  }

  return data || { success: true };
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
  return request(`${BASE}/me`);
}
