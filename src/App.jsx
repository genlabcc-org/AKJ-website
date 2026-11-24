import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer, { FloatingMailButton } from './components/Footer';
import Preloader from './components/Preloader';
import SiteTextAnimations from './components/SiteTextAnimations';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Faq from './pages/Faq';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Team from './pages/Team';
import LearnersAchievement from './pages/LearnersAchievement';
import Pathway from './pages/Pathway';
import Admission from './pages/Admission';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const smootherRef = useRef(null);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [revealReady, setRevealReady] = useState(false);

  const handleRevealStart = useCallback(() => {
    setRevealReady(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setRevealReady(true);
    setPreloaderDone(true);
  }, []);

  useEffect(() => {
    if (isAdminRoute) {
      smootherRef.current?.kill();
      smootherRef.current = null;
      return undefined;
    }

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      smoothTouch: 0.1,
      effects: true,
    });
    smootherRef.current = smoother;

    return () => {
      smoother.kill();
      smootherRef.current = null;
    };
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) return undefined;

    if (smootherRef.current) {
      smootherRef.current.scrollTo(0, false);
    } else {
      window.scrollTo(0, 0);
    }

    let ctx = null;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 901px)', () => {
          const stickyEls = gsap.utils.toArray(
            '.bbb-team-group-left, .bbb-learners-group-left, .bbb-subjects-sidebar'
          );
          stickyEls.forEach((el) => {
            const parent = el.parentElement;
            if (!parent) return;
            ScrollTrigger.create({
              trigger: parent,
              start: 'top 124px',
              end: () => `+=${Math.max(0, parent.offsetHeight - el.offsetHeight)}`,
              pin: el,
              pinSpacing: false,
              invalidateOnRefresh: true,
            });
          });
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      ctx?.revert();
    };
  }, [location.pathname, isAdminRoute]);

  const routeElements = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/acedemics" element={<Pathway />} />
      <Route path="/academics" element={<Pathway />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/services" element={<Services />} />
      <Route path="/team" element={<Team />} />
      <Route path="/learners" element={<LearnersAchievement />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admission" element={<Admission />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  if (isAdminRoute) {
    return (
      <div className="app-wrapper admin-route">
        <main className="main-content">{routeElements}</main>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {!preloaderDone && (
        <Preloader
          onComplete={handlePreloaderComplete}
          onRevealStart={handleRevealStart}
        />
      )}
      <SiteTextAnimations pathname={location.pathname} revealReady={revealReady} />
      <Navbar />
      <FloatingMailButton />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="main-content">{routeElements}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
