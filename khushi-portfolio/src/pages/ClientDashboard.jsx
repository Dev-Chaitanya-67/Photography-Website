import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Download, Share2, ChevronRight, ImageOff, Loader2, X } from 'lucide-react'; // Added X for close button
import '../styles/global.css';
import { fetchPhotosFromDrive } from '../utils/driveService';
import { downloadSingleImage, downloadAllImages } from '../utils/downloadHelper';

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
  
  // NEW: State for Lightbox
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('currentUser');
    if (!sessionData) {
      navigate('/'); 
    } else {
      const userData = JSON.parse(sessionData);
      setUser(userData);
      if (userData.hasBooking && userData.folderId) {
          loadRealPhotos(userData.folderId);
      }
    }
  }, [navigate]);

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
                           <span>{user.name}</span><span style={{opacity:0.3}}>|</span><span>{photos.length} Items</span>
                        </div>
                      </div>
                      
                      <button 
                        className="download-all-btn" 
                        onClick={handleDownloadAll}
                        disabled={isZipping}
                        style={{opacity: isZipping ? 0.7 : 1, cursor: isZipping ? 'wait' : 'pointer'}}
                      >
                        {isZipping ? (
                             <><Loader2 size={18} className="spinner" /> Zipping Original Files...</>
                        ) : (
                             <><Download size={18} /> Download All Photos</>
                        )}
                      </button>
                    </div>

                    <div className="my-photos-grid">
                      {photos.map((photo, idx) => (
                        <div 
                            key={photo.id || idx} 
                            className="photo-card group"
                            // NEW: Click to open Lightbox
                            onClick={() => setSelectedImg(photo.url)}
                        >
                          <img src={photo.url} alt={photo.name} loading="lazy" />
                          
                          <div className="photo-actions">
                             
                             <button 
                                className="action-icon-btn" 
                                // UPDATED: Passed 'e' to stop propagation
                                onClick={(e) => handleSingleDownload(e, photo.url, photo.name)}
                                title={photo.name}
                             >
                              {/* // setting bg of download icon to white for better visibility */}
                                <Download size={14} />
                             </button>
                          </div>
                        </div>
                      ))}
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
      {selectedImg && (
        <div className="lightbox" onClick={() => setSelectedImg(null)}>
            <button className="close-lightbox"><X size={30} /></button>
            <img src={selectedImg} alt="Full View" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

    </div>
  );
};

export default ClientDashboard;