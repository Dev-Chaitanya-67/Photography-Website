import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube } from 'lucide-react';
import { addInquiry } from '../firebase/services';
import '../styles/global.css';
import Breadcrumb from '../components/ui/Breadcrumb';

const Contact = () => {
    // Scroll Reveal Effect
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
        // Trigger once on load
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: 'Wedding',
        date: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        const result = await addInquiry(formData);

        if (result.success) {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', eventType: 'Wedding', date: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } else {
            console.error(result.message);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="contact-page-wrapper" style={{paddingTop: '100px', minHeight: '100vh', background: '#050505'}}>
            
            <div className="max-w-wrapper" style={{paddingLeft: '1.5rem'}}>
                <Breadcrumb pageName="Contact" />
            </div>

            {/* HERO SECTION */}
            <div className="contact-hero reveal" style={{textAlign: 'center', padding: '4rem 1rem 2rem'}}>
                <h1 style={{fontSize: '3.5rem', fontFamily: 'var(--font-head)', marginBottom: '1rem'}}>Get In Touch</h1>
                <p style={{color: '#888', maxWidth: '600px', margin: '0 auto'}}>
                    We'd love to be a part of your story. Tell us about your dream event, and let's create magic together.
                </p>
            </div>

            <div className="max-w-wrapper" style={{display: 'flex', flexWrap: 'wrap', gap: '3rem', padding: '2rem 1rem 6rem', justifyContent:'center'}}>
                
                {/* 1. CONTACT INFO CARDS (Left Side) */}
                <div className="contact-info-col reveal" style={{flex: '1 1 300px', maxWidth: '400px'}}>
                    <div className="glass-card" style={{padding: '2rem', height: '100%'}}>
                        <h3 style={{fontSize: '1.8rem', marginBottom: '2rem', fontFamily: 'var(--font-head)'}}>Contact Info</h3>
                        
                        <div className="contact-item" style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center'}}>
                            <div className="icon-box" style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '50%', color: 'var(--accent)'}}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.2rem'}}>Phone</h4>
                                <p style={{fontSize: '1.1rem'}}>+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="contact-item" style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center'}}>
                            <div className="icon-box" style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '50%', color: 'var(--accent)'}}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.2rem'}}>Email</h4>
                                <p style={{fontSize: '1.1rem'}}>hello@khushicinematic.com</p>
                            </div>
                        </div>

                        <div className="contact-item" style={{display: 'flex', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center'}}>
                            <div className="icon-box" style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '50%', color: 'var(--accent)'}}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.2rem'}}>Studio</h4>
                                <p style={{fontSize: '1.1rem'}}>Chatrapati Sambhajinagar,<br/>Maharashtra, India</p>
                            </div>
                        </div>

                        <div className="social-links-contact">
                            <h4 style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem', textTransform:'uppercase', letterSpacing:'1px'}}>Follow Us</h4>
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <a href="#" style={{color: 'white', background: '#222', padding: '10px', borderRadius: '50%', transition: '0.3s'}}><Instagram size={20}/></a>
                                <a href="#" style={{color: 'white', background: '#222', padding: '10px', borderRadius: '50%', transition: '0.3s'}}><Facebook size={20}/></a>
                                <a href="#" style={{color: 'white', background: '#222', padding: '10px', borderRadius: '50%', transition: '0.3s'}}><Youtube size={20}/></a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. INQUIRY FORM (Right Side) */}
                <div className="contact-form-col reveal" style={{flex: '1 1 500px', maxWidth: '600px'}}>
                     <div className="glass-card" style={{padding: '2.5rem'}}>
                        <h3 style={{fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-head)'}}>Send a Message</h3>
                        <p style={{color: '#888', marginBottom: '2rem'}}>Fill out the form below and we'll get back to you shortly.</p>

                        <form onSubmit={handleSubmit}>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                                <div>
                                    <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.85rem'}}>Your Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        className="form-input" 
                                        placeholder="John Doe" 
                                        required 
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.85rem'}}>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        className="form-input" 
                                        placeholder="+91..." 
                                        required 
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                                <div>
                                    <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.85rem'}}>Event Type</label>
                                    <select 
                                        name="eventType" 
                                        className="form-input" 
                                        value={formData.eventType}
                                        onChange={handleChange}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <option value="Wedding">Wedding</option>
                                        <option value="Pre-Wedding">Pre-Wedding</option>
                                        <option value="Engagement">Engagement</option>
                                        <option value="Maternity">Maternity</option>
                                        <option value="Baby Shower">Baby Shower</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.85rem'}}>Event Date</label>
                                    <input 
                                        type="date" 
                                        name="date" 
                                        className="form-input" 
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.85rem'}}>Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    className="form-input" 
                                    placeholder="john@example.com" 
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.85rem'}}>Your Message</label>
                                <textarea 
                                    name="message" 
                                    className="form-input" 
                                    rows="4" 
                                    placeholder="Tell us about your venue, number of guests, or any specific ideas..." 
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="form-btn" disabled={status === 'submitting' || status === 'success'}>
                                {status === 'idle' && <>Send Inquiry <Send size={16} style={{display:'inline', marginLeft:'8px'}}/></>}
                                {status === 'submitting' && 'Sending...'}
                                {status === 'success' && 'Message Sent Successfully!'}
                            </button>
                        </form>
                     </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;