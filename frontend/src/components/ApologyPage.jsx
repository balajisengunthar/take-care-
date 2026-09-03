import { useEffect, useState, useRef } from 'react';
import { sendTelegramNotification } from '../api/telegramNotifier';
import MusicPlayer from './MusicPlayer';
import SimpleChat from './SimpleChat';
import './ApologyPage.css';

// ─── EmailJS Config (same as FoodNotification) ───────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const NOTIFY_EMAIL        = 'balasekaranssc@gmail.com';
// ─────────────────────────────────────────────────────────────────────────────

const APOLOGY_MESSAGE = `Sorry for everything… Please forgive me, Thanjore Rani 👑

Unkitta appadi kettadhu thappu dhaan… adhu enakke theriyum. Nee appadi solli irukka maatta nu enakkum theriyum.

Aana andha nerathula naan romba confused-aa irundhen… andha situation-ai eppadi handle panradhu, enna panradhu nu enakku suthama puriyala. Adhanala yosikkama appadi kettutten.

Ippo yosichu paatha, naan appadi kettadhu unna evlo uncomfortable-aa feel panna vechirukkum nu puriyudhu. Adhukkaaga nijamaave sorry.

En intention unna hurt panradhu illa… aana intention edhuva irundhaalum, naan pannadhu thappu dhaan. Adha justify panna naan virumbala. En thappai naan accept panren.

Please enna thappa ninaikaadha… andha oru situation-la naan handle panna theriyama pannadhu dhaan.

Un nalla friend-aa unna romba miss pannitten… adhanala dhaan daily-um unna veliya vara solli ketten. Ippo yosichu paatha, adhu en thappu dhaan nu puriyudhu. Unakku uncomfortable-aa irundhirundha, adhukkaaga nijamaave sorry.

Inime ipdi pannave maatten, un space-aiyum feelings-aiyum respect panren. Andha naal unna easy-aa irukkanum nu nenachu naan edhuvum pannala… unna disturb pannavo, uncomfortable-aa feel panna vaikavo enakku konjam kooda intention illa.

Unna oru nalla friend-aa romba miss pannadhu dhaan ennoda mistake-ku reason… aana adhu ennoda thappai justify panna mudiyadhu.

Sorry… nijamaave manasara sorry 🤝🌿`;

const FLOAT_EMOJIS = ['🤝', '🌸', '✨', '💛', '🌿', '💫', '🩷', '🤍', '🦋'];

