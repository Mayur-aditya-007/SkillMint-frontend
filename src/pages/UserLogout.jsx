import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post(
          `${import.meta.env.VITE_BASE_URL}/user/logout`,
          {}, // body can be empty
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // if your backend uses cookies
          }
        )
        .then((res) => {
          if (res.status === 200) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        })
        .catch((err) => {
          console.error("Logout failed:", err);
          localStorage.removeItem("token"); // still clear token
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default UserLogout;
