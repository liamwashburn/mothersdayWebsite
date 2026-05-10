import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { thankYouMessages } from '../data/siteContent.js';
import Reveal from './Reveal.jsx';
import SectionLabel from './SectionLabel.jsx';

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#c2956a" opacity="0.7" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ThankYouCard({ card, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.article
      ref={ref}
      className="glass-card glass-card-hover thank-you-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: (index % 3) * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <HeartIcon />
      <h3>{card.title}</h3>
      <p>{card.body}</p>
    </motion.article>
  );
}

export default function ThankYouMessages() {
  return (
    <section id="thanks" className="content-section thank-you-section">
      <div className="section-glow section-glow--soft" aria-hidden="true" />
      <div className="section-container section-container--narrow section-container--front">
        <Reveal className="section-heading">
          <SectionLabel>Words from my heart</SectionLabel>
          <h2>Thank You, Mom</h2>
        </Reveal>
        <div className="thank-you-grid">
          {thankYouMessages.map((card, index) => (
            <ThankYouCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
