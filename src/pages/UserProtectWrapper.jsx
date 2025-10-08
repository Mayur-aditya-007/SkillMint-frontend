// src/pages/UserProtectWrapper.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// floating menu + local chatbot modal
import SphereQuadMenu from "../components/SphereQuadMenu";
import WebLLMChatModal from "../components/WebLLMChatModal";
import LoadingSpinner from "../components/LoadingSpinner";

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  // state for chatbot modal
  const [openWebLLM, setOpenWebLLM] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // no token -> go to login
        if (mountedRef.current) setLoading(false);
        navigate("/login");
        return;
      }

      try {
        // hit profile endpoint to verify token
        await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // token valid
        if (mountedRef.current) setLoading(false);
      } catch (err) {
        // invalid token: clear and redirect
        localStorage.removeItem("token");
        if (mountedRef.current) setLoading(false);
        navigate("/login");
      }
    };

    verifyToken();

    return () => {
      mountedRef.current = false;
    };
  }, [navigate]);

  // while verifying, show fancy spinner
  if (loading) return <LoadingSpinner message="Verifying session..." />;

  return (
    <>
      {/* Protected content */}
      {children}

      {/* Floating sphere menu visible inside protected area */}
      <SphereQuadMenu
        sphereSize={50}
        chipSize={60}
        radius={75}
        initialPosition={{ x: 24, y: 120 }}
        rememberPosition
        storageKey="sphereQuadMenu:pos"
        onAskAI={() => setOpenWebLLM(true)}
        onQuickTerminal={() => (window.location.href = "/QuickTerminal")}
        onReview={() => {
          /* you can open a review modal here if you have one */
        }}
        onQuickNotes={() => window.open("https://keep.google.com/", "_blank", "noopener,noreferrer")}
      />

      {/* Local chatbot modal */}
      <WebLLMChatModal open={openWebLLM} onClose={() => setOpenWebLLM(false)} />
    </>
  );
};

export default UserProtectWrapper;
