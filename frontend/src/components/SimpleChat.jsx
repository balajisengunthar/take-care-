import { useState, useEffect, useRef } from 'react';
import './SimpleChat.css';

const CHAT_KEY    = 'fm_chat_messages';
const SENDER_NAME = 'Him';
const HER_NAME    = 'Her';

function loadMessages() {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '[]'); }
  catch { return []; }
}

function saveMessages(msgs) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
}

export default function SimpleChat() {
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput]       = useState('');
  const [activeName, setActiveName] = useState(HER_NAME);
  const bottomRef = useRef(null);

  // Poll localStorage every 2s (works if both people on same device/shared storage)
  useEffect(() => {
    const id = setInterval(() => {
      const fresh = loadMessages();
      setMessages(fresh);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const msg = {
      id:         Date.now(),
      senderName: activeName,
      content:    text,
      sentAt:     new Date().toISOString(),
    };
    const updated = [...loadMessages(), msg];
    saveMessages(updated);
    setMessages(updated);
    setInput('');
  }

  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString('ta-IN', { hour: '2-digit', minute: '2-digit' });
  }

  const isMe = (msg) => msg.senderName === activeName;

  return (
    <div className="simple-chat glass-card">
      <div className="sc-header">
        <span className="sc-title serif">💬 Our Space</span>
        {/* Toggle who you are */}
        <div className="sc-role-toggle">
          <button
            className={`sc-role-btn ${activeName === HER_NAME ? 'active' : ''}`}
            onClick={() => setActiveName(HER_NAME)}
          >{HER_NAME}</button>
          <button
            className={`sc-role-btn ${activeName === SENDER_NAME ? 'active' : ''}`}
            onClick={() => setActiveName(SENDER_NAME)}
          >{SENDER_NAME}</button>
        </div>
      </div>

      <div className="sc-messages scroll-area">
        {messages.length === 0 && (
          <div className="sc-empty serif">
            <span>Say something… 💜</span>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`sc-bubble-wrap ${isMe(msg) ? 'me' : 'them'}`}>
            {!isMe(msg) && (
              <div className="sc-avatar">{msg.senderName.charAt(0)}</div>
            )}
            <div className={`sc-bubble ${isMe(msg) ? 'bubble-me' : 'bubble-them'}`}>
              {!isMe(msg) && <div className="sc-name">{msg.senderName}</div>}
              <div className="sc-text">{msg.content}</div>
              <div className="sc-time">{formatTime(msg.sentAt)}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="sc-input-row" onSubmit={handleSend}>
        <input
          id="simple-chat-input"
          className="input sc-input"
          type="text"
          placeholder="Write a message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          maxLength={300}
          autoComplete="off"
        />
        <button
          id="simple-chat-send"
          type="submit"
          className="sc-send-btn"
          disabled={!input.trim()}
          aria-label="Send"
        >💌</button>
      </form>
    </div>
  );
}
