import './TrackingBadge.css';

const STATUS_CONFIG = {
  WAITING: {
    emoji: '⏳',
    label: 'Waiting for her…',
    className: 'badge-waiting',
    sub: 'She hasn\'t opened it yet',
  },
  SEEN: {
    emoji: '💔',
    label: 'She saw it',
    className: 'badge-seen',
    sub: 'She read your message',
  },
  ACCEPTED: {
    emoji: '💚',
    label: 'She accepted',
    className: 'badge-accepted',
    sub: 'She forgave you 🌿',
  },
};

export default function TrackingBadge({ status = 'WAITING', userRole }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.WAITING;

  return (
    <div className="tracking-badge-wrapper">
      <div className={`badge tracking-badge ${config.className}`}>
        <span className="tracking-emoji">{config.emoji}</span>
        <div>
          <div className="tracking-label">{config.label}</div>
          {userRole === 'SENDER' && (
            <div className="tracking-sub">{config.sub}</div>
          )}
        </div>
      </div>
      {status === 'WAITING' && (
        <div className="tracking-dots">
          <span /><span /><span />
        </div>
      )}
    </div>
  );
}
