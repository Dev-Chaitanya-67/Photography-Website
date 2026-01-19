import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

const LazyImage = ({ src, alt, className, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for scroll-based loading
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Stop observing once loaded
        }
      });
    }, {
      rootMargin: '50px', // Load images 50px before they appear
      threshold: 0.1
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-[#111] ${className}`} 
      onClick={onClick}
    >
      {/* 1. Loading Skeleton / Spinner */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
           <Loader2 className="animate-spin text-gray-600" size={24} />
        </div>
      )}

      {/* 2. Error State */}
      {hasError && (
         <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 z-10">
            <ImageOff size={24} />
         </div>
      )}

      {/* 3. The Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

export default LazyImage;
