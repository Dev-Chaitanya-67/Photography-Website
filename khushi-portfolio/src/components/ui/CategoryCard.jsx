import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../../styles/global.css';
import LazyImage from './LazyImage';

const CategoryCard = ({ title, subtitle, image, delay }) => {

  return (
    <article 
      className="card reveal" 
      style={{ transitionDelay: delay }}
    >
      {/* 1. The Wrapper */}
      <div className="card-img-wrap">
        <LazyImage 
          src={image} 
          alt={title} 
          className="w-full h-full"
        />
        
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