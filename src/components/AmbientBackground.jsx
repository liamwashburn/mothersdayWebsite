import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

function useLightweightAmbientMode() {
  const [isLightweight, setIsLightweight] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 47.99rem), (pointer: coarse)');
    const updateMode = () => setIsLightweight(mediaQuery.matches);

    updateMode();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMode);

      return () => mediaQuery.removeEventListener('change', updateMode);
    }

    mediaQuery.addListener(updateMode);

    return () => mediaQuery.removeListener(updateMode);
  }, []);

  return isLightweight;
}

export default function AmbientBackground() {
  const shouldReduceMotion = useReducedMotion();
  const isLightweight = useLightweightAmbientMode();
  const shouldAnimateAmbient = !shouldReduceMotion && !isLightweight;
  const sparkleCount = isLightweight || shouldReduceMotion ? 18 : 40;
  const sparkles = useMemo(() => Array.from({ length: sparkleCount }), [sparkleCount]);

  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-background__base" />
      <motion.div
        className="ambient-background__orb ambient-background__orb--violet"
        animate={shouldAnimateAmbient ? { x: [0, 40, -20, 0], y: [0, -30, 20, 0] } : undefined}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-background__orb ambient-background__orb--rose"
        animate={shouldAnimateAmbient ? { x: [0, -50, 30, 0], y: [0, 40, -20, 0] } : undefined}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        className="ambient-background__orb ambient-background__orb--gold"
        animate={shouldAnimateAmbient ? { x: [0, 60, -40, 0], y: [0, -40, 60, 0] } : undefined}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />
      {sparkles.map((_, index) => (
        <span
          className="sparkle"
          key={index}
          style={{
            left: `${(index * 37 + 13) % 100}%`,
            top: `${(index * 53 + 7) % 100}%`,
            '--duration': `${2.5 + (index % 5) * 0.7}s`,
            '--delay': `${(index * 0.3) % 4}s`,
            width: index % 3 === 0 ? '4px' : '2px',
            height: index % 3 === 0 ? '4px' : '2px',
          }}
        />
      ))}
    </div>
  );
}
