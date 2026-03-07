import { useRef, useEffect, useState } from 'react';

const easeOutExponent = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Returns a smoothly animated number that chases the target value.
 * When target changes mid-animation the counter starts from its current position.
 */
export const useAnimatedNumber = (target: number, duration = 300): number => {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);
  const prevTargetRef = useRef(target);

  useEffect(() => {
    if (target === prevTargetRef.current) return;
    prevTargetRef.current = target;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const from = fromRef.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutExponent(progress);
      const value = Math.round(from + (target - from) * eased);
      fromRef.current = value;
      setDisplay(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, duration]);

  return display;
};
