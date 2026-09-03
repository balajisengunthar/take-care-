import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../api/chatApi';
import './ChatBox.css';

const POLL_INTERVAL = 3000;

export default function ChatBox({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState('');
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);

  // Initial load + polling
  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Auto-scroll to latest
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchMessages() {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch {
      // silently fail polling
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setSending(true);
    setError('');
    try {
      await sendMessage(text);
      setInput('');
      await fetchMessages();
    } catch {
      setError('Could not send. Try again 💔');
    } finally {
      setSending(false);
    }
  }

  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const isMe = (msg) => msg.senderName === currentUser.name;

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <span className="chatbox-title serif">💬 Our Space</span>
        <span className="chatbox-online">
          <span className="online-dot" /> Live
        </span>
      </div>

      <div className="chatbox-messages scroll-area">
        {messages.length === 0 && (
          <div className="chat-empty">
            <span>Say something…</span>
            <span className="chat-empty-emoji">💜</span>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={msg.id ?? i}
            className={`chat-bubble-wrap ${isMe(msg) ? 'me' : 'them'}`}
          >
            {!isMe(msg) && (
              <div className="chat-avatar">{msg.senderName?.charAt(0).toUpperCase()}</div>
            )}
            <div className={`chat-bubble ${isMe(msg) ? 'bubble-me' : 'bubble-them'}`}>
              {!isMe(msg) && (
                <div className="chat-sender-name">{msg.senderName}</div>
              )}
              <div className="chat-text">{msg.content}</div>
              <div className="chat-time">{formatTime(msg.sentAt)}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <div className="chat-error">{error}</div>}

      <form className="chatbox-input-row" onSubmit={handleSend}>
        <input
          id="chat-input"
          className="input chat-input"
          type="text"
          placeholder="Write something…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={sending}
          maxLength={500}
          autoComplete="off"
        />
        <button
          id="chat-send-btn"
          type="submit"
          className="chat-send-btn"
          disabled={sending || !input.trim()}
          aria-label="Send message"
        >
          {sending ? <span className="spinner" /> : '💌'}
        </button>
      </form>
    </div>
  );
}
