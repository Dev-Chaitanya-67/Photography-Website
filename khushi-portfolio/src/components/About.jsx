import React, { useEffect } from 'react';

const About = () => {
  // Scroll Animation Logic
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
    <section id="about" className="reveal" style={{padding:'4rem 1.5rem', textAlign:'center', background:'#050505'}}>
      <h2 className="section-title" style={{marginTop:'0'}}>The Artists</h2>
      
      <img src="/about.png" style={{width:'160px', height:'160px', borderRadius:'50%', margin:'0 auto 2rem', objectFit:'cover', border:'2px solid var(--accent)', boxShadow:'0 0 30px var(--accent-glow)'}} onError={imgError} alt="The Team" />
      
      <p style={{maxWidth:'600px', margin:'0 auto', color:'#aaa', fontSize:'1.1rem', lineHeight:'1.8'}}>
        "We don't just capture photos; we preserve legacies."
      </p>
      
      <div style={{margin: '2.5rem auto', fontFamily: 'var(--font-head)', fontSize: '1.3rem', color: '#fff', letterSpacing: '1px', maxWidth: '400px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem 0'}}>
          <div style={{marginBottom: '10px', color: 'var(--accent)'}}>Sushma Santosh Sonwane</div>
          <div style={{marginBottom: '10px', fontSize: '1.1rem'}}>Vaishnavi Thorat</div>
          <div style={{fontSize: '1.1rem'}}>Pranali Sonwane</div>
      </div>

      <div className="stats-grid" style={{maxWidth:'500px', margin:'2rem auto 0'}}>
          <div className="stat-box"><span className="stat-num">5+</span><span style={{color:'#888', fontSize:'0.8rem'}}>YEARS</span></div>
          <div className="stat-box"><span className="stat-num">150+</span><span style={{color:'#888', fontSize:'0.8rem'}}>WEDDINGS</span></div>
      </div>
      
      <div style={{fontFamily:"'Great Vibes'", fontSize:'3rem', color:'var(--accent)', marginTop:'3rem', transform:'rotate(-5deg)'}}>SVP Team</div>
    </section>
  );
};

export default About;