# 第3章 React(Next.js)+Django(Python)環境の構築

第2章では、第1章で学んだWebの基本的構造を実現する開発基盤を構築しました。第3章では、第2章で構築した基盤の上でフロントエンドとバックエンドそれぞれのアプリケーション開発ができる準備をします。

## 3-1 はじめに

前章では全体の共通基盤となるツールやサービスのインストールや準備などを進めてきました。本章では前章で構築した基盤の上に、フロントエンドとバックエンドそれぞれのアプリケーションのベースとなる環境を構築していきます。また開発を進める上で便利になるようなツールもあわせて設定していきます。本格的に開発を進めるための準備です。

### 3-1-1 本章の目的と概要

本章のハンズオンを実施すると、フロントエンドの環境としてReact（Next.js）とバックエンドの環境としてDjango（Python）を用いたフルスタックアプリケーション開発のための具体的な環境構築手順を習得できます。

それぞれの環境構築を通し、VSCodeでの開発コンテナの準備、アプリケーションのひな型生成、そして開発を効率化するための各種設定についても身に付きます。

### 3-1-2 開発環境の確認

本章を開始するにあたって、第2章のハンズオンが完了し、以下の環境が整っていることを前提とします。

- Docker Desktopがインストールされ、正常に動作していること。
- Visual Studio Code (VSCode) がインストールされ、日本語化およびDev Containers拡張機能が導入されていること。
- GitのインストールおよびGithubのアカウント設定が完了していること。

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未設定の箇所があれば2章に戻り、設定を見直してください。

### 3-1-3 この章からハンズオンを始める場合

2章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませておいてください。プログラムの作成は本章から行うため、コードに関する準備はありません。

## 3-2 環境構築の全体像

### 3-2-1 作成対象の環境

![](media/image33.png)

*図3-2-1 開発環境構築の対象*

最低限のフロントエンドの開発環境とバックエンドの開発環境構築を行います。必要な「ツール」は2章で用意されているので、以下のものの準備をします。

- プログラミング言語の実行環境
- プログラミング言語で効率的に開発を進めるための、フレームワーク
- 様々な処理を便利に行うためのライブラリ

### 3-2-2 環境構築の流れ

フロントエンドとバックエンドをそれぞれ完全に分けて環境構築を行います。ただどちらの環境も大きな流れは同じです。

1. プロジェクトを置くディレクトリを作成する
2. フロントエンド／バックエンドに適した開発用のコンテナ環境の設計図を作成する
3. 開発コンテナを作る
4. 開発コンテナ上に、適したフレームワークをおく
5. 開発コンテナ上に、やりたいことに合わせたライブラリをインストールする
6. 動作確認をする

### 3-2-3 環境構築の範囲

フロントエンドとバックエンドともにフレームワークが提供するデフォルトのスタート画面を表示するところまでがゴールになります。

## 3-3 フロントエンド開発環境

### 3-3-1 ディレクトリの準備

本書ではフロントエンドとバックエンドの2つのプロジェクトを作り、それを連携させてWebシステムとして機能させます。そのため、プロジェクトのホームディレクトリもフロントエンド用と、バックエンド用の2つを用意します。まずはフロントエンドから着手しましょう。

#### STEP: プロジェクトのホームディレクトリを用意する

ホームディレクトリはUbuntuに作成し、そのホームディレクトリ単位でコンテナと連携します。

WindowsのスタートメニューからUbuntuを選択し、起動します。そして、次のコマンドを実行してください。なお、同じウィンドウが表示されてわかりにくくなりますので、VSCodeは一旦閉じてください。

コマンドプロンプトを起動。デフォルトではカレントディレクトリが /c/Users/<ユーザー名> だと思うので、そこにフロントエンドのホームディレクトリを作成します。

```bash
mkdir repos\full-stack-web-development-frontend
```

```bash
cd repos\full-stack-web-development-frontend
```

```bash
code .
```

#### STEP: VS Codeの開発コンテナ（Dev Container 環境）の設計図を準備する

このStepでは構成ファイルと呼ばれる開発コンテナーの設計図をVSCodeのガイドに従って作成していきます。

左下にある緑色の >< アイコンをクリックし、リモート接続用メニューを開きます。

初めに「**開発コンテナー構成ファイルを追加...**」→「**ワークスぺースに構成を追加する**」を選択してください。

![](media/image39.png)

*図3-3-1 開発コンテナ構成ファイルの追加メニュー*

![](media/image11.png)

*図3-3-2 開発コンテナ構成の選択*

次にコンテナで実装する開発環境を選定します。「**Node.js & Typescript deccontaiers**」を選択してください。バージョンを聞かれるので「**22-bookworm**」を選びます。

さらに「機能の選択」「オプションのファイル/ディレクトリ」を求められますが、特に選択せずにそのままOKを選択して構いません。なお、本節で選択しているのは、執筆時点（2025年3月）での最新バージョンです。もし **22-bookworm** の選択がなければ任意のバージョンを選択してください。後ほど修正をします。

*図3-3-3 Node.jsとバージョンの設定*

![](media/image14.png)

![](media/image32.png)

*図3-3-4 機能の選択*

![](media/image37.png)

*図3-3-5 オプションのファイル/ディレクトリ*

![](media/image27.png)

上記の操作によってDockerのコンテナの中にフロントエンドの開発環境の設定ファイルが作られます。

#### 開発コンテナ

本稿では特に他の開発環境と区別するために、今後はVS Codeを利用したこの開発コンテナ環境をDev Container 環境と呼ぶようにします。

#### STEP: Dev Container 環境の設計図を確認する

以下のようなコンテナの設定ファイルが生成されているか確認してください。

**Frontend** .devcontainer/devcontainer.json New

```json
{
  "name": "Node.js & TypeScript",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm"
}
```

※コメントは削除しています。

#### STEP: Dev Container 環境を構成ファイルから作成して起動する

F1キーを押してコマンドパレットを開き、「Dev Containers: Reopen in Container」を選択してください。VSCodeが一度閉じて、先ほど作成した構成ファイルdevcontainer.jsonにしたがってコンテナが作成されます。

※以下が表示されている場合「コンテナーで再度開く」をクリックしても同様

![](media/image10.png)

*図3-3-6 Dev Containerの再度開くボタン*

#### .devcontainer/devcontainer.json

devcontainer.jsonはVS Code が開発用コンテナであるDev Container 環境を起動する方法と起動後に実行する処理が記述されたファイルです。

- "image": "***"：コンテナを生成するために必要なイメージを指定します。イメージはNode.jsやTypeScriptといったプログラム言語を実行するのに必要な環境があらかじめ入っています。このイメージはマイクロソフトといった企業が公開している場合もありますし、自分で作成したオリジナルのイメージを指定することもできます。今回はマイクロソフトの提供するイメージを使用します。Dockerやコンテナについては「2-4 Dockerについて」に戻って確認してみてください。

![](media/image41.png)

devcontainer.jsonはVSCode上に開発環境を作成するための設計図だと思ってください。ここまでのステップはまず設計図を作り、次に設計図を読み込み、読み込んだ内容に従って開発環境を組み立てる、ということを行っています。

