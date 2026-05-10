import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const directions = {
  up: { opacity: 0, y: 50, x: 0 },
  left: { opacity: 0, y: 0, x: -60 },
  right: { opacity: 0, y: 0, x: 60 },
  none: { opacity: 0, y: 0, x: 0 },
};

export default function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.15,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={directions[direction]}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : directions[direction]}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
