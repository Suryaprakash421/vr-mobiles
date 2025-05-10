"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    // Check if document is available (client-side only)
    if (typeof document !== "undefined") {
      // Get or create a portal root element
      let root = document.getElementById("portal-root");
      if (!root) {
        root = document.createElement("div");
        root.id = "portal-root";
        document.body.appendChild(root);
      }
      setPortalRoot(root);
      setMounted(true);
    }

    return () => {
      setMounted(false);
    };
  }, []);

  return mounted && portalRoot ? createPortal(children, portalRoot) : null;
}
