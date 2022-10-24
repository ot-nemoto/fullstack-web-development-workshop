# 【執筆メモStart】
# F1 > Dev Containers: Open Folder in Containerで「/usr/local/src/dev/app/frontend/」フォルダでOK > Node.js > 18 > OK
# により自動生成されます。
# 
# 好みに応じて、カスタマイズすることが可能です。
#
# 自動生成されたままです。
# 執筆にあたり、本書籍の環境に最適化したもの（microsoftのNodeでなく、本家のNodeを使用するとか）も紹介できればと思います。
# 【執筆メモEnd】
# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT=16-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
