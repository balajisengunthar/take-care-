import axios from 'axios';
import BASE_URL from './config';
import { authHeaders, isDemoMode } from './authApi';

// In-memory store for demo mode messages
const demoMessages = [];
let demoIdCounter = 1;

export async function getMessages() {
  if (isDemoMode()) return [...demoMessages];
  try {
    const { data } = await axios.get(`${BASE_URL}/chat/messages`, {
      headers: authHeaders(),
      timeout: 3000,
    });
    return data;
  } catch {
    return [...demoMessages];
  }
}

export async function sendMessage(content) {
  if (isDemoMode()) {
    const stored = JSON.parse(localStorage.getItem('fm_user') || '{}');
    const msg = {
      id: demoIdCounter++,
      senderName: stored.name || 'Me',
      content,
      sentAt: new Date().toISOString(),
    };
    demoMessages.push(msg);
    return msg;
  }
  const { data } = await axios.post(
    `${BASE_URL}/chat/messages`,
    { content },
    { headers: authHeaders() }
  );
  return data;
}

