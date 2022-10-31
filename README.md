# ローカル開発環境構築
## https://code.visualstudio.com/docs/remote/containers の仕組みで、WindowsでVS Code,WSL 2,Dockerを用いた開発環境を作成する
- https://docs.microsoft.com/ja-jp/windows/wsl/install の手順でWSL 2（Ubuntu）をインストールする
	- Windows Terminalを管理者権限として実行し、「wsl --install」を実行する
- https://docs.docker.jp/docker-for-windows/wsl.html の手順でDocker Desktopをインストールする
	- 「Start Docker Desktop wehen you log in」をONにして自動起動するようにしておくと便利
- VS Code をダウンロードしてインストールする。
    - https://code.visualstudio.com/
    - https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ja で日本語化する
- https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack をVS Codeにインストールする
- 作業ディレクトリを作成して権限を付与する
	- cd /usr/local/src
	- sudo mkdir dev
	- sudo chmod 777 dev
## MySQL Workbenchをインストール
- Visual C++ 再頒布可能パッケージをインストール（MySQL Workbenchの実行に必要）
	- https://docs.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist でVisual Studio 2015、2017、2019、および 2022（VC_redist.x64.exe）
- https://www.mysql.com/jp/products/workbench/ から最新のMySQL Workbenchをインストール
## WSL 2のDockerにてMySQL8を起動する
- 任意のディレクトリに`docker-compose.yml`を作成して配置（53306の部分は未使用の空きportであればOK）
```
services:
  app-db:
    image: mysql:8
    command:
      --collation-server=utf8mb4_0900_bin
      --transaction-isolation=READ-COMMITTED
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: password
      TZ: Asia/Tokyo
    ports:
      - 53306:3306
```
- `docker compose up -d` を実行
- WindowsのMySQL Workbenchから接続できることを確認する
	- Hostname:127.0.0.1
	- Port:53306
	- Username:root
	- Password:password
## フロントエンド初期設定
- WSL 2からVS Codeを起動する
	- cd /usr/local/src/dev
	- mkdir -p app/frontend
	- cd app/frontend
	- code .
	- F1 > Dev Containers: Open Folder in Containerで「/usr/local/src/dev/app/frontend/」フォルダでOK > Node.js > 18 > OK
	- yarn create next-app frontend　　→VS Codeのターミナル上で実行
	- frontend配下に作成されたアプリケーションを一階層上に上げる
	- 　→「yarn create next-app .」だと、ルート直下にアプリをつくれるはずなのですが既に「.devcontainer」ディレクトリ（VS Codeの設定ファイル）が存在していてエラーになってしまいます。なので、一時的にfrontend下につくってディレクトリ移動している…ということになります
		- mv frontend/* .
		- mv frontend/.eslintrc.json .
		- mv frontend/.gitignore .
		- rmdir frontend/
	- yarn dev
## フロントエンド追加設定
- next.config.js　　→app/frontendフォルダの直下
	- バックエンドへの疎通設定
		- https://nextjs.org/docs/api-reference/next.config.js/rewrites
```
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://host.docker.internal:8000/api/:path*/',
    },
  ]
}
```
## フロントエンド追加モジュール
- React UI tools
	- https://mui.com/material-ui/getting-started/installation/
		- yarn add @mui/material @emotion/react @emotion/styled
	- グリッド
		- yarn add @mui/x-data-grid
- axios
	- yarn add axios
- SWR
	- yarn add swr
## バックエンド初期設定
- WSL 2からVS Codeを起動する
	- cd /usr/local/src/dev
	- mkdir -p app/backend
	- cd app/backend
	- code .
	- F1 > Dev Containers: Open Folder in Containerで「/usr/local/src/dev/app/backend/」フォルダでOK > Python3 > 3.10 > Node=none > OK
	- echo -e 'djangorestframework\nmysqlclient' > requirements.txt
	- pip install -r requirements.txt
	- pip freeze > requirements.lock
	- VS Code起動時にpip installコマンドが自動実行されるように設定する（VS Code起動時にdjangorestframeworkのインストールがされるので、rest_framework関連の警告回避にもなる）
		- echo '' >> .devcontainer/Dockerfile
		- echo 'COPY requirements.lock .' >> .devcontainer/Dockerfile
		- echo 'RUN pip install -r requirements.lock' >> .devcontainer/Dockerfile
	- django-admin startproject config .
	- `echo '__pycache__/' > .gitignore`
	- mkdir config/settings
	- mv config/settings.py config/settings/base.py
	- echo 'from .base import *' > config/settings/development.py
	- python manage.py runserver --settings config.settings.development
## バックエンド追加設定
- settings.py
	- INSTALLED_APPSに"rest_framework"を追加する
	- ALLOWED_HOSTSに['*']を設定する
	- LANGUAGE_CODEに"ja-jp"を設定する
	- 実行SQLを標準出力に出力する
```
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
        }
    }
}
```
- devcontainer.json
	- 「Class '{モデル名}' has no 'objects' member pylint」のようなDjango特有の警告を誤検出しないようpylint_djangoを設定
```
"python.linting.pylintArgs": [
	"--load-plugins",
	"pylint_django",
	"--django-settings-module",
	"config.settings.development"
],
```
## VS Code操作
- 起動時に「Reopen in Container」を促された際には、「Reopen in Container」を実施する
- .devcontainerの内容を再実行する場合は F1 > Rebuild Container を実施
## Git Cloneからの起動方法
- 【TODO】Gitクライアントのインストール手順
- Windowsから見ると`\\wsl$\Ubuntu\usr\local\src\dev\app`にClone
- フロントエンド起動
	- cd /usr/local/src/dev/app/frontend
	- code .
	- yarn
	- yarn dev
- バックエンド起動
	- cd /usr/local/src/dev/app/backend
	- code .
	- python manage.py runserver --settings config.settings.development
# バックエンド開発
## アプリケーション追加
- startapp
	- cd api
	- django-admin startapp {アプリケーション名}
		- 例：`django-admin startapp hello`
- URL追加
	- config\urls.pyにアプリケーションへのpathを追加する
		- 例：`path('api/hello/', include('api.hello.urls')),`
## DB
- DATABASE作成（初回のみ）
	- CREATE DATABASE app
- development.py
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'app',
        'USER': 'root',
        'PASSWORD': 'password',
        'HOST': 'host.docker.internal',
        'PORT': '53306',
        'ATOMIC_REQUESTS': True
    }
}
```
- マイグレーションファイルを作成
	- python manage.py makemigrations --settings config.settings.development
- マイグレーション
	- python manage.py migrate --settings config.settings.development
- ※マイグレーション対象のアプリケーション（例：api.hello_dbやcommonなど）がINSTALLED_APPSに追加されていること
- ※apps.py > AppConfig > nameがFullPath（例：api.hello_db）になっていること
# 成果物
# フロントエンド成果物
- hello_frontend.js
	- フロントエンド内でのAPI疎通
- hello_backend.js
	- バックエンドへのAPI疎通
- hello_backend_db.js
	- バックエンドDBへのAPI疎通
- product
	- 単一ModelのREST API
	- 商品
	- 一覧 http://localhost:3000/product
	- 詳細 http://localhost:3000/product/[id]
- validation
	- バリデーション
- file
	- ファイル操作
# バックエンド成果物
- api/exception
	- カスタム例外
- api/hello
	- バックエンドのAPI疎通
- api/hello_db
	- バックエンドDBのAPI疎通
- api/product
	- 商品API
- api/validation
	- バリデーション
- api/file
	- ファイル操作
- common
	- 共通ソース
