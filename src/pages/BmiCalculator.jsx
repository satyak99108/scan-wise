import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight || !age) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
    }
  };

  const getBmiConfig = (bmiValue) => {
    if (bmiValue < 18.5) return { category: 'LOW MASS', color: 'var(--accent)' };
    if (bmiValue >= 18.5 && bmiValue < 24.9) return { category: 'OPTIMAL', color: 'var(--risk-low)' };
    if (bmiValue >= 25 && bmiValue < 29.9) return { category: 'OVERWEIGHT', color: 'var(--risk-med)' };
    return { category: 'CRITICAL MASS', color: 'var(--risk-high)' };
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '60px 5%', borderBottom: '1px solid var(--border)', background: 'var(--fg)', color: 'var(--bg)' }}>
        <h1 className="grotesk" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 700, lineHeight: 0.9 }}>
          BODY MASS <br/>[ INDEX ]
        </h1>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
        {/* INPUT FORM */}
        <div style={{ flex: '1 1 400px', padding: '60px 5%', borderRight: '1px solid var(--border)' }}>
          <form onSubmit={calculateBMI} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            <div>
              <div className="grotesk" style={{ fontSize: '2rem', marginBottom: '16px' }}>01 / AGE</div>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="YEARS"
                className="brutal-input brutal-box"
                required
              />
            </div>
            
            <div>
              <div className="grotesk" style={{ fontSize: '2rem', marginBottom: '16px' }}>02 / HEIGHT</div>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="brutal-input brutal-box"
                  style={{ paddingRight: '60px' }}
                  required
                />
                <span style={{ position: 'absolute', right: '20px', top: '16px', opacity: 0.5 }}>CM</span>
              </div>
            </div>

            <div>
              <div className="grotesk" style={{ fontSize: '2rem', marginBottom: '16px' }}>03 / WEIGHT</div>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="brutal-input brutal-box"
                  style={{ paddingRight: '60px' }}
                  required
                />
                <span style={{ position: 'absolute', right: '20px', top: '16px', opacity: 0.5 }}>KG</span>
              </div>
            </div>

            <button type="submit" className="brutal-button" style={{ marginTop: '20px', width: '100%' }}>
              [ COMPUTE ]
            </button>
          </form>
        </div>

        {/* OUTPUT */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 5%', position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence>
            {bmi ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={bmi}
              >
                <div style={{ fontSize: '1rem', opacity: 0.5, marginBottom: '20px' }}>OUTPUT RESULT:</div>
                <div className="grotesk" style={{ fontSize: 'clamp(6rem, 15vw, 15rem)', lineHeight: 0.8, color: getBmiConfig(bmi).color }}>
                  {bmi}
                </div>
                <div style={{ fontSize: '2rem', marginTop: '20px', padding: '10px 20px', background: getBmiConfig(bmi).color, color: '#000', display: 'inline-block', fontWeight: 600 }}>
                  {getBmiConfig(bmi).category}
                </div>
              </motion.div>
            ) : (
              <div style={{ opacity: 0.1, pointerEvents: 'none' }}>
                <div className="grotesk" style={{ fontSize: '15rem', lineHeight: 0.8 }}>0.0</div>
                <div style={{ fontSize: '2rem', marginTop: '20px', fontWeight: 600 }}>NULL</div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}

export default BmiCalculator;
