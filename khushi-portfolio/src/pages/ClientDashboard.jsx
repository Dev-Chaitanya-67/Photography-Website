/* eslint-disable react-hooks/immutability */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Download, Share2, ChevronRight, ImageOff, Loader2, X, Heart, Save } from 'lucide-react'; // Added Heart, Save
import '../styles/global.css';
import { fetchPhotosFromDrive } from '../utils/driveService';
import { downloadSingleImage, downloadAllImages } from '../utils/downloadHelper';
import { saveUserFavorites } from '../firebase/services'; // Value added: Save to DB
import LazyImage from '../components/ui/LazyImage'; // <--- Import LazyImage

const DashboardBreadcrumb = () => (
  <div className="breadcrumb" style={{marginTop: '20px'}}>
    <Link to="/">Home</Link>
    <ChevronRight size={14} />
    <span style={{color: 'var(--accent)'}}>My Gallery</span>
  </div>
);

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]); 
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  
  // NEW: Favorites Logic
  const [favorites, setFavorites] = useState(new Set()); 
  const [isSavingFavs, setIsSavingFavs] = useState(false);

  // NEW: State for Lightbox (Index based)
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const sessionData = localStorage.getItem('currentUser');
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      setUser(userData);
      // Load initial favorites if they exist
      if (userData.favorites && Array.isArray(userData.favorites)) {
          setFavorites(new Set(userData.favorites));
      }
      if (userData.hasBooking && userData.folderId) {
          loadRealPhotos(userData.folderId);
      }
    }
  }, []);

  const removeFav = (photoName) => {
    setFavorites(prev => {
        const next = new Set(prev);
        next.delete(photoName);
        return next;
    });
  };

  const toggleFavorite = (e, photoName) => {
      e.stopPropagation();
      setFavorites(prev => {
          const next = new Set(prev);
          if (next.has(photoName)) {
              next.delete(photoName);
          } else {
              next.add(photoName);
          }
          return next;
      });
  };

  const handleSaveFavorites = async () => {
      setIsSavingFavs(true);
      const favArray = Array.from(favorites);
      const result = await saveUserFavorites(user.uid, favArray);
      
      if(result.success) {
          // Update local storage to keep session fresh
          const updatedUser = { ...user, favorites: favArray };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Persist locally
          setUser(updatedUser);
          alert("Selections saved successfully! We have received your list.");
      } else {
          alert("Failed to save selections. Please try again.");
      }
      setIsSavingFavs(false);
  };

  const loadRealPhotos = async (folderId) => {
      setLoadingPhotos(true);
      const images = await fetchPhotosFromDrive(folderId);
      setPhotos(images);
      setLoadingPhotos(false);
  };

  const handleDownloadAll = async () => {
      if (isZipping) return;
      setIsZipping(true);
      await downloadAllImages(photos, user.eventName || "Event");
      setIsZipping(false);
  };

  const handleSingleDownload = (e, url, originalName) => {
      e.stopPropagation(); // Stop click from opening the lightbox
      downloadSingleImage(url, originalName);
  };

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const hasPhotos = photos.length > 0;

  return (
    <div className="page-container" style={{paddingTop: '80px'}}>
      
      <nav className="client-nav">
        <div className="client-brand">KHUSHI<span>CLIENT ACCESS</span></div>
        <button onClick={handleLogout} className="logout-btn">Log Out</button>
      </nav>

      <div className="max-w-wrapper">
        <DashboardBreadcrumb />

        {loadingPhotos && (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="spinner text-[var(--accent)] mb-4" size={40} />
                <p className="text-gray-400">Loading your high-res memories...</p>
            </div>
        )}

        {!loadingPhotos && (
            <>
                {hasPhotos ? (
                  <>
                    <div className="gallery-header">
                      <div>
                        <h1 className="event-title">{user.eventName || "Your Event"}</h1>
                        <div className="event-meta">
                           <span>{user.name}</span>
                           <span style={{opacity:0.3}}>|</span>
                           <span>{photos.length} Items</span>
                           {favorites.size > 0 && (
                             <>
                               <span style={{opacity:0.3}}>|</span>
                               <span style={{color: 'var(--accent)'}}>{favorites.size} Selected</span>
                             </>
                           )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                            className="download-all-btn" 
                            style={{backgroundColor: '#222', borderColor:'#444'}}
                            onClick={handleSaveFavorites}
                            disabled={isSavingFavs}
                        >
                            {isSavingFavs ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                            <span className="hidden sm:inline">Save Selection</span>
                        </button>

                        <button 
                            className="download-all-btn" 
                            onClick={handleDownloadAll}
                            disabled={isZipping}
                            style={{opacity: isZipping ? 0.7 : 1, cursor: isZipping ? 'wait' : 'pointer'}}
                        >
                            {isZipping ? (
                                <><Loader2 size={18} className="spinner" /> Zipping...</>
                            ) : (
                                <><Download size={18} /> Download All</>
                            )}
                        </button>
                      </div>
                    </div>

                    <div className="my-photos-grid">
                      {photos.map((photo, idx) => {
                        const isFav = favorites.has(photo.name);
                        return (
                        <div 
                            key={photo.id || idx} 
                            className={`photo-card group ${isFav ? 'ring-2 ring-[var(--accent)]' : ''}`}
                            onClick={() => setLightboxIndex(idx)}
                        >
                          <LazyImage 
                            src={photo.url} 
                            alt={photo.name} 
                            className="w-full h-full object-cover" 
                          />
                          
                          <div className="photo-actions">
                             {/* FAVORITE ACTION */}
                             <button
                                className={`action-icon-btn ${isFav ? 'bg-[var(--accent)] text-white border-none' : ''}`}
                                onClick={(e) => toggleFavorite(e, photo.name)}
                                title={isFav ? "Unfavorite" : "Add to Favorites"}
                             >
                                <Heart size={14} fill={isFav ? "white" : "none"} />
                             </button>

                             <button 
                                className="action-icon-btn" 
                                // UPDATED: Passed 'e' to stop propagation
                                onClick={(e) => handleSingleDownload(e, photo.url, photo.name)}
                                title="Download"
                             >
                              {/* // setting bg of download icon to white for better visibility */}
                                <Download size={14} />
                             </button>
                          </div>
                        </div>
                      )})}
                    </div>
                  </>
                ) : (
                  // Empty State Logic (No changes here)
                  <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {user.hasBooking ? (
                      <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-[#333] rounded-2xl bg-[#0a0a0a] max-w-md w-full">
                          <div className="w-20 h-20 rounded-full bg-[#111] flex items-center justify-center mb-6">
                              <ImageOff size={32} color="#666" />
                          </div>
                          <h3 style={{fontFamily:'var(--font-head)', color:'white', fontSize:'1.8rem', marginBottom:'0.5rem'}}>
                              Memories Uploading Soon
                          </h3>
                          <p style={{color:'#888', fontSize:'0.9rem', marginBottom:'2rem', lineHeight:'1.6'}}>
                              Welcome <strong>{user.name}</strong>. We are curating your gallery.
                          </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-[#333] rounded-2xl bg-[#0a0a0a] max-w-md w-full">
                          <div className="w-20 h-20 rounded-full bg-[#111] flex items-center justify-center mb-6">
                              <Download size={32} color="var(--accent)" />
                          </div>
                          <h3 style={{fontFamily:'var(--font-head)', color:'white', fontSize:'1.8rem', marginBottom:'0.5rem'}}>
                              No Memories Yet
                          </h3>
                          <Link to="/packages" className="view-btn" style={{transform:'none', padding:'14px 30px'}}>
                              Book a Package
                          </Link>
                      </div>
                    )}
                  </div>
                )}
            </>
        )}
      </div>

      {/* NEW: LIGHTBOX COMPONENT */}
      {lightboxIndex >= 0 && (
        <Lightbox 
            images={photos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(-1)}
            onIndexChange={setLightboxIndex}
        />
      )}

    </div>
  );
};

export default ClientDashboard;