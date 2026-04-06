import React, { useState } from 'react';

function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight || !age) return;

    // Height in cm, weight in kg
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
    }
  };

  const getBmiCategory = (bmiValue) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: '#3b82f6', bg: '#eff6ff' };
    if (bmiValue >= 18.5 && bmiValue < 24.9) return { category: 'Normal weight', color: '#10b981', bg: '#ecfdf5' };
    if (bmiValue >= 25 && bmiValue < 29.9) return { category: 'Overweight', color: '#f59e0b', bg: '#fffbeb' };
    return { category: 'Obesity', color: '#ef4444', bg: '#fef2f2' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '60px 16px' }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>BMI Calculator</h1>
          <p style={{ color: '#6b7280' }}>Calculate your Body Mass Index quickly and accurately.</p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={calculateBMI}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Age
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Years"
                className="input-field"
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="2"
                  max="500"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Calculate BMI
            </button>
          </form>

          {bmi && (
            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '8px' }}>
                Your BMI Score
              </div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: getBmiCategory(bmi).color, lineHeight: 1 }}>
                {bmi}
              </div>
              <div style={{ marginTop: '12px', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', backgroundColor: getBmiCategory(bmi).bg, color: getBmiCategory(bmi).color, fontWeight: 600, fontSize: '0.9rem' }}>
                {getBmiCategory(bmi).category}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default BmiCalculator;
