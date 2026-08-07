import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Props {
  /** VP9. Offered first: some Chromium and Firefox builds ship no H.264. */
  webm: string;
  /** H.264, for everything else, Safari and iOS included. */
  mp4: string;
  /** First frame. Shown until the video paints, so it must match frame one. */
  poster: string;
  /** Last frame. The still used whenever the film will not or should not run. */
  still: string;
  alt: string;
  className?: string;
}

/**
 * A short film that plays once and holds on its closing frame.
 *
 * It never loops: the film opens on a technical drawing and closes on the real
 * car, so looping would snap a finished car back to a sketch every time round.
 *
 * There are three ways it can end up not playing, and all of them settle on the
 * closing still rather than the opening drawing, because the drawing on its own
 * is an abstract way to head a page about cars that are actually for sale:
 *   - reduced motion is set, so no video element is mounted at all;
 *   - autoplay is refused, which some browsers still do on metered connections
 *     even for muted inline video;
 *   - no source can be decoded. Worth handling separately: a browser missing the
 *     codec still resolves play() and simply sits at readyState 0, so the
 *     rejected-promise path never fires and only the error event gives it away.
 */
export default function HeroFilm({ webm, mp4, poster, still, alt, className = '' }: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [blocked, setBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const video = videoRef.current;
    if (!video) return;
    // Safari and Chrome hand back a rejected promise rather than throwing when
    // they decline to autoplay, so the catch is the only signal we get.
    void video.play().catch(() => setBlocked(true));
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || blocked) {
    return <img className={className} src={still} alt={alt} fetchPriority="high" />;
  }

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-label={alt}
      onError={() => setBlocked(true)}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
