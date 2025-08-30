// socket.js
// Singleton Socket.IO client with safe named exports
// Works with: import { connectSocket, getSocket, disconnectSocket } from "@/lib/socket"

import { io } from "socket.io-client";

let socket = null;

/**
 * Create (or reuse) a single socket connection.
 * @param {string} token (optional) auth token for your backend
 * @returns {import("socket.io-client").Socket}
 */
export const connectSocket = (token) => {
  if (socket && socket.connected) return socket;

  // ✅ Use env in dev, fallback to backend URL in production
  const URL =
    import.meta.env.VITE_SOCKET_URL ||
    "https://skillmint-backend-bla3.onrender.com";

  socket = io(URL, {
    transports: ["websocket"],      // prefer websocket
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 500,
    withCredentials: true,          // important for CORS cookies/auth
    auth: token ? { token } : undefined,
  });

  // --- Debug logs ---
  socket.on("connect", () => console.info("[socket] connected", socket.id));
  socket.on("connect_error", (err) =>
    console.warn("[socket] connect_error:", err?.message || err)
  );
  socket.on("disconnect", (reason) =>
    console.info("[socket] disconnected:", reason)
  );

  return socket;
};

/** Get the current socket (may be null before connectSocket is called). */
export const getSocket = () => socket;

/** Cleanly tear down the connection. */
export const disconnectSocket = () => {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
};

// Optional default export so either import style works
export default { connectSocket, getSocket, disconnectSocket };
