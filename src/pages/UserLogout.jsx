import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const logoutUser = async () => {
      try {
        if (token) {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/user/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
        }
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        localStorage.removeItem("token"); // always clear token
        // Add a short delay so the spinner is visible
        setTimeout(() => navigate("/"), 800);
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>

      {/* Message */}
      <h1 className="text-2xl font-semibold mb-2">Logging out...</h1>
      <p className="text-gray-300">Redirecting to the homepage</p>
    </div>
  );
};

export default UserLogout;
