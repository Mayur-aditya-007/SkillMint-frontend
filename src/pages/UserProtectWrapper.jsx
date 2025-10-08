// src/pages/UserProtectWrapper.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// import your floating sphere + local chatbot modal
import SphereQuadMenu from "../components/SphereQuadMenu";
import WebLLMChatModal from "../components/WebLLMChatModal";

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // state for chatbot modal
  const [openWebLLM, setOpenWebLLM] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setLoading(false); // token is valid
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

    if (loading) return <LoadingSpinner message="loading..." />;

  return (
    <>
      {/* Children (your actual protected route page) */}
      {children}

      {/* Sphere menu available everywhere inside protected routes */}
     

      {/* Local free chatbot modal */}
      <WebLLMChatModal open={openWebLLM} onClose={() => setOpenWebLLM(false)} />
    </>
  );
};

export default UserProtectWrapper;
