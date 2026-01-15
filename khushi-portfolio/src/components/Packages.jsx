import React from "react";
import { Check, X, MessageCircle } from "lucide-react"; 
import '../styles/global.css';

const Packages = () => {

  const allFeatures = [
    { label: "Candid Photography", id: "candid" },
    { label: "Traditional Video", id: "trad_vid" },
    { label: "Cinematic Highlights", id: "cinematic" },
    { label: "Drone Coverage", id: "drone" },
    { label: "Premium Photobook", id: "album" },
    { label: "Instagram Reels", id: "reels" },
    { label: "Raw Data Delivery", id: "raw" },
  ];

  const packages = [
    {
      name: "Basic",
      price: "₹15k",
      desc: "Perfect for intimate celebrations.",
      isFeatured: false,
      isPopular: false,
      features: {
        candid: true,
        trad_vid: true,
        cinematic: false,
        drone: false,
        album: "Standard (30 Sheets)",
        reels: false,
        raw: false
      }
    },
    {
      name: "Pro",
      price: "₹55k",
      desc: "Our most loved cinematic experience.",
      isFeatured: true,
      isPopular: true,
      features: {
        candid: true,
        trad_vid: true,
        cinematic: true,
        drone: true,
        album: "Premium (50 Sheets)",
        reels: true,
        raw: false
      }
    },
    {
        name: "Elite",
        price: "₹85k",
        desc: "The complete royal treatment.",
        isFeatured: false,
        isPopular: false,
        features: {
          candid: true,
          trad_vid: true,
          cinematic: true,
          drone: true,
          album: "Luxury (80 Sheets)",
          reels: true,
          raw: true
        }
    }
  ];

  const handleBookNow = (packageName) => {
    // 1. Define your phone number (Include Country Code, e.g., 91 for India)
    const phoneNumber = "917507620937"; 
    
    // 2. Create the message
    const message = `Hello Khushi Cinematic Team! 👋\n\nI am interested in booking the *${packageName} Package*. \n\nCould you please share availability and more details?`;
    
    // 3. Create the WhatsApp URL
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // 4. Open in new tab
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-wrapper">
      <h2 className="section-title reveal">Our Packages</h2>
      
      <div className="pricing-scroller reveal">
        
        {packages.map((pkg, index) => (
          <div 
            key={index} 
            className={`price-card ${pkg.isFeatured ? 'featured' : ''}`}
          >
            {pkg.isPopular && (
              <div className="popular-badge">MOST WANTED</div>
            )}

            <h3 className="package-name">{pkg.name}</h3>
            <div className="package-price" style={{ marginBottom: "1rem" }}>{pkg.price}</div>
            <p className="package-desc">{pkg.desc}</p>

            <div className="feature-list">
              {allFeatures.map((feat) => {
                const value = pkg.features[feat.id];
                const isIncluded = value === true || (typeof value === 'string');
                
                return (
                  <div key={feat.id} className={`feature-item ${isIncluded ? '' : 'excluded'}`}>
                    <div className="feature-icon">
                      {isIncluded ? (
                        <Check size={16} color="var(--accent)" strokeWidth={3} />
                      ) : (
                        <X size={16} color="#444" />
                      )}
                    </div>
                    
                    <span className="feature-text">
                      {typeof value === 'string' ? value : feat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <button 
              className="form-btn" 
              style={{ width: '100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}
              onClick={() => handleBookNow(pkg.name)}
            >
              <MessageCircle size={18} /> Book via WhatsApp
            </button>
          </div>
        ))}

        {/* Spacer for scroll */}
        <div style={{ minWidth: "20px" }}></div>
      </div>
    </div>
  );
};

export default Packages;