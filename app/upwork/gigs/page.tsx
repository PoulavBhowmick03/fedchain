"use client"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gigs from '../components/Gigs';
import GigDetails from '../components/GigDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Gigs />} />
        <Route path="/gig/:id" element={<GigDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
