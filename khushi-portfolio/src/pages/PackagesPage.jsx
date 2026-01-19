import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Packages from '../components/sections/Packages'; // <--- Reusing your Scrollable Component
import '../styles/global.css';

const PackagesPage = () => {
  return (
    // 'page-container' adds the 110px top padding automatically so it clears the Navbar
    <div className="page-container">
      
      {/* WRAPPER to hold the Breadcrumb nicely aligned */}
      <div className="max-w-wrapper">
        
        {/* BREADCRUMBS */}
        <div className="breadcrumb" style={{ paddingLeft: '1.5rem', marginBottom: '0' }}>
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <span style={{color: 'var(--accent)'}}>Packages</span>
        </div>

      </div>

      {/* REUSING THE SCROLLABLE COMPONENT */}
      {/* We pass a prop or just use it as is. Since it handles its own layout, we just render it. */}
      <Packages />

    </div>
  );
};

export default PackagesPage;