import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Thresholds() {
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('M'); // M or F
  const [calculated, setCalculated] = useState(false);
  const [limits, setLimits] = useState(null);

  const calculateThresholds = (e) => {
    e.preventDefault();
    if (!weight || !age) return;

    const w = parseFloat(weight); // kg
    const a = parseInt(age);

    // Basic rough clinical approximations for max daily limits
    // Not actual medical advice, purely estimation logic for app purposes
    const caffeine = (w * 5.7).toFixed(0); // ~5-6mg per kg is FDA max safe
    const sodium = (sex === 'M' ? 2300 : 2000).toFixed(0); // mg limit approx
    const addedSugar = (sex === 'M' ? 36 : 25).toFixed(0); // grams limit approx (AHA)
    
    setLimits({
      caffeine,
      sodium,
      addedSugar,
      satFat: (w * 0.3).toFixed(0) // Safe approx scaling
    });
    setCalculated(true);
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '60px 5%', borderBottom: '1px solid var(--border)', background: 'var(--fg)', color: 'var(--bg)' }}>
        <h1 className="grotesk" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 700, lineHeight: 0.9 }}>
          TOXICITY <br/>[ THRESHOLDS ]
        </h1>
        <p style={{ fontFamily: 'IBM Plex Mono', marginTop: '20px', fontSize: '1.2rem', fontWeight: 600 }}>CALCULATE ABSOLUTE MAXIMUM DAILY INTAKE.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
        {/* INPUT FORM */}
        <div style={{ flex: '1 1 400px', padding: '60px 5%', borderRight: '1px solid var(--border)' }}>
          <form onSubmit={calculateThresholds} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            <div>
              <div className="grotesk" style={{ fontSize: '2rem', marginBottom: '16px' }}>01 / MASS (KG)</div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="brutal-input brutal-box"
                placeholder="e.g. 75"
                required
              />
            </div>
            
            <div>
              <div className="grotesk" style={{ fontSize: '2rem', marginBottom: '16px' }}>02 / AGE (YRS)</div>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="brutal-input brutal-box"
                placeholder="e.g. 28"
                required
              />
            </div>

            <div>
              <div className="grotesk" style={{ fontSize: '2rem', marginBottom: '16px' }}>03 / BIOLOGICAL SEX</div>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="brutal-input brutal-box"
              >
                <option value="M">MALE</option>
                <option value="F">FEMALE</option>
              </select>
            </div>

            <button type="submit" className="brutal-button" style={{ marginTop: '20px', width: '100%' }}>
              [ COMPUTE LIMITS ]
            </button>
          </form>
        </div>

        {/* OUTPUT */}
        <div style={{ flex: '2 1 600px', padding: '60px 5%', position: 'relative' }}>
          <AnimatePresence>
            {calculated && limits ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key="results"
              >
                <div style={{ fontSize: '1rem', opacity: 0.5, marginBottom: '40px' }}>HARD LIMITS ESTABLISHED:</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  
                  <div className="brutal-box" style={{ padding: '32px', borderTop: '4px solid var(--risk-high)' }}>
                    <div style={{ opacity: 0.7, marginBottom: '12px' }}>MAX CAFFEINE</div>
                    <div className="grotesk" style={{ fontSize: '3rem', color: 'var(--risk-high)', fontWeight: 700, lineHeight: 1 }}>{limits.caffeine}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>mg</span></div>
                    <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#a1a1aa' }}>Exceeding this causes acute cardiovascular strain.</p>
                  </div>

                  <div className="brutal-box" style={{ padding: '32px', borderTop: '4px solid var(--accent)' }}>
                    <div style={{ opacity: 0.7, marginBottom: '12px' }}>ADDED SUGARS</div>
                    <div className="grotesk" style={{ fontSize: '3rem', color: 'var(--accent)', fontWeight: 700, lineHeight: 1 }}>{limits.addedSugar}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>g</span></div>
                    <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#a1a1aa' }}>Linked to rapid metabolic dysfunction.</p>
                  </div>

                  <div className="brutal-box" style={{ padding: '32px', borderTop: '4px solid #fff' }}>
                    <div style={{ opacity: 0.7, marginBottom: '12px' }}>CRITICAL SODIUM</div>
                    <div className="grotesk" style={{ fontSize: '3rem', color: '#fff', fontWeight: 700, lineHeight: 1 }}>{limits.sodium}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>mg</span></div>
                    <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#a1a1aa' }}>Elevates hypertension risk instantly.</p>
                  </div>

                  <div className="brutal-box" style={{ padding: '32px', borderTop: '4px solid var(--risk-med)' }}>
                    <div style={{ opacity: 0.7, marginBottom: '12px' }}>SATURATED FATS</div>
                    <div className="grotesk" style={{ fontSize: '3rem', color: 'var(--risk-med)', fontWeight: 700, lineHeight: 1 }}>{limits.satFat}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>g</span></div>
                    <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#a1a1aa' }}>Arterial clogging threshold.</p>
                  </div>

                </div>
              </motion.div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                <div className="grotesk" style={{ fontSize: '8rem', lineHeight: 0.8, textAlign: 'center' }}>AWAITING<br/>INPUT</div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}

export default Thresholds;
