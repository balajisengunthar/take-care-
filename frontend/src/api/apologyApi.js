import axios from 'axios';
import BASE_URL from './config';
import { authHeaders, isDemoMode } from './authApi';

const DEMO_STATUS_KEY = 'fm_demo_apology_status';

export async function getApologyStatus() {
  if (isDemoMode()) {
    const stored = localStorage.getItem(DEMO_STATUS_KEY) || 'WAITING';
    return { id: 1, status: stored };
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/apology/status`, {
      headers: authHeaders(),
      timeout: 3000,
    });
    return data;
  } catch {
    const stored = localStorage.getItem(DEMO_STATUS_KEY) || 'WAITING';
    return { id: 1, status: stored };
  }
}

export async function updateApologyStatus(status) {
  if (isDemoMode()) {
    localStorage.setItem(DEMO_STATUS_KEY, status);
    return { id: 1, status };
  }
  const { data } = await axios.post(
    `${BASE_URL}/apology/status`,
    { status },
    { headers: authHeaders() }
  );
  return data;
}

