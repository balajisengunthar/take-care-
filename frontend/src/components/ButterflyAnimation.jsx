import { useEffect, useState } from 'react';
import './ButterflyAnimation.css';

const NUM_BUTTERFLIES = 12;

function createButterfly(id) {
  const colors = ['#e05b8a', '#a66dd4', '#f0c060', '#7b3fa8', '#f08cb0', '#6de0a8', '#60b0f0', '#f0a060'];
  return {
    id,
    color:   colors[Math.floor(Math.random() * colors.length)],
    size:    Math.random() * 26 + 24,
    top:     Math.random() * 60 + 15,
    delay:   Math.random() * 1.8,
    dur:     Math.random() * 1.5 + 2,
    dir:     Math.random() > 0.5 ? 1 : -1,
    waveAmp: Math.random() * 60 + 20,
  };
}

export default function ButterflyAnimation({ answer, onDone }) {
  const [butterflies] = useState(() =>
    Array.from({ length: NUM_BUTTERFLIES }, (_, i) => createButterfly(i))
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const maxTime = Math.max(...butterflies.map(b => (b.delay + b.dur) * 1000));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500);
    }, maxTime + 300);
    return () => clearTimeout(timer);
  }, []);

  const answerText = answer === 'yes'
    ? 'நல்லது! எப்பவும் கவலைப்படாதே 💜'
    : 'சீக்கிரம் சாப்பிடு! அவன் கவலைப்படுறான் 🙏';

  return (
    <div className={`min-h-dvh w-full max-w-[430px] relative overflow-hidden flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_50%,#1a0628_0%,#0d0612_100%)] transition-opacity duration-500 ${!visible ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background Blobs using Tailwind */}
      <div className="absolute w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,#7b3fa8,transparent)] top-[20%] -left-[60px] blur-[80px] opacity-25 pointer-events-none animate-pulse" />
      <div className="absolute w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle,#e05b8a,transparent)] bottom-[20%] -right-[40px] blur-[80px] opacity-25 pointer-events-none animate-pulse" />

      {/* Center Answer Text styled with Tailwind utilities */}
      <div className="absolute top-[45%] inset-x-0 mx-auto w-[90%] max-w-[360px] px-4 text-center z-10 pointer-events-none leading-relaxed text-xl sm:text-2xl font-bold tracking-wide text-[#f5e6ff] drop-shadow-[0_0_35px_rgba(224,91,138,0.75)] animate-pulse serif">
        {answerText}
      </div>

      {/* Animated Butterflies */}
      {butterflies.map(b => (
        <div
          key={b.id}
          className="butterfly-wrap absolute z-5 pointer-events-none"
          style={{
            top:               `${b.top}%`,
            left:              b.dir > 0 ? '-80px' : 'calc(100% + 80px)',
            animationDelay:    `${b.delay}s`,
            animationDuration: `${b.dur}s`,
            '--wave':          `${b.waveAmp}px`,
            '--dir':           b.dir,
          }}
        >
          <svg className="butterfly-svg" width={b.size} height={b.size} viewBox="0 0 64 64">
            <ellipse className="wing-left"  cx="20" cy="28" rx="18" ry="12" fill={b.color} opacity="0.85" />
            <ellipse cx="16" cy="42" rx="12" ry="8" fill={b.color} opacity="0.65" />
            <ellipse className="wing-right" cx="44" cy="28" rx="18" ry="12" fill={b.color} opacity="0.85" />
            <ellipse cx="48" cy="42" rx="12" ry="8" fill={b.color} opacity="0.65" />
            <ellipse cx="32" cy="34" rx="3" ry="10" fill="#2a0a1e" opacity="0.8" />
            <line x1="32" y1="24" x2="22" y2="14" stroke="#2a0a1e" strokeWidth="1.5" opacity="0.7" />
            <circle cx="22" cy="14" r="2" fill="#2a0a1e" opacity="0.7" />
            <line x1="32" y1="24" x2="42" y2="14" stroke="#2a0a1e" strokeWidth="1.5" opacity="0.7" />
            <circle cx="42" cy="14" r="2" fill="#2a0a1e" opacity="0.7" />
          </svg>
        </div>
      ))}

      {/* Sparkle particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={`spark-${i}`}
          className="spark absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            left:            `${Math.random() * 100}%`,
            top:             `${Math.random() * 100}%`,
            animationDelay:  `${Math.random() * 2}s`,
            '--spark-color': ['#e05b8a','#f0c060','#a66dd4','#6de0a8'][i % 4],
          }}
        />
      ))}
    </div>
  );
}

