import React, { useEffect } from 'react';
import { Camera, Heart, Film } from 'lucide-react';
import '../styles/global.css';

const About = () => {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        if (reveals[i].getBoundingClientRect().top < window.innerHeight - 60) {
          reveals[i].classList.add('active');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-page-wrapper">
      
      {/* 1. HERO BANNER */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content reveal">
            <h1>The Artist</h1>
            <p>Home / About Us</p>
        </div>
      </div>

      {/* 2. WHO WE ARE (Big Image Left, Text Right) */}
      <section className="about-split-section reveal">
         <div className="max-w-wrapper split-container">
            
            {/* TEXT SIDE */}
            <div className="split-text">
                <h2 className="section-title-left">Who We Are</h2>
                <p className="lead-text">
                    "We don't just capture photos; we preserve legacies."
                </p>
                <p className="body-text">
                    Khushi Cinematic is a team of passionate storytellers based in Chatrapati Sambhajinagar. 
                    With over 5 years of experience, we specialize in turning fleeting moments into timeless cinema. 
                    Whether it's the grandeur of a wedding or the quiet intimacy of a pre-wedding shoot, 
                    we bring a royal, candid touch to every frame.
                </p>
                <div className="signature-block">
                    <span>Khushi Cinematic Team</span>
                </div>
            </div>


         </div>
      </section>

      {/* 3. STATS STRIP (Maroon Bar) */}
      <section className="stats-strip reveal">
         <div className="max-w-wrapper stats-container">
            <div className="stat-block">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years of<br/>Excellence</span>
            </div>
            <div className="stat-block">
                <span className="stat-number">150+</span>
                <span className="stat-label">Weddings<br/>Covered</span>
            </div>
            <div className="stat-block">
                <span className="stat-number">100%</span>
                <span className="stat-label">Client<br/>Satisfaction</span>
            </div>
            <div className="stat-block">
                <span className="stat-number">4K</span>
                <span className="stat-label">Cinema<br/>Quality</span>
            </div>
         </div>
      </section>

      {/* 4. OUR VISION (Big Image Right, Text Left) */}
      <section className="about-split-section reveal">
         <div className="max-w-wrapper split-container reverse">
            
            {/* VISION IMAGE (Using the same about.png or a vision specific one if you have it) */}
            <div className="split-image">
                <img src="/about.png" alt="Vision" className="vision-img" />
            </div>

            <div className="split-text">
                <h2 className="section-title-left">Our Vision</h2>
                <p className="body-text">
                    To be the leading cinematic storytellers in India, known not just for our picture quality, but for the emotions we evoke.
                </p>
                
                <div className="vision-list">
                    <div className="vision-item">
                        <div className="icon-circle"><Camera size={20} /></div>
                        <div>
                            <h4>Cinematic Excellence</h4>
                            <p>Using top-tier gear to create movie-like visuals.</p>
                        </div>
                    </div>
                    <div className="vision-item">
                        <div className="icon-circle"><Heart size={20} /></div>
                        <div>
                            <h4>Emotional Connection</h4>
                            <p>Focusing on candid smiles, tears, and joy.</p>
                        </div>
                    </div>
                    <div className="vision-item">
                        <div className="icon-circle"><Film size={20} /></div>
                        <div>
                            <h4>Timeless Editing</h4>
                            <p>Color grading that looks royal and lasts forever.</p>
                        </div>
                    </div>
                </div>
            </div>

         </div>
      </section>

    </div>
  );
};

export default About;