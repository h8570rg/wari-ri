# wari-ri

割り勘管理アプリケーション

## 開発

```bash
mise install
pnpm install
pnpm dev
```

## デプロイ

### 開発環境 (wari-ri-dev)

ローカルから手動でデプロイします。初回（または認証エラー時）は先にログインしてください：

```bash
pnpm firebase:login

# すべて（Functions + Firestore）
pnpm deploy:dev

# Functionsのみ
pnpm deploy:dev:functions

# Firestoreのみ
pnpm deploy:dev:firestore
```

### 本番環境 (wari-ri)

mainブランチへのマージ時に自動的にデプロイされます（GitHub Actions）。

詳細は [Firebase CI/CD セットアップガイド](./docs/firebase-ci-setup.md) を参照してください。

## ドキュメント

- [環境セットアップ](./docs/environment-setup.md)
- [Firebase CI/CD セットアップ](./docs/firebase-ci-setup.md)
- [Firestore デプロイ手順](./docs/firestore-deployment.md)

## 画像

https://undraw.co/search/money の #F4B400
