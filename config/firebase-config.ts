// Firebase環境別設定管理

interface FirebaseConfig {
  apiKey: string;
  projectId: string;
  appId: string;
}

// 開発環境設定（例）
export const developmentConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wari-ri-development",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// 本番環境設定（例）
export const productionConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wari-ri-production",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// 環境に基づいて設定を取得
export const getFirebaseConfig = (): FirebaseConfig => {
  const environment =
    process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV;

  switch (environment) {
    case "production":
      console.log("🚀 本番環境のFirebaseに接続中");
      return productionConfig;
    case "development":
    default:
      console.log("🛠️ 開発環境のFirebaseに接続中");
      return developmentConfig;
  }
};

// 現在の環境を確認するヘルパー
export const getCurrentEnvironment = () => {
  const env =
    process.env.NEXT_PUBLIC_ENVIRONMENT ||
    process.env.NODE_ENV ||
    "development";
  return {
    isDevelopment: env === "development",
    isProduction: env === "production",
    environment: env,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
};
