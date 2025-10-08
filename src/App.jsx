// src/App.jsx
import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import heroVideo from "./assets/front.mp4";

// Lazy-loaded public pages
const Start = React.lazy(() => import("./pages/Start"));
const UserLogin = React.lazy(() => import("./pages/UserLogin"));
const UserSignup = React.lazy(() => import("./pages/UserSignup"));
const Contact = React.lazy(() => import("./pages/Contact"));
const About = React.lazy(() => import("./pages/About"));
const ReviewsPage = React.lazy(() => import("./pages/ReviewsPage"));

// Lazy-loaded protected pages
const Home = React.lazy(() => import("./pages/Home"));
const Explore = React.lazy(() => import("./pages/Explore"));
const Connect = React.lazy(() => import("./pages/Connect"));
const Courses = React.lazy(() => import("./pages/Courses"));
const Messages = React.lazy(() => import("./pages/Messages"));
const MyProfile = React.lazy(() => import("./pages/MyProfile"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const QuickTerminal = React.lazy(() => import("./pages/QuickTerminal"));
const UserLogout = React.lazy(() => import("./pages/UserLogout"));
const AdvancedLearning = React.lazy(() => import("./pages/AdvancedLearning"));

// Synchronous components
import UserProtectWrapper from "./pages/UserProtectWrapper";
import SphereSingleton from "./components/SphereSingleton";
import WebLLMChatModal from "./components/WebLLMChatModal";
import ReviewModal from "./components/ReviewModal";
import ErrorBoundary from "./components/ErrorBoundary";

// Lightweight video loader
const VideoLoader = ({ videoSrc, onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = videoSrc;
    video.preload = "auto";
    video.oncanplaythrough = () => {
      setProgress(100);
      setTimeout(onLoaded, 300);
    };

    let fakeProgress = 0;
    const interval = setInterval(() => {
      if (fakeProgress < 90) {
        fakeProgress += Math.random() * 10;
        setProgress(fakeProgress);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [videoSrc, onLoaded]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="w-64 h-2 bg-gray-700 rounded overflow-hidden">
        <div className="h-2 bg-gold" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="mt-2 text-sm">Loading... {Math.floor(progress)}%</p>
    </div>
  );
};

// Protected wrapper with floating components
function ProtectedWithMenu({ children }) {
  const [openWebLLM, setOpenWebLLM] = useState(false);
  const [openReview, setOpenReview] = useState(false);

  return (
    <UserProtectWrapper>
      {children}
      <SphereSingleton
        sphereSize={50}
        chipSize={60}
        radius={75}
        initialPosition={{ x: 24, y: 120 }}
        rememberPosition
        storageKey="sphereQuadMenu:pos"
        onAskAI={() => setOpenWebLLM(true)}
        onQuickTerminal={() => window.location.assign("/QuickTerminal")}
        onReview={() => setOpenReview(true)}
        onQuickNotes={() => window.open("https://keep.google.com/", "_blank")}
      />
      <WebLLMChatModal open={openWebLLM} onClose={() => setOpenWebLLM(false)} />
      <ReviewModal open={openReview} onClose={() => setOpenReview(false)} />
    </UserProtectWrapper>
  );
}

// Preload public pages in idle time
function usePreloadPublicPages() {
  useEffect(() => {
    const preload = () => {
      import("./pages/Start");
      import("./pages/About");
      import("./pages/Contact");
      import("./pages/ReviewsPage");
      import("./pages/UserLogin");
      import("./pages/UserSignup");
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preload, { timeout: 2000 });
    } else {
      const t = setTimeout(preload, 1200);
      return () => clearTimeout(t);
    }
  }, []);
}

function App() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  usePreloadPublicPages();

  // Show only video loader initially
  if (!videoLoaded) {
    return <VideoLoader videoSrc={heroVideo} onLoaded={() => setVideoLoaded(true)} />;
  }

  return (
    <Suspense fallback={<LoadingSpinner message="Preparing SkillMint..." />}>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user/logout" element={<UserLogout />} />

        {/* Protected pages */}
        <Route path="/home" element={<ProtectedWithMenu><Home /></ProtectedWithMenu>} />
        <Route path="/explore" element={<ProtectedWithMenu><Explore /></ProtectedWithMenu>} />
        <Route path="/connect" element={<ProtectedWithMenu><Connect /></ProtectedWithMenu>} />
        <Route path="/courses/:id" element={<ProtectedWithMenu><Courses /></ProtectedWithMenu>} />
        <Route path="/messages" element={<ProtectedWithMenu><Messages /></ProtectedWithMenu>} />
        <Route path="/myprofile" element={<ProtectedWithMenu><MyProfile /></ProtectedWithMenu>} />
        <Route path="/users/:id" element={<ProtectedWithMenu><UserProfile /></ProtectedWithMenu>} />
        <Route path="/QuickTerminal" element={<ProtectedWithMenu><QuickTerminal /></ProtectedWithMenu>} />
        <Route path="/advanced-learning" element={<ProtectedWithMenu><ErrorBoundary><AdvancedLearning /></ErrorBoundary></ProtectedWithMenu>} />
        <Route path="/advanced-learning/:courseId" element={<ProtectedWithMenu><ErrorBoundary><AdvancedLearning /></ErrorBoundary></ProtectedWithMenu>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
