import React, { useEffect, useState } from 'react';
import { Camera, Heart, Film, Zap, Award, Users, Quote, ArrowRight, Phone, Smartphone, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import Breadcrumb from '../components/ui/Breadcrumb';
import { getArtistProfile } from '../firebase/services';

const About = () => {
  const [artist, setArtist] = useState({ name: 'The Artist', photo: '/ABHI_img.jpeg' });

  useEffect(() => {
    // 1. Fetch Artist Data
    const fetchArtist = async () => {
        const data = await getArtistProfile();
        if (data) {
            setArtist({
                name: data.name || 'The Artist',
                photo: data.photo || '/ABHI_img.jpeg',
                phone: data.phone,
                whatsapp: data.whatsapp,
                email: data.email,
                instagram: data.instagram
            });
        }
    };
    fetchArtist();

    // 2. Optimized Scroll Animation (IntersectionObserver)
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

  return (
    <div className="about-page-wrapper">
      
      {/* BREADCRUMB */}
      <div className="max-w-wrapper" style={{padding: '0 1.5rem', marginTop: '-10px', marginBottom: '10px'}}>
        <Breadcrumb pageName="About Us" />
      </div>

      {/* 1. HERO BANNER */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content reveal">
            <h1>The Artist</h1>
            <p>Behind The Lens of Khushi Cinematic</p>
        </div>
      </div>

      {/* 2. THE ARTIST BIO (Split Layout) */}
      <section className="about-split-section reveal" style={{paddingTop: '0'}}>
         <div className="max-w-wrapper split-container">
            
            {/* IMAGE SIDE */}
            <div className="split-image" style={{flexDirection:'column', alignItems:'center'}}>
                <div className="image-wrapper-styled">
                    {/* Artist Image */}
                    <img 
                      src={artist.photo}
                      alt="Khushi Cinematic Photographer" 
                      className="artist-cutout" 
                      onError={(e) => e.target.src = "/ABHI_img.jpeg"}
                    />
                    
                    {/* Floating Badge */}
                    <div className="floating-logo-badge">
                        <img src="/logo.jpg" alt="Logo" onError={(e) => e.target.style.display='none'} />
                    </div>
                </div>
                
                {/* ARTIST NAME LABEL */}
                <h3 style={{
                    marginTop: '20px', 
                    fontFamily: 'var(--font-head)', 
                    fontSize: '2rem', 
                    color: 'white', 
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}>
                    {artist.name}
                </h3>
                <div style={{width:'40px', height:'2px', background:'var(--accent)', marginTop:'5px'}}></div>
                
                {/* Contact Icons */}
                <div style={{display:'flex', gap:'20px', marginTop:'20px', justifyContent:'center'}}>
                   {artist.phone && <a href={`tel:${artist.phone}`} style={{color:'var(--text-muted)'}}><Phone size={20}/></a>}
                   {artist.whatsapp && <a href={`https://wa.me/${artist.whatsapp}`} target="_blank" rel="noreferrer" style={{color:'var(--text-muted)'}}><Smartphone size={20}/></a>}
                   {artist.email && <a href={`mailto:${artist.email}`} style={{color:'var(--text-muted)'}}><Mail size={20}/></a>}
                   {artist.instagram && <a href={artist.instagram} target="_blank" rel="noreferrer" style={{color:'var(--text-muted)'}}><Instagram size={20}/></a>}
                </div>
            </div>

            {/* TEXT SIDE */}
            <div className="split-text">
                <h2 className="section-title-left">Who We Are</h2>
                <p className="lead-text">
                    "We don't just capture photos; we preserve legacies for generations to come."
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

      {/* 3. GLASS STATS STRIP */}
      <section className="glass-stats-strip reveal">
         <div className="max-w-wrapper stats-container">
            <div className="stat-block">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years of<br/>Experience</span>
            </div>
            <div className="stat-block">
                <span className="stat-number">150+</span>
                <span className="stat-label">Weddings<br/>Documented</span>
            </div>
            <div className="stat-block">
                <span className="stat-number">100%</span>
                <span className="stat-label">Client<br/>Satisfaction</span>
            </div>
            <div className="stat-block">
                <span className="stat-number">4K</span>
                <span className="stat-label">Cinema<br/>Resolution</span>
            </div>
         </div>
      </section>

      {/* 4. WHY CHOOSE US CARDS */}
      <section className="max-w-wrapper reveal" style={{marginBottom:'6rem'}}>
          <h2 className="section-title-left">Why Choose Us?</h2>
          <div className="why-us-grid">
              
              <div className="why-card">
                  <div className="why-icon"><Film size={28}/></div>
                  <h3>Cinematic Storytelling</h3>
                  <p>We don't just document events; we weave them into a movie. Using high-end color grading and composition.</p>
              </div>

              <div className="why-card">
                  <div className="why-icon"><Users size={28}/></div>
                  <h3>Unobtrusive Presence</h3>
                  <p>We believe the best shots are natural. Our team blends into the crowd to capture raw, candid emotions.</p>
              </div>

              <div className="why-card">
                  <div className="why-icon"><Zap size={28}/></div>
                  <h3>Fast Delivery</h3>
                  <p>We know you can't wait. We deliver a highlight reel within one week of the event.</p>
              </div>

              <div className="why-card">
                  <div className="why-icon"><Award size={28}/></div>
                  <h3>Premium Prints</h3>
                  <p>Digital is great, but print is forever. We offer luxury Italian leather albums included in premium packages.</p>
              </div>

          </div>
      </section>

      {/* 5. QUOTE SECTION */}
      <div className="quote-section reveal">
          <div className="quote-content">
              <Quote size={50} />
              <div className="quote-text">
                  "Photography is the only language that can be understood anywhere in the world."
              </div>
              <div className="quote-author">- Bruno Barbey</div>
          </div>
      </div>

      {/* 6. OUR GEAR (Optional - Shows Professionalism) */}
      <section className="gear-section reveal">
          <div className="max-w-wrapper">
             <h4 style={{color:'#666', textTransform:'uppercase', letterSpacing:'2px'}}>Professional Gear We Use</h4>
             <div className="gear-tags">
                 <span className="gear-tag">Sony A7S III</span>
                 <span className="gear-tag">Canon R5</span>
                 <span className="gear-tag">DJI Mavic 3 Cine</span>
                 <span className="gear-tag">Gimbal Stabilization</span>
                 <span className="gear-tag">Prime Lenses</span>
                 <span className="gear-tag">4K Drone</span>
             </div>
          </div>
      </section>

      {/* 7. CTA */}
      <section className="about-split-section reveal text-center">
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              <h2 style={{fontFamily:'var(--font-head)', fontSize:'3rem', marginBottom:'1rem', color:'white'}}>Let's Create Magic</h2>
              <p style={{color:'#aaa', marginBottom:'2rem'}}>Ready to frame your special day?</p>
              <Link to="/" className="cta-btn" style={{marginTop:'0'}}>
                  View Packages <ArrowRight size={18}/>
              </Link>
          </div>
      </section>

    </div>
  );
};

export default About;