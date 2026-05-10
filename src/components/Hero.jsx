import { motion } from 'framer-motion';
import { heroContent } from '../data/siteContent.js';
import SectionLabel from './SectionLabel.jsx';

export default function Hero({ memoriesRef }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-section__vignette" />
      <div className="hero-section__content">
        <motion.div
          className="hero-section__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <SectionLabel>{heroContent.eyebrow}</SectionLabel>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="gradient-text">{heroContent.titleTop}</span>
          <br />
          <span>{heroContent.titleBottom}</span>
        </motion.h1>

        <motion.div
          className="hero-dedication"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div />
          <motion.span
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {heroContent.dedication}
          </motion.span>
          <div />
        </motion.div>

        <motion.p
          className="hero-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.3 }}
        >
          {heroContent.body}
        </motion.p>

        <motion.button
          className="memory-button"
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 1, delay: 1.6 }}
          onClick={() => memoriesRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          {heroContent.buttonLabel}
        </motion.button>

        <motion.div
          className="hero-scroll-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <motion.div
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
