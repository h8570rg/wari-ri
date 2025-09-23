# Firebase CI/CD セットアップガイド

mainブランチにマージされた際にFirebase FunctionsとFirestore Rulesを自動的に本番環境にデプロイするCIが設定されました。

## セットアップに必要な手順

### 1. Firebase サービスアカウントキーの作成と権限設定

#### サービスアカウントの作成
1. [Google Cloud Console](https://console.cloud.google.com/)で対象のプロジェクトを選択
2. 「IAMと管理」→「サービスアカウント」に移動
3. 「サービスアカウントを作成」をクリック
4. サービスアカウント名（例：`firebase-ci-cd`）を入力して作成

#### 必要な権限の付与
作成したサービスアカウントに以下のロールを付与してください：

1. **Firebase Admin SDK 管理サービス エージェント**
2. **Cloud Functions 管理者**
3. **Firebase セキュリティ ルール管理者**
4. **Cloud Datastore インデックス管理者**
5. **Storage Admin**（Functions用アーティファクト保存に必要）

#### 権限の設定方法
1. 「IAMと管理」→「IAM」に移動
2. 作成したサービスアカウントを見つけて「編集」をクリック
3. 「ロールを追加」で上記の各ロールを追加
4. 「保存」をクリック

#### キーファイルのダウンロード
1. サービスアカウント一覧で作成したアカウントをクリック
2. 「キー」タブ → 「鍵を追加」→「新しい鍵を作成」
3. 「JSON」形式を選択してダウンロード

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
3. **権限エラー（HTTP 403）**: サービスアカウントに以下の権限が不足
   - Firebase セキュリティ ルール管理者
   - Cloud Functions 管理者
   - Firebase Admin SDK 管理サービス エージェント
   - Cloud Datastore インデックス管理者
   - Storage Admin

#### 権限エラーの解決方法
[Google Cloud Console](https://console.cloud.google.com/)で以下を確認：
1. 「IAMと管理」→「IAM」に移動
2. サービスアカウントに上記の権限が全て付与されているか確認
3. 不足している権限があれば「編集」から追加

### ログの確認

GitHub Actionsのワークフローログでエラーの詳細を確認できます。
「Actions」タブ → 該当のワークフロー実行 → 各ステップのログを確認してください。
