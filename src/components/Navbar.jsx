import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'HOME' },
    { path: '/analyze', label: 'ANALYZE' },
    { path: '/history', label: 'ARCHIVE' },
    { path: '/bmi', label: 'BMI' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'stretch',
      height: '64px'
    }}>
      <Link to="/" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 32px',
        borderRight: '1px solid var(--border)',
        textDecoration: 'none',
        background: 'var(--fg)',
        color: 'var(--bg)'
      }}>
        <span className="grotesk" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.05em' }}>
          SCANWISE_
        </span>
      </Link>
      
      <div style={{ display: 'flex', flex: 1, overflowX: 'auto' }}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path}
              to={link.path} 
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center',
                padding: '0 32px',
                borderRight: '1px solid var(--border)',
                textDecoration: 'none',
                color: isActive ? 'var(--bg)' : 'var(--fg)',
                fontWeight: 500,
                transition: 'color 0.2s',
                overflow: 'hidden'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--accent)',
                    zIndex: -1
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                {link.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
