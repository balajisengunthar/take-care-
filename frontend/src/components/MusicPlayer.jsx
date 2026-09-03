import { useEffect, useRef, useState } from 'react';
import './MusicPlayer.css';

const TRACKS = [
  {
    title: 'Khat',
    artist: 'Navjot Ahuja',
    badge: '💌 Featured Song',
    youtubeId: 'KiNr9y-_NKo',
    url: '/music/khat-navjot.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    title: 'Clair de Lune',
    artist: 'Debussy',
    badge: '🌙 Ambient',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'A Gentle Apology',
    artist: 'Soft Piano',
    badge: '🎹 Soft Piano',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const audioRef                  = useRef(null);
  const [playing, setPlaying]     = useState(false);
  const [trackIdx, setTrackIdx]   = useState(0);
  const [progress, setProgress]   = useState(0);
  const [expanded, setExpanded]   = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);
  const track = TRACKS[trackIdx];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => nextTrack();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [trackIdx]);

  function handleAudioError(e) {
    // If local mp3 fails, fallback to online stream if available
    if (track.fallbackUrl && e.target.src !== track.fallbackUrl) {
      e.target.src = track.fallbackUrl;
      if (playing) e.target.play().catch(() => {});
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        // If audio blocked or file missing, open YouTube option if available
        if (track.youtubeId) {
          setShowYoutube(true);
        }
      });
    }
  }

  function nextTrack() {
    const next = (trackIdx + 1) % TRACKS.length;
    setTrackIdx(next);
    setProgress(0);
    setTimeout(() => {
      if (playing) audioRef.current?.play().catch(() => {});
    }, 150);
  }

  function prevTrack() {
    const prev = (trackIdx - 1 + TRACKS.length) % TRACKS.length;
    setTrackIdx(prev);
    setProgress(0);
    setTimeout(() => {
      if (playing) audioRef.current?.play().catch(() => {});
    }, 150);
  }

  function seekTo(e) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const pct  = x / rect.width;
    audio.currentTime = pct * audio.duration;
  }

  return (
    <div className={`music-player glass-card ${expanded ? 'expanded' : ''}`}>
      <audio
        ref={audioRef}
        src={track.url}
        preload="metadata"
        onError={handleAudioError}
      />

      {/* Collapsed pill */}
      <div className="music-pill" onClick={() => setExpanded(v => !v)}>
        <div className={`music-bars ${playing ? 'active' : ''}`}>
          <span /><span /><span /><span />
        </div>
        <div className="music-pill-info">
          <span className="music-pill-title">{track.title} — {track.artist}</span>
          {track.badge && <span className="music-pill-badge">{track.badge}</span>}
        </div>
        <span className="music-expand-icon">{expanded ? '▾' : '▴'}</span>
      </div>

      {/* Expanded controls */}
      {expanded && (
        <div className="music-controls page-enter">
          <div className="music-header">
            <span className="music-featured-tag">🎵 {track.badge || 'Now Playing'}</span>
            <p className="music-track-name serif">{track.title}</p>
            <p className="music-artist">{track.artist}</p>
          </div>

          <div
            className="music-progress-bar"
            onClick={seekTo}
            role="progressbar"
            aria-label="Seek"
          >
            <div className="music-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="music-btns">
            <button id="music-prev-btn" className="music-icon-btn" onClick={prevTrack} aria-label="Previous track">⏮</button>
            <button
              id="music-play-btn"
              className="music-play-btn"
              onClick={togglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? '⏸' : '▶'}
            </button>
            <button id="music-next-btn" className="music-icon-btn" onClick={nextTrack} aria-label="Next track">⏭</button>
          </div>

          {track.youtubeId && (
            <button
              className="btn btn-ghost btn-sm youtube-btn"
              onClick={() => setShowYoutube(v => !v)}
            >
              ▶ Watch / Play on YouTube ({track.title})
            </button>
          )}

          {showYoutube && track.youtubeId && (
            <div className="youtube-embed-container page-enter">
              <iframe
                width="100%"
                height="180"
                src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1`}
                title={`${track.title} - ${track.artist}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
