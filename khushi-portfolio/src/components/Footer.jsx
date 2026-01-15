import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter, ChevronUp, Mail, Phone } from 'lucide-react';
import '../styles/global.css';

const Footer = () => {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="max-w-wrapper footer-content">
        
        {/* COLUMN 1: BRAND & INFO */}
        <div className="footer-brand-col">
            <div className="footer-logo">
                <img src="/logo.jpg" alt="Khushi Logo" />
                <span>KHUSHI</span>
            </div>
            <p className="footer-tagline">
                Capturing emotions, crafting memories, and immortalizing love stories through the lens of cinematic perfection.
            </p>
            
            <div className="social-links">
                <a href="#" className="social-icon"><Instagram size={20} /></a>
                <a href="#" className="social-icon"><Facebook size={20} /></a>
                <a href="#" className="social-icon"><Youtube size={20} /></a>
                <a href="#" className="social-icon"><Twitter size={20} /></a>
            </div>

            <div className="contact-mini">
                <div className="contact-row"><Mail size={16} /> khushiphotography79@gmail.com</div>
                <div className="contact-row"><Phone size={16} /> +91 98765 43210</div>
            </div>
        </div>

        {/* COLUMN 2: SITE MAP */}
        <div className="footer-links-col">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/collections">Our Collections</Link>
            <Link to="/packages">Premium Packages</Link>
            <Link to="/about">The Artist</Link>
            <Link to="/dashboard" style={{color:'var(--accent)'}}>My Gallery</Link>
        </div>
    
        {/* COLUMN 4: ACTION */}
        <div className="footer-action-col">
            <h4>Ready to begin?</h4>
            <p>Let's discuss your dream wedding.</p>
            <Link to="/contact" className="footer-cta-btn">Book Consultation</Link>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="max-w-wrapper footer-bottom-inner">
            <p>&copy; {new Date().getFullYear()} Khushi Cinematic Photography. All Rights Reserved.</p>
            
            <button onClick={scrollToTop} className="back-to-top">
                BACK TO TOP <ChevronUp size={16} />
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;