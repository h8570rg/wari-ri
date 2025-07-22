# Firebase 環境設定ガイド

## 🎯 概要
開発環境と本番環境を分離して安全にFirebaseを使用するための設定方法です。

## 📋 Firebase Console での作業

### 1. 新しい開発用プロジェクトを作成
```
本番： wari-ri-production（既存）
開発： wari-ri-development（新規作成）
```

### 2. 各プロジェクトでWebアプリを追加
- Firebase Console → プロジェクト設定 → 全般 → アプリを追加
- プラットフォーム：Web
- アプリ名：適当な名前（例：Wari-Ri Web App）
- Firebase Hosting は不要（Skip）

### 3. 各プロジェクトでFirestoreを有効化
- Firebase Console → Firestore Database → データベースを作成
- セキュリティルール：テスト用（開発環境）、本番用（本番環境）

## ⚙️ ローカル環境設定

### 環境変数ファイル

#### 開発環境用 `.env.local`
```env
# 開発環境設定
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wari-ri-development
NEXT_PUBLIC_FIREBASE_APP_ID=your_dev_app_id_here
```

#### 本番環境用 `.env.production.local`
```env
# 本番環境設定
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_api_key_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wari-ri-production
NEXT_PUBLIC_FIREBASE_APP_ID=your_prod_app_id_here
```

## 🔧 使用方法

### 開発時
```bash
npm run dev  # 自動的に .env.local を使用
```

### 本番ビルド
```bash
npm run build  # .env.production.local を使用
npm run start
```

## 🛡️ セキュリティルール

### 開発環境（制限なし）
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 本番環境（厳密）
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証が必要な場合
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // パブリックデータ
    match /public/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎨 視覚的な環境識別

- 開発環境：ページ上部にオレンジのバナーが表示
- 本番環境：バナーは表示されない
- ブラウザコンソール：環境情報がログ出力

## ✅ 確認事項

1. ページ読み込み時に正しいプロジェクトIDがコンソールに表示される
2. 開発環境では環境バナーが表示される
3. Firebase Consoleで正しいプロジェクトにデータが保存される

## 🚨 注意事項

- **絶対に** 本番環境の設定で開発・テストしない
- 環境変数ファイルは `.gitignore` に含める
- API キーは公開リポジトリにコミットしない
- 定期的にFirebase Consoleで両環境のデータを確認する 