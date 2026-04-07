import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      setError('ERROR: PARAMETERS MISSING');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'ANALYSIS FAULT');
      setResult(data);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'CONNECTION SEVERED: START BACKEND LOGIC' : err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (score) => {
    if (score === 'good') return 'var(--risk-low)';
    if (score === 'okay') return 'var(--risk-med)';
    return 'var(--risk-high)';
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex' }}>
      
      {/* ─── Sidebar Panel ─── */}
      <div style={{ width: '400px', borderRight: '1px solid var(--border)', padding: '40px', background: 'var(--bg)', height: 'calc(100vh - 64px)', position: 'sticky', top: '64px', overflowY: 'auto' }}>
        <h1 className="grotesk" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '40px', lineHeight: 1 }}>SYSTEM<br/>INPUT.</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>01 // TARGET IMAGE</div>
            <div className="brutal-box" style={{ padding: '20px', position: 'relative' }}>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
              />
              {!preview ? (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--border)' }}>
                  [ CLICK TO INJECT IMAGE ]
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="Target" style={{ width: '100%', filter: 'grayscale(100%) contrast(1.2)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--fg)', color: 'var(--bg)', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 600 }}>IMAGE SECURED</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>02 // CLASSIFICATION</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="brutal-input brutal-box"
              required
            >
              <option value="">AWAITING SELECT...</option>
              <option value="food">FOODSTUFF</option>
              <option value="cosmetics">COSMETICS</option>
              <option value="cleaning">CHEMICAL (CLEANING)</option>
              <option value="other">UNDEFINED</option>
            </select>
          </div>

          <button type="submit" className="brutal-button" disabled={loading} style={{ width: '100%' }}>
            {loading ? '[ EXECUTING ]' : '[ INITIALIZE ]'}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ padding: '20px', background: 'var(--risk-high)', color: '#000', marginTop: '32px', fontWeight: 700, fontSize: '0.9rem' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Main Content Display ─── */}
      <div style={{ flex: 1, padding: '40px', position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(5px)' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="grotesk" style={{ fontSize: '4rem', color: 'var(--accent)', animation: 'pulse 1s infinite' }}>EXTRACTING</div>
              <div style={{ fontFamily: 'IBM Plex Mono' }}>Please wait while the neural engine parses the data matrix.</div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {result && !loading ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--border)', paddingBottom: '20px', marginBottom: '40px' }}>
                <h2 className="grotesk" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 0.8 }}>RESULTS.</h2>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '4px' }}>THREAT LEVEL</div>
                  <div className="grotesk" style={{ fontSize: '2rem', fontWeight: 700, color: severityColor(result.health_score) }}>
                    [{result.health_score.toUpperCase()}]
                  </div>
                </div>
              </div>

              {(result.warning || result.benefit) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                  {result.warning && (
                    <div className="brutal-box" style={{ padding: '24px', borderLeft: `4px solid var(--risk-high)` }}>
                      <div className="grotesk" style={{ color: 'var(--risk-high)', fontSize: '1.2rem', marginBottom: '12px' }}>CRITICAL FLAG</div>
                      <p style={{ lineHeight: 1.5 }}>{result.warning}</p>
                    </div>
                  )}
                  {result.benefit && (
                    <div className="brutal-box" style={{ padding: '24px', borderLeft: `4px solid var(--risk-low)` }}>
                      <div className="grotesk" style={{ color: 'var(--risk-low)', fontSize: '1.2rem', marginBottom: '12px' }}>POSITIVE TRAIT</div>
                      <p style={{ lineHeight: 1.5 }}>{result.benefit}</p>
                    </div>
                  )}
                </div>
              )}

              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px', opacity: 0.7 }}>RAW INGREDIENT DUMP:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.simplified?.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ ease: "easeOut", duration: 0.4, delay: i * 0.1 }}
                    style={{ transformOrigin: 'left', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', padding: '16px', display: 'flex' }}
                  >
                    <div style={{ width: '8px', background: severityColor(item.risk), marginRight: '20px' }} />
                    <div style={{ flex: 1 }}>
                      <div className="grotesk" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--fg)', marginBottom: '4px' }}>{item.original}</div>
                      <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{item.simple}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
              <div className="grotesk" style={{ fontSize: '6rem', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>AWAITING DATA</div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default Analyze;