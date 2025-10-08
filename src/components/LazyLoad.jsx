// src/components/LazyLoad.jsx
import React, { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function LazyLoad({ children }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}
