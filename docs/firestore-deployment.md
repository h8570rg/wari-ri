# Firestore セキュリティルール デプロイ手順

## 概要

このドキュメントでは、wari-riアプリケーションのFirestoreセキュリティルールのデプロイ手順について説明します。

## ファイル構成

- `firestore.rules` - セキュリティルールファイル
- `firestore.indexes.json` - インデックス設定ファイル
- `firebase.json` - Firebase設定ファイル

## セキュリティルールの内容

### グループコレクション (`/groups/{groupId}`)

- **読み取り**: グループのメンバーまたは作成者のみ
- **作成**: 認証済みユーザーのみ（作成者として記録）
- **更新**: グループのメンバーのみ
- **削除**: グループの作成者のみ

### アクティビティサブコレクション (`/groups/{groupId}/activities/{activityId}`)

- **読み取り**: グループのメンバーのみ
- **作成**: グループのメンバーのみ（作成者として記録）
- **更新**: 作成者のみ
- **削除**: 作成者のみ

## デプロイ手順

### 環境別デプロイ戦略

- **本番環境 (wari-ri)**: mainブランチへのマージ時に自動デプロイ（GitHub Actions）
- **開発環境 (wari-ri-dev)**: ローカルから手動デプロイ（npmスクリプト経由）

### 事前準備

Firebase CLIにログインしていることを確認してください：

```bash
firebase login
```

### 開発環境へのデプロイ

package.jsonに定義されたスクリプトを使用してデプロイします：

```bash
# Firestore Rules + Indexes の両方
npm run deploy:dev:firestore

# Rulesのみ
npm run deploy:dev:rules

# Indexesのみ
npm run deploy:dev:indexes

# すべて（Functions + Firestore Rules + Indexes）
npm run deploy:dev
```

### 本番環境へのデプロイ

本番環境へは、mainブランチにマージすることで自動的にデプロイされます。
手動でデプロイする必要はありません。

### デプロイの確認

デプロイが完了したら、Firebaseコンソールでルールが正しく適用されていることを確認してください：

- [開発環境コンソール](https://console.firebase.google.com/project/wari-ri-dev)
- [本番環境コンソール](https://console.firebase.google.com/project/wari-ri)

## トラブルシューティング

### ルールのテスト

ローカルでルールをテストする場合：

```bash
firebase emulators:start --only firestore
```

### ルールの検証

ルールファイルの構文をチェック：

```bash
firebase deploy --only firestore:rules --dry-run
```

## 注意事項

1. セキュリティルールの変更は即座に反映されます
2. インデックスの作成には時間がかかる場合があります
3. 本番環境へのデプロイ前には必ずdev環境でテストしてください
4. ルールの変更は既存のデータアクセスに影響する可能性があります

## セキュリティのベストプラクティス

1. 最小権限の原則に従ってルールを設定
2. 認証状態の確認を必ず行う
3. リソースの所有者のみが更新・削除可能にする
4. 定期的にルールの見直しとテストを行う
