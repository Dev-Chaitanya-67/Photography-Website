import React, { useEffect, useState } from "react";
import '../../styles/global.css';
import { getAllPackages } from "../../firebase/services";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback data matching new structure
  const localFallback = [
      {
        name: "Basic", price: "₹15k", desc: "Perfect for intimate celebrations.", id: "basic",
        features: [
            { label: "Candid Photography", included: true },
            { label: "Traditional Video", included: true },
            { label: "Cinematic Highlights", included: false },
            { label: "Drone Coverage", included: false },
            { label: "Standard Album", included: true },
            { label: "Instagram Reels", included: false }
        ]
      },
      {
        name: "Pro", price: "₹55k", desc: "Our most loved cinematic experience.", id: "pro", isPopular: true, isFeatured: true,
        features: [
            { label: "Candid Photography", included: true },
            { label: "Traditional Video", included: true },
            { label: "Cinematic Highlights", included: true },
            { label: "Drone Coverage", included: true },
            { label: "Premium Album", included: true },
            { label: "Instagram Reels", included: true }
        ]
      },
      {
        name: "Elite", price: "₹85k", desc: "The complete royal treatment.", id: "elite",
        features: [
            { label: "Candid Photography", included: true },
            { label: "Traditional Video", included: true },
            { label: "Cinematic Highlights", included: true },
            { label: "Drone Coverage", included: true },
            { label: "Luxury Album", included: true },
            { label: "Instagram Reels", included: true },
            { label: "Raw Data Delivery", included: true }
        ]
      }
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getAllPackages();
        if (data && data.length > 0) {
           const visible = data.filter(p => !p.isHidden);
           setPackages(visible);
        } else {
             setPackages(localFallback); 
        }
      } catch (err) {
        console.error("Failed to load packages, using fallback", err);
        setPackages(localFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleBookNow = (packageName) => {
    const phoneNumber = "917507620937"; 
    const message = `Hello Khushi Cinematic Team! 👋\n\nI am interested in booking the *${packageName} Package*. \n\nCould you please share availability and more details?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) return (
      <div className="max-w-wrapper" style={{display:'flex',justifyContent:'center',padding:'50px'}}>
        <div style={{color:'white'}}>Loading Packages...</div>
      </div>
  );

  return (
    <div className="max-w-wrapper">
      <h2 className="section-title reveal">Our Packages</h2>
      
      <div className="pricing-scroller reveal">
        
        {packages.map((pkg, index) => (
          <div 
            key={pkg.id || index} 
            className={`price-card ${pkg.isFeatured ? 'featured' : ''}`}
          >
            {pkg.isPopular && (
              <div className="popular-badge">MOST WANTED</div>
            )}

            <h3 className="package-name">{pkg.name}</h3>
            <div className="package-price" style={{ marginBottom: "1rem" }}>
                {pkg.price}
                {pkg.prevPrice && <span style={{textDecoration:'line-through', fontSize:'0.9rem', color:'#666', marginLeft:'10px'}}>{pkg.prevPrice}</span>}
            </div>
            <p className="package-desc">{pkg.desc}</p>

            <ul className="package-features">
                {(Array.isArray(pkg.features) ? pkg.features : []).map((f, i) => (
                    <li key={i} className={f.included ? "" : "disabled"}>
                        {f.label}
                    </li>
                ))}
            </ul>

            <button 
                className="package-btn"
                onClick={() => handleBookNow(pkg.name)}
            >
                Book This Package
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;