### 3-3-2 ターミナル

#### STEP: フロントエンドでターミナルを使う（VSCode）

VSCodeのターミナルの使い方

VSCodeではターミナルを利用できます。ターミナルは、画面左上のメニューから呼び出します。ターミナルはプロジェクトホームディレクトリからLinux（Ubuntu）のコマンドを実行できます。以降の章でも頻繁に使うので覚えておきましょう。

*図3-3-7 ターミナルのメニュー呼び出し*

![](media/image7.png)

*図3-3-8 ターミナル*

![](media/image3.png)

#### STEP: インストール状況の確認をする

パッケージマネージャーの設定をターミナルから行ってみましょう。パッケージマネージャーの主な役割は依存ライブラリの管理です。パッケージマネージャーが依存関係を管理してくれるおかげで、複数の開発者の間で生じるライブラリのバージョン違いなどのトラブルが防げます。APIやフレームワークを多用するWebシステム開発では必要な役割です。

本編で使用するNode.jsのパッケージマネージャーとしては「npm」「yarn」「pnpm」などがあります。今回yarnを使用しているのは、執筆時点で最も主流であり、パッケージングの際のパフォーマンスがよいためです。git cloneしてローカルでソフトウェアを動作・テストなどをする際、高速でストレスの少ない開発が行えます。

node、yarnが使えることを確認

**Frontend** *Terminal*

```bash
node -v
```

**Frontend** *Terminal*

```bash
yarn -v
```

### 3-3-3 フロントエンドひな型作成

まずはこれから作成するアプリケーションのベースとなるアプリケーションを作成します。

#### STEP: フロントエンドのターミナルからアプリケーションの枠組みを生成する

yarnは「yarn.lock」というロックファイルを使用して、依存関係の正確なバージョンを固定できます。次のように操作を行ってください。

①VSCodeのメニューバーの「ターミナル」をクリックし、コマンドラインを呼び出す

②コマンドラインに次のコマンドを入力しyarnでアプリケーションをインストールする

**Frontend** *Terminal*

```bash
yarn create next-app frontend --ts --eslint
```

#### yarn createコマンド

このコマンドは、yarnによって新しいアプリケーションを作成しています。「yarn create next-app プロジェクト名」とあるように、frontendというNext.jsのアプリケーションを、オプションを使用して生成しています。

①クリック

②コマンドを入力

*図3-3-9 ターミナルでのコマンド実行画面*

![](media/image26.png)

オプションには次のような役割があります。

`--ts`

TypeScriptを使用してプロジェクトを作成することを指定します。

`--eslint`

ESLintをプロジェクトに統合することを指定します。ESLintは、コードの品質やスタイルを検証するためのJavaScriptの静的解析ツールです。ESLintをプロジェクトに統合することで、コーディング規約に準拠し、一貫性のあるコードを書くことができます。

*図3-3-10 yarnの構築中画面*

![](media/image25.png)

コマンドが実行されると、何度か「No／Yes」を尋ねられますが、デフォルトのままで問題ありません。

*図3-3-11 yarnによりフロントエンドのパッケージングが完了した画面*

![](media/image6.png)

ここで使用したVSCodeの「ターミナル」は今後もファイルシステムなどOSをVSCodeから操作する際に使用します。ターミナルの使い方も覚えておきましょう。

> **Hint:** 本書で想定しているnext.jsのバージョンはX.X.Xになります。もし同じバージョンにならない場合は以下のnpxコマンドを利用して、バージョンが同じになるようにインストールを行ってください。
>
> **Frontend** *Terminal*
>
> ```bash
> npx create-next-app@15.2.2 frontend --use-yarn
> ```
>
> ※ yarn create next-app frontend --ts --eslint でひな型の作成は可能だが、本書と読者のバージョンを合わせるために、npx create-next-app でひな型を作成する。
>
> ※ yarnはバージョン指定できないから
>
> 次のように確認がはいる。本書では以下の設定で。
>
> ✔ Would you like to use TypeScript? ... No / **Yes**
>
> ✔ Would you like to use ESLint? ... **No** / Yes
>
> ✔ Would you like to use Tailwind CSS? ... No / **Yes**
>
> ✔ Would you like your code inside a `src/` directory? ... **No** / Yes
>
> ✔ Would you like to use App Router? (recommended) ... No / **Yes**
>
> ✔ Would you like to use Turbopack for `next dev`? ... No / **Yes**
>
> ✔ Would you like to customize the import alias (`@/*` by default)? ... **No** / Yes

#### npx コマンド

npx コマンドを用いることで、create-react-appというフロントエンドのひな形に使うパッケージをローカルにインストールすることなく、直接実行しています。これにより、新しいReactプロジェクトのひな形がfrontendディレクトリ内に作成されます。

#### STEP: アプリケーションの枠組みを生成に成功したか確認する

サイドバーにあるエクスプローラーに「frontend」ディレクトリが作成されているでしょうか。また、アプリケーションの作成に成功した場合は以下のようなメッセージがターミナルに表示されます。

```
node@b9534f2dae0d:/workspaces/frontend$ yarn create next-app frontend --ts --eslint ・・・前Stepで実行したコマンド
yarn create v1.22.22
[1/4] Resolving packages...
（省略）
Success! Created frontend at /workspaces/frontend/frontend ・・・成功メッセージ
Done in 93.97s.
```

![](media/image21.png)

*図3-3-12 フロントエンドディレクトリの生成確認*

#### 成功／失敗の確認のポイント

アプリケーション開発に限りませんが、自分の行った手順が成功した／失敗したかを確認するのは意外に難しいです。例えば、上記では「frontend」フォルダが作成されたことを成功の判断ポイントにあげていますが、実際には「frontend」フォルダは作成されていたけど、フォルダの中身はからっぽで失敗していたといったこともあります。

なのでいろいろな切り口から手順の成功／失敗を見極められるようになると、手順などに共有しきれていない予期せぬ事態にも対応できるようになります。私がよくみるポイントを紹介します。

- 実行したコマンドの一番最後に「Success」や「Done」といった正常に終了したことを示すメッセージが表示されているか
- コマンド等でバージョン番号などインストール対象の情報が確認できるか
- 後の手順で生成済みが想定されているファイルやフォルダがあるか

手順書ですべてのパターンを網羅できるのが理想ですが、現実にはなかなか難しいです。なので自身で解決できるポイントを増やしておくといろいろな作業のやり直しも少なくなりますし、対応力も上がっていくのでおすすめです。

#### STEP: フロントエンドに自動生成されたファイルがあるか確認する

様々なファイルが作成されていると思うのでいくつかのファイル名をピックアップして、いま作成した環境でも該当ファイル名があるか確認してみましょう。

![](media/image3.png)

*図3-3-13 フロントエンドに自動生成されたファイル*

これらは Next.js のプロジェクトを動かす上で必要なファイルになります。個々のファイルに対する説明はここでは行いませんが、これらのファイルにはアプリケーションの画面を作るだけではなく様々な設定が記載されていたり、使用するプラグインを指定していたりします。

