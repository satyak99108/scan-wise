import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Macros() {
  const [file, setFile] = useState(null);
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
    if (!file) {
      setError('ERROR: NO VISUAL DATA PROVIDED.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('http://localhost:5000/api/macros', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'MACRO ESTIMATION FAULT');
      setResult(data);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'CONNECTION SEVERED TO AI MODEL.' : err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex' }}>
      
      {/* ─── Sidebar Panel ─── */}
      <div style={{ width: '400px', borderRight: '1px solid var(--border)', padding: '40px', background: 'var(--bg)', minHeight: 'calc(100vh - 64px)', position: 'sticky', top: '64px', overflowY: 'auto' }}>
        <h1 className="grotesk" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px', lineHeight: 1 }}>VISUAL<br/>MACROS.</h1>
        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '40px' }}>Neural estimation of protein, fats, and carbohydrates from raw optical data of plated meals.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>01 // MEAL UPLOAD</div>
            <div className="brutal-box" style={{ padding: '20px', position: 'relative' }}>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
              />
              {!preview ? (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--border)' }}>
                  [ INJECT MEAL PHOTO ]
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="Target" style={{ width: '100%', filter: 'contrast(1.2)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--fg)', color: 'var(--bg)', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 600 }}>OPTICAL DATA SECURED</div>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="brutal-button" disabled={loading} style={{ width: '100%' }}>
            {loading ? '[ ESTIMATING ]' : '[ INITIALIZE AI VISION ]'}
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
              <div className="grotesk" style={{ fontSize: '4rem', color: 'var(--accent)', animation: 'pulse 1s infinite' }}>PROCESSING</div>
              <div style={{ fontFamily: 'IBM Plex Mono' }}>Llama-3.2 Vision Model analyzing optical structures.</div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border)', paddingBottom: '20px', marginBottom: '40px' }}>
                <div>
                  <h2 className="grotesk" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 0.8, marginBottom: '16px' }}>ESTIMATE.</h2>
                  <div style={{ fontSize: '1.2rem', opacity: 0.8, textTransform: 'uppercase' }}>{result.food_detected}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '4px' }}>AI CONFIDENCE</div>
                  <div className="grotesk" style={{ fontSize: '2rem', fontWeight: 700, color: result.confidence === 'high' ? 'var(--risk-low)' : 'var(--risk-med)' }}>
                    [{result.confidence?.toUpperCase()}]
                  </div>
                </div>
              </div>

              {/* Huge Calorie Display */}
              <div style={{ marginBottom: '40px', padding: '40px', border: '1px solid var(--border)', background: 'var(--fg)', color: 'var(--bg)', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.2rem', marginBottom: '8px' }}>TOTAL CALORIC LOAD</div>
                <div className="grotesk" style={{ fontSize: '8rem', lineHeight: 0.8, fontWeight: 700 }}>{result.calories}</div>
              </div>

              {/* Macros Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                
                <div className="brutal-box" style={{ padding: '32px', borderTop: '4px solid var(--accent)' }}>
                  <div style={{ opacity: 0.7, marginBottom: '12px' }}>PROTEIN STRUCTURES</div>
                  <div className="grotesk" style={{ fontSize: '3rem', color: 'var(--accent)', fontWeight: 700, lineHeight: 1 }}>{result.protein}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>g</span></div>
                </div>

                <div className="brutal-box" style={{ padding: '32px', borderTop: '4px solid #fff' }}>
                  <div style={{ opacity: 0.7, marginBottom: '12px' }}>CARBOHYDRATES</div>
                  <div className="grotesk" style={{ fontSize: '3rem', color: '#fff', fontWeight: 700, lineHeight: 1 }}>{result.carbs}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>g</span></div>
                </div>

                <div className="brutal-box" style={{ padding: '32px', borderTop: '4px solid var(--risk-high)' }}>
                  <div style={{ opacity: 0.7, marginBottom: '12px' }}>LIPIDS / FATS</div>
                  <div className="grotesk" style={{ fontSize: '3rem', color: 'var(--risk-high)', fontWeight: 700, lineHeight: 1 }}>{result.fats}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>g</span></div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px', opacity: 0.7 }}>LOGICAL BREAKDOWN:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.breakdown?.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ ease: "easeOut", duration: 0.4, delay: i * 0.1 }}
                    style={{ transformOrigin: 'left', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', padding: '16px 24px', fontSize: '1.1rem' }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>

            </motion.div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
              <div className="grotesk" style={{ fontSize: '6rem', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>AWAITING OPTICS</div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default Macros;
