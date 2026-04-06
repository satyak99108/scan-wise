import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/history')
      .then(res => {
        if (!res.ok) throw new Error('DATA LOSS: FETCH FAILED.');
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const badgeColor = (score) => {
    if (score === 'good') return 'var(--risk-low)';
    if (score === 'okay') return 'var(--risk-med)';
    return 'var(--risk-high)';
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '60px 5%', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h1 className="grotesk" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 700, lineHeight: 0.9 }}>
          DATA <br/>[ ARCHIVE ]
        </h1>
        <div style={{ fontSize: '1.5rem', opacity: 0.5 }}>
          TOTAL LOGS: {history.length}
        </div>
      </div>

      <div style={{ padding: '60px 5%', flex: 1 }}>
        {loading ? (
          <div className="grotesk" style={{ fontSize: '4rem', animation: 'pulse 1s infinite' }}>[ LOADING LOGS ]</div>
        ) : error ? (
          <div className="brutal-box" style={{ padding: '40px', background: 'var(--risk-high)', color: '#000', fontSize: '2rem' }}>
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="grotesk" style={{ fontSize: '4rem', opacity: 0.2 }}>[ NO RECORDS FOUND ]</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence>
              {history.map((record, i) => (
                <motion.div
                  key={record._id || i}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="brutal-box"
                  style={{ 
                    display: 'flex', 
                    padding: '24px', 
                    borderBottom: '1px solid var(--border)',
                    borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                    borderLeft: 'none', borderRight: 'none',
                    alignItems: 'center',
                    gap: '40px'
                  }}
                >
                  <div style={{ width: '120px' }}>
                    <div style={{ opacity: 0.5, fontSize: '0.8rem', marginBottom: '8px' }}>TIMESTAMP</div>
                    <div>{new Date(record.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h2 className="grotesk" style={{ fontSize: '2rem', fontWeight: 600 }}>
                      {record.productName || 'UNKNOWN ENTITY'}
                    </h2>
                    <div style={{ opacity: 0.5 }}>CLASS: {record.category.toUpperCase()}</div>
                  </div>

                  <div style={{ flex: 2, padding: '0 20px', borderLeft: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {record.ingredients}
                    </div>
                  </div>

                  <div style={{ width: '150px', textAlign: 'right' }}>
                    <span 
                      className="grotesk"
                      style={{ 
                        color: '#000',
                        background: badgeColor(record.result?.health_score),
                        padding: '12px 20px', 
                        fontSize: '1.2rem', 
                        fontWeight: 700
                      }}
                    >
                      {record.result?.health_score || 'N/A'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}

export default History;
