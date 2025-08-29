// src/App.jsx
import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Connect from "./pages/Connect";
import Courses from "./pages/Courses";
import Messages from "./pages/Messages";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";
import QuickTerminal from "./pages/QuickTerminal";
import UserLogout from "./pages/UserLogout";

import UserProtectWrapper from "./pages/UserProtectWrapper";
import SphereSingleton from "./components/SphereSingleton";
import WebLLMChatModal from "./components/WebLLMChatModal";
import ReviewModal from "./components/ReviewModal"; // ⬅️ NEW
import ReviewsPage from "./pages/ReviewsPage";
import AdvancedLearning from "./pages/AdvancedLearning";
import ErrorBoundary from "./components/ErrorBoundary";

function ProtectedWithMenu({ children }) {
  const navigate = useNavigate();
  const [openWebLLM, setOpenWebLLM] = useState(false);
  const [openReview, setOpenReview] = useState(false); // ⬅️ NEW

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
        onReview={() => setOpenReview(true)} // ⬅️ open modal
        onQuickNotes={() => window.open("https://keep.google.com/", "_blank", "noopener,noreferrer")}
      />

      <WebLLMChatModal open={openWebLLM} onClose={() => setOpenWebLLM(false)} />

      {/* NEW Review modal */}
      <ReviewModal
        open={openReview}
        onClose={() => setOpenReview(false)}
        onSubmitted={() => {
          // optional: toast/refresh
          console.log("Review saved");
        }}
      />
    </UserProtectWrapper>
  );
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/reviews" element={<ReviewsPage />} />


      {/* Protected */}
      <Route path="/home" element={<ProtectedWithMenu><Home /></ProtectedWithMenu>} />
      <Route path="/explore" element={<ProtectedWithMenu><Explore /></ProtectedWithMenu>} />
      <Route path="/connect" element={<ProtectedWithMenu><Connect /></ProtectedWithMenu>} />
      <Route path="/courses/:id" element={<ProtectedWithMenu><Courses /></ProtectedWithMenu>} />
      <Route path="/messages" element={<ProtectedWithMenu><Messages /></ProtectedWithMenu>} />
      <Route path="/myprofile" element={<ProtectedWithMenu><MyProfile /></ProtectedWithMenu>} />
      <Route path="/users/:id" element={<ProtectedWithMenu><UserProfile /></ProtectedWithMenu>} />
      <Route path="/QuickTerminal" element={<ProtectedWithMenu><QuickTerminal /></ProtectedWithMenu>} />
      <Route path="/user/logout" element={<ProtectedWithMenu><UserLogout /></ProtectedWithMenu>} />
      <Route path="/advanced-learning" element={<ProtectedWithMenu>     <ErrorBoundary>
        <AdvancedLearning />
      </ErrorBoundary>
        </ProtectedWithMenu>} />
      <Route path="/advanced-learning/:courseId" element={<ProtectedWithMenu><ErrorBoundary>
        <AdvancedLearning />
      </ErrorBoundary></ProtectedWithMenu>} />

    </Routes>
  );
}

export default App;
