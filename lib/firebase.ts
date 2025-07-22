import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getFirebaseConfig,
  getCurrentEnvironment,
} from "../config/firebase-config";

// 環境別設定を取得
const firebaseConfig = getFirebaseConfig();

// 現在の環境情報をログ出力
const envInfo = getCurrentEnvironment();
console.log(`🔧 Firebase環境: ${envInfo.environment}`);
console.log(`📊 プロジェクトID: ${envInfo.projectId}`);

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firestoreデータベースの初期化
export const db = getFirestore(app);

export default app;
