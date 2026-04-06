import React, { useState } from 'react';

function Analyze() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !category) {
      setError('Please select an image and a category.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed.');
      setResult(data);
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please start the backend with: node server/server.js');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const riskClass = (risk) => {
    if (risk === 'safe') return 'risk-safe';
    if (risk === 'caution') return 'risk-caution';
    return 'risk-harmful';
  };

  const dotClass = (risk) => {
    if (risk === 'safe') return 'dot dot-safe';
    if (risk === 'caution') return 'dot dot-caution';
    return 'dot dot-harmful';
  };

  const badgeClass = (score) => {
    if (score === 'good') return 'badge badge-good';
    if (score === 'okay') return 'badge badge-okay';
    return 'badge badge-bad';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
              ScanWise
            </h1>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 400 }}>
            Upload a product image to analyze its ingredients
          </p>
        </div>

        {/* ── Upload Form ── */}
        <div className="card" style={{ padding: '32px', marginBottom: 20 }}>
          <form onSubmit={handleSubmit}>

            {/* Image Upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Product Image
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 5 }}
                />
                <div className={`upload-zone ${preview ? 'has-file' : ''}`}
                  style={{ minHeight: preview ? 'auto' : 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: preview ? 0 : '24px', overflow: 'hidden' }}>
                  {!preview ? (
                    <>
                      <svg width="36" height="36" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 10 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 500 }}>Click to upload or drag image here</span>
                      <span style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: 4 }}>JPG or PNG · Max 5 MB</span>
                    </>
                  ) : (
                    <div style={{ width: '100%', position: 'relative' }}>
                      <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 240, objectFit: 'contain', display: 'block', background: '#f9fafb', borderRadius: '10px' }} />
                      <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', textAlign: 'center', padding: '8px', fontSize: '0.75rem', color: '#0d9488', fontWeight: 600 }}>
                        ✓ Image selected · Click to change
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Product Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="input-field"
                style={{ appearance: 'none', cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                <option value="">Select a category…</option>
                <option value="food">Food & Beverages</option>
                <option value="cosmetics">Cosmetics & Skincare</option>
                <option value="cleaning">Cleaning Products</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !file || !category} className="btn-primary">
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Analyzing… this may take 20–30s
                </span>
              ) : 'Analyze Ingredients'}
            </button>
          </form>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="card" style={{ padding: '16px 20px', marginBottom: 20, borderColor: '#fecaca', background: '#fef2f2' }}>
            <p style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>⚠</span>
              {error}
            </p>
          </div>
        )}

        {/* ── Loading Overlay ── */}
        {loading && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(248,249,250,0.85)',
            backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3" />
              <path d="M12 2a10 10 0 019.95 9" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#111827', fontSize: '1rem', fontWeight: 600 }}>Analyzing your product…</p>
              <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: 4 }}>Reading image → Extracting ingredients → AI analysis</p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* ──          ANALYSIS RESULTS            ── */}
        {/* ══════════════════════════════════════════ */}
        {result && (
          <div style={{ marginTop: 8 }}>

            {/* Results Header */}
            <div className="card" style={{ padding: '28px 32px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Analysis Results</h2>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 400 }}>Powered by AI ingredient analysis</p>
                </div>
                <span className={badgeClass(result.health_score)}>
                  {result.health_score === 'good' ? '● ' : result.health_score === 'okay' ? '● ' : '● '}
                  Safety: {result.health_score}
                </span>
              </div>
            </div>

            {/* Warning */}
            {result.warning && (
              <div className="card" style={{ padding: '18px 24px', marginBottom: 12, background: '#fffbeb', borderColor: '#fde68a', borderLeft: '4px solid #f59e0b' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>⚠ Warning</p>
                <p style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: 1.6, fontWeight: 400 }}>{result.warning}</p>
              </div>
            )}

            {/* Benefit */}
            {result.benefit && (
              <div className="card" style={{ padding: '18px 24px', marginBottom: 12, background: '#ecfdf5', borderColor: '#a7f3d0', borderLeft: '4px solid #10b981' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>✓ Benefit</p>
                <p style={{ fontSize: '0.88rem', color: '#064e3b', lineHeight: 1.6, fontWeight: 400 }}>{result.benefit}</p>
              </div>
            )}

            {/* Ingredient Breakdown */}
            <div className="card" style={{ padding: '28px 32px', marginBottom: 16 }}>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
                Ingredient Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {(result.simplified || []).map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                    borderBottom: i < result.simplified.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <div className={dotClass(item.risk)} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1f2937', marginBottom: 2 }}>
                        {item.original}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 400, lineHeight: 1.5 }}>
                        {item.simple}
                      </div>
                    </div>
                    <span className={`risk-pill ${riskClass(item.risk)}`}>
                      {item.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternatives */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div className="card" style={{ padding: '28px 32px' }}>
                <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                  Recommended Alternatives
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {result.alternatives.map((alt, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                      borderBottom: i < result.alternatives.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}>
                      <span style={{ color: '#0d9488', fontSize: '0.85rem' }}>→</span>
                      <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 400 }}>{alt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Analyze;