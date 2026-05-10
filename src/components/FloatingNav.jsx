import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const navItems = [
  { id: 'hero', label: 'Hero' },
  { id: 'memories', label: 'Memories' },
  { id: 'thanks', label: 'Thank You' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'final-message', label: 'Final Message' },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.12, 0.28, 0.45],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setIsOpen(false);
  };

  return (
    <motion.nav
      className={`sticky-nav ${isOpen ? 'sticky-nav--open' : ''}`}
      initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-label="Page sections"
    >
      <button
        className="sticky-nav__toggle"
        type="button"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
      </button>

      <div className="sticky-nav__links">
        {navItems.map((item) => (
          <button
            className={`sticky-nav__link ${activeSection === item.id ? 'sticky-nav__link--active' : ''}`}
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
