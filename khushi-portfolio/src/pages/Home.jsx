import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link
import Portfolio from '../components/sections/Portfolio'; 
import Packages from '../components/sections/Packages';
import ClientCTA from '../components/sections/ClientCTA'; 
import '../styles/global.css';

const Home = ({ toggleLogin }) => {
  
  // Optimized Scroll Animation (IntersectionObserver)
  // This fixes the lag you were feeling earlier
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const imgError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=600";
  };

  return (
    <>
      <header className="hero" id="hero">
        <div className="hero-content reveal">
          <img src="/logo.jpg" alt="Khushi Logo" className="hero-logo-large" onError={imgError} />
          <h1>KHUSHI</h1>
          <div style={{fontSize:'0.9rem', letterSpacing:'4px', textTransform:'uppercase', fontWeight:'bold', color:'var(--text-muted)', marginTop:'10px'}}>Cinematic Photography</div>
          <div className="tagline">"Capturing the magic of your special day"</div>
        </div>
      </header>

      <Portfolio />
      
      <ClientCTA toggleLogin={toggleLogin} /> 

      <section className="packages-wrap" id="packages">
        <Packages />
      </section>
      

      {/* NEW: SIMPLE ABOUT SECTION (No Image BG) */}
      <section className="reveal" style={{ 
          padding: '5rem 1.5rem', 
          textAlign: 'center', 
          background: '#0a0a0a', /* Subtle dark grey difference from footer */
          borderTop: '1px solid var(--border)' 
      }}>
          <h2 style={{ 
              fontFamily: 'var(--font-head)', 
              color: 'white', 
              fontSize: '2rem', 
              marginBottom: '1rem' 
          }}>
            About Us
          </h2>
          
          <p style={{ 
              color: '#888', 
              maxWidth: '600px', 
              margin: '0 auto 2.5rem', 
              fontSize: '0.95rem' 
          }}>
            Get to know the passionate team dedicated to preserving your legacy with royal elegance.
          </p>

          <Link to="/about" className="form-btn" style={{ 
              display: 'inline-block', 
              width: 'auto', 
              padding: '12px 40px', 
              textDecoration: 'none' 
          }}>
             Know more
          </Link>
      </section>

    </>
  );
};

export default Home;