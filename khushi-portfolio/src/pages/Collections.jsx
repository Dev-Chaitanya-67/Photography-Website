import React, { useEffect, useState } from 'react';
import { fetchPortfolioCategories } from '../utils/driveService'; 
import { Loader2, X, ChevronRight, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import Lightbox from '../components/ui/Lightbox';
import LazyImage from '../components/ui/LazyImage';

// YOUR MASTER PORTFOLIO ID
const MASTER_PORTFOLIO_ID = "1TYj8bo0O2poMLzcXzz-h7FRbty-8qobJ"; 

const Collections = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPortfolioCategories(MASTER_PORTFOLIO_ID);
      setCategories(data);
      setLoading(false);
    };
    loadData();

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDisplayPhotos = () => {
    if (activeTab === 'All') {
        return categories.flatMap(cat => cat.photos);
    } else {
        const cat = categories.find(c => c.name === activeTab);
        return cat ? cat.photos : [];
    }
  };

  const displayPhotos = getDisplayPhotos();

  return (
    <section className="collections-wrap" id="collections">
      <div className="max-w-wrapper">
        
        {/* BREADCRUMBS: This sits at the top now */}
        <div className="breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <span style={{color: 'var(--accent)'}}>Collections</span>
        </div>

        {/* LOADING */}
        {loading && (
             <div className="flex flex-col items-center py-12">
                 <Loader2 className="spinner" color="var(--accent)" size={40} />
             </div>
        )}

        {/* CONTENT */}
        {!loading && (
            <>
                {/* 1. CATEGORY TABS */}
                <div className="category-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveTab('All')}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id} 
                            className={`tab-btn ${activeTab === cat.name ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat.name)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* 2. PHOTO GRID */}
                <div className="collections-grid">
                    {displayPhotos.length === 0 ? (
                        <div style={{color:'#666', gridColumn:'1/-1', textAlign:'center', padding:'40px'}}>
                            No photos found.
                        </div>
                    ) : (
                        displayPhotos.map((photo, index) => (
                            <div 
                                key={photo.id || index} 
                                className="collection-card" 
                                onClick={() => setLightboxIndex(index)}
                            >
                                <LazyImage src={photo.url} alt="Portfolio" className="w-full h-full object-cover" />
                            </div>
                        ))
                    )}
                </div>
            </>
        )}

      {/* SCROLL TO TOP BUTTON */}
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`} 
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>

      </div>

      {/* LIGHTBOX COMPONENT */}
      {lightboxIndex >= 0 && (
        <Lightbox 
            images={displayPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(-1)}
            onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
};

export default Collections;