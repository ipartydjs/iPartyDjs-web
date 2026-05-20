import { useEffect } from 'react';
import { useCursor } from './hooks/useCursor';
import Navbar from './components/Navbar';
import Marquee from './components/Marquee';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Stats from './sections/Stats';
import Process from './sections/Process';
import Gallery from './sections/Gallery';
import Contact from './sections/Contact';
import './App.css';

function App() {
  useCursor();

  useEffect(() => {
    document.title = 'iPartyDJs — Producción & Coordinación de Eventos';
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div className="cursor" />
      <div className="cursor-follower" />

      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Stats />
        <Process />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