以降ではこれらのファイルを修正してプロジェクトのカスタマイズを行っていきます。

#### STEP: フロントエンドの自動生成されたフォルダを整理する

フロントエンド環境構築の追加作業

ここまで、Dockerコンテナを用いたフロントエンドの自動生成と、yarnを使ったNext.jsアプリケーションのセットアップを行ってきました。しかし、yarnのコマンドで「yarn create next-app .」と直接実行すると、3-2-1項「フロントエンドのコンテナ構築」で生成されたディレクトリ・ファイル群と衝突してエラーが発生する可能性があります。これは、自動生成されるディレクトリ名が既存のファイル名と重複してしまうためです。

この問題を避けるために、本書では「yarn create next-app frontend」というコマンドを使用し、プロジェクトを「frontend」という名前の新しいサブディレクトリに作成する手順を採用しています。しかしその結果、メインの「frontend」ディレクトリの一階層下に、同じ名前の「frontend」サブディレクトリが生成される構造になってしまっています。

そこで、作業しやすいように以下のコマンドでfrontendをまとめる作業を行います。VSCodeの「ターミナル」で次のコマンドを実行します。

**Frontend** *Terminal*

```bash
mv frontend/* .
mv frontend/.* .
rmdir frontend/
```

*図3-3-14 ディレクトリ構成図*

![](media/image34.png)

#### フレームワークのカスタマイズ

アプリケーション開発を効率的に進めるためのものがフレームワークなのに、その構成を勝手に変えてしまっていいのかな？と不思議に思う方もいるのではないでしょうか。

もちろん好き勝手にフレームワークの構成を変更してしまうことはNGです。フレームワークには想定された使い方があり、パターンを外れた使い方をすると開発効率の低下やアプリケーションの品質の低下も招いてしまいます。

しかし一方で、フレームワークが開発者が開発したいすべてのアプリケーションに完璧にマッチすることは難しい、という現状もあります。そのため、開発者はフレームワークの特徴を理解してメリットとデメリットを選択しながらカスタマイズを行ったりします。カスタマイズに限界がある場合は、別のフレームワークへの移行も検討したりもします。ちゃんと変更による影響を許容してカスタマイズを行うのであれば問題ありません。

#### STEP: フロントエンド環境を起動する

フロントエンド環境の動作確認

それでは、作成したフロントエンドの Next.js アプリケーション（frontend）が起動するか動作確認をしましょう。VSCodeのターミナルで次のコマンドを実行します。

**Frontend** *Terminal*

```bash
yarn dev
```

#### STEP: 画面が描画されているか確認する

起動後に以下のようなメッセージが出ていると思います。

**Frontend** *Terminal*

```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

このURLが Next.js デフォルトのウェルカムページのURLとなっているのでクリックしてリンクを開いてください。

http://localhost:3000

*図3-3-15 yarn dev の実行画面*

![](media/image38.png)

図3-3-16のようなウェルカムページが表示されれば成功です。

*図3-3-16 Next.jsウェルカムページ*

![](media/image8.png)

もしかしたら画面が白背景ではなく黒背景になっているかもしれません。本稿ではブラウザのデザインはライトモードで進めています。動作に問題はありませんが、違いが気になる場合はライトモードに変更してください。

#### STEP: 自動でパッケージをインストールするための設定をする

ひな型作成時にコマンド「yarn create next-app」によってライブラリのインストールも同時に実行していますが、新しくDev Container 環境を構築し直したり、他の方が構築する際にはライブラリは未インストールの状態です。そのため別途ライブラリのインストールが必要になります。

しかし、環境構築のたびに開発者がコマンドを実行すると手間ですし、実行し忘れなども考えられます。仕組みで解決できるようにコンテナ再構築時にライブラリを入れるように、Dev Container 環境を構成ファイルにある環境設定を変更しましょう。

**Frontend** .devcontainer/devcontainer.json

```json
{
  "name": "Node.js & TypeScript",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm",
  "postCreateCommand": "yarn install"
}
```

※コメントは削除しています。

#### .devcontainer/devcontainer.json

devcontainer.jsonはVS Code が開発用コンテナであるDev Container 環境を起動する方法と起動後に実行する処理が記述されたファイルです。

- "postCreateCommand": "yarn install"：コンテナを生成したときに指定したコマンドを実行するオプションです。本稿だと「yarn install」という、Next.js のパッケージを管理するpackage.jsonに記載されている、ライブラリをインストールするコマンドを実行します。
  > 似たようなオプションとしてpostStartCommandという、コンテナを起動したときに指定したコマンドを実行するオプションがあります。生成は１度だけですが、起動は何度もすることになるので、ライブラリのバージョンアップが頻繁な場合などはpostStartCommandを使用するなどの使い分けることができます。

#### package.json

少し、似たようなシーンで使われることが多い意味の違う言葉が増えてきたので改めて整理しましょう。

#### ライブラリ

自分のプログラムから呼び出す特定の機能をもったパーツです、パッケージとしてまとめられ管理されています。

#### パッケージ

ライブラリを管理できるようにまとめた状態のものです。今作成しているアプリケーションも

#### プラグイン

VSCodeの拡張機能のように、既存のソフトウェアに機能を追加する部品のようなものです。2章ではVSCodeを日本語化したりDockerコンテナを扱うための拡張機能（プラグイン）をインストールしていました。

![](media/image43.png)

### 3-3-4 フロントエンド開発環境の準備

biomeを使ってアプリケーションのフォーマットの統一や、構文チェックを実施するため、インストールと設定を行う。

#### STEP: ライブラリをインストールする

**Frontend** *Terminal*

```bash
yarn add -D @biomejs/biome
```

#### STEP: 設定ファイルを生成する

**Frontend** *Terminal*

```bash
yarn biome init
```

以下のような biome の設定ファイルが生成されます。

**Frontend** biome.json New

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": []
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  }
}
```

※ formatter.indentStyle で空白の扱いを tab から space に変更しています。個人の好みもありますが、チーム内でルールを決めるのがいいと思います。

#### STEP: フォーマットのチェックをしてみる

フォーマッターは、コードの見た目を整えることに特化したツールです。コードのインデント（字下げ）、スペース、改行、カッコの位置など、コードのスタイルを統一することができます。

**Frontend** *Terminal*

```bash
yarn biome format app/
```

試しにフォーマットしてみましょう。以下のようなインデントなどがばらばらのjsonファイルを作成します。

data.json

```json
{ "product_id" : "A001", "name":"在庫管理システム", "price": 49800,
"tags": ["fullstack", "django", "nextjs" ],
"details":{ "stock": 150, "location":"Warehouse A" }
}
```

先ほどのコマンドを実行しましょう。

**Frontend** *Terminal*

```bash
yarn biome format app/
```

以下のように修正されたでしょうか。

```json
{
  "product_id": "A001",
  "name": "在庫管理システム",
  "price": 49800,
  "tags": [
    "fullstack",
    "django",
    "nextjs"
  ],
  "details": {
    "stock": 150,
    "location": "Warehouse A"
  }
}
```

