import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import '../../styles/global.css';

const Breadcrumb = ({ pageName }) => {
  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      <ChevronRight size={14} />
      <span>{pageName}</span>
    </div>
  );
};

export default Breadcrumb;