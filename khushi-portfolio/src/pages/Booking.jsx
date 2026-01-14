import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, CreditCard, Lock, ChevronLeft } from 'lucide-react';
import '../styles/global.css';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Get Plan from URL
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get('plan') || 'Custom Plan';
  
  // Fake Pricing
  const getPrice = (plan) => {
    if (plan === 'Basic') return '₹15,000';
    if (plan === 'Pro') return '₹55,000';
    if (plan === 'The Legacy') return '₹1,50,000';
    return '₹0';
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Payment
    setTimeout(() => {
      alert(`Payment Successful for ${selectedPlan}!`);
      setIsProcessing(false);
      // In a real app, we would update the database here to "Booked"
      navigate('/dashboard'); 
    }, 2000);
  };

  return (
    <div className="page-container" style={{paddingTop:'120px', minHeight:'100vh'}}>
      
      <div className="max-w-wrapper">
        <div className="booking-grid">
        
            {/* LEFT COLUMN: User Details Form */}
            <div className="booking-form-box">
                
                <Link to="/packages" style={{display:'inline-flex', alignItems:'center', gap:'8px', color:'#888', textDecoration:'none', marginBottom:'1.5rem', fontSize:'0.9rem'}}>
                    <ChevronLeft size={16} /> Back to Packages
                </Link>

                <h2 className="hero-heading" style={{fontSize:'2rem', marginBottom:'1rem'}}>Secure Booking</h2>
                
                <form onSubmit={handlePayment} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    
                    <div className="name-row">
                        <input type="text" className="form-input" placeholder="First Name" required />
                        <input type="text" className="form-input" placeholder="Last Name" required />
                    </div>
                    
                    <input type="email" className="form-input" placeholder="Email Address" required />
                    <input type="tel" className="form-input" placeholder="Phone Number" required />
                    
                    {/* Dark Credit Card Box */}
                    <div className="credit-card-box">
                        <div className="cc-header">
                            <span style={{display:'flex', alignItems:'center', gap:'8px', color:'var(--accent)'}}>
                                <CreditCard size={18} /> Card Details
                            </span>
                            {/* Fake Card Icons */}
                            <div style={{display:'flex', gap:'5px'}}>
                               <div style={{width:'30px', height:'20px', background:'#333', borderRadius:'3px'}}></div>
                               <div style={{width:'30px', height:'20px', background:'#333', borderRadius:'3px'}}></div>
                            </div>
                        </div>

                        <input type="text" className="form-input cc-input" placeholder="0000 0000 0000 0000" style={{marginBottom:'10px'}} />
                        
                        <div className="cc-row">
                            <input type="text" className="form-input cc-input" placeholder="MM/YY" style={{marginBottom:'0'}} />
                            <input type="text" className="form-input cc-input" placeholder="CVC" style={{marginBottom:'0'}} />
                        </div>
                    </div>

                    <button 
                        className="form-btn" 
                        disabled={isProcessing}
                        style={{marginTop:'1rem', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px'}}
                    >
                        {isProcessing ? 'Processing...' : `Pay ${getPrice(selectedPlan)}`}
                        {!isProcessing && <Lock size={16} />}
                    </button>
                    
                    <p style={{textAlign:'center', color:'#444', fontSize:'0.75rem', marginTop:'10px', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                        <Lock size={10} /> 256-bit SSL Encrypted Payment
                    </p>
                </form>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="order-summary-card">
                <div className="summary-glow"></div>

                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-header">
                    <div>
                        <h2 className="plan-name">{selectedPlan}</h2>
                        <div className="plan-sub">Cinematic Wedding Photography</div>
                    </div>
                    <div className="plan-price">{getPrice(selectedPlan)}</div>
                </div>

                <ul className="summary-list">
                    <li className="summary-item">
                        <CheckCircle size={16} color="var(--accent)" /> Full Day Coverage
                    </li>
                    <li className="summary-item">
                        <CheckCircle size={16} color="var(--accent)" /> High Resolution Editing
                    </li>
                    <li className="summary-item">
                        <CheckCircle size={16} color="var(--accent)" /> Digital Gallery Access
                    </li>
                    <li className="summary-item">
                        <CheckCircle size={16} color="var(--accent)" /> Drone Shots Included
                    </li>
                </ul>

                <div className="total-row">
                    <span>Total Due</span>
                    <span>{getPrice(selectedPlan)}</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Booking;