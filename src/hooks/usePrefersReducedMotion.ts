import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the user's reduced-motion preference so callers can swap an animation
 * for a still rather than merely shortening it.
 *
 * Read synchronously on the first render so the correct element is the one that
 * gets painted. Resolving it in an effect instead would mount the still and the
 * video in turn, and the swap reads as a flash on the very frame we are trying
 * to keep calm.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
