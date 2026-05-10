import { useRef } from 'react';
import AmbientBackground from './components/AmbientBackground.jsx';
import FinalMessage from './components/FinalMessage.jsx';
import FloatingNav from './components/FloatingNav.jsx';
import Gallery from './components/Gallery.jsx';
import Hero from './components/Hero.jsx';
import ThankYouMessages from './components/ThankYouMessages.jsx';
import Timeline from './components/Timeline.jsx';

export default function App() {
  const memoriesRef = useRef(null);

  return (
    <main className="site-shell">
      <AmbientBackground />
      <FloatingNav />
      <Hero memoriesRef={memoriesRef} />
      <Timeline sectionRef={memoriesRef} />
      <ThankYouMessages />
      <Gallery />
      <FinalMessage />
    </main>
  );
}
