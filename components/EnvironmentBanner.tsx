"use client";

import { getCurrentEnvironment } from "@/config/firebase-config";

export default function EnvironmentBanner() {
  const env = getCurrentEnvironment();

  if (env.isProduction) {
    return null; // 本番環境では表示しない
  }

  const bannerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ff6b35",
    color: "white",
    textAlign: "center",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "bold",
    zIndex: 9999,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  return (
    <div style={bannerStyle}>
      🛠️ 開発環境 | プロジェクト: {env.projectId || "Not Set"}
    </div>
  );
}
