import React from "react";
import { useNavigate } from "react-router-dom"; 
import { Check, X } from "lucide-react"; 
import '../styles/global.css';

const Packages = () => {
  const navigate = useNavigate();

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
  ];

  const handleBookNow = (packageName) => {
    navigate(`/booking?plan=${encodeURIComponent(packageName)}`);
  };

  return (
    <section className="packages-wrap" id="packages">
      {/* REMOVED 'reveal' class so it is visible immediately */}
      <h2 className="section-title" style={{ marginTop: "1rem", color: "white" }}>
        Our Packages
      </h2>
      
      {/* REMOVED 'reveal' class here too */}
      <div className="pricing-scroller">
        
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
              style={{ width: '100%' }}
              onClick={() => handleBookNow(pkg.name)}
            >
              Book Now
            </button>
          </div>
        ))}

        <div style={{ minWidth: "20px" }}></div>
      </div>
    </section>
  );
};

export default Packages;