結果が確認出来たらこのdata.jsonファイルは削除してください。

#### STEP: 構文解析してみる

リンターは、コードの文法と潜在的な問題をチェックすることに特化したツールです。プログラムを実行する前に、文法的な間違い、バグの原因になりやすい書き方、推奨されないコードスタイルなどを検出します。

**Frontend** *Terminal*

```bash
yarn biome lint app/
```

試しに構文解析してみましょう。以下のようなインデントなどがばらばらのjsonファイルを作成します。

sample.json

```javascript
// utils.js の一部を想定
const TOTAL_COUNT = 100; // 定数なのにすべて大文字ではない
let count = 0;
function incrementCount() {
  // if文のブロックがないため、意図しない挙動になる可能性がある
  if (count > 10) count = 10;
  count++;
}

// 意図的に未使用の変数を定義
const MAX_LIMIT = 50;

// 意図的にエラーが発生しうるコード
const result = some_undefined_function();

export default incrementCount;
```

先ほどのコマンドを実行します

**Frontend** *Terminal*

```bash
yarn biome lint app/
```

以下のような構文解析の結果が出力されたでしょうか。

**Frontend** *Terminal*

```
utils.js:3:1: lint/style/useConst: Replace `let` with `const` for variable `count`. utils.js:3:1: lint/suspicious/noDiscardedButUsed: The expression `count++` might be unintentionally discarded. utils.js:6:20: lint/complexity/noUselessCondition: The condition `count > 10` is always true. utils.js:10:7: lint/nursery/noUnusedVariables: Unused variable `MAX_LIMIT`. utils.js:13:14: lint/nursery/noUndeclaredVariables: The variable `some_undefined_function` is not defined. Found 5 errors.
```

ひとつひとつの内容は詳しく解説しませんが、JavaScriptの推奨される記載の仕方や未使用の変数、未定義の変数に関する警告が発生しています。

このようにリンターは、単にコードの見た目を整えるだけでなく、潜在的なバグや実行時のエラーにつながる論理的なミスを検出し、アプリケーションの品質を向上させるための重要な役割を果たします。

#### フォーマッタやリンターの役割

なぜフォーマッタやリンターといったコードをきれいに整える仕組みが必要なのでしょうか。じつは全部で３つの理由があります。

まずは一つ目です。もしひとりひとりが自分が好きなようにコードを整えていたらと考えてみましょう。以下にそれぞれのルールにしたがって書いた同じ内容のjsonファイルを記載します。

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": false,"clientKind": "git",
    "useIgnoreFile": false
  }
}