export default function ApologyPage() {
  const [charIndex, setCharIndex]   = useState(0);
  const [hearts, setHearts]         = useState([]);
  const [showSign, setShowSign]     = useState(false);
  const [showChat, setShowChat]     = useState(false);
  const [accepted, setAccepted]     = useState(false);
  const [accepting, setAccepting]   = useState(false);
  const [toastMsg, setToastMsg]     = useState('');
  const heartCounterRef = useRef(0);
  const cursorRef       = useRef(null);
  const popupRef        = useRef(null);
  const scrollRef       = useRef(null);

  // Typewriter effect + Auto-scroll down slowly
  useEffect(() => {
    if (charIndex >= APOLOGY_MESSAGE.length) {
      setTimeout(() => setShowSign(true), 400);
      return;
    }
    const t = setTimeout(() => {
      setCharIndex(i => i + 1);
      // Auto scroll to cursor so new lines are always visible
      if (cursorRef.current) {
        cursorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 38);
    return () => clearTimeout(t);
  }, [charIndex]);

  // Scroll to popup card when letter finishes
  useEffect(() => {
    if (showSign && popupRef.current) {
      setTimeout(() => {
        popupRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [showSign]);

  // Floating hearts/emojis
  useEffect(() => {
    const id = setInterval(() => {
      heartCounterRef.current += 1;
      const hid = heartCounterRef.current;
      setHearts(prev => [
        ...prev,
        {
          id:    hid,
          emoji: FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)],
          left:  Math.random() * 82 + 6,
          size:  Math.random() * 14 + 12,
          dur:   Math.random() * 2 + 2.5,
        },
      ]);
      setTimeout(() => setHearts(p => p.filter(h => h.id !== hid)), 5500);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  async function handleAccept() {
    setAccepting(true);
    const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    try {
      await sendTelegramNotification(
        `💚 <b>SHE ACCEPTED YOUR APOLOGY!</b> 🌿🎉\n\nShe clicked 'Forgive Me' on the app at ${timeStr}! Go make it count! 🤝`
      );
    } catch (err) {
      console.error('Telegram notification failed:', err);
    }
    setAccepted(true);
    setAccepting(false);
    showToast('💚 Notification sent! Thank you 🌿');
  }

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  }

  return (
    <div className="apology-page">
      {/* Floating emojis layer */}
      <div className="hearts-layer" aria-hidden="true">
        {hearts.map(h => (
          <span
            key={h.id}
            className="float-heart"
            style={{
              left:              `${h.left}%`,
              fontSize:          `${h.size}px`,
              animationDuration: `${h.dur}s`,
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      {/* Top bar */}
      <header className="apology-topbar">
        <div className="apology-brand serif">💜 Forgive Me</div>
      </header>

      {/* Scrollable content */}
      <main ref={scrollRef} className="apology-content scroll-area">

        {/* Letter card */}
        <div className="letter-card glass-card page-enter">
          <div className="letter-seal">
            <span className="letter-seal-icon">🤝</span>
          </div>

          <h1 className="letter-heading serif shimmer-text">
            A letter for you…
          </h1>

          <div className="letter-divider" />

          <p className="letter-body serif">
            {APOLOGY_MESSAGE.substring(0, charIndex)}
            {charIndex < APOLOGY_MESSAGE.length && (
              <span ref={cursorRef} className="letter-cursor">|</span>
            )}
          </p>

          {showSign && (
            <p className="letter-sign serif page-enter">
              — From your true friend 🤝🌿
            </p>
          )}
        </div>

        {/* ── Accept / Forgive Pop-up Card ── */}
        {showSign && !accepted && (
          <div ref={popupRef} className="apology-popup-card glass-card page-enter">
            <div className="popup-icon">🙏🌿</div>
            <p className="popup-msg serif">
              "Ella thappum en mela dhaan… naan pannadhu thappu nu enakku puriyudhu. Adhuku endha excuse-um solla maatten. Unna hurt pannirundha, uncomfortable-aa feel panna vechirundha, manasara sorry. Please enna mannichidu… inimel indha maadhiri oru situation unakku varama, naan kandippa paathukuren. 🙏
              <br /><br />
              Please unblock me please… miss u as frnd 🤝🌿"
            </p>
            <button
              id="accept-forgive-btn"
              className="btn accept-btn"
              onClick={handleAccept}
              disabled={accepting}
            >
              {accepting ? (
                <><span className="spinner" /> Sending…</>
              ) : (
                <>💚 Forgive Me</>
              )}
            </button>
          </div>
        )}

        {/* Accepted banner */}
        {accepted && (
          <div className="accepted-banner glass-card page-enter">
            <span className="accepted-icon">🌿</span>
            <div>
              <div className="accepted-title serif">You forgave him 💚</div>
              <div className="accepted-sub">He's been notified. Thank you so much. 💜</div>
            </div>
          </div>
        )}

        {/* Chat toggle */}
        <div className="chat-section">
          <button
            id="toggle-chat-btn"
            className="btn btn-ghost btn-full chat-toggle-btn"
            onClick={() => setShowChat(v => !v)}
          >
            {showChat ? '✕ Close chat' : '💬 Open chat'}
          </button>

          {showChat && (
            <div className="chat-wrapper page-enter">
              <SimpleChat />
            </div>
          )}
        </div>

        {/* Bottom spacing for music player */}
        <div style={{ height: '110px' }} />
      </main>

      {/* Music player fixed at bottom */}
      <MusicPlayer />

      {/* Toast */}
      {toastMsg && (
        <div className="toast toast-success">{toastMsg}</div>
      )}
    </div>
  );
}
