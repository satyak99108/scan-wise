import React, { useState } from 'react';

function App() {
  const [productName, setProductName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, ingredients, category }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">ScanWise</h1>
          <p className="text-gray-600 mt-2">Analyze product ingredients for safety</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Ingredients</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="food">Food</option>
              <option value="cosmetics">Cosmetics</option>
              <option value="cleaning">Cleaning Products</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Health Score: 
                <span className={`ml-2 ${result.health_score === 'good' ? 'text-green-600' : result.health_score === 'okay' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {result.health_score}
                </span>
              </h3>
            </div>

            {result.warning && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-red-600">Warning:</h3>
                <p>{result.warning}</p>
              </div>
            )}

            {result.benefit && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-600">Benefit:</h3>
                <p>{result.benefit}</p>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Simplified Ingredients:</h3>
              <ul className="list-disc list-inside">
                {result.simplified.map((item, index) => (
                  <li key={index} className="mb-1">
                    <strong>{item.original}</strong>: {item.simple} 
                    <span className={`ml-2 ${item.risk === 'safe' ? 'text-green-600' : item.risk === 'caution' ? 'text-yellow-600' : 'text-red-600'}`}>
                      ({item.risk})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {result.alternatives && result.alternatives.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Alternatives:</h3>
                <ul className="list-disc list-inside">
                  {result.alternatives.map((alt, index) => (
                    <li key={index}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;