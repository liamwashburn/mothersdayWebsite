import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { memories } from '../data/siteContent.js';
import { getFamilyPhotoMeta } from '../utils/galleryImages.js';
import Reveal from './Reveal.jsx';
import SectionLabel from './SectionLabel.jsx';

function MemoryCard({ memory, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isLeft = index % 2 === 0;
  const imageMeta = getFamilyPhotoMeta(memory.image);

  return (
    <div ref={ref} className="timeline-item">
      <div className="timeline-item__grid">
        <motion.article
          className={`glass-card glass-card-hover timeline-card ${
            imageMeta.portrait ? 'timeline-card--portrait' : ''
          }`}
          style={{
            gridColumn: isLeft ? '1 / 2' : '3 / 4',
            paddingRight: isLeft ? '2.5rem' : 0,
            paddingLeft: isLeft ? 0 : '2.5rem',
            '--timeline-image-aspect': imageMeta.aspectRatio || 1.45,
          }}
          initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="timeline-card__image-wrap">
            <img src={memory.image} alt={memory.title} loading="lazy" />
            <div className="timeline-card__image-overlay" />
            <div className="timeline-card__year">{memory.year}</div>
          </div>
          <div className="timeline-card__body">
            <h3>{memory.title}</h3>
            <p>{memory.description}</p>
          </div>
        </motion.article>

        <div className="timeline-item__marker-column">
          <motion.div
            className="timeline-item__marker"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </div>
        <div className="timeline-item__spacer" style={{ gridColumn: isLeft ? '3 / 4' : '1 / 2' }} />
      </div>
    </div>
  );
}

export default function Timeline({ sectionRef }) {
  return (
    <section id="memories" ref={sectionRef} className="content-section timeline-section">
      <div className="section-container section-container--narrow">
        <Reveal className="section-heading">
          <SectionLabel>Through the years</SectionLabel>
          <h2>Moments We Cherish</h2>
        </Reveal>

        <div className="timeline-list">
          <div className="timeline-line" aria-hidden="true" />
          {memories.map((memory, index) => (
            <MemoryCard key={`${memory.year}-${memory.title}`} memory={memory} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
