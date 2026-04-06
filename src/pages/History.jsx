import React, { useState, useEffect } from 'react';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/history')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch history');
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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading history...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Scan History</h1>
        
        {history.length === 0 ? (
          <div className="card" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
            No scans found yet. Start analyzing some products!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((record, index) => (
              <div key={index} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>{record.productName}</h2>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'capitalize' }}>Category: {record.category}</p>
                  </div>
                  <span className={`badge ${record.result?.health_score === 'good' ? 'badge-good' : record.result?.health_score === 'okay' ? 'badge-okay' : 'badge-bad'}`}>
                    {record.result?.health_score}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {record.ingredients}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                  Scanned on {new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
