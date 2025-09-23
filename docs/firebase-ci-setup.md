# Firebase CI/CD セットアップガイド

mainブランチにマージされた際にFirebase FunctionsとFirestore Rulesを自動的に本番環境にデプロイするCIが設定されました。

## セットアップに必要な手順

### 1. Firebase サービスアカウントキーの作成

1. [Firebase Console](https://console.firebase.google.com/)で対象のプロジェクトを選択
2. 「プロジェクトの設定」 → 「サービスアカウント」タブを開く
3. 「新しい秘密鍵の生成」をクリック
4. ダウンロードされたJSONファイルの内容をコピー

### 2. GitHub Secretsの設定

GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」で以下のSecretsを設定してください：

- **FIREBASE_PROJECT_ID**: FirebaseプロジェクトのID
- **FIREBASE_SERVICE_ACCOUNT**: サービスアカウントキーのJSONファイルの内容をそのまま貼り付け

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
