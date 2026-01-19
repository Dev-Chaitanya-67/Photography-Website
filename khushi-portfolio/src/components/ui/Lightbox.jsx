import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { downloadSingleImage } from '../../utils/downloadHelper';

const Lightbox = ({ images, currentIndex, onClose, onIndexChange }) => {
  const [zoom, setZoom] = useState(1);
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]); 

  // Reset zoom on image change
  useEffect(() => {
    setZoom(1);
  }, [currentIndex]);

  const handleNext = (e) => {
    if(e) e.stopPropagation();
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  const handlePrev = (e) => {
    if(e) e.stopPropagation();
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const toggleZoom = (e) => {
    e.stopPropagation();
    setZoom(prev => prev === 1 ? 2.5 : 1);
  };

  const handleDownload = (e) => {
      e.stopPropagation();
      downloadSingleImage(currentImage.url, currentImage.name);
  }

  if (!currentImage) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      
      {/* Controls */}
      <div className="lightbox-controls">
         <div className="lightbox-header">
             <span className="image-counter">{currentIndex + 1} / {images.length}</span>
             <div className="lightbox-actions">
                <button onClick={handleDownload} title="Download Original"><Download size={20}/></button>
                <button onClick={toggleZoom} title={zoom > 1 ? "Zoom Out" : "Zoom In"}>
                    {zoom > 1 ? <ZoomOut size={20}/> : <ZoomIn size={20}/>}
                </button>
                <button onClick={onClose} title="Close"><X size={24}/></button>
             </div>
         </div>
      </div>

      {/* Navigation */}
      {currentIndex > 0 && (
          <button className="nav-btn prev" onClick={handlePrev}><ChevronLeft size={36} /></button>
      )}
      {currentIndex < images.length - 1 && (
          <button className="nav-btn next" onClick={handleNext}><ChevronRight size={36} /></button>
      )}

      {/* Image Container */}
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
         <img 
            src={currentImage.url} 
            alt={currentImage.name} 
            style={{ 
                transform: `scale(${zoom})`, 
                cursor: zoom > 1 ? 'zoom-out' : 'zoom-in' 
            }}
            onClick={toggleZoom}
         />
      </div>
    </div>
  );
};

export default Lightbox;
