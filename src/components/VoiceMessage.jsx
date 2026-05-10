import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { voiceMessage } from '../data/siteContent.js';
import Reveal from './Reveal.jsx';
import SectionLabel from './SectionLabel.jsx';

const waveformHeights = [14, 38, 22, 44, 18, 40, 28, 48, 10, 32, 42, 20, 46, 26, 14, 50, 22, 36, 10, 42, 30, 18, 44, 16, 38, 48, 24, 10, 40, 28];
const waveformDurations = [0.6, 0.8, 0.5, 0.9, 0.7, 0.6, 1, 0.7, 0.8, 0.5, 0.9, 0.6, 0.8, 0.7, 0.5, 0.9, 0.6, 0.8, 0.7, 0.5, 0.9, 0.6, 0.8, 0.7, 0.5, 0.9, 0.6, 0.8, 0.7, 0.5];
const waveformDelays = [0, 0.1, 0.2, 0.05, 0.15, 0.3, 0.1, 0.25, 0, 0.2, 0.1, 0.3, 0.05, 0.15, 0.25, 0, 0.2, 0.1, 0.3, 0.05, 0.15, 0.25, 0, 0.2, 0.1, 0.3, 0.05, 0.15, 0.25, 0.1];

function Waveform({ isPlaying }) {
  return (
    <div className={`waveform ${isPlaying ? 'playing' : ''}`} aria-hidden="true">
      {waveformHeights.map((height, index) => (
        <div
          className="waveform-bar"
          key={index}
          style={{
            height: `${height}px`,
            opacity: isPlaying ? 0.85 : 0.35,
            '--wave-duration': `${waveformDurations[index]}s`,
            '--wave-delay': `${waveformDelays[index]}s`,
          }}
        />
      ))}
    </div>
  );
}

function PlayIcon() {
  return (
    <motion.svg
      key="play"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="white"
      style={{ marginLeft: '3px' }}
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </motion.svg>
  );
}

function PauseIcon() {
  return (
    <motion.svg
      key="pause"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </motion.svg>
  );
}

export default function VoiceMessage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const duration = voiceMessage.durationSeconds;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setElapsed((current) => {
          if (current >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return current + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [duration, isPlaying]);

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const progress = (elapsed / duration) * 100;

  return (
    <section className="content-section voice-section">
      <div className="section-container section-container--small">
        <Reveal className="section-heading section-heading--compact">
          <SectionLabel>{voiceMessage.eyebrow}</SectionLabel>
          <h2>{voiceMessage.heading}</h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass-card voice-card">
            <p className="voice-card__meta">Voice Message - {formatTime(duration)}</p>
            <div className="voice-card__wave-wrap">
              <Waveform isPlaying={isPlaying} />
            </div>
            <div className="voice-card__progress">
              <motion.div
                style={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="voice-card__time-row">
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <motion.button
              className="voice-card__button"
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                if (elapsed >= duration) {
                  setElapsed(0);
                }
                setIsPlaying((current) => !current);
              }}
              aria-label={isPlaying ? 'Pause voice message animation' : 'Play voice message animation'}
            >
              <AnimatePresence mode="wait">{isPlaying ? <PauseIcon /> : <PlayIcon />}</AnimatePresence>
            </motion.button>
            <p className="voice-card__caption">{voiceMessage.caption}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
