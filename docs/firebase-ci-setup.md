# Firebase CI/CD セットアップガイド

mainブランチにマージされた際にFirebase FunctionsとFirestore Rulesを自動的に本番環境にデプロイするCIが設定されました。

## デプロイ戦略

- **本番環境 (wari-ri)**: GitHub ActionsのCDで自動デプロイ（mainブランチへのマージ時）
- **開発環境 (wari-ri-dev)**: ローカルから手動デプロイ（コマンド経由）

## セットアップに必要な手順

### 1. Firebase サービスアカウントキーの作成

1. [Firebase Console](https://console.firebase.google.com/)で対象のプロジェクトを選択
2. 「プロジェクトの設定」 → 「サービスアカウント」タブを開く
3. 「新しい秘密鍵の生成」をクリック
4. ダウンロードされたJSONファイルの内容をコピー

### 2. GitHub Secretsの設定

GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」で以下のSecretsを設定してください：

- **FIREBASE_PROJECT_ID**: FirebaseプロジェクトのID
- **FIREBASE_SERVICE_ACCOUNT_KEY**: サービスアカウントキーのJSONファイルの内容をbase64エンコードした値

#### base64エンコードの方法

macOS/Linuxの場合：
```bash
base64 -i path/to/service-account.json
```

### 3. デプロイワークフローの動作

mainブランチにマージされると以下が自動実行されます：

1. **Functions のビルド**: TypeScriptからJavaScriptにコンパイル
2. **Firebase CLI の認証**: サービスアカウントキーを使用
3. **デプロイ実行**: 以下のコンポーネントをデプロイ
   - Firebase Functions
   - Firestore Rules
   - Firestore Indexes

## セキュリティ考慮事項

- サービスアカウントキーは機密情報として適切に管理されます
- デプロイ後にキーファイルは自動削除されます
- 最小権限の原則に従い、必要な権限のみをサービスアカウントに付与してください

## トラブルシューティング

### よくあるエラー

1. **認証エラー**: FIREBASE_SERVICE_ACCOUNT_KEYが正しく設定されているか確認
2. **プロジェクトID エラー**: FIREBASE_PROJECT_IDが正しいか確認
3. **権限エラー**: サービスアカウントにFirebase Admin権限があるか確認

### ログの確認

GitHub Actionsのワークフローログでエラーの詳細を確認できます。
「Actions」タブ → 該当のワークフロー実行 → 各ステップのログを確認してください。

## 開発環境へのデプロイ

開発環境へのデプロイは、ローカルから以下のコマンドで実行できます：

### 事前準備

Firebase CLIにログインしてください：

```bash
firebase login
```

### デプロイコマンド

```bash
# すべてをデプロイ（Functions + Firestore Rules + Indexes）
npm run deploy:dev

# Functionsのみ
npm run deploy:dev:functions

# Firestore Rules + Indexes
npm run deploy:dev:firestore

# Rulesのみ
npm run deploy:dev:rules

# Indexesのみ
npm run deploy:dev:indexes
```

### デプロイフロー

1. **functions:build**: Functions のTypeScriptをコンパイル
2. **firebase deploy**: 指定されたコンポーネントをwari-ri-devプロジェクトにデプロイ

### 注意事項

- 開発環境へのデプロイは認証が必要です（`firebase login`）
- Functionsのビルドが失敗した場合、デプロイは実行されません
- 開発環境での変更は本番環境に影響しません
