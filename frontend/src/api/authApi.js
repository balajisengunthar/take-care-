import axios from 'axios';
import BASE_URL from './config';

const TOKEN_KEY = 'fm_token';
const USER_KEY  = 'fm_user';

// ─── Demo credentials (used when backend is offline) ─────────────────────────
const DEMO_USERS = [
  { name: 'Bala',   password: 'bala123', role: 'SENDER'   },
  { name: 'Her',    password: 'her123',  role: 'RECEIVER'  },
];

function makeDemoToken(user) {
  // Simple base64 "token" for demo mode — backend will replace this with real JWT
  return btoa(JSON.stringify({ name: user.name, role: user.role, demo: true }));
}
// ─────────────────────────────────────────────────────────────────────────────

export async function login(name, password) {
  try {
    // Try the real backend first
    const { data } = await axios.post(
      `${BASE_URL}/auth/login`,
      { name, password },
      { timeout: 3000 }
    );
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    // If backend is unreachable (network error), fall back to demo mode
    const isNetworkError =
      !err.response ||
      err.code === 'ECONNREFUSED' ||
      err.code === 'ERR_NETWORK' ||
      err.message?.includes('Network Error');

    if (isNetworkError) {
      // Validate against demo credentials
      const match = DEMO_USERS.find(
        u =>
          u.name.toLowerCase() === name.toLowerCase() &&
          u.password === password
      );
      if (match) {
        const user = { name: match.name, role: match.role };
        localStorage.setItem(TOKEN_KEY, makeDemoToken(match));
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
      }
      // Wrong credentials even in demo mode
      throw { response: { data: { message: 'Invalid name or password. 💔' } } };
    }

    // Real backend error (e.g. 401) — pass it through
    throw err;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

export function isDemoMode() {
  try {
    const token = getToken();
    if (!token) return false;
    const parsed = JSON.parse(atob(token));
    return parsed.demo === true;
  } catch {
    return false;
  }
}
