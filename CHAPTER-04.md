**※ 旧版に近い構成にいったん戻す**

-   [[対応章無し ※ 6/2まで第4章、コードレベルで大きく変えた版なのでいったん保留]](https://docs.google.com/document/d/1WYYgOu7UQSYBQnucGqZbQOWx0q4l3Scne9rYZE-yk48/edit?usp=sharing)

-   [[第6章 ※ 6/2まで第6(8)章]](https://docs.google.com/document/d/1VuFj4WyWEnUdly1dtXawebtEMxJ5QDPbcpxpjanxVZk/edit?usp=sharing)

-   

第4章

フロントエンドの実装

　第II部の冒頭では、この後の章で作成するアプリケーションの簡単な設計を行いました。第5章では、画面を表示するフロントエンドの実装を行い、フロントエンドの役割とNext.jsについて学んでいきましょう。

4-1 はじめに

　第3章では、フルスタック開発の基盤となるフロントエンド（React、Next.js）、バックエンド（Django、Python）のそれぞれの開発環境を構築し、起動できることを確認しました。本章以降はいよいよシステムの作り込みを行っていきます。まず第4章ではフロントエンドの実装に焦点を絞り、ユーザーが直接触れる画面がどのように作られていくのかを学んでいきます。

1つの動くWebシステムとして実装し、動かしてみることで、仕組みを理解します。

4-1-1 本章の目的と概要

### 本章で達成できること: 

本章のハンズオンを実施すると、Next.jsを使って、Webアプリケーションの基本的な画面を実装できるようになります。具体的には、静的なHTMLだけではない、動的なデータの表示や、そして入力値のチェック（バリデーション）といった、現代のWebアプリケーションに不可欠なフロントエンドの機能を実装します。

4-1-2 開発環境の確認

本章を開始するにあたって、第3章のハンズオンが完了し、以下の環境が整っていることを前提とします。

-   Dockerコンテナ上でNext.jsが動作し、ウェルカムページが表示できること 。

-   Githubにフロントエンドのリポジトリが作成されており、ウェルカムページが表示されるコードまでコミットされていること。

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未設定の箇所があれば3章に戻り、設定を見直してください。

4-1-3 この章からハンズオンを始める場合

2章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませて置いてください。

また、本章から始めたいという方は以下のリポジトリをクローンもしくはフォークして初めて見てください。

\# クローン or フォークコマンド



フォークが完了したら以下の操作でDockerコンテナを立ち上げてみてください。

\# DevContainorの展開

\# npmインストールとNext.jsの起動コマンド



本章以降は読者の理解度に合わせて好きな章からハンズオンを開始することができます。また、学習をはじめからやり直したいときなどご利用ください。

4-1　フロントエンドの実装を始める前に

　いよいよ本格的に実装を進めていきますが、コードを読み解く上で前提になる知識を確認しておきましょう。JavaScriptについて基本的な知識を持っている、という方は読み飛ばしても構いません。

4-1-2 フロントエンドに関する基礎知識

　実装を進める前に、前提知識を押さえておきましょう。[[Next.js]](http://next.js)のベースとなるReactについて学ぶための前提知識として、MozillaではHTML、CSS、JavaScriptが推奨されています[^注4-1]。HTMLとCSSの比重はそれほど大きくないため、JavaScriptだけ振り返っておきます。

### 静的な描画と動的な描画

ああ

![図](media/image16.png){width="14.666666666666666in" height="8.0in"}

### 基本的なフロントエンドの文法を確認する

[^4-1]: 「React を始める」 https://developer.mozilla.org/ja/docs/Learn/Tools\_and\_testing/Client-side\_JavaScript\_frameworks/React\_getting\_started

###### 変数の宣言

　JavaScriptで変数を宣言する方法には、いくつかの種類があります。

・let：再代入可能

・const：再代入不可能

・var：再代入、再宣言可能、基本的に使用しない

###### 関数の宣言

　関数には様々な定義方法があります。本稿では主に次に示す定義方法を使用します。

##### サンプル（実行環境無し）

const 関数名 = (引数) =\> {

// 処理

}



　他にも次のような定義方法があります。

##### サンプル（実行環境無し）

function 関数名(引数) {

// 処理

}



##### サンプル（実行環境無し）

const 関数名 = function(引数) {

// 処理

}



　それぞれの定義方法の違いについても押さえておきましょう。参加するプロジェクトのコーディング規約で使用する関数の形式が決められていたり、使用したい外部ライブラリのソースコードを読んだりする場合は、②～③の定義方法ももちろん使用されているため、知識としては重要です。

　まず定義方法②のfunctionですが、これがJavaScriptにおける、最も基本的な関数の書き方になります。

　次に定義方法③は②の形式の関数を変数に代入し、式として扱っています。これを「名前つき関数」といいます。②との大きな違いはfunctionを左辺に代入していて、式の形になっていることです。変数に代入しているため、次のような違いが生まれます。

・スコープの違い

　　　- 宣言した場所によって、同じファイル内でも参照できる場合とできない場合がある

・使用可能なタイミングの違い

　　　- 宣言した順番によって、代入が済んでいる場合と済んでいない場合がある

　　　- 一般的には「関数の巻き上げ」と表現します

　また定義方法①は、③の右辺をさらに省略表記したものです。これを「アロー関数」といいます。スコープの違いなどもありますが、表記が簡潔になるメリットがあります。本稿ではスコープの扱いがわかりやすくなること、そして表記がシンプルになることから、①を主に使用しています。

###### 他ファイルの使用

　JavaScriptでも他の言語と同様に、他ファイルで定義された関数を使用することができます。まずは使われる側となるエクスポートの書き方です。

##### サンプル（実行環境無し）

export エクスポート対象になるもの

　エクスポートは、前項で紹介したような変数や関数などを対象にすることができます。

##### サンプル（実行環境無し）

// 事前に宣言された機能のエクスポート

export { 関数名1, 関数名2 };

const 関数名1 = (引数) =\> {

// 処理

}

const 関数名2 \...



　次は、上記のエクスポートで定義された対象を使用するインポートの書き方です。

##### サンプル（実行環境無し）

import { インポートしたい変数や関数名 } from "インポートするモジュール"



　エクスポートで変数や関数などを定義できたことと同じように、インポートでも変数や関数を対象にすることができます。

##### サンプル（実行環境無し）

import { 関数名1 } from "関数名1が定義されているファイル名"



　関数の宣言と同じように、インポート／エクスポートには多くの書き方があります。4-1-2項で紹介したdefaultもこの書き方の1つです。

###### 代入

　「=」を用いて、他の言語と同じような代入が可能です。

変数名 = 値

　値には整数やbool値以外に変数そのものや以下のような配列、オブジェクトも使用可能です。

・\[\]：配列初期化子またはリテラル構文

・{}：オブジェクト初期化子またはリテラル構文

　また、分割代入というオブジェクトに対して、ここに値を代入することが可能です。

##### 

##### サンプル（実行環境無し）

let a, b, rest;

\[a, b\] = \[10, 20\];



オブジェクト指向プログラミング

　JavaScriptは、今回バックエンドで取り上げるPythonやJava、C\#といった言語のようにオブジェクト指向プログラミングをサポートしています。そのため、クラスとインスタンス、継承、カプセル化といった実装が可能です。しかし、今回のアプリケーションの実装においてはコードとしては出てこない要素なので、特に解説は行いません。

　また、フロントエンドの要素は次のような関係性になっています（図4-1-1）。

　以降の解説では、機能を実装していく際に、それぞれの機能がどの技術要素に依存するものなのか、あわせて明記していきます。

![図](media/image10.png){width="7.760416666666667in" height="3.875in"}

*図4-1-1　フロントエンドで使用する技術要素の関係図　※旧図の再利用*

TypeScript

　TypeScriptはJavaScriptでも型を管理できるように拡張した言語になります。全ての文法を網羅しようと思うと覚えきれないので本稿に関連する文法を抜粋して紹介します。

　まずは変数の宣言と代入です。

##### サンプル（実行環境無し）

let 変数名1: 変数の型1 = 値1;

const 変数名2: 変数の型2 = 値2;

var 変数名3: 変数の型3 = 値3;



　変数の型には最初から、文字列を表すstringや数値を表すnumericといった基本的な型が用意されています。また、この型のつけ方は変数の宣言時だけでなく関数の引数の型を定義するときでも使うことができます。

##### サンプル（実行環境無し）

const 関数名 = (引数: 引数の型): 戻り値の型 =\> {

// 処理

};



　基本的な型以外を利用したい場合は型エイリアスを使用します。

##### サンプル（実行環境無し）

type 型名 = { 変数名1: 変数の型1; 変数名2: 変数の型2 };



// 利用例

let 変数名: 型名 = { 変数名1: 123, 変数名2: "abc" };



　最後に、少し難しいですがジェネリクスです。ジェネリクスは様々な型を扱える汎用的な型とイメージしてください。本稿では自分でジェネリクスを用いた関数などを定義することはありませんが、ライブラリが提供するジェネリクスを使った関数を使用することはあるため押さえておきましょう。

const 関数名 = \<T\>(引数: T): T =\> {

// 処理

}

// 利用例

let 結果1 = 関数名\<string\>("abc");

let 結果2 = 関数名(123);

　

4-1-4　コミットのタイミングについて

本稿においてコミットのタイミングは章の最後など大きな区切りの時点でしか指示をしません。本稿のハンズオンを実施される方は項の区切りやコードが一通り動作したタイミングなどの任意のタイミングで適宜、コミットを行ってください。

4-2 フロントエンドの全体像

4-2-1 画面の一覧と機能分類

　第II部の冒頭で設計したバックエンドで作成するAPIについて、改めて確認します（表5-2-1）。

**表5-2-1　APIの一覧**

API メソッド URL

-   商品一覧画面 http://localhost:3000/inventory/products/

-   商品詳細画面 http://localhost:3000/inventory/products/\[id\]

-   ログイン画面 http://localhost:3000/login/

-   共通パーツ URLなし

各画面には以下の機能を実装する予定です。

-   商品一覧画面

    -   商品の一覧の表示

    -   商品の登録、更新、削除

-   商品詳細画面

    -   商品の在庫履歴の表示

    -   商品の仕入れ・卸

-   ログイン画面

    -   ログイン

-   共通パーツ

    -   商品一覧への遷移

    -   ログアウト

-   一括アップロード画面（9章）

本章では商品一覧から在庫一覧参照までを実装します。

ログイン関連のAPIは6章、同期処理関連のAPIは8章で実装するので、本章には登場しません。

　数が多いように思われますが、参照・更新の対象としては３つほどです。

4-2-1 フロントエンドの実装の流れ

本節では、まず一般的なHTMLのようなファイルを作成し、そこから徐々にNext.jsの機能を利用した実装に書き換えていきます。もちろん、実際の開発の現場ではいきなりNext.jsらしいコードで実装を進めるでしょう。しかし、本節ではNext.jsの機能や考え方を理解するために、あえてプレーンなコードから始めます。

4-2-2 フロントエンドの実装範囲

第II部のアーキテクチャの解説でも触れた通り、フロントエンドの役割はあくまで画面を表示することです。本書のサンプルアプリケーションでいえば、商品一覧画面と在庫一覧画面、ヘッダーや商品を追加するボタン、また一覧を表示するための表の枠組みの部分などが該当します。

　フロントエンドで商品一覧や在庫一覧を表示するために、具体的なデータを内部で取得してくる処理はバックエンドの役割です。フロントエンドから商品一覧を取得する処理自体は実行されるのですが、データベースから取り出すデータの形式や処理の流れなど、具体的な処理の詳細はバックエンドで実装されています。画面表示に関する処理はフロントエンドの役割、表示するデータに関する処理はバックエンドの役割と分けて考えましょう。

ここでいうデータに関する処理とは、データベースからどうやってデータを取得するか、またどのようにデータを登録・更新するか、さらにアプリケーション特有のバリデーションなども含まれます。このことを念頭において、次の節からさっそく画面を作成していきましょう。

4-2 ベースの作成

　本節では、まず一般的なHTMLのようなファイルを作成し、そこから徐々にNext.jsの機能を利用した実装に書き換えていきます。もちろん、実際の開発の現場ではいきなりNext.jsらしいコードで実装を進めるでしょう。しかし、本節ではNext.jsの機能や考え方を理解するために、あえてプレーンなコードから始めます。

4-2-1 作成対象の確認

　第3章の手順と同じようにUbuntuのフロントエンドのディレクトリ（/usr/local/src/devapp/frontend）から「code .」コマンドを使い、フロントエンドのVSCodeを起動しましょう。

#### STEP: 作業フォルダを作成する

起動ができたら、作業をするためのフォルダを作成していきます。作成場所を間違えないように次のコマンドでカレントディレクトリを確認してみましょう。

```
\$ pwd

/workspaces/app/frontend



　もし上記以外の場所であれば、次のコマンドで移動してください。

```
\$ cd /workspaces/app/frontend



　移動ができたら、作成する在庫管理アプリケーションを機能ごとにまとめるためのディレクトリを作成します。

*図4-2-1　アプリケーションの構成図*

　作成するディレクトリは2つで、1つ目は商品一覧機能と商品在庫機能を実装するためのinventory/

products/\[id\]です。フォルダは階層構造になっておりinventoryとproducts、\[id\]が入れ子の構造になります。そして、もう1つはログイン認証を行うためのloginフォルダです。次のコマンドを実行しましょう。

```
\$ cd app

\$ mkdir -p {inventory/products/\[id\],login}

\$ ls

inventory login......その他のファイル・フォルダ



> **Hint:** Linuxコマンドについて補足
> 
> 　mkdirコマンドはディレクトリを新規に作成するコマンドです。-pでオプションをつけることでサブディレクトリも一括して作成しています。中かっこ「{}」で複数の文字列を囲むことでブレース展開という機能を使って、それぞれについてコマンドが実行されています。これにより一度に複数のフォルダを作成しています。

4-2-2 画面の作成

　ディレクトリが作成できたら、それぞれのディレクトリの中に、最低限の画面表示をするファイルを次のように追加しましょう。

#### Step: 各画面のベースになる空のファイルとフォルダを作成する

空欄の場所で右クリックを押し「新しいファイル\...」を選択する。

![図](media/image2.png){width="2.807292213473316in" height="6.158100393700788in"}

図x-y-z　XXXXXXXXXXXXX

入力ボックスが表示されるので、追加するファイルを相対パスで入力（app/inventory/products/page.tsx）

![図](media/image3.png){width="2.8076279527559054in" height="3.664009186351706in"}

図x-y-z　XXXXXXXXXXXXX

ディレクトリを含めてファイルを作成する。既にディレクトリが存在している場合は、そのディレクトリの階層にファイルが配置される。

![図](media/image7.png){width="2.803505030621172in" height="4.549083552055993in"}

図x-y-z　XXXXXXXXXXXXX

第4章で行った手順と同様に、VSCodeの左のウィンドウ、エクスプローラーにあるproductsフォルダを右クリックして、「新しいファイル」を選択し、page.tsxファイルを作成してください。\[id\]やloginフォルダでも同じようにファイルを作成します。これで準備は完了です。

#### Step: 各画面のベースになるファイルを作成する

今度はそれぞれの空のファイルに最低限の画面の実装をしていきます。

```

export default function Page() {

return (

\<div\>

\<h2\>商品一覧\</h2\>

\<p\>商品の一覧を表示\</p\>

\</div\>

);

}



```

export default function Page() {

return (

\<div\>

\<h2\>商品在庫管理\</h2\>

\<p\>商品在庫の一覧を表示する\</p\>

\</div\>

);

}



```

export default function Page() {

return (

\<div\>

\<h2\>ログイン\</h2\>

\<p\>ログインの入力項目を表示する\</p\>

\</div\>

);

}



#### Step: デザインに関する設定を削除する

最低限の見た目で進めたいので、いったんスタイルシートというデザインに関する設定の内容を削除してください。

★★★

globals.cssの設定

90Pの内容（golbals.css を無効化する記述）を転記

**Frontend** app/globals.css





★★★

#### Step: 作成したベースの画面をブラウザで表示する

アプリケーションを起動

**Frontend** *Terminal*

yarn run dev



　この状態で画面を表示してみましょう。それぞれ以下のURLで画面が表示されるはずです。

・http://localhost:3000/inventory/products

・http://localhost:3000/inventory/products/1

・http://localhost:3000/login

*図4-2-2　商品在庫画面*

　うまく表示されたでしょうか。もし画面が表示されなかった場合は、コードの内容が正しいかどうか、またサーバーが起動しているかどうかを確認してください。このpageファイル一つ一つが、URLの表示内容に対応しています。

### pageファイル

また、このpageファイルはReactコンポーネントになります。Reactコンポーネントとはマークアップ、CSS、JavaScriptを組み合わせたひとまとまりの要素で、アプリケーションで再利用可能な部品になっています。

```

 \<div\>

\<h2\>商品在庫管理\</h2\>

\<p\>商品在庫の一覧を表示する\</p\>

\</div\>



　なぜこの画面は\<h2\>タグと\<p\>タグを並列で記載するのではなく、一番外側を\<div\>タグで囲んであるのでしょうか。試しに以下のような記述にしてみましょう。

```
 \<h2\>商品在庫管理\</h2\>

\<p\>商品在庫の一覧を表示する\</p\>



　すると、図4-2-3のような画面が表示されます。

*図4-2-3　商品一覧画面*

　これはReactのJSXのreturnでは1つの要素しか返してはいけないというルールがあるためです。しかし\<div\>タグで囲ってしまうとコンポーネントの分だけネストが深くなってしまい余分な記述が増えてしまいます。そのためReactではこれは以下のように空のタグ\<\>を記載して、余分な\<div\>タグを省略しています。

```
 \<\>

\<h2\>商品在庫管理\</h2\>

\<p\>商品在庫の一覧を表示する\</p\>

\</\>



　これにより描画時に余分なネストが減るため、構造を把握しやすくなります。

　ここまでで実装する機能のベースとなる、最低限の画面を作成しました。次の節からは、各画面についてデータの一覧表示や各種ボタンの追加など肉づけをしていきましょう。

作業分をリポジトリに反映する記述を入れるなら以下のコマンド

以前の状態から変更のあったファイルを一覧を確認

git status

*message*

Untracked files:

(use "git add \<file\>\..." to include in what will be committed)

app/inventory/

app/login/



ステージに追加

git add .



ステージに追加されていることを確認

git status

*message*

Changes to be committed:

(use "git restore \--staged \<file\>\..." to unstage)

new file: app/inventory/products/\[id\]/page.tsx

new file: app/inventory/products/page.tsx

new file: app/login/page.tsx



問題がなければ、git commit または vscode のソース管理でリポジトリに反映させる。（手順は前回の章を参照）

4-3 商品一覧画面の作成

4-3-1 モックアップ

　では始めに、商品一覧画面から用意していきましょう。APIの処理は一旦置いておいて、画面のイメージを先に作っていきます（コード4-3-1）。

　この一覧画面では以下のことが可能です。

・商品一覧の閲覧

・商品の登録・更新・削除

#### Step: 商品一覧のモックアップを作成する

基本的な画面のベースができたところで、次は各画面の見た目を整えていきましょう。この段階ではデータはダミーなので、見た目だけを確認できるように適当なデータをそのまま商品一覧のファイルの中に記載しています。

```

export default function Page() {

return (

\<\>

\<h2\>商品一覧\</h2\>

\<button type="button"\>商品を追加する\</button\>

\<table\>

\<thead\>

\<tr\>

\<th\>商品ID\</th\>

\<th\>商品名\</th\>

\<th\>単価\</th\>

\<th\>説明\</th\>

\<th /\>

\</tr\>

\</thead\>

\<tbody\>

\<tr\>

\<td\>1\</td\>

\<td\>コットン100％バックリボンティアードワンピース（黒）\</td\>

\<td\>6900\</td\>

\<td\>

大人の愛らしさを引き立てる、ナチュラルな風合い。リラックス×トレンドを楽しめる、上品なティアードワンピース。

\</td\>

\<td\>

\<button type="button"\>更新・削除\</button\>

\</td\>

\</tr\>

\<tr\>

\<td\>2\</td\>

\<td\>ライトストレッチカットソー（ネイビー）\</td\>

\<td\>2980\</td\>

\<td\>

しなやかな肌触りが心地よい、程よいフィット感のカットソー。ビジネスカジュアルにも普段使いにも使える、ベーシックなデザイン。

\</td\>

\<td\>

\<button type="button"\>更新・削除\</button\>

\</td\>

\</tr\>

\<tr\>

\<td\>3\</td\>

\<td\>ベルト付きデニムパンツ（ブルー）\</td\>

\<td\>5980\</td\>

\<td\>

定番のデニムパンツに、フェミニンなベルトをプラスしたスタイリッシュなアイテム。カジュアルにもきれいめにも合わせやすい。

\</td\>

\<td\>

\<button type="button"\>更新・削除\</button\>

\</td\>

\</tr\>

\</tbody\>

\</table\>

\</\>

);

}



#### Step: 作成したベースの画面をブラウザで表示する

　http://localhost:3000/inventory/productsにアクセスすると次の画面が表示されます（図4-3-1）。ここから徐々にNext.jsを使ったコードに書き換えていきましょう。

*図4-3-1　商品一覧の表示例*

4-X React で登場する重要な用語

ここからコードに書いた内容をそのまま表示する静的描画ないようから、ユーザーのイベントに合わせて描画を変える動的描画の仕組みを実装していきます。その際にReactでは以下の２つの重要な用語があるので、覚えておきましょう。

1.  コンポーネント：画面を構成する部品をコンポーネントと呼びます。

2.  フック：「状態の管理」や「外部との連携」といった特別な機能をコンポーネントに追加する仕組み

まずはコンポーネントについて深堀りしてみましょう。コンポーネントには、大きく分けて以下の2つの役割を持っています。

-   見た目の表示: HTMLのような画面の要素を表示する役割。

-   状態（データ）の管理: ユーザーの操作や時間の経過によって変化するデータ（例：「ボタンが何回押されたか」「入力フォームに何が書かれているか」）を管理する役割。

ただしこの「状態の管理」をコンポーネントで表現することは難しく、コードが複雑になりがちでした。そのため、Hooks（フック）という仕組みが用意されています。これにより「状態の管理」や「外部との連携」といった特別な機能を、シンプルな関数コンポーネントに追加して管理することができます。

この２点を踏まえて実装に進んでみましょう。

4-3-2 動的描画の導入

　まずはデータを動的に読み込むようにします。Reactにはstateというユーザーのイベントに合わせて値を更新する機能があります。このstateにイベントを紐づけるための接続の役割をするものがhookです。

#### Step: 商品一覧のデータを動的に読み込ませるデータを作成する

dataの内容となるjsonファイルの内容は先ほどの出力内容と同じものを用意します（コード4-3-3）。

```

\[

{

"id": 1,

"name": "コットン100％バックリボンティアードワンピース（黒）",

"price": 6900,

"description": "大人の愛らしさを引き立てる、ナチュラルな風合い。リラックス×トレンドを楽しめる、上品なティアードワンピース。"

},

{

"id": 2,

"name": "ライトストレッチカットソー（ネイビー）",

"price": 2980,

"description": "しなやかな肌触りが心地よい、程よいフィット感のカットソー。ビジネスカジュアルにも普段使いにも使える、ベーシックなデザイン。"

},

{

"id": 3,

"name": "ベルト付きデニムパンツ（ブルー）",

"price": 5980,

"description": "定番のデニムパンツに、フェミニンなベルトをプラスしたスタイリッシュなアイテム。カジュアルにもきれいめにも合わせやすい。"

}

\]



#### Step: 商品一覧のデータを動的に読み込ませる

まずは、商品情報が表示されるデータ部分をuseStateとuseEffectというReactのビルトインのhookを使って動的に読み込むように書き換えてみましょう（コード4-3-2）。

　React組み込みのhookは他にもuseContextやuseRef、useMemo/useCallback、useReducerなどがありますが、本アプリでは使用しません。この節ではバックエンドとの通信はしないのでひとまずjsonファイルから読み込む形に変更します。

```

"use client";

import { useEffect, useState } from "react";

import productsData from "./sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

export default function Page() {

// 読込データを保持

const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);

useEffect(() =\> {

setData(productsData as ProductData\[\]);

}, \[\]);

return (

\<\>

\<h2\>商品一覧\</h2\>

\<button type="button"\>商品を追加する\</button\>

\<table\>

\<thead\>

\<tr\>

\<th\>商品ID\</th\>

\<th\>商品名\</th\>

\<th\>単価\</th\>

\<th\>説明\</th\>

\<th /\>

\</tr\>

\</thead\>

\<tbody\>

{data.map((data: ProductData) =\> (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>{data.name}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.description}\</td\>

\<td\>

\<button type="button"\>更新・削除\</button\>

\</td\>

\</tr\>

))}

\</tbody\>

\</table\>

\</\>

);

}



　❶では「export default function Page() {」の前後に、ステートを管理する処理と読込対象のjsonファイルを追加しています。❷では一つ一つ記載していた商品の情報を全て削除し、代わりに商品の一覧情報を持つdataという変数を繰り返し取り出すコードを追記しています。

TODO: つなぎの説明をいれること

#### Step: データを画面をブラウザで表示する

　画面を表示すると、先ほどと同じ画面が表示されます。ただ、これだけではjsonファイルから読み込まれた結果なのか判別がつかないので、jsonファイルの内容を追加して確かめてみましょう。"id": 1～3と同様に、"id": 4を定義します（コード4-3-4）。

```

\[

{

"id": 1,

"name": "コットン100％バックリボンティアードワンピース（黒）",

"price": 6900,

"description": "大人の愛らしさを引き立てる、ナチュラルな風合い。リラックス×トレンドを楽しめる、上品なティアードワンピース。"

},

{

"id": 2,

"name": "ライトストレッチカットソー（ネイビー）",

"price": 2980,

"description": "しなやかな肌触りが心地よい、程よいフィット感のカットソー。ビジネスカジュアルにも普段使いにも使える、ベーシックなデザイン。"

},

{

"id": 3,

"name": "ベルト付きデニムパンツ（ブルー）",

"price": 5980,

"description": "定番のデニムパンツに、フェミニンなベルトをプラスしたスタイリッシュなアイテム。カジュアルにもきれいめにも合わせやすい。"

},

{

"id": 4,

"name": "レースフレアスカート（ホワイト）",

"price": 4980,

"description": "エレガントな雰囲気を醸し出すレーススカート。裏地付きで透け感も抑えられ、通年使えるおすすめアイテム。"

}

\]



#### Step: 読込データを変更した画面をブラウザで表示する

　画面にも先ほど追加した内容が追加されたでしょうか（図4-3-2）。

　[[http://localhost:3000/inventory/products]](http://localhost:3000/inventory/products)

*図4-3-2　商品一覧の表示例*

### （解説に相当する小見出し）動的な操作を実現するuseStateとは

　商品データは追加や削除などの処理で常にデータの状態が更新されていきます。この状態の変化を画面に反映するためにuseStateによって管理しています。

##### サンプル

const \[変数, 変数の状態を更新する関数\] = useState\<型\>(初期値);



今回はdataという商品を表す変数に、setDataという商品一覧を設定するための関数をuseStateにセットしました。

##### サンプル

 const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);



　本アプリケーションでは変数はdata、変数の状態を更新する関数はsetData、初期値として空の配列を与えています。setDataでデータが更新されたときに、初めて商品一覧が画面に表示されるという流れになっています。

![図](media/image9.png){width="14.666666666666666in" height="8.0in"}

　では、setData()はどこで呼んでいるのかというと、useEffectで呼んでいます。useEffectは以下のような構成になっています。

##### サンプル



useEffect(() =\> {

セットアップコードを含むセットアップ関数

return () =\> {

クリーンナップコードを含むクリーンナップ関数

};

}, 依存関係);



　まずuseEffectを含むコンポーネントがページに追加されると、セットアップ関数が実行されます。次に、依存関係が更新されるとコンポーネントが再レンダリングされます。その際、クリーンナップ関数が古いpropsとstateで実行されます。その後セットアップ関数が新しいpropsとstateで実行されます。最後にコンポーネントがページから削除された後、クリーンナップ関数が実行されます。図示すると図4-3-3のような流れになります。

![図](media/image18.png){width="6.645833333333333in" height="7.302083333333333in"}

*図4-3-3　描画のサイクル*

　この流れを今回の商品データに当てはめると次のようになります。

##### サンプル

useEffect(() =\> {

setData(productsData); // セットアップ関数

// クリーンナップ関数はなし

}

, \[\] // 依存関係はなし

)



　つまり、コンポーネントが追加されたタイミングでセットアップ関数であるsetData()が一度だけ実行されるようになります。

　この例では、バックエンドに一方的にリクエストを送るため、セットアップ関数のみしか実装していません。しかし、外部サーバーとコネクションを確立する場合やモーダルダイアログを制御する際などクリーンナップ関数や依存関係が必要になってくるケースはあります。

4-3-3 use client

　Next.js 13ではデフォルトがサーバーサイドレンダリングを行う設定になっています。しかし、ユーザー操作のイベントによって画面の値を更新するなど、依然クライアント側で行う処理もあるのでクライアントサイドレンダリングも必要になります。その場合は、use clientを使用してクライアントサイドレンダリングを行うことをファイルの先頭で宣言しておきます。

　ここまで詳しく説明はしていませんでしたが、Next.jsにはサーバーサイドレンダリングとクライアントサイドレンダリングの2種類があります。

![図](media/image15.png){width="8.416666666666666in" height="7.364583333333333in"}

*図4-3-4　クライアントサイドレンダリングの挙動　※旧図の再利用*

4-3-4 ルーティング

　外部から取得した商品データを表示することができたので、次は商品を選択して詳細画面に遷移できるようにしましょう。

#### STEP: 商品一覧に詳細画面へのリンクを追加する

次のようにコードを修正してください（コード4-3-5）。

##### 

```

"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import productsData from "./sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

export default function Page() {

// 読込データを保持

const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);

useEffect(() =\> {

setData(productsData as ProductData\[\]);

}, \[\]);

return (

\<\>

\<h2\>商品一覧\</h2\>

\<button type="button"\>商品を追加する\</button\>

\<table\>

\<thead\>

\<tr\>

\<th\>商品ID\</th\>

\<th\>商品名\</th\>

\<th\>単価\</th\>

\<th\>説明\</th\>

\<th /\>

\<th /\>

\</tr\>

\</thead\>

\<tbody\>

{data.map((data: ProductData) =\> (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>{data.name}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.description}\</td\>

\<td\>

\<Link href={\`/inventory/products/\${data.id}\`}\>在庫処理\</Link\>

\</td\>

\<td\>

\<button type="button"\>更新・削除\</button\>

\</td\>

\</tr\>

))}

\</tbody\>

\</table\>

\</\>

);

}



　図4-3-5のように、在庫処理ラベルが表示されました。

*図4-3-5　商品一覧の表示例*

#### Step: 一覧から詳細画面への遷移を確認する

　在庫処理ラベルをクリックしてください。図4-3-6のように、商品在庫管理画面に遷移できるようになったはずです。

*図4-3-6　商品在庫の表示例*

### 画面とURLの紐づけを実現するルーティングとは

まずこのルーティングとは何でしょうか。フロントエンドにおけるルーティングはユーザーが特定のアドレス（URL）にアクセスしたとき、そのアドレスに対応した画面表示や遷移を行う仕組みを指します。

本稿では以下の３つの役割を実現します。

  役割の分類                   詳細                                                                                                                                                               例
    
  アドレスと画面のマッピング   ユーザーがブラウザに入力したURL（アドレス）と、そのアドレスで表示すべき画面（コンポーネント）を結びつけます。                                                      ユーザーが http://example.com/item にアクセスしたら、「在庫一覧画面」を表示する。
  データの抽出                 URLに含まれる特定の情報（IDなど）を抽出して、プログラムに渡します。                                                                                                http://example.com/item/A001 のURLから、商品IDである A001 を抜き出す。
  ページの遷移管理             アプリケーション内で「戻る」「進む」といった画面間の遷移を制御します。フロントエンドのルーティングでは、ページの再読み込みなしで画面を切り替える役割も担います。   ユーザーが「登録」ボタンを押したときに、item/register のURLにスムーズに画面を切り替える。

このルーティングにはルートの定義と使用するタグの2つのポイントがあります。第4章でも少し触れましたが、振り返りつつ詳しく見ていきましょう。

　まずはルーティングについてです。第4章で述べた通り、Next.jsではフォルダを使用してルートを定義します。各フォルダは、URLセグメントにマップされるルートセグメントを表します。今回の在庫管理アプリケーションだと図4-3-7のようになります。

### ルートディレクトリ

localhost:3000/inventory/products

![図](media/image5.png){width="4.9375in" height="6.15625in"}

*図4-3-7　ルーティングの状況*

　ルートになるappフォルダの直下にあるinventoryフォルダが、そのままURLの1つのセグメントになっています。またinventoryフォルダ配下のproductsフォルダがURLのinventory以降のセグメントになっています。

### [[Next.js]](http://next.js)のファイルシステムルーティングの仕組み

[[Next.js]](http://next.js)で特長なのは、ファイルの配置場所とファイル名が、そのままWebアプリケーションのURLになるという仕組みになっている点です。これを「ファイルシステムベースルーティング」と呼びます。

近年のフレームワークではURLと画面のルーティングを別の設定ファイルなどに切り分けて管理をしていました。一つのファイルに集まっていることで見通しがよい一方で、いちいちURLと画面を紐づけなければいけないなど手間がかかる側面もありました。

一方でこの「ファイルシステムベースルーティング」では、ファイルを作成するだけでルーティングが実現するため設定の手間がなくなりました。またフォルダ構造がそのままURLの構造をとなるため、ルーティングのルールさへ押さえておけば対応関係がわかるようになっており、全体構造が把握しやすくなりました。

コラム開始＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

先ほどのルーティングについて詳細な動作を確認してみましょう。これはハンズオンとは直接関係のないコードになるため実行後は削除してください。また実施せずに読むだけでも大丈夫です。

ではフォルダ追加を用いてルーティングがどういう挙動をしているのか確認してみましょう。

#### Step: ルーティングを理解するためのサンプルフォルダを追加する

　このようにルート以下のフォルダの階層構造がそのままURLの構造に反映されます。こういったルーティング形式をファイルシステムベースルーティングと呼びます。今度は、app配下にrooting\_testフォルダを作成して、http://localhost:3000/rooting\_testにアクセスしてみてください。

404になったはずです。これはrooting\_test内にはpage.tsxファイルが存在しておらず、アクセスするためのページが生成されなかったためです。

*図4-3-8　存在しないURLにアクセスしたときの表示例*

　URLはフォルダ構成で決まりますが、表示できるページがあるかどうかはpage.tsxの有無で決まります。

#### Step: ルーティングを理解するためのサンプルURLにアクセスする

　では、先ほど追加したsampleフォルダはどうなるでしょうか。http://localhost:3000/inventory/products/sampleにアクセスして確認してみましょう。商品在庫管理のページが開かれます。

フォルダ内にpage.tsxがないのに、どうして開くことができたのでしょうか。少し考えてみましょう。

これは\[id\]という動的ルーティングが有効になるフォルダが同じ階層にあったため、sample配下ではなく\[id\]フォルダ配下のpage.tsxでページが表示されたためです。

　このようにNext.jsではディレクトリ構成によってルーティングが自動的に行われています。

![図](media/image6.png){width="4.71875in" height="5.489583333333333in"}

*図4-3-9　URLとフォルダ構成の関係図*

コラム終了＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

4-3-5 ビルトインコンポーネント

　次のポイントはLinkタグです。Next.jsでは画像やリンクなどを表示する環境によって最適なビルトインコンポーネントを提供しています。これにより、アプリケーションの速度の向上などユーザーエクスペリエンスが向上します。

　本アプリケーションではLinkタグを使用しています。見かけの動き自体はHTMLの\<a\>タグと変わりません。大きく異なる点として、指定された遷移先の情報を先に読み込んで、実際に遷移する際に素早く移動できるようになっていることが挙げられます。こういった先に読み込む動作をプリフェッチといいます。

　Next.jsのビルトインコンポーネントにはアプリケーションの動作を改善するような機能が組み込まれています。またページの遷移については、Link以外にuseRouterという機能でも管理することができます。Next.jsの公式では、特別な理由がない限りLinkでの遷移を推奨しているため、本アプリケーションでもLinkを使用しています。ユーザー認証などイベントの結果によって遷移先を振り分ける場合は利用を検討してもよいでしょう。ログイン機能の解説部分で、改めて取り上げます。

　今回説明したのはNext.js 13の基本的なルーティングの考え方についてです。12とは異なるルーティング形式になっているため、調べる際にはバージョンによく注意してください。また、ビルトインコンポーネントはLink以外にもImageやHeadなども提供されています。

4-3-6 登録イベントの追加

　商品を追加するボタンがクリックされた際に、登録用の入力フォームが表示されるようにします。

#### Step: 商品一覧に登録用の行を追加する

```

"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import productsData from "./sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

export default function Page() {

// 読込データを保持

const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);

useEffect(() =\> {

setData(productsData as ProductData\[\]);

}, \[\]);

// 新規登録処理、新規登録行の表示状態を保持

const \[shownNewRow, setShownNewRow\] = useState(false);

const handleShowNewRow = () =\> {

setShownNewRow(true);

};

const handleAddCancel = () =\> {

setShownNewRow(false);

};

const handleAdd = () =\> {

// TODO: バックエンドを使用した登録処理を呼ぶ

setShownNewRow(false);

};

return (

\<\>

\<h2\>商品一覧\</h2\>

\<button type="button" onClick={handleShowNewRow}\>

商品を追加する

\</button\>

\<table\>

\<thead\>

\<tr\>

\<th\>商品ID\</th\>

\<th\>商品名\</th\>

\<th\>単価\</th\>

\<th\>説明\</th\>

\<th /\>

\<th /\>

\</tr\>

\</thead\>

\<tbody\>

{shownNewRow ? (

\<tr\>

\<td /\>

\<td\>

\<input type="text" /\>

\</td\>

\<td\>

\<input type="number" /\>

\</td\>

\<td\>

\<input type="text" /\>

\</td\>

\<td /\>

\<td\>

\<button type="button" onClick={handleAddCancel}\>

キャンセル

\</button\>

\<button type="button" onClick={handleAdd}\>

登録する

\</button\>

\</td\>

\</tr\>

) : null}

{data.map((data: ProductData) =\> (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>{data.name}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.description}\</td\>

\<td\>

\<Link href={\`/inventory/products/\${data.id}\`}\>在庫処理\</Link\>

\</td\>

\<td\>

\<button type="button"\>更新・削除\</button\>

\</td\>

\</tr\>

))}

\</tbody\>

\</table\>

\</\>

);

}



#### Step: 「商品を追加する」ボタンをクリックして新規登録行を表示する

　❸の「商品を追加する」ボタンをクリックすると、❶で追加した新規登録行の表示状態を管理するshownNewRowがhandleShowNewRowメソッド内でtrueに更新されます。そして❷でshown

NewRowの値によって表示する内容を切り替えています。その際、三項演算子というif文を代替する構文を用いています。

shownNewRow ? ( 新規登録をするための追加行 ) : ""

条件 ? 条件がtrueだった場合 : 条件がfalseだった場合;

#### Step: 「キャンセル」または「登録する」ボタンをクリックして新規登録行を非表示にする

　これにより、商品を追加するボタンを押下したときには、shownNewRowにtrue、キャンセルと登録するボタンを押下したときはshownNewRowにfalseを渡して、入力フォームの表示・非表示を切り替えています。また❷ではキャンセルボタンと登録ボタンも追加しており、ここからはshown

NewRowにfalseをセットするメソッドを呼び出しています。

*図4-3-10　商品一覧の表示例*

### onClickイベントとは

　また、ここで少々違和感を覚える箇所がありますね。

```
\<button onClick={ handleShowNewRow }\>商品を追加する\</button\>

　このonClickは、JavaScriptであれば、全て小文字のonclickになるはずです。実はこれはReactのクリック時のイベントで、JavaScriptと異なり、必ずcamelCase[^注4-2]で名づけられているのです。

[^4-2]: 最初の単語を小文字にして、以降の単語を大文字始まりでつなげる命名記法をcamelCaseといいます。

4-3-7 更新・削除イベントの追加

　登録処理と同じ要領で、更新ボタンをクリックしたらラベルが入力フィールドに変わるようにします（コード4-3-7）。

#### Step: 商品一覧の表示用の行を更新行に切り替える

```

"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import productsData from "./sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

export default function Page() {

// 読込データを保持

const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);

useEffect(() =\> {

setData(productsData as ProductData\[\]);

}, \[\]);

// 新規登録処理、新規登録行の表示状態を保持

const \[shownNewRow, setShownNewRow\] = useState(false);

const handleShowNewRow = () =\> {

setShownNewRow(true);

};

const handleAddCancel = () =\> {

setShownNewRow(false);

};

const handleAdd = () =\> {

// TODO: バックエンドを使用した登録処理を呼ぶ

setShownNewRow(false);

};

// 更新・削除処理、更新・削除行の表示状態を保持

const \[editingRow, setEditingRow\] = useState\<number \| null\>(null);

const handleEditRow = (id: number) =\> {

setShownNewRow(false);

setEditingRow(id);

};

const handleEditCancel = (id: number) =\> {

setEditingRow(null);

};

const handleEdit = (id: number) =\> {

// TODO: バックエンドを使用した更新処理を呼ぶ

setEditingRow(null);

};

const handleDelete = (id: number) =\> {

setEditingRow(null);

};

return (

\<\>

\<h2\>商品一覧\</h2\>

\<button type="button" onClick={handleShowNewRow}\>

商品を追加する

\</button\>

\<table\>

\<thead\>

\<tr\>

\<th\>商品ID\</th\>

\<th\>商品名\</th\>

\<th\>単価\</th\>

\<th\>説明\</th\>

\<th /\>

\<th /\>

\</tr\>

\</thead\>

\<tbody\>

{shownNewRow ? (

\<tr\>

\<td /\>

\<td\>

\<input type="text" /\>

\</td\>

\<td\>

\<input type="number" /\>

\</td\>

\<td\>

\<input type="text" /\>

\</td\>

\<td /\>

\<td\>

\<button type="button" onClick={handleAddCancel}\>

キャンセル

\</button\>

\<button type="button" onClick={handleAdd}\>

登録する

\</button\>

\</td\>

\</tr\>

) : null}

{data.map((data: ProductData) =\>

editingRow === data.id ? (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>

\<input type="text" defaultValue={data.name} /\>

\</td\>

\<td\>

\<input type="number" defaultValue={data.price} /\>

\</td\>

\<td\>

\<input type="text" defaultValue={data.description} /\>

\</td\>

\<td /\>

\<td\>

\<button

type="button"

onClick={handleEditCancel(data.id)}

\>

キャンセル

\</button\>

\<button type="button" onClick={handleEdit(data.id)}\>

更新する

\</button\>

\<button type="button" onClick={handleDelete(data.id)}\>

削除する

\</button\>

\</td\>

\</tr\>

) : (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>{data.name}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.description}\</td\>

\<td\>

\<Link href={\`/inventory/products/\${data.id}\`}\>在庫処理\</Link\>

\</td\>

\<td\>

\<button type="button" onClick={handleEditRow(data.id)}\>

更新・削除

\</button\>

\</td\>

\</tr\>

),

)}

\</tbody\>

\</table\>

\</\>

);

}



#### Step: 更新ボタンをクリックし、表示行を更新行に切り替える

　さっそく画面を確認してみましょう。次のような画面が表示されます（図4-3-11）。

[[http://localhost:3000/inventory/products]](http://localhost:3000/inventory/products)

Unhandled Runtime Error

Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.



*図4-3-11　商品一覧の表示例*

#### Step: 「キャンセル」または「登録する」、「削除する」ボタンをクリックして更新行を表示行にする

// TODO: 検証の文章を追加する

　これは第4章の図4-1-8でも発生した、「Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.」というエラーです。あちらのケースではステートを変更するためのsetData()がPage()の直下に記載されていたために、レンダリングの無限ループが発生していました。今回の原因は何でしょうか。実はsetEditingRowが実行されるhandleEditRowの呼び出し方が原因です。onClick={handleEditRow(data.id)}の処理はクリック時ではなく、Buttonコンポーネントがレンダリングされたときに実行されているのです。

### レンダリング

　詳細についてはコラムの「レンダリングイベント」を確認してください。

#### Step: クリックイベントに関数を渡す

関数そのものを渡すため、追加した❷のコードの関数を呼び出す箇所を次のように修正します（コード4-3-10）。

```

"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import productsData from "./sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

export default function Page() {

// 読込データを保持

const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);

useEffect(() =\> {

setData(productsData as ProductData\[\]);

}, \[\]);

// 新規登録処理、新規登録行の表示状態を保持

const \[shownNewRow, setShownNewRow\] = useState(false);

const handleShowNewRow = () =\> {

setShownNewRow(true);

};

const handleAddCancel = () =\> {

setShownNewRow(false);

};

const handleAdd = () =\> {

// TODO: バックエンドを使用した登録処理を呼ぶ

setShownNewRow(false);

};

// 更新・削除処理、更新・削除行の表示状態を保持

const \[editingRow, setEditingRow\] = useState\<number \| null\>(null);

const handleEditRow = (id: number) =\> {

setShownNewRow(false);

setEditingRow(id);

};

const handleEditCancel = (id: number) =\> {

setEditingRow(null);

};

const handleEdit = (id: number) =\> {

// TODO: バックエンドを使用した更新処理を呼ぶ

setEditingRow(null);

};

const handleDelete = (id: number) =\> {

setEditingRow(null);

};

return (

\<\>

\<h2\>商品一覧\</h2\>

\<button type="button" onClick={handleShowNewRow}\>

商品を追加する

\</button\>

\<table\>

\<thead\>

\<tr\>

\<th\>商品ID\</th\>

\<th\>商品名\</th\>

\<th\>単価\</th\>

\<th\>説明\</th\>

\<th /\>

\<th /\>

\</tr\>

\</thead\>

\<tbody\>

{shownNewRow ? (

\<tr\>

\<td /\>

\<td\>

\<input type="text" /\>

\</td\>

\<td\>

\<input type="number" /\>

\</td\>

\<td\>

\<input type="text" /\>

\</td\>

\<td /\>

\<td\>

\<button type="button" onClick={handleAddCancel}\>

キャンセル

\</button\>

\<button type="button" onClick={handleAdd}\>

登録する

\</button\>

\</td\>

\</tr\>

) : null}

{data.map((data: ProductData) =\>

editingRow === data.id ? (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>

\<input type="text" defaultValue={data.name} /\>

\</td\>

\<td\>

\<input type="number" defaultValue={data.price} /\>

\</td\>

\<td\>

\<input type="text" defaultValue={data.description} /\>

\</td\>

\<td /\>

\<td\>

\<button

type="button"

onClick={() =\> handleEditCancel(data.id)}

\>

キャンセル

\</button\>

\<button type="button" onClick={() =\> handleEdit(data.id)}\>

更新する

\</button\>

\<button type="button" onClick={() =\> handleDelete(data.id)}\>

削除する

\</button\>

\</td\>

\</tr\>

) : (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>{data.name}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.description}\</td\>

\<td\>

\<Link href={\`/inventory/products/\${data.id}\`}\>在庫処理\</Link\>

\</td\>

\<td\>

\<button type="button" onClick={() =\> handleEditRow(data.id)}\>

更新・削除

\</button\>

\</td\>

\</tr\>

),

)}

\</tbody\>

\</table\>

\</\>

);

}



　これで画面が表示できるようになりました。

#### Step: 更新ボタンをクリックし、表示行を更新行に切り替える

ではコードの処理の内容を見てみましょう。まず、❸で追加したonClickから呼ばれる❶のhandleEditによって、useStateで定義したeditingRowに編集したい行のidがセットされます。次に❷の三項演算子の箇所によって、更新されたeditingRowと同じidを持つ行は入力欄を持つ行に書き換わります。実際にクリックしてフォームが切り替わることを確認してみてください。

コラム開始＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

### レンダリングイベント

先ほどのレンダリングイベントについて詳細な動作を確認してみましょう。これはハンズオンとは直接関係のないコードになるため実行後は削除してください。また実施せずに読むだけでも大丈夫です。

ではアラートダイアログを用いてレンダリングイベントがどういう挙動をしているのか確認してみましょう。

#### STEP: アラートダイアログを表示する

在庫管理アプリケーションのコードから離れ、次のコードを作成してみてください（コード4-3-8）。

```

"use client";

export default function Page() {

const showDialog = () =\> {

alert("アラート");

};

return (

\<div\>

\<button onClick={showDialog()}\>Click\</button\>

\</div\>

);

}



#### Step: アラートダイアログをブラウザで表示する

　ブラウザで http://localhost:3000/sample\_usestate を表示するとClickボタンを押下する前にダイアログが表示されます（図4-3-12）。

*図4-3-12　レンダリングの動きを理解するためのサンプルコードの表示例*

#### Step: アラートダイアログがブラウザで表示されないことを確認する

　今度はButtonコンポーネントを削除して画面を表示してみましょう。

"use client";

export default function Page() {

const showDialog = () =\> {

alert("アラート");

};

return \<div/\>;

}



　ダイアログは表示されませんでした。この例からButtonコンポーネントの描画時にonClickに渡した関数が実行されていたことがわかります。

　余談になりますが、この例ではダイアログが2回表示されました。これは開発環境だけで実施されるReactのstrictモードによる動作です。このモードにより1回の描画では気づけないコンポーネントのバグを検知し、警告してくれます。

　では、在庫管理アプリケーションのコードに戻りましょう。これは関数そのものではなく、関数の実行結果がonClickに渡されているためです。そのため、今回のようにstateを更新する関数を渡すと、stateの更新が画面表示時に実行され、再レンダリングされ、再度stateが更新され......と無限ループが発生します。

コラム終了＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

4-3-8 入力値のformデータへの反映

　次は各イベントに入力した値を渡して、formデータとしてバックエンドに渡せるようにしましょう（コード4-3-11）。

#### Step: 入力した値を登録データにまとめる

```

"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import productsData from "./sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

type InputData = {

id: string;

name: string;

price: string;

description: string;

};

export default function Page() {

// 読込データを保持

const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);

useEffect(() =\> {

setData(productsData as ProductData\[\]);

}, \[\]);

// 登録データを保持

const \[input, setInput\] = useState\<InputData\>({

id: "",

name: "",

price: "",

description: "",

});

// 登録データの値を更新

const handleInput = (event: React.ChangeEvent\<HTMLInputElement\>) =\> {

const { value, name } = event.target;

setInput({ \...input, \[name\]: value });

};

// 新規登録処理、新規登録行の表示状態を保持

const \[shownNewRow, setShownNewRow\] = useState(false);

const handleShowNewRow = () =\> {

setShownNewRow(true);

};

const handleAddCancel = () =\> {

setShownNewRow(false);

};

const handleAdd = () =\> {

console.log("登録", input);

// TODO: バックエンドを使用した登録処理を呼ぶ

setShownNewRow(false);

};

// 更新・削除処理、更新・削除行の表示状態を保持

const \[editingRow, setEditingRow\] = useState\<number \| null\>(null);

const handleEditRow = (id: number) =\> {

setShownNewRow(false);

setEditingRow(id);

const selectedProduct: ProductData = data.find(

\(v\) =\> v.id === id,

) as ProductData;

setInput({

id: id.toString(),

name: selectedProduct.name,

price: selectedProduct.price.toString(),

description: selectedProduct.description,

});

};

const handleEditCancel = (id: number) =\> {

setEditingRow(null);

};

const handleEdit = (id: number) =\> {

console.log("更新", input);

// TODO: バックエンドを使用した更新処理を呼ぶ

setEditingRow(null);

};

const handleDelete = (id: number) =\> {

setEditingRow(null);

};

return (

\<\>

\<h2\>商品一覧\</h2\>

\<button type="button" onClick={handleShowNewRow}\>

商品を追加する

\</button\>

\<table\>

\<thead\>

\<tr\>

\<th\>商品ID\</th\>

\<th\>商品名\</th\>

\<th\>単価\</th\>

\<th\>説明\</th\>

\<th /\>

\<th /\>

\</tr\>

\</thead\>

\<tbody\>

{shownNewRow ? (

\<tr\>

\<td /\>

\<td\>

\<input type="text" name="name" onChange={handleInput} /\>

\</td\>

\<td\>

\<input type="number" name="price" onChange={handleInput} /\>

\</td\>

\<td\>

\<input type="text" name="description" onChange={handleInput} /\>

\</td\>

\<td /\>

\<td\>

\<button type="button" onClick={handleAddCancel}\>

キャンセル

\</button\>

\<button type="button" onClick={handleAdd}\>

登録する

\</button\>

\</td\>

\</tr\>

) : null}

{data.map((data: ProductData) =\>

editingRow === data.id ? (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>

\<input

type="text"

value={input.name}

name="name"

onChange={handleInput}

/\>

\</td\>

\<td\>

\<input

type="number"

value={input.price}

name="price"

onChange={handleInput}

/\>

\</td\>

\<td\>

\<input

type="text"

value={input.description}

name="description"

onChange={handleInput}

/\>

\</td\>

\<td /\>

\<td\>

\<button

type="button"

onClick={() =\> handleEditCancel(data.id)}

\>

キャンセル

\</button\>

\<button type="button" onClick={() =\> handleEdit(data.id)}\>

更新する

\</button\>

\<button type="button" onClick={() =\> handleDelete(data.id)}\>

削除する

\</button\>

\</td\>

\</tr\>

) : (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>{data.name}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.description}\</td\>

\<td\>

\<Link href={\`/inventory/products/\${data.id}\`}\>在庫処理\</Link\>

\</td\>

\<td\>

\<button type="button" onClick={() =\> handleEditRow(data.id)}\>

更新・削除

\</button\>

\</td\>

\</tr\>

),

)}

\</tbody\>

\</table\>

\</\>

);

}



#### Step: 作成した入力画面をブラウザで表示する

### フォームデータへのセットの流れ

　❶で入力値と更新に使うformデータそれぞれで型を定義し、❷で入力値をステートで管理しています。そして新規登録では❷で定義した初期値のままの状態、更新処理となる❸-2ではidに紐づく商品データを❷にセットしています。

```
 const \[input, setInput\] = useState\<InputData\>({

id: "",

name: "",

price: "",

description: "",

});



　❹では入力値の変更によって❸-1を呼出し、最新の入力値で❷を更新しています。見慣れない「\...input」がありますが、これはスプレッド構文という配列やオブジェクトといった要素を簡単に扱う仕組みです。これによって入力した値をセットしています。スプレッド構文については、https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread\_syntaxを参照してください。個別の入力値として管理するのではなく、入力値という1つのオブジェクトにまとめて管理しています。もちろん個別の入力値として管理しても大丈夫ですが、入力項目の数だけ似たような処理が増えてしまい、保守性が下がり可読性も悪くなるため、共通化しています。1つのオブジェクトにまとめることで、handleInputの1メソッドに処理を集約し、引数のeventに渡された入力欄のnameとvalueを用いてinput全体の値を更新しています。

4-4 商品在庫画面の作成

4-4-1 モックアップの作成

　こちらも一覧画面と同様にまず画面の大枠を作成しましょう。

#### Step: 商品在庫画面のモックアップを作成する

frontend/app/inventory/products/\[id\]/page.tsxを次の内容に置き換えます（コード4-4-1）。

```

export default function Page() {

return (

\<\>

\<h2\>商品在庫管理\</h2\>

\<h3\>在庫処理\</h3\>

\<form\>

\<div\>

\<span\>商品名:\</span\>

\<span\>コットン100％バックリボンティアードワンピース（黒）\</span\>

\</div\>

\<div\>

\<label htmlFor="quantity"\>数量:\</label\>

\<input type="number" id="quantity" /\>

\</div\>

\<button type="submit"\>商品を仕入れる\</button\>

\<button type="submit"\>商品を卸す\</button\>

\</form\>

\<h3\>在庫履歴\</h3\>

\<table\>

\<thead\>

\<tr\>

\<th\>処理種別\</th\>

\<th\>処理日時\</th\>

\<th\>単価\</th\>

\<th\>数量\</th\>

\<th\>価格\</th\>

\<th\>在庫数\</th\>

\</tr\>

\</thead\>

\<tbody\>

\<tr\>

\<td\>卸し\</td\>

\<td\>2023-04-03 18:54:13\</td\>

\<td\>6900\</td\>

\<td\>2\</td\>

\<td\>13800\</td\>

\<td\>390\</td\>

\</tr\>

\<tr\>

\<td\>仕入れ\</td\>

\<td\>2023-04-03 18:54:13\</td\>

\<td\>6900\</td\>

\<td\>3\</td\>

\<td\>20700\</td\>

\<td\>392\</td\>

\</tr\>

\<tr\>

\<td\>卸し\</td\>

\<td\>2023-04-03 18:54:13\</td\>

\<td\>6900\</td\>

\<td\>1\</td\>

\<td\>6900\</td\>

\<td\>389\</td\>

\</tr\>

\<tr\>

\<td\>卸し\</td\>

\<td\>2023-04-03 18:54:13\</td\>

\<td\>6900\</td\>

\<td\>10\</td\>

\<td\>69000\</td\>

\<td\>390\</td\>

\</tr\>

\<tr\>

\<td\>仕入れ\</td\>

\<td\>2023-04-03 18:54:13\</td\>

\<td\>6900\</td\>

\<td\>400\</td\>

\<td\>2760000\</td\>

\<td\>400\</td\>

\</tr\>

\</tbody\>

\</table\>

\</\>

);

}



#### Step: 作成したベースの画面をブラウザで表示する

　http://localhost:3000/inventory/products/1にアクセスすると図4-4-1の画面が表示されます。

*図4-4-1　商品在庫の表示例*

　一覧と同じようにjsonからのサンプルデータを読み込む形式に修正しましょう。

#### Step: 商品在庫のデータを動的に読み込ませるデータを作成する

　次に読込データを作成します（コード4-4-3）。

```

\[

{

"id": 1,

"type": "卸し",

"date": "2023-04-03 18:54:13",

"unit": 6900,

"quantity": 2,

"price": 13800,

"inventory": 390

},

{

"id": 2,

"type": "仕入れ",

"date": "2023-04-03 18:54:13",

"unit": 6900,

"quantity": 3,

"price": 20700,

"inventory": 392

},

{

"id": 3,

"type": "卸し",

"date": "2023-04-03 18:54:13",

"unit": 6900,

"quantity": 1,

"price": 6900,

"inventory": 389

},

{

"id": 4,

"type": "卸し",

"date": "2023-04-03 18:54:13",

"unit": 6900,

"quantity": 10,

"price": 69000,

"inventory": 390

},

{

"id": 5,

"type": "仕入れ",

"date": "2023-04-03 18:54:13",

"unit": 6900,

"quantity": 400,

"price": 2760000,

"inventory": 400

}

\]



#### Step: 商品在庫のデータを動的に読み込ませる

詳細画面は選択した商品のIDに紐づく商品を表示するようにします（コード4-4-2）。

```

"use client";

import { useEffect, useState } from "react";

import inventoriesData from "../sample/dummy\_inventories.json";

import productsData from "../sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

type InventoryData = {

id: number;

type: string;

date: string;

unit: number;

quantity: number;

price: number;

inventory: number;

};

export default function Page() {

// 商品IDにあたる検索条件

const params = { id: 1 };

// 読込データを保持

const \[product, setProduct\] = useState\<ProductData\>({

id: 0,

name: "",

price: 0,

description: "",

});

const \[data, setData\] = useState\<Array\<InventoryData\>\>(\[\]);

useEffect(() =\> {

const selectedProduct: ProductData = productsData.find(

\(v\) =\> v.id === params.id,

) ?? {

id: 0,

name: "",

price: 0,

description: "",

};

setProduct(selectedProduct);

setData(inventoriesData);

}, \[\]);

return (

\<\>

\<h2\>商品在庫管理\</h2\>

\<h3\>在庫処理\</h3\>

\<form\>

\<div\>

\<span\>商品名:\</span\>

\<span\>{product.name}\</span\>

\</div\>

\<div\>

\<label htmlFor="quantity"\>数量:\</label\>

\<input type="number" id="quantity" /\>

\</div\>

\<button type="submit"\>商品を仕入れる\</button\>

\<button type="submit"\>商品を卸す\</button\>

\</form\>

\<h3\>在庫履歴\</h3\>

\<table\>

\<thead\>

\<tr\>

\<th\>処理種別\</th\>

\<th\>処理日時\</th\>

\<th\>単価\</th\>

\<th\>数量\</th\>

\<th\>価格\</th\>

\<th\>在庫数\</th\>

\</tr\>

\</thead\>

\<tbody\>

{data.map((data: InventoryData) =\> (

\<tr key={data.id}\>

\<td\>{data.type}\</td\>

\<td\>{data.date}\</td\>

\<td\>{data.unit}\</td\>

\<td\>{data.quantity}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.inventory}\</td\>

\</tr\>

))}

\</tbody\>

\</table\>

\</\>

);

}

#### Step: データを画面をブラウザで表示する

　http://localhost:3000/inventory/products/1 にアクセスするとjsonファイルから読み込んだ値が表示されます。useEffect内ではjsonファイルから読み込んだ商品データで検索条件となる想定の商品IDと一致するデータを取得しています。

4-4-2 動的ルートのパラメーターの取得

　これまでは固定の商品IDを読み込んでいましたが、動的にこのIDを取得できるようにしましょう。パラメーターの渡し方には、formデータとして渡したり、クエリパラメーターとしてURLに直接追加して渡したりと、いくつかの種類があります。今回は、URLセグメントから取得する方法を採用します。

　まず、このpage.tsxが保存されているフォルダ名に、改めて注目してください。以前、フォルダ名とURLセグメントが対応すると説明しましたが、URLと対応しないフォルダ名になっていることがわかります。今回の商品IDをURLに使用するように、事前に正確なセグメント名がわからない場合には、動的セグメントを使います。

### Step: 動的に読み込ませるデータをパラメーターとして指定する

　動的セグメントはフォルダ名を角かっこで囲むことによって作成します。今回はidをURLセグメントにしているので\[id\]というフォルダ名で作成しました。動的セグメントから検索に使うパラメーターを取得しましょう（コード4-4-4）。

```

"use client";

import { useParams } from "next/navigation";

import { useEffect, useState } from "react";

import inventoriesData from "../sample/dummy\_inventories.json";

import productsData from "../sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

type InventoryData = {

id: number;

type: string;

date: string;

unit: number;

quantity: number;

price: number;

inventory: number;

};

export default function Page() {

const params = useParams\<{ id: string }\>();

const id = Number(params?.id);

// 読込データを保持

const \[product, setProduct\] = useState\<ProductData\>({

id: 0,

name: "",

price: 0,

description: "",

});

const \[data, setData\] = useState\<Array\<InventoryData\>\>(\[\]);

useEffect(() =\> {

const selectedProduct: ProductData = productsData.find(

\(v\) =\> v.id === id,

) ?? {

id: 0,

name: "",

price: 0,

description: "",

};

setProduct(selectedProduct);

setData(inventoriesData);

}, \[id\]);

return (

\<\>

\<h2\>商品在庫管理\</h2\>

\<h3\>在庫処理\</h3\>

\<form\>

\<div\>

\<span\>商品名:\</span\>

\<span\>{product.name}\</span\>

\</div\>

\<div\>

\<label htmlFor="quantity"\>数量:\</label\>

\<input type="number" id="quantity" /\>

\</div\>

\<button type="submit"\>商品を仕入れる\</button\>

\<button type="submit"\>商品を卸す\</button\>

\</form\>

\<h3\>在庫履歴\</h3\>

\<table\>

\<thead\>

\<tr\>

\<th\>処理種別\</th\>

\<th\>処理日時\</th\>

\<th\>単価\</th\>

\<th\>数量\</th\>

\<th\>価格\</th\>

\<th\>在庫数\</th\>

\</tr\>

\</thead\>

\<tbody\>

{data.map((data: InventoryData) =\> (

\<tr key={data.id}\>

\<td\>{data.type}\</td\>

\<td\>{data.date}\</td\>

\<td\>{data.unit}\</td\>

\<td\>{data.quantity}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.inventory}\</td\>

\</tr\>

))}

\</tbody\>

\</table\>

\</\>

);

}



　Page関数の引数にparamsを追加することで、URLセグメントの値をパラメーターとして取得することができます。本アプリケーションでは次のような設定となります（表4-4-1）。

**表4-4-1　画面とAPIの対応関係**

ファイル URL params

app/inventory/products/\[id\]/page.tsx /inventory/product/\[id\] {id:'1'}

#### Step: パラメーターにより商品在庫の商品が切り替わることを確認する

　URLからパラメーターの値が読み込まれているか、確かめてみましょう。次のURLをそれぞれ画面に表示してみてください。異なる商品が表示されたでしょうか。

・http://localhost:3000/inventory/products/1

・http://localhost:3000/inventory/products/2

　本例では扱いませんが、複数の動的セグメントをparamsとして取得したり、クエリパラメーターをsearchParamsとして取得したりすることもできます。詳細は公式のページを参照ください[^注4-3]。

[^4-3]: https://nextjs.org/docs/app/api-reference/file-conventions/page\#props

　ここまで、Next.jsにおける画面遷移やパラメーターの渡し方を学びました。最低限のデータの表示や画面操作はここまでの要素で実現できますが、このままではアプリケーションとしてはまだまだ不親切です。次の節では、入力チェックを追加し、ユーザーにメッセージを表示していきます。

4-5 バリデーション

　ここまでで入力した値をバックエンドに投げて処理するような基本的な画面構成ができました。ここからは細かい機能を作り込んでいきます。

　まずは一覧画面に入力値のチェックを実装してみましょう。一覧画面では商品名称と価格が入力可能です。しかし、価格に数字以外の値を入力されたりしたら困ります。そこで、入力した値が決められた形式や意図しない値になっていないかチェックを行う必要が出てきます。一般的にこういったチェックのことをバリデーションといいます。

![図](media/image21.png){width="14.666666666666666in" height="8.0in"}

4-4-1 React Hook Formのインストール

　Next.jsではバリデーションの機能は提供していません。そこでHTMLの組み込みのメソッドやJavaScriptでオリジナルの処理を作成するか、外部のReactライブラリを使用するかの2種類の方法があります。今回はReactのライブラリであるReact Hook Formを導入してチェックを行います。ライブラリを導入することで状態管理やValidationの処理をシンプルに記述することができます。

#### Step: バリデーションを行うライブラリをインストールする

　次のコマンドをVSCode上のターミナルで実行してください。

```
yarn add react-hook-form



#### Step: バリデーションを行うライブラリがインストールされたことを確認する

package.json に追加されている。以降は、yarn install で追加される。

### yarn add

yarn addを実行すると、このプロジェクトで利用するライブラリとそのバージョンがpackage.jsonに記録されます。これにより、他の開発者がこのプロジェクトを開始する際にyarn installを実行するだけで、同じ開発環境を簡単に再現できるようになり、環境差異による問題を減らすことができます。

### package.json

4-4-1 React Hook Formの実装

### Step: 新規登録のバリデーションを商品一覧に組み込む

### Step: 更新のバリデーションを商品一覧に組み込む

### Step: 削除のバリデーションを商品一覧に組み込む

### Step: バリデーションを行うライブラリを商品一覧に組み込む

　React Hook Formをコードに組み込みましょう（コード4-4-1）。

```

"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import productsData from "./sample/dummy\_products.json";

type ProductData = {

id: number \| null;

name: string;

price: number;

description: string;

};

export default function Page() {

const {

register,

handleSubmit,

reset,

formState: { errors },

} = useForm\<FormInput\>();

// 読込データを保持

const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);

useEffect(() =\> {

setData(productsData as ProductData\[\]);

}, \[\]);

// 登録データを保持

const \[id, setId\] = useState\<number \| null\>(0);

// submit時のactionを分岐させる

const \[action, setAction\] = useState\<string\>("");

type FormInput = {

name: string;

price: number \| string;

description: string;

};

const onSubmit = (event: FormInput): void =\> {

const data: ProductData = {

id: id,

name: event.name,

price: Number(event.price),

description: event.description,

};

// actionによってHTTPメソッドと使用するパラメーターを切り替える

if (action === "add") {

handleAdd(data);

} else if (action === "update") {

if (data.id === null) {

return;

}

handleEdit(data);

} else if (action === "delete") {

if (data.id === null) {

return;

}

handleDelete(data.id);

}

};

// 新規登録処理、新規登録行の表示状態を保持

const handleShowNewRow = () =\> {

console.log("handleShowNewRow");

setId(null);

reset({

name: "",

price: "0",

description: "",

});

};

const handleAddCancel = () =\> {

console.log("handleAddCancel");

setId(0);

};

const handleAdd = (data: ProductData) =\> {

console.log("handleAdd", data);

setId(0);

};

// 更新・削除処理、更新・削除行の表示状態を保持

const handleEditRow = (id: number \| null) =\> {

console.log("handleEditRow", id);

const selectedProduct: ProductData = data.find(

\(v\) =\> v.id === id,

) as ProductData;

setId(selectedProduct.id);

reset({

name: selectedProduct.name,

price: selectedProduct.price,

description: selectedProduct.description,

});

};

const handleEditCancel = () =\> {

console.log("handleEditCancel");

setId(0);

};

const handleEdit = (data: ProductData) =\> {

console.log("handleEdit", data);

setId(0);

};

const handleDelete = (id: number) =\> {

console.log("handleDelete", id);

setId(0);

};

return (

\<\>

\<h2\>商品一覧\</h2\>

\<button type="button" onClick={handleShowNewRow}\>

商品を追加する

\</button\>

\<form onSubmit={handleSubmit(onSubmit)}\>

\<table\>

\<thead\>

\<tr\>

\<th\>商品ID\</th\>

\<th\>商品名\</th\>

\<th\>単価\</th\>

\<th\>説明\</th\>

\<th /\>

\<th /\>

\</tr\>

\</thead\>

\<tbody\>

{id === null ? (

\<tr\>

\<td /\>

\<td\>

\<input

type="text"

id="name"

{\...register("name", { required: true, maxLength: 100 })}

/\>

{errors.name && (

\<div\>100文字以内の商品名を入力してください\</div\>

)}

\</td\>

\<td\>

\<input

type="number"

id="price"

{\...register("price", {

required: true,

min: 1,

max: 99999999,

})}

/\>

{errors.price && (

\<div\>1から99999999の数値を入力してください\</div\>

)}

\</td\>

\<td\>

\<input

type="text"

id="description"

{\...register("description")}

/\>

\</td\>

\<td /\>

\<td\>

\<button type="button" onClick={() =\> handleAddCancel()}\>

キャンセル

\</button\>

\<button type="submit" onClick={() =\> setAction("add")}\>

登録する

\</button\>

\</td\>

\</tr\>

) : null}

{data.map((data: ProductData) =\>

id === data.id ? (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>

\<input

type="text"

id="name"

{\...register("name", { required: true, maxLength: 100 })}

/\>

{errors.name && (

\<div\>100文字以内の商品名を入力してください\</div\>

)}

\</td\>

\<td\>

\<input

type="number"

id="price"

{\...register("price", { min: 1, max: 99999999 })}

/\>

{errors.price && (

\<div\>1から99999999の数値を入力してください\</div\>

)}

\</td\>

\<td\>

\<input

type="text"

id="description"

{\...register("description")}

/\>

\</td\>

\<td /\>

\<td\>

\<button type="button" onClick={() =\> handleEditCancel()}\>

キャンセル

\</button\>

\<button type="submit" onClick={() =\> setAction("update")}\>

更新する

\</button\>

\<button type="submit" onClick={() =\> setAction("delete")}\>

削除する

\</button\>

\</td\>

\</tr\>

) : (

\<tr key={data.id}\>

\<td\>{data.id}\</td\>

\<td\>{data.name}\</td\>

\<td\>{data.price}\</td\>

\<td\>{data.description}\</td\>

\<td\>

\<Link href={\`/inventory/products/\${data.id}\`}\>

在庫処理

\</Link\>

\</td\>

\<td\>

\<button

type="button"

onClick={() =\> handleEditRow(data.id)}

\>

更新・削除

\</button\>

\</td\>

\</tr\>

),

)}

\</tbody\>

\</table\>

\</form\>

\</\>

);

}



#### Step: バリデーションを実行する

// TODO: ちゃんと操作を明示する

・入力値を入れる

・サブミットを押す

・メッセージが表示される・・・みたいな流れ

### React Hook Formとは

　React Hook Formに関する修正と、submitボタンを押下した際の挙動の修正の、大きく2つの変更を行っています。まず❶ではformを簡単に処理するためのReact Hook FormのカスタムフックであるuseFormを定義します。以前出てきたuseStateやuseEffectは、Reactのビルトインのhookでしたが、useFormはReact Hook Formで実装されたhookのため、ライブラリをインストールしなければ使用できません。実際の開発でも様々なhookが出てきますが、どのライブラリのhookなのか、切り分けて考えることが重要です。useFormでは様々なオブジェクトを取得できますが、今回は以下の要素に絞っています。主要な要素を深堀していきましょう。

・register：最も重要な要素。form入力値やValidationの内容を管理する

・handleSubmit：submitした際の動作とform入力値の受け渡しを管理する

・reset：formの入力値を初期化する

・formState: { errors }：Validation時のエラー内容を管理する

### register

　まずはregisterです。❺のような入力フィールドに対して使用します。

　バリデーションの条件をregister内に追加していきます。

{\...register("name", { required: true, maxLength: 100 })}

　例えば上記の場合は、必須項目で文字列の最大長は100という風になります。Validationが通らなかった場合に条件ごとに個別のメッセージを表示する場合は、requiredはメッセージの文字列、maxLengthはvalueに判定に用いる値、messageにメッセージの文字列を設定し分けることもできます。以下は書き換えた例です。

##### サンプル

{\...register("name", {

required: \'必須項目です。',

maxLength: {

value: 100,

message: \'商品名は100文字以下で入力して下さい。\'

}

})}



　設定したエラーのメッセージはどう表示するのでしょうか。formState {errors}を見てみましょう。Validationに引っかかった際のメッセージは、このerrorsに入ってきます。

```
 {errors.name?.message? && (

\<div\>{ errors.name?.message?}\</div\>

)}



### reset

　次は各登録イベントから呼ばれる❸のメソッドにあるresetを見てみましょう。

 const handleShowNewRow = () =\> {

setId(null);

reset({

name: "",

price: "0",

description: "",

});

};



　resetはregisterで紐づけられた入力値を初期化するために使用します。今回は追加ボタンを押下した際には空の入力値、更新ボタンを押下した際はその行の値を初期値とするようにしました。

### handleSubmit

　最後に❷と❹、❻によって使用されるhandleSubmitです。

```
 const onSubmit = (event: any): void =\> {

const data: ProductData = {

id: id,

name: event.name,

price: Number(event.price),

description: event.description,

};

...

\</button\>

\<form onSubmit={handleSubmit(onSubmit)}\>

\<table\>



　❹で修正したようにformのonSubmitイベントと紐づけて使用します。❻で押したボタンに応じて❹から呼ばれる❷の処理が登録や更新、削除処理に振り分けられます。関数のonSubmitの引数には❺のregisterで紐づけられた入力値が入ってきます。本例では登録に使用する型の初期値として使用しました。このようにReact Hook Formを利用することで、管理するstateのコード量を削減し、エラーメッセージを楽に管理しつつ実装ができます。他にも様々なオプションがあるのでプロジェクトの要件に合わせて利用してみてください。

#### Step: バリデーションを行うライブラリを商品在庫に組み込む

　次は商品在庫画面を置き換えましょう。商品一覧への置き換えで行なったような流れで進めます。

① React Hook Formをインポートし、useFormを定義する

② 各入力フィールドにバリデーションを追加する

③ handleSubmitから各登録処理を呼び分ける

　ただし、全てのコードを掲載するには文量が多いため、本サンプルコードの全文は翔泳社のサイト上からダウンロードしたZipファイルの中にある、次のファイルをご参照ください[^注4-4]。後工程のレイアウトの反映も含まれていますが、バリデーション部分の構造は同じです。

[^4-4]: サンプルコードのダウンロード方法は本書のvページを参照してください。

・writing-full-stack-web-development/chapter5\_done/frontend/app/inventory/products/\[id\]/page.tsx

#### Step: バリデーションを実行する

// TODO: 手順の詳細を書く

　この章ではReact Hook FormというReactのライブラリを導入し、バリデーションを実装しました。ライブラリの仕様を理解する必要はありますが、チェック内容と出力メッセージに集中したシンプルな実装ができたのではないでしょうか。

　ここまで、各画面の実装を行ってきました。次の節では各画面から離れヘッダーやサイドバーといったアプリケーションとして共通する部分について実装していきます。

4-6 レイアウト

　一覧画面と詳細画面を作成したところで、ヘッダー等の画面で共通で使用されるコンテンツがあることに気づいたでしょうか。画面ごとに実装するのはメンテナンス性が悪いので、共通のコンポーネントとして切り出していきましょう。

4-6-1 Layout Pattern

　Next.jsではlayoutというファイルによりディレクトリごとに共通のレイアウトを設定することができるのでそれを利用します。

#### Step: ナビゲーションバーを追加する

　まずinventoryフォルダの直下にlayout.tsxというファイルを作成し、次のように実装してみましょう（コード4-6-1）。

```

export default function InventoryLayout({

children,

}: {

children: React.ReactNode;

}) {

return (

\<div className="layout"\>

\<header className="header"\>ヘッダー\</header\>

\<div className="container"\>

\<nav className="navbar"\>サイドバー\</nav\>

\<main className="content"\>

\<section\>{children}\</section\>

\</main\>

\</div\>

\<footer className="footer"\>フッター\</footer\>

\</div\>

);

}



　図4-6-1のようなディレクトリ構成になっています。

![図](media/image20.png){width="6.489583333333333in" height="4.697916666666667in"}

*図4-6-1　URLとフォルダ構成の関係図*

　layout.tsxの配下の各フォルダにpage.tsxが入っている状態になっています。

#### Step: 商品一覧画面のナビゲーションバーを表示する

　それでは画面を確認してみましょう。一覧画面を表示すると、ヘッダーとサイドバー、フッターが追加されているでしょうか（図4-6-2）。

*図4-6-2　商品一覧の表示例*

![図](media/image19.png){width="21.333333333333332in" height="6.447916666666667in"}

#### Step: 商品在庫画面のナビゲーションバーを表示する

　在庫処理をクリックして、商品在庫画面も確認してみましょう。同じようにヘッダー、サイドバーが表示されているはずです（図4-6-3）。

*図4-6-3　商品在庫の表示例*

![図](media/image1.png){width="21.333333333333332in" height="6.739583333333333in"}

### layout.tsxの階層構造

　これはlayout.tsx内の{children}に同ディレクトリ配下のpage.tsxが埋め込まれるようになっているためです。フォルダがネストされている場合でも、最も近い上の階層のlayout.tsxの子コンポーネントとして埋め込まれるため、フォルダの異なる詳細画面にも同layoutが適用されています。実はプロジェクト作成時にapp直下にlayout.tsxも同時に作成されています。内容を確認してみましょう。

```

 \<html lang="en"\>

\<body className={inter.className}\>{children}\</body\> ❶

\</html\>

)

}



　❶を見ると、{children}があります。つまり、これまで表示していたpage.tsxは全て、ルートにあるlayout.tsxに埋め込まれる形で表示されていたことがわかります。今回は他の章の例との兼ね合いでrootのlayoutファイルは修正しませんでしたが、全画面共通のコンポーネントを使用するのであれば、こちらを修正してもよいでしょう。

　また、layoutを分割して画面ごとのコードの重複がなくなることで、修正がしやすくなったり、コードの全体像を把握しやすくなったりと、保守性が高まるメリットがあります。プログラムは作成するときだけでなく、作成してからのメンテナンスまで考慮しなければならないため、保守性を高めることは大切な要素になります。

4-6-2 スタイリング

　レイアウトも決まってきたので、見た目をリッチにするためにCSSを適用してみましょう。

#### Step: ナビゲーションバー用のスタイルを作成する

まずはproducts配下にstyles.module.cssファイルを作成して、コード4-6-3を実装してください。

```

.layout {

min-height: 100vh;

display: flex;

flex-direction: column;

}

.header {

background-color: \#f2f2f2;

padding: 20px;

}

.container {

flex-grow: 1;

display: flex;

}

.navbar {

width: 200px;

background-color: \#eaeaea;

padding: 20px;

}

.content {

flex-grow: 2;

padding: 20px;

}

.footer {

background-color: \#f2f2f2;

padding: 20px;

}



#### Step: ナビゲーションバーのスタイルを指定する

　作成したcssを適用するために、layoutファイルの各タグにクラス名を追加しましょう（コード4-6-4）。

```

import styles from "./products/styles.module.css";

export default function InventoryLayout({

children,

}: {

children: React.ReactNode;

}) {

return (

\<div className={styles.layout}\>

\<header className={styles.header}\>ヘッダー\</header\>

\<div className={styles.container}\>

\<nav className={styles.navbar}\>サイドバー\</nav\>

\<main className={styles.content}\>

\<section\>{children}\</section\>

\</main\>

\</div\>

\<footer className={styles.footer}\>フッター\</footer\>

\</div\>

);

}



　http://localhost:3000/inventory/products を表示すると、ヘッダー、サイドバー、フッターにスタイルが表示されます（図4-6-4）。

*図4-6-4　スタイルが表示される*

![図](media/image17.png){width="21.333333333333332in" height="10.979166666666666in"}

### CSSモジュール

　普通のhtmlではclassでしたがReactではclassNameという属性でスタイリングを行います。Next.jsではCSSモジュールという機能があり、同一のクラス名をつけてもページ間で個別のCSSを適用できるようになっています。これにより、各フォルダにstyles.module.cssを用意して同じクラス名で異なったスタイルを適用することができます。イメージとしてはlayoutファイルの階層構造と同じです。

　またlayout.tsxと同様に、プロジェクト作成時にrootフォルダにpage.module.cssというファイルが作成されますが、それとは別にglobals.cssというファイルも作成されます。構造には関係なく全体に反映させたいスタイルがある場合は、こちらに記述するとよいでしょう。

　Next.jsでは他にも以下のようなスタイルの適用方法がサポートされています。

・Tailwind CSS

・CSS-in-JS

・Sass

### TODO: スタイリングフレームワーク

// TODO: 新規に追加するので解説

4-6-3 UIの改善

　Next.jsの機能により、柔軟なスタイルの適用が可能なことはわかりました。しかし、一つ一つのコンポーネントに対してスタイルを検討していくのは少し大変です。そこで、外部のUIツールを導入して統一感のあるUIを作成してみましょう。

　今回はMaterial UIを使用します。第3章で述べたように、Reactコンポーネントとして広く利用されている実績があり、CSSなどを設定するのに比べて、一貫したデザインの実現が容易なためです。第3章のインストールしているはずですが、もしインストールしていない場合は3-2-4項の手順を実行してください。また加えて、ボタンに表示するアイコンもインストールします。

#### Step: デザインを行うライブラリをインストールする

VSCodeのターミナルで次のコマンドを実行してください。

yarn add \@mui/material \@emotion/react \@emotion/styled \@mui/icons-material



　それでは各画面にMaterial UIを適用しましょう。

#### Step: ナビゲーションにデザインを行うライブラリを適用する

まずは共有部分となるlayout.tsxに適用します。全面的な修正になるため、コード4-6-5の内容に書き換えてください。基本的な構造は変わっていません。

```



"use client";

import { Logout as LogoutIcon, Menu as MenuIcon } from "\@mui/icons-material";

import {

AppBar,

Box,

Button,

Divider,

Drawer,

IconButton,

List,

ListItem,

ListItemButton,

ListItemText,

Toolbar,

Typography,

} from "\@mui/material";

export default function InventoryLayout({

children,

}: {

children: React.ReactNode;

}) {

return (

\<Box sx={{ display: "flex" }}\>

\<AppBar position="fixed"\>

\<Toolbar\>

\<IconButton\>

\<MenuIcon /\>

\</IconButton\>

\<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}\>

在庫管理システム

\</Typography\>

\<Button variant="contained" startIcon={\<LogoutIcon /\>}\>

ログアウト

\</Button\>

\</Toolbar\>

\</AppBar\>

\<Drawer anchor="left"\>

\<Box sx={{ width: 240 }}\>

\<Toolbar /\>

\<Divider /\>

\<List\>

\<ListItem component="a" href="/inventory/products" disablePadding\>

\<ListItemButton\>

\<ListItemText primary="商品一覧" /\>

\</ListItemButton\>

\</ListItem\>

\<Divider /\>

\<ListItem

component="a"

href="/inventory/import\_sales"

disablePadding

\>

\<ListItemButton\>

\<ListItemText primary="売上一括登録" /\>

\</ListItemButton\>

\</ListItem\>

\<Divider /\>

\</List\>

\</Box\>

\</Drawer\>

\<Box

component="main"

sx={{

flexGrow: 1,

p: 3,

// AppBar と被るため下にずらしている

marginTop: "64px",

width: "100%",

background: "white",

}}

\>

{children}

\</Box\>

\<Box

component="footer"

sx={{

width: "100%",

position: "fixed",

textAlign: "center",

bottom: 0,

background: "\#1976d2",

}}

\>

\<Typography variant="caption" color="white"\>

©2023 full stack web development

\</Typography\>

\</Box\>

\</Box\>

);

}



### コンポーネントとhtmlタグの対応関係

　大きく書き変わったため、構造が捉えにくくなりましたね。上から見ていきましょう。まず❶では画面表示に関するMaterial UIのコンポーネントを一通りインポートしています。ボタンの見た目についてはチェックやゴミ箱のアイコンを使用したいため、対応するアイコンデザインもインポートしています。適用例などのサンプルが公開されているので参考にしてもよいでしょう。次に❷でインポートしたコンポーネントを使用してhtmlタグをMaterial UIを使用したコードへ修正を行っています。

　このMaterial UIのタグからHTMLタグへの書き換えは、次のような対応関係になっています。

・header → AppBar

・aside → Drawer

・div → Box

・div → Toolbar→Divider

・select → List

・option → ListItem→ ListItemButton→ ListItemText

・span → Typography

![図](media/image12.png){width="21.333333333333332in" height="10.979166666666666in"}

#### Step: ナビゲーションのサイドバーに開閉機能や遷移機能を追加する

　最後に、「サイドバー」に商品一覧といったメニューの追加を行っています。これにより各機能への遷移が可能になります。このDrawerというコンポーネントはサイドバーの開閉の機能も持ち合わせていますが、現時点では閉じた状態で固定されています。開閉の機能を追加しつつ、もう少し使いやすくしてみましょう（コード4-6-6）。

```

"use client";

import { Logout as LogoutIcon, Menu as MenuIcon } from "\@mui/icons-material";

import {

AppBar,

Box,

Button,

Divider,

Drawer,

IconButton,

List,

ListItem,

ListItemButton,

ListItemText,

ThemeProvider,

Toolbar,

Typography,

createTheme,

} from "\@mui/material";

import { useRouter } from "next/navigation";

import { useState } from "react";

declare module "\@mui/material/styles" {

// 指定を単純にするためにモバイルとPCの2つに限定する

interface BreakpointOverrides {

xs: false;

sm: false;

md: false;

lg: false;

xl: false;

mobile: true;

desktop: true;

}

}

const defaultTheme = createTheme({

breakpoints: {

values: {

mobile: 0,

desktop: 600,

},

},

});

export default function InventoryLayout({

children,

}: {

children: React.ReactNode;

}) {

/\*\* サイドバーの開閉を管理する \*/

const \[open, setOpen\] = useState(false);

const toggleDrawer = (open: boolean) =\> {

setOpen(open);

};

/\*\* 各種画面への遷移を管理する \*/

const router = useRouter();

// ログアウト処理

const handleLogout = () =\> {

router.replace("/login");

};

/\*\* 開閉対象となるサイドバー本体 \*/

const list = () =\> (

\<Box sx={{ width: 240 }}\>

\<Toolbar /\>

\<Divider /\>

\<List\>

\<ListItem component="a" href="/inventory/products" disablePadding\>

\<ListItemButton\>

\<ListItemText primary="商品一覧" /\>

\</ListItemButton\>

\</ListItem\>

\<Divider /\>

\<ListItem component="a" href="/inventory/import\_sales" disablePadding\>

\<ListItemButton\>

\<ListItemText primary="売上一括登録" /\>

\</ListItemButton\>

\</ListItem\>

\<Divider /\>

\</List\>

\</Box\>

);

return (

\<ThemeProvider theme={defaultTheme}\>

\<Box sx={{ display: "flex" }}\>

\<AppBar position="fixed"\>

\<Toolbar\>

\<IconButton onClick={() =\> toggleDrawer(true)}\>

\<MenuIcon /\>

\</IconButton\>

\<Typography

variant="h6"

noWrap

component="div"

sx={{ flexGrow: 1 }}

\>

在庫管理システム

\</Typography\>

\<Button

variant="contained"

startIcon={\<LogoutIcon /\>}

onClick={() =\> handleLogout()}

\>

ログアウト

\</Button\>

\</Toolbar\>

\</AppBar\>

\<Drawer open={open} onClose={() =\> toggleDrawer(false)} anchor="left"\>

{list()}

\</Drawer\>

\<Box

component="main"

sx={{

flexGrow: 1,

p: 3,

// AppBar と被るため下にずらしている

marginTop: "64px",

width: "100%",

background: "white",

}}

\>

{children}

\</Box\>

\<Box

component="footer"

sx={{

width: "100%",

position: "fixed",

textAlign: "center",

bottom: 0,

background: "\#1976d2",

}}

\>

\<Typography variant="caption" color="white"\>

©2023 full stack web development

\</Typography\>

\</Box\>

\</Box\>

\</ThemeProvider\>

);

}



　共通部分は以下の機能を持っています。

・ログアウト機能

・各機能の遷移機能

・サイドバーの開閉

![図](media/image14.png){width="21.333333333333332in" height="11.020833333333334in"}

#### Step: ナビゲーションからログアウトできることを確認する

// TODO: 状態を記載する

#### Step: ナビゲーションから各機能に遷移できることを確認する

// TODO: 状態を記載する

#### Step: ナビゲーションを開閉できることを確認する

// TODO: 状態を記載する

### レスポンシブ

　また、PCとスマートフォンで最適な画面が表示できるように画面幅によってレイアウトを変更するための機能を追加しています。ThemeProviderを使って実装しています。ThemeProviderでマテリアル UI をカスタマイズします。カスタマイズをしない場合はMaterialUIのデフォルトのテーマが使用されます。テーマは、コンポーネントの色、サーフェスの暗さ、影のレベル、インク要素の適切な不透明度などを指定することができます。また、画面幅に応じた各レイアウトを指定することも可能です。ここでは、スマートフォンとPCのそれぞれの画面で、レイアウトを変えるための設定を追加しています。

### サイドバーの展開

　各機能の実装方法を見ていきます。

・ログアウト機能

　　　- ナビゲーションバー上に設置する。バックエンド側での処理とフロントエンドの画面遷移処理の2つが必要。現時点では画面遷移のみ実装している

・各機能への画面遷移

　　　- 一覧画面から詳細画面への遷移と同じように、Linkコンポーネントを使用している

・サイドバーの展開

　　　- useStateによって開閉状態を管理している

　次のコードに注目してください。

```
 /\*\* 開閉対象となるサイドバー本体 \*/

const list = () =\> (

\<Box sx={{ width: 240 }}\>

...

\</Box\>

);

...

\<Drawer open={open} onClose={() =\> toggleDrawer(false)} anchor="left"\>

{list()}

\</Drawer\>



　描画対象を関数の実行結果として返すことができます。これにより描画に必要な部品を関数として分解し、共通の部品として使用することができます。

　次は商品一覧画面と商品在庫画面を置き換えましょう。次の流れで進めます。

① 必要なコンポーネントをインポートする

② htmlタグを対応するコンポーネントに置き換える

　全てのコードを掲載するには文量が多いため、重要な部分を抜粋して紹介します。全文は本書サンプルコードの下記ファイルを参照してください。

・writing-full-stack-web-development/chapter5\_done/frontend/app/inventory/products/page.tsx

・writing-full-stack-web-development/chapter5\_done/frontend/app/inventory/products/\[id\]/page.tsx

#### Step: 商品一覧画面にデザインを適用する

```

"use client";

import {

Add as AddIcon,

Cancel as CancelIcon,

Check as CheckIcon,

Delete as DeleteIcon,

Edit as EditIcon,

} from "\@mui/icons-material";

import type { AlertColor } from "\@mui/material";

import {

Alert,

Box,

Button,

IconButton,

Paper,

Snackbar,

Table,

TableBody,

TableCell,

TableContainer,

TableHead,

TableRow,

TextField,

Typography,

} from "\@mui/material";

import Link from "next/link";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import productsData from "./sample/dummy\_products.json";

type FormInput = {

name: string;

price: number \| string;

description: string;

};

type ProductData = {

id: number \| null;

name: string;

price: number;

description: string;

};

export default function Page() {

const {

register,

handleSubmit,

reset,

formState: { errors },

} = useForm\<FormInput\>();

// 読込データを保持

const \[data, setData\] = useState\<Array\<ProductData\>\>(\[\]);

const \[open, setOpen\] = useState(false);

const \[severity, setSeverity\] = useState\<AlertColor\>("success");

const \[message, setMessage\] = useState("");

const result = (severity: AlertColor, message: string) =\> {

setOpen(true);

setSeverity(severity);

setMessage(message);

};

const handleClose = () =\> {

setOpen(false);

};

useEffect(() =\> {

setData(productsData as ProductData\[\]);

}, \[\]);

const \[id, setId\] = useState\<number \| null\>(0);

// submit時のactionを分岐させる

const \[action, setAction\] = useState\<string\>("");

const onSubmit = (event: FormInput): void =\> {

const data: ProductData = {

id: id,

name: event.name,

price: Number(event.price),

description: event.description,

};

// actionによってHTTPメソッドと使用するパラメーターを切り替える

if (action === "add") {

handleAdd(data);

} else if (action === "update") {

if (data.id === null) {

return;

}

handleEdit(data);

} else if (action === "delete") {

if (data.id === null) {

return;

}

handleDelete(data.id);

}

};

// 新規登録処理、新規登録行の表示状態を保持

const handleShowNewRow = () =\> {

console.log("handleShowNewRow");

setId(null);

reset({

name: "",

price: "0",

description: "",

});

};

const handleAddCancel = () =\> {

console.log("handleAddCancel");

setId(0);

};

const handleAdd = (data: ProductData) =\> {

console.log("handleAdd", data);

result("success", "商品が登録されました");

setId(0);

};

// 更新・削除処理、更新・削除行の表示状態を保持

const handleEditRow = (id: number \| null) =\> {

console.log("handleEditRow", id);

const selectedProduct: ProductData = data.find(

\(v\) =\> v.id === id,

) as ProductData;

setId(selectedProduct.id);

reset({

name: selectedProduct.name,

price: selectedProduct.price,

description: selectedProduct.description,

});

};

const handleEditCancel = () =\> {

console.log("handleEditCancel");

setId(0);

};

const handleEdit = (data: ProductData) =\> {

console.log("handleEdit", data);

result("success", "商品が更新されました");

setId(0);

};

const handleDelete = (id: number) =\> {

console.log("handleDelete", id);

result("success", "商品が削除されました");

setId(0);

};

return (

\<\>

\<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}\>

\<Alert severity={severity}\>{message}\</Alert\>

\</Snackbar\>

\<Typography variant="h5"\>商品一覧\</Typography\>

\<Button

variant="contained"

startIcon={\<AddIcon /\>}

onClick={() =\> handleShowNewRow()}

\>

商品を追加する

\</Button\>

\<Box

component="form"

onSubmit={handleSubmit(onSubmit)}

sx={{ height: 400, width: "100%" }}

\>

\<TableContainer component={Paper}\>

\<Table\>

\<TableHead\>

\<TableRow\>

\<TableCell\>商品ID\</TableCell\>

\<TableCell\>商品名\</TableCell\>

\<TableCell\>単価\</TableCell\>

\<TableCell\>説明\</TableCell\>

\<TableCell /\>

\<TableCell /\>

\</TableRow\>

\</TableHead\>

\<TableBody\>

{id === null ? (

\<TableRow\>

\<TableCell /\>

\<TableCell\>

\<TextField

type="text"

id="name"

{\...register("name", {

required: "必須入力です。",

maxLength: {

value: 100,

message: "100文字以内の商品名を入力してください。",

},

})}

error={Boolean(errors.name)}

helperText={errors.name?.message?.toString() \|\| ""}

/\>

\</TableCell\>

\<TableCell\>

\<TextField

type="number"

id="price"

{\...register("price", {

required: "必須入力です。",

min: {

value: 1,

message: "1から99999999の数値を入力してください",

},

max: {

value: 99999999,

message: "1から99999999の数値を入力してください",

},

})}

error={Boolean(errors.price)}

helperText={errors.price?.message?.toString() \|\| ""}

/\>

\</TableCell\>

\<TableCell\>

\<TextField

type="text"

id="description"

{\...register("description")}

/\>

\</TableCell\>

\<TableCell /\>

\<TableCell\>

\<Button

variant="outlined"

startIcon={\<CancelIcon /\>}

onClick={() =\> handleAddCancel()}

\>

キャンセル

\</Button\>

\<Button

type="submit"

variant="contained"

startIcon={\<CheckIcon /\>}

onClick={() =\> setAction("add")}

\>

登録する

\</Button\>

\</TableCell\>

\</TableRow\>

) : null}

{data.map((data: ProductData) =\>

id === data.id ? (

\<TableRow key={data.id}\>

\<TableCell\>{data.id}\</TableCell\>

\<TableCell\>

\<input

type="text"

id="name"

{\...register("name", {

required: true,

maxLength: 100,

})}

/\>

{errors.name && (

\<div\>100文字以内の商品名を入力してください\</div\>

)}

\</TableCell\>

\<TableCell\>

\<input

type="number"

id="price"

{\...register("price", { min: 1, max: 99999999 })}

/\>

{errors.price && (

\<div\>1から99999999の数値を入力してください\</div\>

)}

\</TableCell\>

\<TableCell\>

\<input

type="text"

id="description"

{\...register("description")}

/\>

\</TableCell\>

\<TableCell /\>

\<TableCell\>

\<Button

variant="outlined"

startIcon={\<CancelIcon /\>}

onClick={() =\> handleEditCancel()}

\>

キャンセル

\</Button\>

\<Button

type="submit"

variant="contained"

startIcon={\<CheckIcon /\>}

onClick={() =\> setAction("update")}

\>

更新する

\</Button\>

\<IconButton

aria-label="削除する"

type="submit"

color="warning"

onClick={() =\> setAction("delete")}

\>

\<DeleteIcon /\>

\</IconButton\>

\</TableCell\>

\</TableRow\>

) : (

\<TableRow key={data.id}\>

\<TableCell\>{data.id}\</TableCell\>

\<TableCell\>{data.name}\</TableCell\>

\<TableCell\>{data.price}\</TableCell\>

\<TableCell\>{data.description}\</TableCell\>

\<TableCell\>

\<Link href={\`/inventory/products/\${data.id}\`}\>

在庫処理

\</Link\>

\</TableCell\>

\<TableCell\>

\<IconButton

aria-label="編集する"

color="primary"

onClick={() =\> handleEditRow(data.id)}

\>

\<EditIcon /\>

\</IconButton\>

\</TableCell\>

\</TableRow\>

),

)}

\</TableBody\>

\</Table\>

\</TableContainer\>

\</Box\>

\</\>

);

}



　登録や更新、削除処理を行なった際の結果をalertで返していた箇所を、メッセージを伝えるSnackbarを使うように変更しました。❸でSnackbarを画面に追加し、❶でSnackbarの表示の可否やメッセージといったステートを管理しています。そして❷の登録や更新、削除処理内で具体的なメッセージなどを設定しています。

　商品在庫画面でも同様に仕入れ・卸し処理時にSnackbarを組み込みましょう。

![図](media/image13.png){width="21.333333333333332in" height="10.979166666666666in"}

#### Step: 商品在庫画面にデザインを適用する

```

"use client";

import type { AlertColor } from "\@mui/material";

import {

Alert,

Box,

Button,

Paper,

Snackbar,

Table,

TableBody,

TableCell,

TableContainer,

TableHead,

TableRow,

TextField,

Typography,

} from "\@mui/material";

import { useParams } from "next/navigation";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import inventoriesData from "../sample/dummy\_inventories.json";

import productsData from "../sample/dummy\_products.json";

type ProductData = {

id: number;

name: string;

price: number;

description: string;

};

type FormData = {

id: number;

quantity: number;

};

type InventoryData = {

id: number;

type: string;

date: string;

unit: number;

quantity: number;

price: number;

inventory: number;

};

export default function Page() {

const params = useParams\<{ id: string }\>();

const id = Number(params?.id);

const {

register,

handleSubmit,

formState: { errors },

} = useForm\<FormData\>();

// 読込データを保持

const \[product, setProduct\] = useState\<ProductData\>({

id: 0,

name: "",

price: 0,

description: "",

});

const \[data, setData\] = useState\<Array\<InventoryData\>\>(\[\]);

// submit時のactionを分岐させる

const \[action, setAction\] = useState\<string\>("");

const \[open, setOpen\] = useState(false);

const \[severity, setSeverity\] = useState\<AlertColor\>("success");

const \[message, setMessage\] = useState("");

const result = (severity: AlertColor, message: string) =\> {

setOpen(true);

setSeverity(severity);

setMessage(message);

};

const handleClose = () =\> {

setOpen(false);

};

useEffect(() =\> {

const selectedProduct: ProductData = productsData.find(

\(v\) =\> v.id === id,

) ?? {

id: 0,

name: "",

price: 0,

description: "",

};

setProduct(selectedProduct);

setData(inventoriesData);

}, \[id\]);

const onSubmit = (event: FormData): void =\> {

const data: FormData = {

id: id,

quantity: Number(event.quantity),

};

// actionによってHTTPメソッドと使用するパラメーターを切り替える

if (action === "purchase") {

handlePurchase(data);

} else if (action === "sell") {

if (data.id === null) {

return;

}

handleSell(data);

}

};

// 仕入れ・卸し処理

const handlePurchase = (data: FormData) =\> {

result("success", "商品を仕入れました");

console.log("handlePurchase", data);

};

const handleSell = (data: FormData) =\> {

result("success", "商品を卸しました");

console.log("handleSell", data);

};

return (

\<\>

\<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}\>

\<Alert severity={severity}\>{message}\</Alert\>

\</Snackbar\>

\<Typography variant="h5"\>商品在庫管理\</Typography\>

\<Typography variant="h6"\>在庫処理\</Typography\>

\<Box component="form" onSubmit={handleSubmit(onSubmit)}\>

\<Box\>

\<TextField

disabled

fullWidth

id="name"

label="商品名"

variant="filled"

value={product.name}

/\>

\</Box\>

\<Box\>

\<TextField

type="number"

id="quantity"

variant="filled"

label="数量"

{\...register("quantity", {

required: "必須入力です。",

min: {

value: 1,

message: "1から99999999の数値を入力してください",

},

max: {

value: 99999999,

message: "1から99999999の数値を入力してください",

},

})}

error={Boolean(errors.quantity)}

helperText={errors.quantity?.message?.toString() \|\| ""}

/\>

\</Box\>

\<Button

variant="contained"

type="submit"

onClick={() =\> setAction("purchase")}

\>

商品を仕入れる

\</Button\>

\<Button

variant="contained"

type="submit"

onClick={() =\> setAction("sell")}

\>

商品を卸す

\</Button\>

\</Box\>

\<Typography variant="h6"\>在庫履歴\</Typography\>

\<TableContainer component={Paper}\>

\<Table\>

\<TableHead\>

\<TableRow\>

\<TableCell\>処理種別\</TableCell\>

\<TableCell\>処理日時\</TableCell\>

\<TableCell\>単価\</TableCell\>

\<TableCell\>数量\</TableCell\>

\<TableCell\>価格\</TableCell\>

\<TableCell\>在庫数\</TableCell\>

\</TableRow\>

\</TableHead\>

\<TableBody\>

{data.map((data: InventoryData) =\> (

\<TableRow key={data.id}\>

\<TableCell\>{data.type}\</TableCell\>

\<TableCell\>{data.date}\</TableCell\>

\<TableCell\>{data.unit}\</TableCell\>

\<TableCell\>{data.quantity}\</TableCell\>

\<TableCell\>{data.price}\</TableCell\>

\<TableCell\>{data.inventory}\</TableCell\>

\</TableRow\>

))}

\</TableBody\>

\</Table\>

\</TableContainer\>

\</\>

);

}



![図](media/image11.png){width="21.333333333333332in" height="10.989583333333334in"}

　この章ではレイアウトの共通化やUIの修正方法を学びました。一貫性のあるデザインを提供するために役立つ機能です。

4-X コンポーネント設計の基礎

4-X-1 なぜコンポーネントを分割するのか？

React開発の核となるのが「コンポーネント」です。前段ではビルトインコンポーネントとしてLinkコンポーネントやレイアウトではMaterialUIのコンポーネントが登場しました。これらは、Webページを構成する部品であり、HTML、CSS、JavaScriptの機能が一まとまりになったものです。

コンポーネントの役割は「コンポーネントは再利用性を高めるために分割する」と説明されることが多いですが、もうひとつ大切な視点があります。それは「責務の分割」です。

![図](media/image4.png){width="10.666666666666666in" height="5.822916666666667in"}

責務の分割: 「その部品が何をする責任を持っているか」でコードを切り分ける考え方です。

例：「在庫一覧画面」という大きな部品の中に、「データ表示」と「登録ボタン」のロジックがすべて入っていると、一つの部品がたくさんの責任を持つことになります。

責務を分割することで、「この部品は入力値のチェックだけを担当する」「この部品はボタンを押す動作だけを担当する」というように、問題が発生したときに直すべき場所を特定しやすくなります。

これは、あなたが部屋を掃除する際に、「キッチン用品」と「衣類」と「本」を同じ箱に入れずに、それぞれの役割に応じて別の箱に分けるのと同じ考え方です。

この責務という考えた方はコンポーネントに限らず、プログラム開発をする際にいろいろなシーンで出てきます。それぞれ粒度は異なりますが、以下のような例があります。

-   フロントエンドやバックエンド

-   バックエンドの中でもデータを受け取ったり返したりするファイルやデータベースにアクセスするファイル

-   ファイルの中のそれぞれのメソッド、関数

この責務というそれぞれの対象に期待される役割を意識することで、プログラムの見通しがよくなり運用しやすいアプリケーションを作成しやすくなります。

4-X-2 コンポーネント分割の考え方

このコンポーネントの分割の仕方にもいくつかのパターンがあります。代表的なものが以下のAtomic Designというものです。

  分割の分類          役割（責務）                                                                     該当するコンポーネント例（本章）                                                               意識すべき点
     
  Atoms（原子         それ以上分割できない最小の部品。単一の役割のみを持つ。                           Inputタグ、Buttonタグ、Labelタグ                                                               スタイルや機能は持たず、見た目だけを担当することが多い。
  Molecules（分子     Atomsをいくつか組み合わせた、機能的なひとまとまり                                フォームの\*\*「入力欄とラベルがセットになった部品」、「タイトルと一覧表示用のコンテナ」\*\*   独立した機能を持つが、データの流れ（親子の関係）を意識し始める。
  Organisms（組織）   MoleculesやAtomsを組み合わせて作られた、画面の一部を構成する大きな部品。         「在庫の登録フォーム全体」、「在庫の一覧テーブル全体                                           画面の特定の領域（セクション）全体を担当し、複雑なロジックを持つことが多い。
  Pages（ページ）     Organismsを配置して作られた画面全体。Next.jsのルーティングに対応するファイル。   pages/index.tsx、pages/login.tsx                                                               データ取得（API連携）や、ページ全体の状態管理など、\*\*「画面全体」\*\*の役割を担う。

本稿では適用しませんが、どのようなパターンがあるかを知っておくことで初めて見るプログラムでも理解がしやすくなります。大きなプロジェクトになるとアプリケーションを構成するファイルも数百ファイル以上と膨大な量になってきます。そのファイルの内容の一つ一つを開いて確認していくことはとてもできません。

しかし、このパターンや期待される責務を理解しておくことで、そのファイルの内容の詳細を知らなくても動作などについてある程度理解することができるようになります。

4-7 ログイン画面

　残りのログイン画面も作成していきます。Marterial UIも適応した状態で作成していきましょう。

4-7-1 ベース画面の作成

　コード4-2-3にて作成したログイン画面用のpage.tsxを修正していきます。商品一覧画面と商品在庫画面を作成していく過程で様々な実装を行いました。このログイン画面ではそれらを思い出しながら、一度に同様の修正を反映させてみましょう。

#### Step: ログイン画面にいままでの修正内容を適用する

page.tsxのファイルを開いて、次のコードを記載してください（コード4-7-1）。

```

"use client";

import {

Box,

Button,

Container,

CssBaseline,

TextField,

ThemeProvider,

Typography,

createTheme,

} from "\@mui/material";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

type FormData = {

username: string;

password: string;

};

export default function Page() {

const {

register,

handleSubmit,

formState: { errors },

} = useForm\<FormData\>();

const router = useRouter();

const defaultTheme = createTheme();

const onSubmit = (data: FormData): void =\> {

handleLogin(data);

};

const handleLogin = (data: FormData) =\> {

router.push("/inventory/products");

};

return (

\<ThemeProvider theme={defaultTheme}\>

\<Container component="main"\>

\<CssBaseline /\>

\<Box

sx={{

marginTop: 8,

display: "flex",

flexDirection: "column",

alignItems: "center",

}}

\>

\<Typography component="h1" variant="h5"\>

ログイン

\</Typography\>

\<Box component="form" onSubmit={handleSubmit(onSubmit)}\>

\<TextField

type="text"

id="username"

variant="filled"

label="ユーザー名（必須）"

fullWidth

margin="normal"

{\...register("username", { required: "必須入力です。" })}

error={Boolean(errors.username)}

helperText={errors.username?.message?.toString() \|\| ""}

/\>

\<TextField

type="password"

id="password"

variant="filled"

label="パスワード（必須）"

autoComplete="current-password"

fullWidth

margin="normal"

{\...register("password", {

required: "必須入力です。",

minLength: {

value: 8,

message: "8文字以上の文字列にしてください。",

},

})}

error={Boolean(errors.password)}

helperText={errors.password?.message?.toString() \|\| ""}

/\>

\<Button

variant="contained"

type="submit"

fullWidth

sx={{ mt: 3, mb: 2 }}

\>

ログイン

\</Button\>

\</Box\>

\</Box\>

\</Container\>

\</ThemeProvider\>

);

}



#### Step: ログイン画面から一覧画面にログインする

　これでログイン画面は完成です。ログインボタンを押下すれば商品一覧画面に遷移し、ユーザー名やパスワードがバリデーションに引っかかればエラーメッセージが表示されます。

[[http://localhost:3000/login]](http://localhost:3000/login)

*図4-7-1　ログイン画面*

![図](media/image8.png){width="21.333333333333332in" height="10.96875in"}

4-7-2 useRouter

　先ほどのコードが、今までと異なるのは以下の箇所です。

```
import { useRouter } from "next/navigation";

（中略）

const router = useRouter();

router.push("/inventory/products");

　商品一覧画面から商品在庫画面への遷移はLinkコンポーネントを使用していました。しかし今回の場合は、ログインボタンを押した後に認証が成功したかどうかで遷移動作を分けたいため、useRouterというhookを使っています。

　useRouterはNext.jsから提供されるhookです。以前登場したuseStateやuseEffectはReactの提供するhookなので区別しておくと、他のReactプロジェクトでも混乱しないでしょう。useRouterによって生成されたオブジェクトを利用することで、関数内から任意のページに遷移する機能を実現できます。少し前に紹介したLinkコンポーネントと異なり、関数内で利用するといったプログラム的な遷移の制御を行えることが特徴です。

　また、今回は使用しませんがrouterオブジェクトは過去の遷移情報やURLの情報を持っているため、戻るボタンやリロードボタンの実現にも使用できます。

　第5章ではログインと商品一覧、商品在庫画面の表示を担当するフロントエンドの実装を行いました。第6章では、第5章でダミーデータとなっていた商品情報や認証の処理をバックエンド側で実装、フロントエンドと連携させていきます。

4-x レスポンシブ

4-x-x スマホ向けレイアウトの作成

#### STEP: スマホ向けのレスポンシブを実装する

// TODO: 状態を記載する

```
samplesamplesamplesamplesamplesamplesamplesamplesample

samplesamplesamplesamplesamplesamplesamplesamplesample

samplesamplesamplesamplesamplesamplesamplesamplesample

samplesamplesamplesamplesamplesamplesamplesamplesample

samplesamplesamplesamplesamplesamplesamplesamplesample

samplesamplesamplesamplesamplesamplesamplesamplesample

samplesamplesamplesamplesamplesamplesamplesamplesample

#### STEP: 開発者モードに切り替える

// TODO: 状態を記載する

#### STEP: レイアウトを切り替えてPC・スマホでレスポンシブデザインになっていることを確認する

// TODO: 状態を記載する

4-9 Gitに作業状態を残す

#### **Step フロントエンドの初期状態をローカルのgitに保存する**

ここまで実行できたでしょうか。問題なければ、いったんこの状態を保存するためにgithubに開発状態を連携したいと思います。

##### **コマンドプロンプト（Ubuntu）**

cd /usr/local/src/dev/\<REPO\>

git add .

git commit -m "6章終了時点"

#### ****

#### **Step ローカルのgitの状態をgithubに連携する**

以下のコマンドを実行してください。

##### **コマンドプロンプト（Ubuntu）**

git push origin main

Enumerating objects: 25, done.

Counting objects: 100% (25/25), done.

Delta compression using up to 8 threads

Compressing objects: 100% (24/24), done.

Writing objects: 100% (25/25), 76.02 KiB \| 8.45 MiB/s, done.

Total 25 (delta 0), reused 0 (delta 0), pack-reused 0

To https://github.com/keiji-ueno/wfswd02.git

\* \[new branch\] main -\> main

4-10 本章のハンズオンチェック

以下の内容を実施できたでしょうか。問題がなければまとめの内容を確認して、次の章に進んでください。

✅[[Next.js]](http://next.js)を利用してフロントエンドだけで動作する画面を作成する

✅登録、更新、削除の動作をするボタンを配置する

✅バリエーションチェックを実装する

✅画面をパーツごとに扱うコンポーネントを実装する

✅フロントエンド環境をGithubのリポジトリに保存する

4-10 本章のまとめ

本章では、Webアプリケーションにおいて顔となるフロントエンドの実装について、深く掘り下げて学習しました。Next.jsを主軸に、ユーザーが実際に操作する画面がどのように構築され、動的な振る舞いをするのかを、ハンズオンを通して体験しました。

具体的には、以下の重要な概念と実装手法を習得しました。

-   Next.jsの基本: プレーンなHTMLから段階的にNext.jsの機能を導入し、コンポーネント指向の考え方、動的なデータ描画のためのuseStateやuseEffectといったReactのHookの利用方法を学びました。

-   ルーティングの仕組み: Next.jsにおけるファイルシステムベースのルーティング、動的ルーティング、そしてページ遷移を最適化するLinkコンポーネントの活用方法を理解しました。

-   フォームとバリデーション: ユーザーからの入力を受け付けるフォームの作成と、React Hook Formというライブラリを用いて入力値のバリデーションを実装し、エラーメッセージをユーザーに表示する方法を学びました。これにより、より堅牢で使いやすいフォームを作成するスキルが身につきました。

-   レイアウトの分割とUIコンポーネント: 共通のヘッダーやサイドバーをlayout.tsxファイルで管理するレイアウトパターンを導入し、Material UIというUIコンポーネントライブラリを適用することで、一貫性のあるデザインを効率的に実現する方法を習得しました。

本章で身につけたフロントエンドでの考え方は、実現方法は違えど他のフレームワークでも共通の考え方になります。実装方法はフレームワークごとに決まっていますが、フロントエンドの実装に求められる基本的な要素は共通しているためNext.js以外のフレームワークを利用する場合でも意識してみてください。

次章では、本章でダミーデータを用いて表示していた商品情報や認証の処理を、いよいよバックエンド側で実装していきます。これにより、データベースと連動した「生きた」フルスタックアプリケーションとしての動作を実現することを目指します。本章とはまた考え方が変わるので、今からバックエンドを実装すると意識を切り替えて次の章に進んでください。
