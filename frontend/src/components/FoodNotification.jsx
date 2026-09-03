import { useState } from 'react';
import { sendTelegramNotification } from '../api/telegramNotifier';
import './FoodNotification.css';

export default function FoodNotification({ onAnswer }) {
  const [pressed, setPressed] = useState(false);

  async function handleClick(answer) {
    if (pressed) return;
    setPressed(true);

    const timeStr = new Date().toLocaleString('ta-IN', { timeZone: 'Asia/Kolkata' });
    const msg = answer === 'yes'
      ? `✅ <b>Saaptiyaa Answer: YES!</b> 🍱\nShe answered YES (Saaptutaal) at ${timeStr}`
      : `❌ <b>Saaptiyaa Answer: NO!</b> 💔\nShe answered NO (Innum saapdala!) at ${timeStr}`;

    try {
      await sendTelegramNotification(msg);
    } catch (err) {
      console.error('Telegram notification error:', err);
    }

    onAnswer(answer);
  }

  return (
    <div className="notif-overlay">
      <div className="notif-blob nb1" />
      <div className="notif-blob nb2" />
      <div className="notif-blob nb3" />

      <div className="notif-card glass-card">
        <div className="notif-icon-wrap">
          <div className="notif-ring-outer" />
          <div className="notif-ring-inner" />
          <span className="notif-icon">🍱</span>
        </div>

        <div className="notif-text-block">
          <p className="notif-title serif">Hey… 💜</p>
          <p className="notif-question">Saaptiyaa Illaiyaa?</p>
          <p className="notif-sub">Kavalaiyaa Irukku 🌸</p>
        </div>

        <div className="notif-btns">
          <button id="notif-yes-btn" className="notif-btn notif-btn-yes" onClick={() => handleClick('yes')} disabled={pressed}>
            {pressed ? <span className="spinner" /> : '✅ Yes'}
          </button>
          <button id="notif-no-btn" className="notif-btn notif-btn-no" onClick={() => handleClick('no')} disabled={pressed}>
            {pressed ? <span className="spinner" /> : '❌ No'}
          </button>
        </div>
      </div>
    </div>
  );
}
