// src/services/api.js

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

// Generic helper to send requests
async function request(path, method = "GET", body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("access_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  return res.json();
}

// ✅ REGISTER
export function registerUser(email, password) {
  return request("/api/auth/register", "POST", { email, password });
}

// ✅ LOGIN (supports TOTP — will expand soon)
export async function loginUser(email, password, totp) {
  const data = await request("/api/auth/login", "POST", { email, password, totp });

  if (data.access) {
    localStorage.setItem("access_token", data.access);
  }

  return data;
}

// ✅ Example protected route
export function getAssets() {
  return request("/api/assets", "GET", null, true);
}