{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json"
  ,"vcs":{
    "enabled": false
    , "clientKind": "git"
    , "useIgnoreFile": false
  }
  ,
}
```

内容は同じなのに全然違うコードのように見えてしまいます。チーム開発では自分以外の人が書いたコードを読む機会の方が圧倒的に多いです。このように書き方がバラバラだと後からコードを読む人が混乱します。

次に二つ目です。また同じ内容のコードを記載します。どのような印象を持つでしょうか？

```json
{"$schema": "https://biomejs.dev/schemas/1.9.4/schema.json","vcs": {"enabled": false,"clientKind": "git","useIgnoreFile": false},
```

一目見ただけではこのコードの内容が先ほどの例に比べて捉えにくかったと思います。このようなコードの読みやすさ／理解のしやすさを可読性と言います。コードが整っていることによって可読性が上がり、開発を進めやすくなります。

最後の三つ目です。自身のコーディングのレベルも向上しレビューも多く任されるようになったシーンを想像してみてください。以下のようなJSONのレビュー依頼が来たときにどのようなことをするでしょうか。

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json"
  , "vcs": {
    "enabled": false,"clientKind": "git",
    "useIgnoreFile": false
  },
}
```

おそらく、「インデントが揃っていない」や「区切り位置がバラバラ」など作成しているアプリケーションの本質とは関係のないレビューコメントをつけると思います。

本来、開発者が集中したいのは開発しているアプリケーションの業務ロジックやMVP機能などのそのアプリケーションの核となるようなところのレビューです。体裁といった枝葉の要素は実際のところ興味があるところではないのです。コードの整形が適切に行われることで、開発者は本質的なレビューに集中することができます。

これらの理由からフォーマッタやリンターを導入し、まるで**『自動の校正係』**のようにコードの書き方を統一したいのです。

#### なぜBiome

以前はフォーマッタやリンターを導入しようと思うとJavaScriptではESLint、Prettier、Stylelintなどそれぞれ別のツールを導入する必要がありました。ツールによって設定方法も異なったり競合する機能があったりと、複数のツールで一つのコードを整形するにはしばしば煩わしいシーンがありました。

Biomeは単体でフォーマッタやリンター機能を持っているため、この煩わしさを解決することができました。こういった開発環境を補助するツールの変遷はフレームワークよりも早いため、いろいろ試してみるのもよいでしょう。

#### STEP: 拡張機能を設定する

コードを書くたびにフォーマッターで確認するのは面倒ですし反映漏れもでてきます。そこでbiomeの拡張機能を利用し、ファイルの保存時に自動でフォーマットされたり、リアルタイムに構文解析をして指摘して貰えるようにしていきましょう。

まずはvscodeの設定を変更します。

**Frontend** .devcontainer/devcontainer.json

```json
{
  "name": "Node.js & TypeScript",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm",
  "postCreateCommand": "yarn install",
  "customizations": {
    "vscode": {
      "extensions": ["biomejs.biome"]
    }
  }
}
```

**Frontend** .vscode/settings.json New

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit",
    "source.fixAll.biome": "explicit"
  }
}
```

### 3-3-5 フロントエンドのコンテナ

この時点でフロントエンドの環境はDockerコンテナ上に作成されています。前項でウェルカムページが表示されていることは確認できていますが、意図した通りローカル環境ではなくコンテナ環境にフロントエンドの開発環境が作成されているか確認してみましょう。

#### STEP: Docker Desktopを起動する

第2章ですでにインストールしているので、デスクトップからDocker Desktopを起動してください。

#### STEP: Docker Desktopの管理画面を確認する

基本的にコンテナの生成は、VSCodeやデータベースのインスタンスを連携することで自動的に生成されます。

フロントエンド

*図3-3-17 コンテナ一覧*

![](media/image4.png)

次にイメージ（Images）タブをクリックしてみましょう。生成されたコンテナはイメージ（image）として保管されます。「in use」と表示されているものが、実際に使用されているコンテナです。

### 3-3-6 Gitでソースコードを管理

#### STEP: ローカルリポジトリとリモートリポジトリの紐づけする

①リモートリポジトリの設定

**Frontend** *Terminal*

```bash
git remote add origin https://github.com/USERNAME/full-stack-web-development-frontend.git
```

※USERNAMEは自身のGithubのユーザ名

以下、コマンドで実行したことを、GUIベースで操作する

[リモート] → [リモートの追加]

![](media/image17.png)

*図3-3-18 リモートリポジトリの追加*

第2章で作成したリポジトリを設定

https://github.com/USERNAME/full-stack-web-development-frontend.git

![](media/image29.png)

*図3-3-19 リモートURL入力*

![](media/image13.png)

*図3-3-20 リモートリポジトリの設定完了*

#### STEP: ローカルリポジトリに保存する

②すべての変更をステージ

**Frontend** *Terminal*

```bash
git add .
```

以下、コマンドで実行したことを、GUIベースで操作する。

[すべての変更をステージ] をクリック。

![](media/image2.png)

*図3-3-21 すべての変更をステージ*

#### STEP: リモートリポジトリにアップロードする

③コミットしてリモートリポジトリにアップロードする

**Frontend** *Terminal*

```bash
git commit -m "フロントエンドの初期設定"
git push origin main
```

以下、コマンドで実行したことを、GUIベースで操作する。

コミットメッセージ（「フロントエンドの初期設定」）を入力し、[コミットしてプッシュ]を選択

![](media/image19.png)

*図3-3-22 コミットメッセージの入力*

![](media/image23.png)

*図3-3-23 コミット完了*

#### STEP: リモートリポジトリを確認する

以下のGithubのリポジトリにアクセスし、作成した内容がGithubにも反映されているか確認してみましょう。

https://github.com/USERNAME/full-stack-web-development-frontend.git

![](media/image40.png)

*図3-3-24 Githubリポジトリの確認*

### 3-3-7 本節のハンズオンチェック

フロントエンドの開発環境の構築について、以下の内容を実施できたでしょうか。問題がなければ、次の節に進んでください。

✅ フロントエンド開発のためにNext.jsをインストールしてウェルカムページを表示する

✅ Next.js で開発をするための設定をする

✅ フロントエンド環境をGithubのリポジトリに保存する

次の節のバックエンドの開発環境構築では、いま構築した環境とは別にバックエンド用の開発用コンテナを作成します。

## 3-4 バックエンド開発環境

### 3-4-1 バックエンドのコンテナの構築

前節ではフロントエンドの開発環境を作りながら、VSCodeの使い方を学びました。本節では、次章以降のために引き続き、バックエンド開発の準備をします。

バックエンドのコンテナを作成し、いくつかの設定や拡張機能をインストールします。図3-4-1の濃い網掛け部分のアーキテクチャが対象となります。

*図3-4-1 開発環境構成図*

![](media/image18.png)

プロジェクトのホームディレクトリの作成

前節で作成しておいたバックエンドのホームディレクトリ（/usr/local/src/dev/app/backend）を使用します。この作業フォルダにコンテナを構築しアプリケーションを開発していきます。間違いを防ぐために、前項で使用したフロントエンドのVSCodeを立ち上げたままの方は一度、閉じてください。その上で、WindowsメニューからUbuntuを立ち上げ、次のコマンドを実行してください。

### 3-4-2 ディレクトリの準備

#### STEP: プロジェクトのホームディレクトリを用意する

フロントエンドと同様にホームディレクトリはUbuntuに作成し、そのホームディレクトリ単位でコンテナと連携します。

WindowsのスタートメニューからUbuntuを選択し、起動します。そして、次のコマンドを実行してください。なお、同じウィンドウが表示されてわかりにくくなりますので、VSCodeは一旦閉じてください。

コマンドプロンプトを起動。デフォルトではカレントディレクトリが /c/Users/<ユーザー名> だと思うので、そこにフロントエンドのホームディレクトリを作成する。

**Command Prompt**

```bash
mkdir repos\full-stack-web-development-backend
```

**Command Prompt**

```bash
cd repos\full-stack-web-development-backend
```

**Command Prompt**

```bash
code .
```

#### STEP: devcontainer環境を準備する

以下のようにコンテナの設定を記載してください。

*図3-4-2 バックエンド設定画面1*

![](media/image28.png)

*図3-4-3 バックエンド設定画面2*

![](media/image35.png)

**Backend** .devcontainer/devcontainer.json New

```json
{
  "name": "Python 3",
  "image": "mcr.microsoft.com/devcontainers/python:1-3.12-bullseye"
}
```

#### STEP: devcontainer環境で起動する

F1キーを押してコマンドパレットを開きます。「Dev Containers: Open Folder in Container」を選択し、WindowsのエクスプローラーのLinuxから「/usr/local/src/dev/app/backend/」フォルダが選択されていることを確認して「Open」ボタンを押してください。

python が使えることを確認

**Backend** *Terminal*

```bash
python --version
```

### 3-4-3 バックエンドひな型作成

#### STEP: フレームワークをインストールする

バックエンドの環境設定を行う

ここまでで、プロジェクトのホームディレクトリにPython3でのコンテナを作成しました。次に今後の開発に必要な設定を行います。

以下のコマンドを実行して、Djangoフレームワークをインストールしてください。

**Backend** *Terminal*

```bash
pip install djangorestframework
```

#### pipとは

pipは、Pythonで使用されるパッケージ管理システムです。PythonのパッケージリポジトリであるPyPI（Python Package Index）からライブラリやツールをインストールし、管理します。前述のフロントエンドのハンズオンの際に、JavaScriptのパッケージマネージャーであるyarnを使ってライブラリをインストールをしたことを覚えているでしょうか。yarnのPython版と考えればわかりやすいと思います。

pipには次のような機能があります。

- パッケージのインストール
- パッケージのアップグレード
- パッケージのアンインストール
- 依存関係の解決とインストール
- インストール済みパッケージの一覧表示

前述の「pip install ～」のように、インストールもできますし「pip uninstall パッケージ名」でアンインストールなどもできます。pipは前述の「requirements.txt」でパッケージを管理しています。

作業手順の解説に戻ります。続いて、次のコマンドを実行して依存関係を固定してください。

#### STEP: 依存関係を管理する

**Backend** *Terminal*

```bash
pip freeze > requirements.txt
```

pip freezeコマンドは、インストールされているパッケージとそのバージョンを一覧表示します。「>」で「requirements.txt」ファイルに書き出します。次の節のDockerの設定では、ここで作成した txt ファイルの中身を使い、コンテナの中のAPIなどのバージョンを固定しています。

*図3-4-4 requirements.txt の中身*

```
asgiref==3.9.1
Django==5.2.4
djangorestframework==3.16.0
gitdb==4.0.12
GitPython==3.1.41
setuptools==75.6.0
smmap==5.0.2
sqlparse==0.5.3
```

#### STEP: 自動でパッケージをインストールするための設定をする

Dockerの設定を行う

Dockerに追加モジュールや依存関係の設定を行います。VSCodeのエディター機能を使い、.devcontainer/devcontainer.jsonを開いてください。

カンマを忘れない

①選択

②入力

*図3-4-5 devcontainer.jsonの設定画面*

![](media/image12.png)

中段の下あたりに記載のある、postCreateCommandを使用するため、次のように書き換えてください。

**Backend** .devcontainer/devcontainer.json

```json
{
  "name": "Python 3",
  "image": "mcr.microsoft.com/devcontainers/python:1-3.12-bullseye",
  "postCreateCommand": "pip3 install -r requirements.txt"
}
```

その際、上段の「"image": "mcr.microsoft.com/devcontainers/python:1-3.12-bullseye"」にカンマ（,）を忘れないように注意してください。上段にカンマを入れないとVSCodeがエラーを表示します。

書き換えが完了したら左下の開発コンテナをクリックし、「コンテナーのリビルド」を実行してください。

①クリック

②選択

*図3-4-6 コンテナのリビルド画面*

![](media/image36.png)

これでVSCodeを起動しサーバーサイドのコンテナを立ち上げる際に、依存関係を持つパッケージを自動的にインストールできます。

*図3-4-7 .devcontainer/Dockerfileの中身*

![](media/image22.png)

#### STEP: バックエンドのサーバー（開発環境）の準備を行う（Djangoプロジェクト設定）

Djangoプロジェクトを設定する

続いて、プロジェクトの設定をします。Djangoにはプロジェクトという概念があり、開発時にアプリケーションの単位として扱うことができます。

ただ、本書ではDjangoのプロジェクトは「開発の単位」としては使用せず、環境依存情報の管理のためだけに使用します。プロジェクト名が「config」というのは少々わかりにくいですが、本書における作業の便宜上そうしています。まず第2章の冒頭で説明した「開発環境」についての説明を思い出してください。

*図3-4-8 開発・テスト・本番環境（再掲）*

![](media/image30.png)

#### STEP: 開発（development）環境を作成する

今回は①の環境を「development」とします。そのため、以降は①の環境設定を「config/settings/development.py」として作成しています。本来のプロジェクトを想定すると「staging.py」（③ステージング環境）や「production.py」（④本番環境）なども作成することになります（本書では「development」のみ作成します）。

その際、①～④の各環境独自の設定は、環境ごとのpyファイルとして作成しますが、逆に環境によらない情報（タイムゾーンや言語など）は共通ファイルとして管理します。

本書では共通ファイルをbase.pyとして管理しています。後述の設定ファイルの作成ではbase.pyという環境共通設定ファイルを使用します。

*図3-4-9 base.pyと環境共通設定ファイル*

![](media/image24.png)

VSCodeのターミナル上で次のコマンドを実行します。

**Backend** *Terminal*

```bash
django-admin startproject config .
```

django-adminは、Djangoコマンドラインです。startprojectは、新しいDjangoプロジェクトを作成するコマンドです。configはプロジェクトの名前であり、.はプロジェクトをカレントディレクトリに作成することを指定します。

このコマンドを実行すると、configという名前のディレクトリが作成され、Djangoプロジェクトのスケルトンがその中に作成されます。ここには基本的なファイル（settings.py、asgi.py、wsgi.pyなど）が作成されます。

#### STEP: バックエンドに自動生成されたファイルがあるか確認する

様々なファイルが作成されていると思いますが、フロントエンドと同様にこれらはDjangoのプロジェクトを動かす上で必要なファイルになります。個々のファイルに対する説明はここでは行いませんが、これらのファイルにはアプリケーションの画面を作るだけではなく様々な設定が記載されていたり、使用するプラグインを指定していたりします。

以降ではこれらのファイルを修正してプロジェクトのカスタマイズを行っていきます。

#### STEP: 開発（development）環境のgit設定を行う

Gitの管理からソース以外のファイルを外す

VSCodeのターミナル上で次のコマンドを実行します。

**Backend** .gitignore New

```
__pycache__/
```

このコマンドは、.gitignoreファイルに__pycache__/というテキストを書き込みます。.gitignoreファイルは、Gitのバージョン管理から除外するファイルやディレクトリのリストを指定するために使用されます。__pycache__/は、Pythonのコンパイル済みバイトコードファイルが生成されるディレクトリです。

このコマンドを実行することで、__pycache__/ディレクトリ内のファイルがGitの追跡から除外されます。

#### STEP: 設定した内容でバックエンドのDjangoサーバーを起動する

Djangoサーバーの起動

ここまでで作成・配置した環境設定ファイルを利用して、開発環境を起動します。次のコマンドをVSCodeのターミナルから実行します。

**Backend** *Terminal*

```bash
python manage.py runserver
```

このコマンドは、Djangoの開発サーバーを起動しています。python manage.py runserverコマンドは、Djangoプロジェクトの管理コマンドであり、開発サーバーを起動するために使用されます。このコマンドを実行すると、Djangoの開発サーバーが起動し、指定された設定ファイルに基づいてアプリケーションが実行されます。

無事サーバーの起動が完了すると、図3-4-10のような画面が表示されます。

*図3-4-10 Djangoサーバーの起動画面*

![](media/image5.png)

### 3-4-4 アプリケーションの設定

前項までで、開発環境のコンテナの設定を行いました。引き続き、後の章での開発の準備を兼ねて環境の設定を行います。

> **メモ:** Djangoアプリケーションの起動時に、以下のメッセージが表示される。
>
> You have 18 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
>
> Run 'python manage.py migrate' to apply them.
>
> マイグレーションが未適応のメッセージ。あとで説明。
>
> WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.
>
> For more information on production servers see: https://docs.djangoproject.com/en/5.2/howto/deployment/
>
> 本番環境は別のサーバを使うべきという注意喚起

#### パッケージマネージャー

pipはyarnのpython版という話をしました。実際に並べてみるといろいろな要素が対応していることがわかると思います。これはPythonにおけるpip以外の他のプログラミング言語でもだいたい同じです。

![](media/image42.png)

#### STEP: ライブラリを追加をする

DjangoでAPIを作るためのライブラリを追加します。

- INSTALLED_APPSに"rest_framework"を追加する（後ろにカンマ（,）をつけてください）

**Backend**

*コード3-4-1 共通環境用の設定ファイル（config/settings.py）*

```python
# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
]
```

#### STEP: アクセス許可の設定を変更する

- ALLOWED_HOSTSに['*']を設定する

**Backend**

*コード3-4-2 共通環境用の設定ファイル（config/settings.py）*

```python
ALLOWED_HOSTS = ['*']
```

#### STEP: デフォルトの言語とタイムゾーンの設定を変更する

- LANGUAGE_CODEに"ja-jp"を設定する（かなり後ろのほうに項目があります）

**Backend**

*コード3-4-3 共通環境用の設定ファイル（config/settings.py）*

```python
LANGUAGE_CODE = "ja-jp"
TIME_ZONE = "Asia/Tokyo"
```

①選択

②設定

*図3-4-11 VSCodeのエクスプローラーよりエディターを起動*

![](media/image16.png)

#### STEP: ログ出力の設定を追加する

バックエンドでSQLのクエリを標準出力されるようにする設定をします。

次に、「実行SQLを標準出力に出力する」ためにコード3-4-4の設定を一番下に追記します。

**Backend**

*コード3-4-4 共通環境用の設定ファイル（config/settings.py）*

```python
# Logging configuration
# https://docs.djangoproject.com/en/5.2/topics/logging/
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': False,
        }
    }
}
```

### 3-4-5 バックエンド開発環境の準備

ruff を使ってアプリケーションのフォーマットの統一や、構文チェックを実施するため、インストールと設定を行う。

#### STEP: ライブラリをインストールする

**Backend** *Terminal*

```bash
pip install ruff
```

設定ファイルを生成する。

https://docs.astral.sh/ruff/configuration/ からデフォルトの設定ファイルを取得します。

**Backend** ruff.toml

```toml
# Exclude a variety of commonly ignored directories.
exclude = [
    ".bzr",
    ".direnv",
    ".eggs",
    ".git",
    ".git-rewrite",
    ".hg",
    ".ipynb_checkpoints",
    ".mypy_cache",
    ".nox",
    ".pants.d",
    ".pyenv",
    ".pytest_cache",
    ".pytype",
    ".ruff_cache",
    ".svn",
    ".tox",
    ".venv",
    ".vscode",
    "__pypackages__",
    "_build",
    "buck-out",
    "build",
    "dist",
    "node_modules",
    "site-packages",
    "venv",
]

