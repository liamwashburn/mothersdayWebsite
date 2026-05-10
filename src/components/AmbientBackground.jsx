import { motion } from 'framer-motion';

export default function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-background__base" />
      <motion.div
        className="ambient-background__orb ambient-background__orb--violet"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-background__orb ambient-background__orb--rose"
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        className="ambient-background__orb ambient-background__orb--gold"
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />
      {Array.from({ length: 40 }).map((_, index) => (
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
