import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { finalMessage } from '../data/siteContent.js';

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#b8738a"
        opacity="0.7"
      />
    </svg>
  );
}

export default function FinalMessage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="final-message" ref={ref} className="final-section">
      <motion.div
        className="final-section__glow"
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 2 }}
        aria-hidden="true"
      />
      <div className="section-container section-container--small final-section__content">
        <motion.div
          className="final-section__divider"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <div />
          <HeartIcon />
          <div />
        </motion.div>

        <motion.blockquote
          className="final-quote"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span>{finalMessage.quoteLineOne}</span>
          <br />
          <span className="gradient-text">{finalMessage.quoteLineTwo}</span>
        </motion.blockquote>

        <motion.p
          className="final-signature"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          {finalMessage.signature}
        </motion.p>

        <motion.div
          className="glass-card final-card"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <p>{finalMessage.body}</p>
          <div className="final-card__heart">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              &hearts;
            </motion.span>
          </div>
        </motion.div>

        <motion.p
          className="final-footer"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ duration: 1, delay: 2 }}
        >
          {finalMessage.footer}
        </motion.p>
      </div>
    </section>
  );
}
