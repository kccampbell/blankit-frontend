// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Trial from './pages/Trial';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trial" element={<Trial />} />
          {/* Future routes will go here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;