import { useState, useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getApiUrl } from "@/lib/utils";

import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import News from "./pages/News";
import Members from "./pages/Rankings";
import MemberVerifier from "./pages/DownloadPage";
import WhatIsAkrho from "./pages/WhatIsAkrho";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import YouTubeAudioPlayer from "./components/YouTubeAudioPlayer";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

// Check if user has already passed the landing page this session
const hasEntered = () => sessionStorage.getItem("sws_entered") === "true";

// Inner app that has access to router context
const AppInner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Bypass landing page for verifier or download paths
  const isVerifierRoute = location.pathname === "/member-verifier" || location.pathname === "/download";
  
  if (isVerifierRoute && sessionStorage.getItem("sws_entered") !== "true") {
    sessionStorage.setItem("sws_entered", "true");
  }

  const [showLanding, setShowLanding] = useState(!hasEntered() && !isVerifierRoute);
  const [audioPlaying, setAudioPlaying] = useState(hasEntered() || isVerifierRoute);

  // Sync landing page visibility if route changes
  useEffect(() => {
    if (isVerifierRoute) {
      setShowLanding(false);
    }
  }, [isVerifierRoute]);

  // Periodic heartbeat to track active online members
  useEffect(() => {
    const sendHeartbeat = () => {
      const token = localStorage.getItem("sws_token");
      if (!token) return;
      fetch(getApiUrl("/api/auth/me"), { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    };
    sendHeartbeat();
    const heartbeatInterval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(heartbeatInterval);
  }, []);

  const handleEnter = useCallback(() => {
    // Mark session as entered
    sessionStorage.setItem("sws_entered", "true");
    // Start audio (triggered by user gesture — satisfies browser autoplay policy)
    setAudioPlaying(true);
    // Hide landing and go to home
    setShowLanding(false);
    navigate("/", { replace: true });
  }, [navigate]);

  if (showLanding) {
    return (
      <>
        <LandingPage onEnter={handleEnter} />
        {/* Audio player pre-mounted but only activates after user clicks */}
        <YouTubeAudioPlayer playing={audioPlaying} />
      </>
    );
  }

  return (
    <>
      {/* Persistent audio player across all pages */}
      <YouTubeAudioPlayer playing={audioPlaying} />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/news" element={<News />} />
        <Route path="/members" element={<Members />} />
        <Route path="/rankings" element={<Members />} />
        <Route path="/member-verifier" element={<MemberVerifier />} />
        <Route path="/download" element={<MemberVerifier />} />
        <Route path="/what-is-akrho" element={<WhatIsAkrho />} />
        <Route path="/about" element={<About />} />
        <Route path="/activities" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
