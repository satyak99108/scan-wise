import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import History from './pages/History';
import BmiCalculator from './pages/BmiCalculator';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/history" element={<History />} />
            <Route path="/bmi" element={<BmiCalculator />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;