import React, { useEffect } from 'react';
import Portfolio from '../components/Portfolio'; // Import the new section
import '../styles/global.css';
import Packages from '../components/Packages';

const Home = () => {
  // Animation Logic for Hero Header
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        if (revealTop < windowHeight - 60) {
          reveals[i].classList.add('active');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const imgError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=600";
  };

  return (
    <>
      {/* HERO SECTION */}
      <header className="hero" id="hero">
        <div className="hero-content reveal">
          <img src="/logo.jpg" alt="Khushi Logo" className="hero-logo-large" onError={imgError} />
          <h1>KHUSHI</h1>
          <div style={{fontSize:'0.9rem', letterSpacing:'4px', textTransform:'uppercase', fontWeight:'bold', color:'var(--text-muted)', marginTop:'10px'}}>Cinematic Photography</div>
          <div className="tagline">"Capturing the magic of your special day"</div>
        </div>
      </header>

      {/* NEW PORTFOLIO SECTION */}
      <Portfolio />
      <Packages />
    </>
  );
};

export default Home;