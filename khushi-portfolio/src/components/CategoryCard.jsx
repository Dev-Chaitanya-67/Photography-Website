import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../styles/global.css';

const CategoryCard = ({ title, subtitle, image, delay }) => {
  const imgError = (e) => {
  };

  return (
    <article 
      className="card reveal" 
      style={{ transitionDelay: delay }}
    >
      {/* 1. The Wrapper */}
      <div className="card-img-wrap">
        <img src={image} alt={title} onError={imgError} />
        
        {/* 2. The Overlay */}
        <div className="view-more-overlay">
             {/* 3. The Button */}
             <Link to="/collections" className="view-btn">
                View Collection <ArrowRight size={14} />
             </Link>
        </div>
      </div>
      
      <div className="card-body">
        <h3 style={{fontFamily:'var(--font-head)', color:'white'}}>{title}</h3>
        <p style={{color:'#888'}}>{subtitle}</p>
      </div>
    </article>
  );
};

export default CategoryCard;