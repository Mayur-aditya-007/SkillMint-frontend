// src/components/SphereSingleton.jsx
import React, { useEffect, useRef, useState } from "react";
import SphereQuadMenu from "./SphereQuadMenu";

const MARKER_ID = "sphere-quad-singleton-marker";

export default function SphereSingleton(props) {
  const [active, setActive] = useState(false);
  const claimedRef = useRef(false);

  useEffect(() => {
    // 1) Global window flag (survives duplicate module instances)
    if (typeof window !== "undefined") {
      if (window.__SPHERE_SINGLETON_ACTIVE__) {
        // Another instance already claimed it
        setActive(false);
        return;
      }
    }

    // 2) DOM marker (works even across different bundles)
    const existingMarker = document.getElementById(MARKER_ID);
    if (existingMarker) {
      setActive(false);
      return;
    }

    // Claim: set global + create marker
    if (typeof window !== "undefined") {
      window.__SPHERE_SINGLETON_ACTIVE__ = true;
    }
    const marker = document.createElement("span");
    marker.id = MARKER_ID;
    marker.style.display = "none";
    document.body.appendChild(marker);
    claimedRef.current = true;
    setActive(true);

    // Cleanup: release claim
    return () => {
      if (claimedRef.current) {
        if (typeof window !== "undefined") {
          window.__SPHERE_SINGLETON_ACTIVE__ = false;
        }
        const m = document.getElementById(MARKER_ID);
        if (m && m.parentNode) m.parentNode.removeChild(m);
      }
    };
  }, []);

  if (!active) return null;
  return <SphereQuadMenu data-sphere-quad="root" {...props} />;
}
