# Chapter 14：CI/CD with GitHub Actions

この章では、テストをプッシュのたびに自動で実行する仕組みを構築します。「コードを変えたらテストが自動で走る」状態を作ることで、チーム開発でも品質を保ちやすくなります。

## 14-1 CI/CDの概念

### CIとCDとは何か

**CI（継続的インテグレーション）** は、コードをリポジトリに統合するたびに自動でビルド・テストを実行する仕組みです。**CD（継続的デリバリー／デプロイ）** は、テストが通ったコードを自動で本番環境に届ける仕組みです。

本書では CI を扱います。「プッシュしたら自動でテストが走り、失敗したら教えてくれる」という状態が目標です。

### GitHub Actionsとは

GitHub Actions は GitHub に組み込まれた CI/CD ツールです。リポジトリに YAML ファイルを置くだけで、プッシュや PR のタイミングで処理を自動実行できます。

```
コードをプッシュ
   ↓
GitHub が .github/workflows/ のYAMLを検出
   ↓
仮想マシンが起動し、YAMLに書いた手順を実行
   ↓
テスト成功 → ✅ 緑 / テスト失敗 → ❌ 赤
```

外部サービスへの登録は不要で、パブリックリポジトリは無料で使えます。

### ワークフローファイルの構造

ワークフローファイルは **YAML** 形式で書きます。YAMLはインデント（行頭のスペース）でデータの階層構造を表します。スペースの数がずれるとエラーになるため、**インデントにはスペースを使い、タブ（Tab キー）は使わない**ことが重要です。

```yaml
name: ワークフロー名

on:                  # いつ実行するか
  push:
    branches: [develop]

jobs:                # 何を実行するか
  test:              # ジョブ名（任意）
    runs-on: ubuntu-latest   # 実行環境
    steps:           # 手順（上から順に実行）
      - uses: actions/checkout@v4   # リポジトリをチェックアウト
      - run: echo "hello"           # シェルコマンドを実行
```

## 14-2 ブランチ戦略とプルリクエスト

### mainブランチとdevelopブランチ

本書では2つのブランチを使います。

| ブランチ | 役割 |
|----------|------|
| `master` | 動作確認済みの安定版。本番相当 |
| `develop` | 開発中のコードを統合するブランチ |

新機能を追加するときは `develop` から `feature/xxx` ブランチを切り、完成したら `develop` にマージします。CI はこのマージのタイミングでテストを実行します。

```
master ──────────────────────────────→ 安定版
                  ↑ merge（動作確認後）
develop ──────────────────────────→ 統合ブランチ
         ↑ merge
feature/add-tests ──→ コミット → PR作成 → CI実行 → マージ
```

### 🛠️ developブランチを作成する

`develop` ブランチを作成してチェックアウトします。

```bash
git checkout -b develop
git push origin develop
```

### 🛠️ featureブランチを作成する

`develop` ブランチから `feature/add-tests` ブランチを作成します。

```bash
git checkout -b feature/add-tests
```

テストファイルをコミットします（前章で作成した `backend/library/tests.py` と `frontend/src/components/__tests__/BookCard.test.tsx`）。

```bash
git add backend/library/tests.py
git add frontend/src/components/__tests__/BookCard.test.tsx
git add frontend/jest.config.ts
git add frontend/jest.setup.ts
git commit -m "Add Django and Next.js tests"
git push origin feature/add-tests
```

### 🛠️ プルリクエストを作成する

GitHub のリポジトリページを開き、**Compare & pull request** ボタンをクリックします。

- **base**: `develop`
- **compare**: `feature/add-tests`
- タイトル：`テストを追加する`

**Create pull request** をクリックします。この PR に対して CI が動作します。

## 14-3 GitHub Actionsのワークフローを書く

### Djangoテストをデータベース付きで実行するには

GitHub Actions の仮想マシン上では MySQL が起動していません。Django テストが必要とするデータベースを用意するには、**サービスコンテナ**という仕組みを使います。ワークフロー内で MySQL コンテナを起動し、テスト実行中だけ使えるようにします。

