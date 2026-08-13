import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const BuyMyCar = lazy(() => import('./pages/BuyMyCar'));
const About = lazy(() => import('./pages/About'));
const Listen = lazy(() => import('./pages/Listen'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Routes>
          {/* Buy My Car is a focused, standalone landing page (minimal chrome) */}
          <Route path="/buy-my-car" element={<BuyMyCar />} />

          {/* All other pages share the standard header/footer layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about-adam-hall" element={<About />} />
            <Route path="/listen-whats-your-car-worth" element={<Listen />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
