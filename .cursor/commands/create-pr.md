# プルリクエストを自動作成

## 概要
現在の変更を自動的にステージング、コミット、プッシュし、適切な説明を含むプルリクエストを作成する包括的なワークフロー。

**言語仕様**:
- コミットメッセージ: 英語（Conventional Commits準拠）
- PRタイトル・説明: 日本語

## 手順
1. **変更の確認と準備**
   - 現在の git status を確認
   - 変更されたファイルの差分を解析
   - 変更内容から適切なコミットメッセージを自動生成

2. **ステージングとコミット**
   - すべての変更をステージング (`git add .`)
   - 差分から自動生成されたコミットメッセージでコミット
   - 必要に応じてコミットメッセージを調整

3. **ブランチ管理**
   - 現在のブランチ名を確認
   - mainまたはmasterブランチにいる場合は、変更内容から適切な新しいブランチ名を自動生成
   - 新しいフィーチャーブランチを作成してチェックアウト
   - リモートにブランチをプッシュ

4. **プルリクエスト作成**
   - GitHub MCP を使用してPRを作成（GitHub APIに直接アクセス）
   - 変更内容から自動的にPRタイトルと説明を生成
   - 適切なラベルとレビュワーを提案

## 自動化されるタスク
- [ ] git status の確認と変更ファイルの特定
- [ ] 現在のブランチがmain/masterかをチェック
- [ ] mainブランチにいる場合は変更内容から新しいブランチ名を自動生成
- [ ] 新しいフィーチャーブランチの作成とチェックアウト
- [ ] git diff の解析と英語のコミットメッセージを自動生成（Conventional Commits準拠）
- [ ] すべての変更をステージング
- [ ] 英語のコミットメッセージでコミット（feat:, fix:, docs: など）
- [ ] 現在のブランチをリモートにプッシュ
- [ ] 変更内容に基づいた日本語のPRタイトルと説明を生成
- [ ] GitHub MCP を使用したPRの自動作成
- [ ] 関連するissueがあれば自動リンク

## コミットメッセージのフォーマット（英語・Conventional Commits準拠）
**機能追加**: `feat: add user authentication system`
**バグ修正**: `fix: resolve login validation issue`  
**リファクタリング**: `refactor: improve database query performance`
**ドキュメント**: `docs: update API documentation`
**スタイル**: `style: fix code formatting and linting issues`
**テスト**: `test: add unit tests for user service`
**チョア**: `chore: update dependencies and build tools`
**パフォーマンス**: `perf: optimize image loading performance`
**ビルド**: `build: update webpack configuration`
**CI/CD**: `ci: add automated deployment pipeline`

### 破壊的変更がある場合
`feat!: change authentication API structure` (感嘆符で破壊的変更を示す)

## PRタイトル・説明のフォーマット（日本語）
**PRタイトル例**: 「ユーザー認証システムの追加」「ログイン検証バグの修正」

**PR説明テンプレート**:
```markdown
## 概要
[この変更の目的や背景を簡潔に説明]

## 変更内容
- [具体的な変更内容を箇条書きで記載]
```

## 自動生成されるブランチ名のパターン
**機能追加**: `feature/add-new-functionality` や `feat/implement-user-auth`
**バグ修正**: `fix/resolve-login-issue` や `bugfix/fix-calculation-error`
**リファクタリング**: `refactor/improve-code-structure` や `refactor/optimize-database-queries`
**ドキュメント**: `docs/update-readme` や `docs/add-api-documentation`
**ホットフィックス**: `hotfix/critical-security-patch`

## 注意事項
- GitHub MCP が設定され、認証されていることを確認
- 適切なリモートリポジトリが設定されていることを確認  
- コミットメッセージはConventional Commits仕様（英語）に準拠
- PRのタイトルと説明は日本語で記載
- 機密情報が含まれていないか変更内容を最終確認

## エラーハンドリング
- mainブランチに未コミットの変更がある場合の警告と対処法
- 同名のブランチが既に存在する場合の代替ブランチ名提案
- コンフリクトがある場合は解決方法を提案
- リモートブランチが既に存在する場合の対処法
- PR作成時のエラー対応策を提供
