import { useEffect } from 'react';
import { useCursor } from '../../hooks/useCursor';
import Navbar from '../../components/Navbar/Navbar';
import Marquee from '../../components/Marquee/Marquee';
import Footer from '../../components/Footer/Footer';
import Hero from '../../sections/Hero/Hero';
import Services from '../../sections/Services/Services';
import Stats from '../../sections/Stats/Stats';
import Process from '../../sections/Process/Process';
import Gallery from '../../sections/Gallery/Gallery';
import Contact from '../../sections/Contact/Contact';
import WeddingExperiences from '../../sections/WeddingExperiences/WeddingExperiences';

const Home = () => {
  useCursor();

  useEffect(() => {
    document.title = 'iPartyDJs — Producción & Coordinación de Eventos';
  }, []);

  return (
    <>
      <div className="cursor" />
      <div className="cursor-follower" />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <WeddingExperiences />
        <Stats />
        <Process />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;