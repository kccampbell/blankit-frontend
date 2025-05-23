// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Trial from './pages/Trial';
import RedactionEditor from './pages/RedactionEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trial" element={<Trial />} />
        <Route path="/redaction-editor/:documentId" element={<RedactionEditor />} />
      </Routes>
    </Router>
  );
}

export default App;