import './WaveDivider.css';

/**
 * Curved section divider. `color` is the colour of the wave shape,
 * placed against the previous section so the next section appears to
 * rise/curve in — matching the reference site's wave transitions.
 */
export default function WaveDivider({
  color = 'green',
  flip = false,
  from,
}: {
  color?: 'green' | 'cream';
  flip?: boolean;
  from?: 'white' | 'cream';
}) {
  return (
    <div
      className={`wave-divider wave-divider--${color} ${flip ? 'is-flip' : ''} ${from ? `wave-divider--from-${from}` : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,60 C360,0 1080,120 1440,40 L1440,90 L0,90 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
