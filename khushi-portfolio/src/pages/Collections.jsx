import React, { useEffect, useState } from 'react';
import { fetchPortfolioCategories } from '../utils/driveService'; 
import { Loader2, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

// YOUR MASTER PORTFOLIO ID
const MASTER_PORTFOLIO_ID = "1TYj8bo0O2poMLzcXzz-h7FRbty-8qobJ"; 

const Collections = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPortfolioCategories(MASTER_PORTFOLIO_ID);
      setCategories(data);
      setLoading(false);
    };
    loadData();
  }, []);

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
                                onClick={() => setSelectedImg(photo.url)}
                            >
                                <img src={photo.url} alt="Portfolio" loading="lazy" />
                            </div>
                        ))
                    )}
                </div>
            </>
        )}
      </div>

      {/* LIGHTBOX */}
      {selectedImg && (
        <div className="lightbox" onClick={() => setSelectedImg(null)}>
            <button className="close-lightbox"><X size={30} /></button>
            <img src={selectedImg} alt="Full View" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
};

export default Collections;