# Same as Black.
line-length = 88
indent-width = 4

# Assume Python 3.9
target-version = "py39"

[lint]
# Enable Pyflakes (`F`) and a subset of the pycodestyle (`E`) codes by default.
# Unlike Flake8, Ruff doesn't enable pycodestyle warnings (`W`) or
# McCabe complexity (`C901`) by default.
select = ["E4", "E7", "E9", "F"]
ignore = []

# Allow fix for all enabled rules (when `--fix`) is provided.
fixable = ["ALL"]
unfixable = []

# Allow unused variables when underscore-prefixed.
dummy-variable-rgx = "^(_+|(_+[a-zA-Z0-9_]*[a-zA-Z0-9]+?))$"

[format]
# Like Black, use double quotes for strings.
quote-style = "double"

# Like Black, indent with spaces, rather than tabs.
indent-style = "space"

# Like Black, respect magic trailing commas.
skip-magic-trailing-comma = false

# Like Black, automatically detect the appropriate line ending.
line-ending = "auto"

# Enable auto-formatting of code examples in docstrings. Markdown,
# reStructuredText code/literal blocks and doctests are all supported.
#
# This is currently disabled by default, but it is planned for this
# to be opt-out in the future.
docstring-code-format = false

# Set the line length limit used when formatting code snippets in
# docstrings.
#
# This only has an effect when the `docstring-code-format` setting is
# enabled.
docstring-code-line-length = "dynamic"
```

Frontendのbiome.jsonと同様にアレンジしてください。

#### STEP: フォーマットのチェックをしてみる／構文解析してみる

**Backend** *Terminal*

```bash
ruff format .
```

**Backend** *Terminal*

```bash
ruff check .
```

#### ~~STEP: バックエンドでDjangoのlintの誤検出を防止する~~

~~devcontainer.json~~

~~「Class '{モデル名}' has no 'objects' member pylint」のような、Django特有の警告を誤検出しないようにpylint_djangoを設定します。VSCodeのエディター機能を使いdevcontainer.jsonを開いてください。~~

~~カンマ~~

~~①選択~~

~~②追記~~

![](media/image31.png)

~~図3-4-12 devcontainer.jsonの設定（.devcontainer/devcontainer.json）~~

~~そして、次のコードを記載してください。その際、必ず1つ上の設定にカンマ（,）をつけてください。~~

#### STEP: 拡張機能を設定する

**Backend** .devcontainer/devcontainer.json

```json
{
  "name": "Python 3",
  "image": "mcr.microsoft.com/devcontainers/python:1-3.12-bullseye",
  "postCreateCommand": "pip3 install -r requirements.txt",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-python.python",
        "charliermarsh.ruff",
        "ms-python.vscode-pylance"
      ]
    }
  }
}
```

**Backend** .vscode/settings.json New

```json
{
  "editor.defaultFormatter": "charliermarsh.ruff",
  "editor.formatOnSave": true,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit",
    "source.fixAll": "explicit"
  },
  "python.analysis.typeCheckingMode": "basic",
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  }
}
```

フロンドエンドではeditor.defaultFormatterにbiomを設定していましたが、バックエンドではruffを設定しています。フロントエンドとバックエンドで使用するツールなどは違うものの、フォーマットや構文解析を行いたい、など大きくやりたいことは変わりません。

これは他のフレームワークや開発ツールを使用したときも同じです。

大きく分けて

- 実行環境に関する設定
- 開発環境に関する設定
- アプリケーションに関する設定

を作成し、それらを開発者が共有できるようして同じように環境構築できるように管理します。様々なプロジェクトを経験するとその現場ごとにいろいろなツールやフレームワークに出会うと思いますが、大きい目で見るとやっていることはどれも似ています。だいたい何をしているのか？を押さえておくとプロジェクトがグッと理解しやすくなります。

### 3-4-6 バックエンドのコンテナ

この時点でバックエンドの環境はDockerコンテナ上に作成されています。前項でウェルカムページが表示されていることは確認できていますが、意図した通りローカル環境ではなくコンテナ環境にバックエンドの開発環境が作成されているか確認してみましょう。

#### STEP: Docker Desktopを起動する

第2章ですでにインストールしているので、デスクトップからDocker Desktopを起動してください。

#### STEP: Docker Desktopの管理画面を確認する

基本的にコンテナの生成は、VSCodeやデータベースのインスタンスを連携することで自動的に生成されます。

フロントエンド

*図3-4-13 コンテナ一覧*

![](media/image4.png)

次にイメージ（Images）タブをクリックしてみましょう。生成されたコンテナはイメージ（image）として保管されます。「in use」と表示されているものが、実際に使用されているコンテナです。

### 3-4-7 ローカルリポジトリとリモートリポジトリの連携

Frontendと同様にリモートリポジトリにアップロードします。

（FrontendでGUIベースの操作は体験したので、コマンドベースの操作のみ）

#### STEP: リポジトリの初期化

**Backend** *Terminal*

```bash
git init --initial-branch=main
```

#### STEP: ローカルリポジトリとリモートリポジトリの紐づけする

**Backend** *Terminal*

```bash
git remote add origin https://github.com/USERNAME/full-stack-web-development-backend.git
```

> **メモ:** fatal: detected dubious ownership in repository at '/workspaces/full-stack-web-development-backend'
>
> To add an exception for this directory, call:
>
> git config --global --add safe.directory /workspaces/full-stack-web-development-backend

#### STEP: ローカルリポジトリに保存する

ここまで実行できたでしょうか。問題なければ、いったんこの状態を保存するためにgithubに開発状態を連携したいと思います。

**Backend** *Terminal*

```bash
git status
git add .
git commit -m "バックエンドの初期設定"
```

#### STEP: ローカルリポジトリをリモートリポジトリにアップロードする

以下のコマンドを実行してください。

**Backend** *Terminal*

```bash
git push origin main
```

### 3-4-8 本節のハンズオンチェック

バックエンドの開発環境の構築について、以下の内容を実施できたでしょうか。問題がなければ、次の節に進んでください。

✅ バックエンド開発のためにDjangoをインストールしてウェルカムページを表示する

✅ Djangoで開発をするための設定をする

✅ バックエンド環境をGithubのリポジトリに保存する

次の節のバックエンドの開発環境構築では、いま構築した環境とは別にバックエンド用の開発用コンテナを作成します。

## 3-5 Docker Desktop

第2章でDockerのインストールを行い、MySQLをコンテナにインストールしました。そして3-3節までで、そのDockerにフロントエンド、バックエンド双方のコンテナを作成しました（それぞれのホームディレクトリでcodeコマンドを実行し、コマンドパレットから「開発コンテナでフォルダを開く」を選択して言語などを選定しました）。この時点でフロントエンド・バックエンド・MySQLの各コンテナが作成されているので、その使い方・見方を解説します。

またこの節の内容は、ハンズオンそのものよりはハンズオンをやり直したり、途中から始める際に必要な知識となっています。アプリケーションの扱いではなくあくまでコンテナの扱いかと切り分けて実施してください。

### 3-5-1 コンテナの状態の確認

DockerはDocker Engine（実際にコンテナを実行する部分）とDocker CLI（コンテナを操作するためのコマンドラインインターフェース）で構成されています。こうしたDockerの機能をGUIから管理可能にしているのが、「Docker Desktop」です。Docker Desktopでは、コンテナとそのイメージの管理を行います。第2章ですでにインストールしているので、デスクトップからDocker Desktopを起動してください。

基本的にコンテナの生成は、VSCodeやデータベースのインスタンスを連携することで自動的に生成されます。図3-5-1の例でわかるようにコンテナが3つランニングしており、1つ目がバックエンドで、2つ目がフロントエンド、3つ目はデータベースのコンテナです。

バックエンド

フロントエンド

MySQL

*図3-5-1 コンテナ一覧*

![](media/image4.png)

次にイメージ（Images）タブ中①をクリックしてみましょう。生成されたコンテナはイメージ（image）として保管されます。「in use」（同図中②）と表示されているものが、実際に使用されているコンテナです。

①

②

*図3-5-2 Dockerのimagesタブ*

![](media/image15.png)

それではコンテナ（Containars）タブ（図3-5-3中①）をクリックしてトップ画面に戻り、MySQLコンテナ（同図中②。例では「app-db-1」）をクリックしてコンテナの詳細画面を確認しましょう。

①

②

*図3-5-3 Dockerメイン画面*

![](media/image9.png)

まず、コンテナ（フロントエンド・バックエンド・MySQL）は、それぞれが1つのサーバーだと考えてください。そのため、起動も終了も個別に管理されています。作業しているとエラーなどでサーバーのログを確認したいことがあることでしょう。その際は、「Logsタブ」を確認すると、MySQLのログが書き込まれています。データベースにエラーが出るときには確認してください。

Logsタブ

*図3-5-4 コンテナのMySQL詳細画面*

![](media/image20.png)

また、コンテナ上にあるサーバーに、直接linuxコマンドを実行したい場合は「Execタブ」からコマンドラインを開くことができます。ここでVSCodeを使わずに直接ファイルの編集なども行えます。

Execタブ

*図3-5-5 DockerのExec（コマンド）画面*

![](media/image1.png)

### 3-5-2 コンテナの起動

停止中のコンテナを起動し、開発環境を再開できるようにしましょう。ハンズオンを連続して行っている時は問題ないのですが、PCの再起動後や、Docker Desktopを終了した後など、コンテナが停止している状態から作業を再開するために必要となります。

#### STEP: Docker Desktopのダッシュボードを開く

#### STEP: Docker Desktopからコンテナを起動する

#### STEP: 起動を確認する

### 3-5-3 コンテナの停止

起動中のコンテナを安全に停止し、リソースの消費を抑える。

なぜ必要なのか？: 作業を中断する際や、PCのシャットダウン前に、不要なリソース消費を防ぐためにコンテナを停止する必要がある。

### 3-5-4 コンテナの削除

本節の目的: 不要になったコンテナを削除し、ディスク容量を解放する。

なぜ必要なのか？: 環境構築をやり直したい場合や、古いコンテナが残っていてディスク容量を圧迫している場合に、コンテナを削除する必要がある。

### 3-5-5 コンテナの再作成

本ハンズオンにおけるコンテナの再作成は、VSCodeを通して行います。

## 3-6 本章のハンズオンチェック

以下の内容を実施できたでしょうか。問題がなければまとめの内容を確認して、次の章に進んでください。

✅ フロントエンド開発のためにNext.jsをインストールしてウェルカムページを表示する

✅ Next.js で開発をするための設定をする

✅ フロントエンド環境をGithubのリポジトリに保存する

✅ バックエンド開発のためにDjangoをインストールしてウェルカムページを表示する

✅ Djangoで開発をするための設定をする

✅ バックエンド環境をGithubのリポジトリに保存する

## 3-7 本章のまとめ

本章では、第2章で構築した開発基盤を土台として、フルスタック開発を本格的に開始するための準備を整えました。特に、フロントエンドとバックエンドそれぞれの開発の主要な作業場所となるVSCodeのセットアップと基本的な使い方、そして開発環境を支えるDockerコンテナの管理方法について深く掘り下げました。

またバックエンドの双方の環境設定、コンテナの構築を通して、コマンドパレット、拡張機能、ターミナル、エディターといったVSCodeの基礎的な使い方を学びました。また、開発環境と、その他の環境のコンテナの設定ファイルの管理の仕方も説明しました。

具体的には、以下の重要なポイントを習得しました。

- **VSCodeの基本操作**: エディター、ターミナル、コマンドパレットといったVSCodeの主要な機能と、それらを効率的に利用する方法を学びました。
- **開発環境のコンテナ構築**: Dockerコンテナを活用し、フロントエンド（Node.js/TypeScript）とバックエンド（Python/Django）のそれぞれ独立した開発環境をVSCode上で構築しました。これにより、安定した開発環境を効率的に準備できるようになりました。
- **パッケージ管理の基礎**: フロントエンドではyarn、バックエンドではpipというパッケージマネージャーを用いて、依存ライブラリの管理を行う方法を学びました。
- **Dockerコンテナの管理と操作**: Docker Desktopを用いて、フロントエンド、バックエンド、データベースの各コンテナの状態（起動・停止）やログ、さらにはコンテナ内部へのコマンド実行など、コンテナを管理・操作する基本的な方法を習得しました。

本章で作成した開発環境は、今後の章で実際にアプリケーションを実装していく上での基盤となります。特に、Dockerによるコンテナ化された開発環境は、環境差異による問題を減らし、チーム開発をスムーズに進める上で非常に有効です。

次章からは、本章で準備したVSCodeとDockerコンテナ環境、そしてその操作方法を活かし、いよいよ本格的なアプリケーション開発へと進んでいきます。本章で学んだ基礎をしっかりと活用し、実践的な開発の楽しさを体験していきましょう。
