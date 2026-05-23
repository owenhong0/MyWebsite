import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Existing pages
import PeaksMainPage   from './components/PeaksMainPage';
import LocaleMainPage  from './components/LocaleMainPage';
import PlatesMainPage  from './components/PlatesMainPage';

// New page structure
import Homepage            from './views/Homepage';
import FullscreenViewer    from './components/CarGallery/Car3DBackgroundPage';
import MakeSelectionPage   from './pages/MakeSelectionPage';
import IndividualCarPage   from './pages/IndividualCarPage';
import TravelPage          from './pages/TravelPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Landing ─────────────────────────────────────────────────── */}
        <Route path="/"         element={<Homepage />} />

        {/* ── Car gallery ─────────────────────────────────────────────── */}
        {/* Gallery main view — all cars, make emblem strip at bottom */}
        <Route path="/gallery"                       element={<FullscreenViewer />} />
        {/* Make selection — filtered grid of cars for one make */}
        <Route path="/gallery/:make"                 element={<MakeSelectionPage />} />
        {/* Individual car — full 3D + scroll-down spec sheet */}
        <Route path="/gallery/:make/:slug"           element={<IndividualCarPage />} />

        {/* ── Travel ──────────────────────────────────────────────────── */}
        <Route path="/travel"   element={<TravelPage />} />

        {/* ── Legacy routes (keep alive) ──────────────────────────────── */}
        <Route path="/localeMain" element={<LocaleMainPage />} />
        <Route path="/platesMain" element={<PlatesMainPage />} />
        <Route path="/peaksMain"  element={<PeaksMainPage />} />

        {/* ── Catch-all ───────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
