// src/App.jsx
import React, { Suspense, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded pages (public pages prioritized in preloads below)
const Start = React.lazy(() => import(/* webpackChunkName: "start" */ "./pages/Start"));
const UserLogin = React.lazy(() => import(/* webpackChunkName: "user-login" */ "./pages/UserLogin"));
const UserSignup = React.lazy(() => import(/* webpackChunkName: "user-signup" */ "./pages/UserSignup"));
const Contact = React.lazy(() => import(/* webpackChunkName: "contact" */ "./pages/Contact"));
const About = React.lazy(() => import(/* webpackChunkName: "about" */ "./pages/About"));
const ReviewsPage = React.lazy(() => import(/* webpackChunkName: "reviews" */ "./pages/ReviewsPage"));

// Protected pages (lazy)
const Home = React.lazy(() => import(/* webpackChunkName: "home" */ "./pages/Home"));
const Explore = React.lazy(() => import(/* webpackChunkName: "explore" */ "./pages/Explore"));
const Connect = React.lazy(() => import(/* webpackChunkName: "connect" */ "./pages/Connect"));
const Courses = React.lazy(() => import(/* webpackChunkName: "courses" */ "./pages/Courses"));
const Messages = React.lazy(() => import(/* webpackChunkName: "messages" */ "./pages/Messages"));
const MyProfile = React.lazy(() => import(/* webpackChunkName: "myprofile" */ "./pages/MyProfile"));
const UserProfile = React.lazy(() => import(/* webpackChunkName: "userprofile" */ "./pages/UserProfile"));
const QuickTerminal = React.lazy(() => import(/* webpackChunkName: "quickterminal" */ "./pages/QuickTerminal"));
const UserLogout = React.lazy(() => import(/* webpackChunkName: "userlogout" */ "./pages/UserLogout"));
const AdvancedLearning = React.lazy(() => import(/* webpackChunkName: "advanced-learning" */ "./pages/AdvancedLearning"));

// Wrapper + UI bits (kept synchronous because they are small or already imported by pages)
import UserProtectWrapper from "./pages/UserProtectWrapper";
import SphereSingleton from "./components/SphereSingleton";
import WebLLMChatModal from "./components/WebLLMChatModal";
import ReviewModal from "./components/ReviewModal";
import ErrorBoundary from "./components/ErrorBoundary";

function ProtectedWithMenu({ children }) {
  const navigate = useNavigate();
  const [openWebLLM, setOpenWebLLM] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);

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
        onQuickTerminal={() => navigate("/QuickTerminal")}
        onReview={() => setOpenReview(true)}
        onQuickNotes={() => window.open("https://keep.google.com/", "_blank", "noopener,noreferrer")}
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
 * Preload helper:
 * - Attempts to preload important public pages during browser idle.
 * - Falls back to setTimeout if requestIdleCallback is not available.
 */
function usePreloadPublicPages() {
  useEffect(() => {
    const preload = () => {
      // Trigger dynamic imports; React.lazy uses these imports internally.
      import(/* webpackChunkName: "start" */ "./pages/Start");
      import(/* webpackChunkName: "about" */ "./pages/About");
      import(/* webpackChunkName: "contact" */ "./pages/Contact");
      import(/* webpackChunkName: "reviews" */ "./pages/ReviewsPage");
      import(/* webpackChunkName: "user-login" */ "./pages/UserLogin");
      import(/* webpackChunkName: "user-signup" */ "./pages/UserSignup");
    };

    if ("requestIdleCallback" in window) {
      // Preload when browser is idle, low-priority
      window.requestIdleCallback(preload, { timeout: 2000 });
    } else {
      // Fallback short timeout to avoid blocking initial paint
      const t = setTimeout(preload, 1200);
      return () => clearTimeout(t);
    }
  }, []);
}

function App() {
  usePreloadPublicPages();

  return (
    // Suspense wraps all routes; LoadingSpinner shows while lazy components load
    <Suspense fallback={<LoadingSpinner message="Preparing SkillMint..." />}>
      <Routes>
        {/* Public (first-load prioritized) */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedWithMenu>
              <Home />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedWithMenu>
              <Explore />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/connect"
          element={
            <ProtectedWithMenu>
              <Connect />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedWithMenu>
              <Courses />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedWithMenu>
              <Messages />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/myprofile"
          element={
            <ProtectedWithMenu>
              <MyProfile />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedWithMenu>
              <UserProfile />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/QuickTerminal"
          element={
            <ProtectedWithMenu>
              <QuickTerminal />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/user/logout"
          element={
            <ProtectedWithMenu>
              <UserLogout />
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/advanced-learning"
          element={
            <ProtectedWithMenu>
              <ErrorBoundary>
                <AdvancedLearning />
              </ErrorBoundary>
            </ProtectedWithMenu>
          }
        />
        <Route
          path="/advanced-learning/:courseId"
          element={
            <ProtectedWithMenu>
              <ErrorBoundary>
                <AdvancedLearning />
              </ErrorBoundary>
            </ProtectedWithMenu>
          }
        />

        {/* Fallback: redirect any undefined route to /start */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
