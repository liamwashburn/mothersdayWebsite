import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { getGalleryImages } from '../utils/galleryImages.js';
import Reveal from './Reveal.jsx';
import SectionLabel from './SectionLabel.jsx';

function GalleryItem({ image, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.figure
      ref={ref}
      className={`gallery-item ${image.wide ? 'gallery-item--wide' : ''} ${
        image.tall ? 'gallery-item--tall' : ''
      } ${image.portrait ? 'gallery-item--portrait' : ''}`}
      style={{
        '--gallery-aspect-ratio': image.aspectRatio || 1,
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: Math.min(index * 0.04, 0.45),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <img
        src={image.src}
        alt={image.label || 'Family memory'}
        loading="lazy"
        width={image.width || undefined}
        height={image.height || undefined}
      />
      <div className="gallery-item__ring" aria-hidden="true" />
    </motion.figure>
  );
}

export default function Gallery() {
  const galleryImages = getGalleryImages();

  return (
    <section id="gallery" className="content-section gallery-section">
      <div className="section-container">
        <Reveal className="section-heading section-heading--compact">
          <SectionLabel>Captured in time</SectionLabel>
          <h2>Our Family Gallery</h2>
        </Reveal>

        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <GalleryItem key={image.src} image={image} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
