// src/App.jsx
import React, { Suspense, useEffect, useState, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner"; // Spinner component
import heroVideo from "./assets/front.mp4"; // Adjust path to your hero video
import { UserContext } from "./context/UserContext";

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

// Loader that preloads the hero video
const VideoLoader = ({ videoSrc, onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = videoSrc;
    video.preload = "auto";
    video.oncanplaythrough = () => {
      setProgress(100);
      setTimeout(onLoaded, 500); // small delay for smooth transition
    };

    // fake progress bar
    let fakeProgress = 0;
    const interval = setInterval(() => {
      if (fakeProgress < 90) {
        fakeProgress += Math.random() * 10;
        setProgress(fakeProgress);
      }
    }, 300);

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
        onQuickTerminal={() => window.location.href = "/QuickTerminal"}
        onReview={() => setOpenReview(true)}
        onQuickNotes={() =>
          window.open("https://keep.google.com/", "_blank", "noopener,noreferrer")
        }
      />
      <WebLLMChatModal open={openWebLLM} onClose={() => setOpenWebLLM(false)} />
      <ReviewModal
        open={openReview}
        onClose={() => setOpenReview(false)}
        onSubmitted={() => console.log("Review saved")}
      />
    </UserProtectWrapper>
  );
}

/**
 * Preload important public pages during idle time
 */
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

// Main App
function App() {
  const { user, bootstrapped } = useContext(UserContext);
  const [videoLoaded, setVideoLoaded] = useState(false);

  usePreloadPublicPages();

  // Show loader until UserContext is bootstrapped or hero video is ready
  if (!bootstrapped || !videoLoaded) {
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
        <Route
          path="/home"
          element={
            user ? (
              <ProtectedWithMenu>
                <Home />
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/explore"
          element={
            user ? (
              <ProtectedWithMenu>
                <Explore />
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/connect"
          element={
            user ? (
              <ProtectedWithMenu>
                <Connect />
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/courses/:id"
          element={
            user ? (
              <ProtectedWithMenu>
                <Courses />
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/messages"
          element={
            user ? (
              <ProtectedWithMenu>
                <Messages />
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/myprofile"
          element={
            user ? (
              <ProtectedWithMenu>
                <MyProfile />
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/users/:id"
          element={
            user ? (
              <ProtectedWithMenu>
                <UserProfile />
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/QuickTerminal"
          element={
            user ? (
              <ProtectedWithMenu>
                <QuickTerminal />
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/advanced-learning"
          element={
            user ? (
              <ProtectedWithMenu>
                <ErrorBoundary>
                  <AdvancedLearning />
                </ErrorBoundary>
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/advanced-learning/:courseId"
          element={
            user ? (
              <ProtectedWithMenu>
                <ErrorBoundary>
                  <AdvancedLearning />
                </ErrorBoundary>
              </ProtectedWithMenu>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
