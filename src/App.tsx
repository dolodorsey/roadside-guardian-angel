import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import ProviderApp from '@/pages/ProviderApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/provider/*" element={<ProviderApp />} />
      </Routes>
    </Router>
  );
}

export default App;