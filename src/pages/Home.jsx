import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#111827', marginBottom: '24px', lineHeight: 1.2 }}>
          Understand what you consume.
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '40px', lineHeight: 1.6 }}>
          ScanWise uses advanced AI to analyze product ingredients, highlighting health risks and simplifying complex labels into plain English.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/analyze" className="btn-primary" style={{ textDecoration: 'none', width: 'auto', padding: '16px 32px', fontSize: '1.1rem' }}>
            Start Analysis
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 20px', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: '48px' }}>
            Scan Any Product Instantly
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#ecfdf5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>🛡️</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Risk Detection</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.5 }}>
                Automatically identifies ingredients that may pose a health risk or trigger allergies.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f0fdfa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>📝</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Plain Summaries</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.5 }}>
                Converts complex chemical names into clear, concise summaries you can actually read.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>✨</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Multi-Category</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.5 }}>
                Supports analysis across food, cosmetics, cleaning supplies, and more.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '48px' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0d9488', opacity: 0.2, marginBottom: '16px' }}>01</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Upload</h3>
              <p style={{ color: '#6b7280' }}>Take a picture of the product ingredients and upload it.</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0d9488', opacity: 0.2, marginBottom: '16px' }}>02</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Analyze</h3>
              <p style={{ color: '#6b7280' }}>Our AI scans for risks and categorizes components.</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0d9488', opacity: 0.2, marginBottom: '16px' }}>03</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>Review</h3>
              <p style={{ color: '#6b7280' }}>Get a clear, color-coded actionable report instantly.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
