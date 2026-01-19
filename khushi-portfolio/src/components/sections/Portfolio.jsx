import React, { useEffect, useState } from "react";
import CategoryCard from "../ui/CategoryCard";
import '../../styles/global.css';
import { fetchPortfolioCategories } from "../../utils/driveService"; // <--- Import Drive Service
import { Loader2 } from "lucide-react";

// YOUR MASTER FOLDER ID (Same as Collections Page)
const MASTER_PORTFOLIO_ID = "1TYj8bo0O2poMLzcXzz-h7FRbty-8qobJ";

const Portfolio = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Scroll Animation Logic (Kept as is)
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        if (revealTop < windowHeight - 60) {
          reveals[i].classList.add("active");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]); // Re-run animation check when loading finishes

  // 2. Fetch Real Categories from Drive
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchPortfolioCategories(MASTER_PORTFOLIO_ID);
      setCategories(data);
      setLoading(false);
    };
    loadCategories();
  }, []);

  // 3. Helper to keep your fancy subtitles
  const getSubtitle = (folderName) => {
      const subtitles = {
          "Wedding": "Royal Traditions & Rituals",
          "Pre_Wedding": "Candid Love Stories", // Note: Drive might use underscores
          "Pre-Wedding": "Candid Love Stories",
          "Ring_Ceremony": "The Beginning of Forever",
          "Baby_Shower": "Welcoming New Life",
          "Haldi": "Yellow Hues of Joy",
          "Mehndi": "Artistry & Celebration"
      };
      // Default fallback if a new folder name doesn't match above
      return subtitles[folderName] || `${folderName.replace(/_/g, ' ')} Gallery`;
  };

  return (
    <section id="gallery">
      <h2 className="section-title reveal">Our Collections</h2>
      
      <p className="reveal tagline" style={{textAlign: 'center', marginBottom: '3rem', letterSpacing: '2px'}}>
        LOVE / LIGHT / EMOTION
      </p>

      {/* LOADING STATE */}
      {loading && (
          <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="spinner text-[var(--accent)] mb-4" size={40} />
              <p className="text-gray-500 text-sm">Loading Collections...</p>
          </div>
      )}

      {/* DYNAMIC GRID */}
      {!loading && (
        <div className="portfolio-grid">
          {categories.length === 0 ? (
             <div className="col-span-full text-center text-gray-500">
                No categories found in Drive.
             </div>
          ) : (
             categories.map((cat, index) => {
                // Use the first photo as the cover, or a fallback placeholder
                const coverImage = cat.photos && cat.photos.length > 0 
                    ? cat.photos[0].url 
                    : "https://via.placeholder.com/400x600?text=No+Image";

                return (
                  <CategoryCard
                    key={cat.id}
                    title={cat.name.replace(/_/g, ' ')} // Clean up "Pre_Wedding" -> "Pre Wedding"
                    subtitle={getSubtitle(cat.name)}
                    image={coverImage}
                    delay={`${index * 0.1}s`}
                  />
                );
             })
          )}
        </div>
      )}
    </section>
  );
};

export default Portfolio;