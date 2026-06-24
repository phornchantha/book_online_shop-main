"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#ffffff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          fontWeight: "500",
        },
        success: {
          style: {
            background: "#10b981",
          },
          icon: "✅",
        },
        error: {
          style: {
            background: "#ef4444",
          },
          icon: "❌",
        },
      }}
    />
  );
}