また、`backend/config/settings.py` の `DATABASES` 設定はローカル用の固定値になっています。CI 環境では別のホスト名・パスワードを使うため、環境変数で切り替えられるようにします。

### 🛠️ settings.py をCI対応にする

`backend/config/settings.py` の `DATABASES` を以下のように変更します。

```python
import os    # os モジュールは Python 標準ライブラリ。環境変数を読み取るのに使う

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'library'),
        # os.environ.get('変数名', デフォルト値) は環境変数がなければデフォルト値を使う
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'password'),
        'HOST': os.environ.get('DB_HOST', '127.0.0.1'),
        'PORT': os.environ.get('DB_PORT', '3306'),
    }
}
```

> **補足**：ローカル環境の DB 接続情報（`DB_HOST=db` 等）は、Ch.2 で確認した `.devcontainer/docker-compose.yml` の `app` サービスに既に設定されています。追加の変更は不要です。ローカルでは `.devcontainer/docker-compose.yml` の環境変数が使われ、CI ではワークフロー内で設定した環境変数が使われます。

### 🛠️ Djangoテスト用ワークフローを作成する

`.github/workflows/django.yml` を作成します（`.github/workflows/` ディレクトリが存在しない場合は作成してください）。

```yaml
name: Django Tests

on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      db:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: library
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    env:
      DB_NAME: library
      DB_USER: root
      DB_PASSWORD: password
      DB_HOST: 127.0.0.1
      DB_PORT: 3306

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run migrations
        run: |
          cd backend
          python manage.py migrate

      - name: Run tests
        run: |
          cd backend
          python manage.py test
```

### 🛠️ Next.jsビルド用ワークフローを作成する

`.github/workflows/nextjs.yml` を作成します。

```yaml
name: Next.js Build and Test

on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd frontend
          npm install

      - name: Run tests
        run: |
          cd frontend
          npm test -- --watchAll=false

      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          NEXT_PUBLIC_API_URL: http://localhost:8000
```

## 14-4 CIの動作を確認する

### 🛠️ ワークフローをプッシュしてCIを動かす

ワークフローファイルをコミットしてプッシュします。

```bash
git add .github/workflows/django.yml
git add .github/workflows/nextjs.yml
git add backend/config/settings.py
git commit -m "Add GitHub Actions workflows"
git push origin feature/add-tests
```

GitHub のリポジトリページを開き、**Actions** タブをクリックします。ワークフローが実行中または完了しているのが確認できます。

```
✅ Django Tests       — 実行完了（成功）
✅ Next.js Build and Test — 実行完了（成功）
```

PR ページに戻ると、チェックが通ったことが表示されます。

### CIが失敗したときの表示

もしテストが失敗するコードをプッシュした場合、GitHub の Actions タブには ❌ が表示されます。PR ページにも赤いバツ印が出て、マージ前に問題があることが一目でわかります。

```
❌ Django Tests       — 失敗
✅ Next.js Build and Test — 実行完了（成功）
```

テストを通過させない限りマージを防ぐ運用にすることで、壊れたコードがメインブランチに混入するリスクを大幅に減らせます。

> **参考コード**：この章完了時点のコードは [v3.1 - CI/CD](https://github.com/ot-nemoto/fullstack-web-development-workshop-app/releases/tag/v3.1) で確認できます。手順通りに進めてコードが動かない場合、ここと見比べてみてください。

## まとめ

- CI は「プッシュするたびにテストを自動実行する」仕組みで、チーム開発での品質維持に役立つ
- GitHub Actions はリポジトリに YAML を置くだけで使えるCI/CDツール
- サービスコンテナを使って CI 環境でも MySQL を動かした
- `os.environ.get()` で環境変数を読み取ることで、ローカルと CI の設定を切り替えた
- PR に CI を連携させることで、壊れたコードをメインブランチに混ぜにくくなる

---

次の章では、本番環境への公開に必要な考え方を学びます。
