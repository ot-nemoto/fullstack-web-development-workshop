# Dockerイメージを指定
FROM node:20-slim

# appというディレクトリを作成しソースコードを配置、yarnでライブラリをインストールし、yarn buildでライブラリをビルド
RUN mkdir /app
WORKDIR /app
ADD . /app/
RUN yarn
RUN yarn build

# 別ホストからもアクセスできるように設定
ENV HOST 0.0.0.0

# Next.jsを起動
ENTRYPOINT yarn start
