import React, { Suspense, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Components
import Loader from "./components/Loader.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import UserProtectWrapper from "./pages/UserProtectWrapper.jsx";
import SphereSingleton from "./components/SphereSingleton.jsx";
import WebLLMChatModal from "./components/WebLLMChatModal.jsx";
import ReviewModal from "./components/ReviewModal.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Lazy-loaded pages
const Start = React.lazy(() => import("./pages/Start.jsx"));
const UserLogin = React.lazy(() => import("./pages/UserLogin.jsx"));
const UserSignup = React.lazy(() => import("./pages/UserSignup.jsx"));
const Contact = React.lazy(() => import("./pages/Contact.jsx"));
const About = React.lazy(() => import("./pages/About.jsx"));
const ReviewsPage = React.lazy(() => import("./pages/ReviewsPage.jsx"));

const Home = React.lazy(() => import("./pages/Home.jsx"));
const Explore = React.lazy(() => import("./pages/Explore.jsx"));
const Connect = React.lazy(() => import("./pages/Connect.jsx"));
const Courses = React.lazy(() => import("./pages/Courses.jsx"));
const Messages = React.lazy(() => import("./pages/Messages.jsx"));
const MyProfile = React.lazy(() => import("./pages/MyProfile.jsx"));
const UserProfile = React.lazy(() => import("./pages/UserProfile.jsx"));
const QuickTerminal = React.lazy(() => import("./pages/QuickTerminal.jsx"));
const UserLogout = React.lazy(() => import("./pages/UserLogout.jsx"));
const AdvancedLearning = React.lazy(() => import("./pages/AdvancedLearning.jsx"));

/** Protected wrapper with floating sphere and modals */
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

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading SkillMint..." />}>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/user/logout" element={<UserLogout />} />

        {/* Protected pages */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
