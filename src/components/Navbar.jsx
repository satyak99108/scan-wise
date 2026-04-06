import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-teal-50 text-teal-700' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;
  };

  return (
    <nav style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
            ScanWise
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/" className={getLinkStyle('/')}>Home</Link>
          <Link to="/analyze" className={getLinkStyle('/analyze')}>Analyze</Link>
          <Link to="/history" className={getLinkStyle('/history')}>History</Link>
          <Link to="/bmi" className={getLinkStyle('/bmi')}>BMI Calculator</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
