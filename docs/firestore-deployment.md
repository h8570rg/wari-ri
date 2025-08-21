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

### 1. 事前準備

Firebase CLIがインストールされていることを確認してください：

```bash
npm install -g firebase-tools
```

### 2. ログイン

Firebaseアカウントにログインします：

```bash
firebase login
```

### 3. プロジェクトの選択

デプロイ先のプロジェクトを選択します：

```bash
# dev環境の場合
firebase use dev

# 本番環境の場合
firebase use default
```

### 4. ルールのデプロイ

セキュリティルールとインデックスをデプロイします：

```bash
# セキュリティルールのみ
firebase deploy --only firestore:rules

# インデックスのみ
firebase deploy --only firestore:indexes

# 両方
firebase deploy --only firestore
```

### 5. デプロイの確認

デプロイが完了したら、Firebaseコンソールでルールが正しく適用されていることを確認してください。

## 環境別デプロイ

### dev環境

```bash
firebase use dev
firebase deploy --only firestore
```

### 本番環境

```bash
firebase use default
firebase deploy --only firestore
```

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
