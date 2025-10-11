# wari-ri

割り勘管理アプリケーション

## 開発

```bash
npm install
npm run dev
```

## デプロイ

### 開発環境 (wari-ri-dev)

ローカルから手動でデプロイします：

```bash
# すべて（Functions + Firestore）
npm run deploy:dev

# Functionsのみ
npm run deploy:dev:functions

# Firestoreのみ
npm run deploy:dev:firestore
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
