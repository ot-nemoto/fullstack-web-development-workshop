# 第5章 はじめに


　前章では在庫管理アプリケーションのフロントエンド部分を実装し、ユーザーが直接操作する画面がどのように構築されるのかを学びました。本章では、そのフロントエンドから呼び出される、データの取得や登録といった処理を行うバックエンドの実装を行います。具体的には、PythonのWebフレームワークであるDjangoと、API開発を効率化するDjango REST Framework (DRF) を使用して、データの参照、登録、更新、削除といった基本的なAPI（Application Programming Interface）を実装していきます。

## 5-1-1 本章の目的と概要


#### 本章で達成できること


本章のハンズオンを実施すると、WebアプリケーションにAPIの仕組みを理解し、DjangoとDjango REST Framework (DRF) を使って、APIを実装できるようになります。

APIでは参照と登録・更新・削除を実装しバックエンドの基本的なデータベース操作ができるようになります。

#### なぜAPIが必要なのか？


フロントエンドだけではユーザーの入力したデータを保存したり、外部のサービスと連携したりすることはできません。APIを使うことで、バックエンドとのデータのやり取りが可能になり、より実用的なWebアプリケーションを構築できるようになります。

## 5-1-2 開発環境の準備


本章を開始するにあたって、第3章のハンズオンが完了し、以下の環境が整っていることを前提とします。

-   Dockerコンテナ上でDjangoが動作し、ウェルカムページが表示できること 。

-   Githubにバックエンドのリポジトリが作成されており、ウェルカムページが表示されるコードまでコミットされていること。

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未設定の箇所があれば3章に戻り、設定を見直してください。

## 5-1-3 この章からハンズオンを始める場合


2章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませて置いてください。

また、本章から始めたいという方は以下のリポジトリをクローンもしくはフォークして初めて見てください。

\# クローン or フォークコマンド

git clone https://github.com/USERNAME/full-stack-web-development-backend.git

cd full-stack-web-development-backend



フォークが完了したら以下の操作でDockerコンテナを立ち上げてみてください。

\# DevContainorの展開

\# npmインストールとNext.jsの起動コマンド



バックエンドの環境を最新化しアプリケーションを立ち上げるために、以下のコマンドを実行してください。

\# DevContainorの展開

\# npmインストールとNext.jsの起動コマンド



本章以降は読者の理解度に合わせて好きな章からハンズオンを開始することができます。また、学習をはじめからやり直したいときなどご利用ください。

この章から新規にハンズオンを始める場合は以下のURLのリポジトリをクローンして始めてください。

[[https://xxxx]{.underline}](https://xxxx)

クローンおよび開発環境の構築手順は、X章Y項を参考にしてください。

## 5-1-4 バックエンドに関する基礎知識


　本章ではPythonで構成されたWebアプリケーションのフレームワークであるDjangoを使ってハンズオン行います。そのため、Djangoで開発をする場合、最低限のPythonの知識が必要になります。そこで、まずはこの章を読み進めていく上で必要なPythonの知識を振り返っておきましょう。Pythonについて基本的な知識を持っている、という方は読み飛ばしても構いません。

### クラス定義

　他の言語と同じように、classキーワードを用いてクラス定義を行います。注意点として、第5章で扱ったJavaScriptをはじめとする他の言語では、中かっこ（｛｝）を使ってクラスや関数の塊を表していましたが、Pythonでは中かっこは使わずにインデントで表現をします。

class クラス名:

変数名 = 値



関数

　関数はdefキーワードを用いて定義します。第5章の冒頭で解説したJavaScriptのfunctionの書き方に似ています。

def 関数名(引数名1, 引数名2):

処理



メソッド

　メソッドは上記の関数と似ていて、defキーワードを用いて定義します。関数との違いはクラスの内部にいるかどうかどうかです。またクラスに関連するため、第一引数に自身のクラスのインスタンスを表すselfという名前の引数を持っています。本書では関数とメソッドの違いを意識して実装をするコードはないため、こういった書き方もあるといった程度の認識でOKです。

class クラス名:

def 関数名(self, 引数1, 引数2):

処理



コンストラクタ

　コンストラクタは\_\_init\_\_という特別なメソッドを使用して定義をします。他の言語と同様に、クラスのインスタンス作成時に自動的に呼び出されます。また、上記のメソッドと同様にselfを第一引数に持っています。本書では実装上は使用しませんが、フレームワークのコードを分析するときに見かけます。

class クラス名:

def \_\_init\_\_(self, 引数1):

self.クラス変数1 = 引数1



インスタンス

　インスタンスの生成はクラス名を記載してコンストラクタを呼び出すことで行います。

インスタンス1 = クラス名()

インスタンス2 = クラス名(変数1)



継承

　継承も他のオブジェクト指向をサポートする言語と同様に行うことができます。本稿で作成する多くのクラスはフレームワークから提供されるクラスを継承して作成するため、しっかり押さえておきましょう。

class 親クラス:

内容

class 子クラス(親クラス):

内容



　多少書き方は異なりますが、Javaといったオブジェクト指向言語と同じような機能が備わっています。

例外処理

　例外処理はtryキーワードを起点に行います。

try:

例外が発生する可能性のある処理

except 例外の種類 as エラーオブジェクト:

例外が発生した場合の処理

else:

例外が発生しなかった場合の処理

finally:

例外の有無にかかわらず必ず実行される処理



例外のスロー

　例外のスローはraiseキーワードを使用します。

raise 例外のクラス(\"エラーメッセージ\")



　また、バックエンドの要素は図5-1-1のような関係になっています。フロントエンドよりもシンプルですが、各クラスの関係やライブラリの依存関係などは少し複雑なので意識して進めてください。

![](media/image28.png)

図5-1-1　フロントエンドで使用する技術要素の関係図

# 第5章 バックエンドの全体像


フルスタック開発において、バックエンドは「見えない司令塔」のような役割を担います。ユーザーの操作に応じてデータベースと連携し、必要なデータの取得や保存、複雑な計算などを裏側で行う部分です。この章を通して、Webアプリケーションがどのようにデータのやり取りを行っているのか、その仕組みを深く理解することを目指します。

## 5-2-1 APIの一覧と機能分類


　第II部の冒頭で設計したバックエンドで作成するAPIについて、改めて確認します（表5-2-1）。

表5-2-1　APIの一覧

API メソッド URL

商品一覧参照 GET http://localhost:8000/api/inventory/products/

商品参照 GET http://localhost:8000/api/inventory/products/\[id\]

商品登録 POST http://localhost:8000/api/inventory/products/

商品更新 PUT http://localhost:8000/api/inventory/products/\[id\]

商品削除 DELETE http://localhost:8000/api/inventory/products/\[id\]

仕入れ登録 POST http://localhost:8000/api/inventory/purchases/

卸し登録 POST http://localhost:8000/api/inventory/sales/

在庫一覧参照 POST http://localhost:8000/api/inventory/inventories/

ログイン POST http://localhost:8000/api/inventory/login/

リフレッシュ POST http://localhost:8000/api/inventory/retry/

ログアウト POST http://localhost:8000/api/inventory/logout/

同期処理登録 POST http://localhost:8000/api/inventory/sync/

非同期処理登録 POST http://localhost:8000/api/inventory/async/

売上一覧参照 POST http://localhost:8000/api/inventory/summary/

種類は多いですが、大きく分けると次の３種類になります。

・商品機能用API

・在庫機能用API

・ログイン機能用API

本章では商品一覧から在庫一覧参照までを実装します。

ログイン関連のAPIは6章、同期処理関連のAPIは8章で実装するので、本章には登場しません。

　数が多いように思われますが、参照・更新の対象としては３つほどです。

#### 



##### 







##### 







##### 





### 5-2-1 バックエンドの実装の流れ

　図5-2-1はバックエンドの処理の流れを表したイメージ図です。views.pyがレスポンスを返す本体になります。このviews.pyにリクエストを結びつけるためにurls.pyが必要になります。そしてviewのレスポンスを作成するために、models.pyが必要になります。また、models.pyはDBのテーブルを作成するという役割も持っています。レスポンスを扱いやすい形にするためにシリアライザーを使います。個別のファイルの役割については必要になった段階で改めて説明するので、まずはこのような流れで処理がされているのだなというイメージを持ってください。

![](media/image20.png)

図5-2-1　Djangoにおけるファイルの構成と本アプリケーションで扱う範囲

## 5-1-3 バックエンドの実装範囲


　第5章の冒頭でも触れたように、フロントエンドとバックエンドでは役割が異なります。この役割の違いを意識して実装ができると、後からコードを見直すときに処理の意図が理解しやすくなります。

　フロントエンドが画面表示やその動作に関する役割を担う一方、バックエンドではデータベースからどのような形式のデータを持ってくるのか、どのようにデータを取得するのかといった部分に関する処理を担っています。

![](media/image2.png)

図5-1-2　バックエンドの実装範囲の概念図

# 第5章 最小限のAPIの実装 ※ 旧版4章


4-2-1 バックエンド（API）におけるリクエスト・レスポンス ※ 旧版4章
-----------------------------------------------------------------

　この節からは、フロントエンド（React、Next.js）とバックエンド（Python、Django）のアーキテクチャを分けて作成し連携していきます（図4-2-1）。

図4-2-1　アーキテクチャ構成図

　前項までは、サーバーサイドJavaScriptを用いて、Next.js同士のフロントエンド、バックエンド通信を行ってきました。

　今度はDjangoを使って、バックエンドのAPIを用意してみましょう。Next.js（クライアント）からDjango（バックエンド）に向けてリクエストを行い、取得結果をクライアントにレスポンスし表示します。なお、本節以降、Pythonでのプログラミングを行う機会が多くなりますが、Pythonではプログラムの「インデント」によってブロックを見分けています。コードをコピーして貼り付ける際などにはインデントも注意して反映してください。

![](media/image51.png)

図4-2-2　バックエンド処理イメージ

サーバー側についてさらに踏み込んでみてみましょう。フロントエンドからきたリクエストは大きく３つの仕組みを通って処理が行われます。

![](media/image13.png)

4-2-2　最小限のAPIの実装
------------------------

API実装の大きな流れを理解するために、まずはデータベースが関係しないAPIを実装してみましょう。以下の箇所の実装を行います。

![](media/image13.png)

#### Step: バックエンドのコンテナを立ち上げる


　WindowsのメニューからUbuntuを立ち上げてバックエンドのディレクトリ（/usr/local/src/dev/app/backend）から「code .」コマンドで、バックエンドのVSCodeを起動しましょう。そしてターミナルで次のコマンドを実行して、Djangoのアプリケーションを追加します。VSCodeを起動したら必ず左下のコンテナ接続を確認しましょう。コンテナと表示されず「\>\<」になっている場合、コンテナに接続していません。青のハイライトをクリックして「コンテナーで再度開く」を選択し、接続しましょう（図4-2-3）。

##### backend: コマンドプロンプト（VSCode）


mkdir api

cd api



表示を確認

![](media/image30.png)

図4-2-3　アプリケーションの追加

#### Step: APIを入れるためのアプリケーションを作成する


　3-3-1項「バックエンド開発準備」では、「django-admin startproject」コマンドを使用して「config」という名前のプロジェクトを作成しました。その際に説明したように、本書においてDjangoのプロジェクトは環境設定情報の管理のために使用しています。なお、実際の開発現場でも、本書のようにプロジェクトを環境情報の管理として使用しているケースもあります。本項では「django-admin startapp」コマンドを使い「アプリケーション」を作成していきます。

django-admin startapp {アプリケーション名}



　今回はinventoryというアプリケーションを追加します。APIとして使用されることが明確になるように、apiディレクトリを作成して、その配下にinventoryアプリケーションを作成します。次のコマンドをVSCodeのターミナルで実行してください。

##### コマンドプロンプト（Ubuntu）


django-admin startapp inventory



　api/inventoryにいくつかのファイルが作成されたはずです（図4-2-4）。

①

②

![](media/image38.png)

図4-2-4　バックエンドアプリケーションが追加される

### 代表的なファイルの役割

　VSCodeのエクスプローラーを見ると、先ほどstartappしたapp/inventory（①）のアプリケーションフォルダと、第3章で作成したプロジェクトフォルダ（②）の2つがあります。それぞれのフォルダにあるファイルの役割は次の通りです。

api/inventoryフォルダの中身

・\_\_init\_\_.py

　ファイルを含むディレクトリをパッケージとしてPythonに扱わせるためのファイルです。変更の必要はありません。

・admin.py

　Django管理画面にテーブルを表示するための定義です。本書では使用しません。

・apps.py

　アプリケーションの設定をします。本書では使用しません。

・[[models.py]{.underline}](http://models.py)

　テーブル構成と密接に関わる重要なファイルです。本章の5-3で詳しく解説します。

・tests.py

　テストコードを記載します。本書では使用しません。

・views.py

　API実行時の本処理を記載する箇所です。

/configフォルダの中身

　このフォルダの設定は（プロジェクト）全体の共通設定になります。

・urls.py

　urls.pyは、Djangoアプリケーションのルーティング設定を管理するファイルです。具体的には、WebブラウザからのリクエストURLと、そのリクエストを処理するDjangoのビュー関数またはクラスベースのビューとのマッピングを定義します。

・asgi.py

　非同期通信のための定義です。

・wsgi.py

　フロントエンドとの通信の定義です。

・[[settings.py]{.underline}](http://settings.py)

![](media/image45.png)

図4-2-5　Djangoファイル構造基本概念図

4-2-3　ルーティング
-------------------

#### Step: Djangoで共通設定のAPIへのルーティングを設定する


　APIを使用するためにはルーティング（このURLでリクエストがきたら、このアプリケーションを動かすという設定）が必要です。図4-2-4にあるように、プロジェクト全体の設定をしているconfig/[[urls.py]{.underline}](http://urls.py)と個別アプリケーションのapi/inventory/urls.pyそれぞれに設定を行います。

コード4-2-1　全体のルーティング（config/urls.py）

##### Backend














// 修正後

from django.contrib import admin

from django.urls import path, include ❷

urlpatterns = \[

path(\"admin/\", admin.site.urls),

path(\'api/inventory/\', include(\'api.inventory.urls\')), ❶

\]



　まずconfig/urls.pyにアプリケーション（inventory）へのpathを追加します。最後のカンマまで忘れないでください（❶）。include関数を使用するのでimportしておきます（❷）。

　これは「api/inventory/のリクエストがきたら、api/inventory/urls.pyの定義を見てください」という指定です。config/urls.pyに全てのルーティングを直接指定してもよいのですが、定義数が多くなって管理がしづらくなります。そこで、config/urls.pyではなくconfig/inventory/urls.pyに記述してアプリケーションごとに定義ファイルを分けることで、管理がしやすくなります。

#### Step: Djangoで個別のアプリケーションへのルーティング設定ファイルを追加する


　次にapi/inventoryフォルダにurls.pyというファイルを新規に作成し、次のコードを記入してください。

コード4-2-2　inventoryアプリのルーティング（api/inventory/urls.py）**New**

##### Backend


from django.urls import path

from . import views

urlpatterns = \[

// ここにルーティングする対象を追記していく

\]



### Djangoにおけるルーティング

以下のファイルはサンプルなので実装する必要はありません。見るだけで大丈夫です。

from django.urls import path

from . import views

urlpatterns = \[

path(\'sample/\', views.SampleView.as\_view())

\]



　これはsample/というリクエストがきたらviews.pyのSampleViewというClassを参照するという指定になります。前述のルーティングと合わせると、「api/inventory/sample/というリクエストがきたら、api/inventory/views.pyのSampleViewというClassを参照してください」という指定になります。

このようにアプリケーション毎にファイルを分けることでルーティングの管理もわかりやすくしています。

![](media/image24.png)

図4-2-6　リクエストURLと[[urls.py/views.pyの紐づけ]{.underline}](http://urls.py/views.py%E3%81%AE%E7%B4%90%E3%81%A5%E3%81%91)

また4章で解説したNext.jsのファイルシステムベースルーティングとの違いを比べてみてください。こちらのバックエンドでは、ファイル内に明示的にURLと対象ファイルを記載しています。

4-2-4　API内の処理の実装
------------------------

#### Step: APIの処理を実装する


　それでは、views.pyの実装に進みましょう。Next.jsでは作成したプログラム（hogehoge.ts）を「apiフォルダ」に配置すれば、APIとして動作しました。Djangoの場合には「rest\_framework」を使用してコードを実装することでAPIとして動作し、JSONを返すことになります。なお、apiフォルダをバックエンドでも作成しているのは、開発者にとってのわかりやすさのためです。

　views.pyの内容をすべて削除して次のコードを新たに書いてください（コード4-2-3）。

コード4-2-3　バックエンド実装（api/inventory/views.py）**New**

##### Backend


from rest\_framework.response import Response \# rest\_frameworkを使用する

from rest\_framework.views import APIView

class ProductView(APIView):

def get(self, request, format=None):

return Response({\"message\": \"products\"})



　後半では、先ほどの説明にあったBackendというclassを指定しています。def getとありますが、これはGETリクエストがきたら実行されるという意味です。ここでは{\"message\": \"products\"}というJSONをレスポンスで返却しています。

#### Step: 追加したapiへのルーティングを設定する


　ProductViewというクラスを追加しただけでは、HTTP経由でこのapiを実行することはできません。ProductViewと実行URLを紐づけてあげるために、ルーティングを設定してあげます。

コード4-2-2　inventoryアプリのルーティング（api/inventory/urls.py）

##### Backend


from django.urls import path

from . import views

urlpatterns = \[

path(\'products/\', views.ProductView.as\_view())

\]



#### Step: APIを実行して結果を確認しよう


実際にBackendを動かして確認しましょう。次のコマンドをVSCodeのターミナルでbackendディレクトリに移動し、実行してください。

##### コマンドプロンプト（Ubuntu）


cd /workspaces/app/backend/

python manage.py runserver 



　ブラウザでhttp://localhost:8000/api/inventory/products/ にアクセスしてみてください。Django REST Frameworkが提供する「Browsable API」画面というAPIを簡単にテストすることができる画面が表示されます。この画面の実行結果に先ほど作成したバックエンドのAPIのレスポンスである「ProductView」という値が返却されているはずです。

図4-2-7　バックエンドレスポンス

![](media/image39.png)

上記のようなテスト画面はDRF以外のすべてのフレームワークに用意されているわけではありません。一般的にはAPIをテストするための専用ツールであるAPIクライアントや5-8で実装するAPIを管理するためのフレームワークを使用したりします。

### JSONとは？

　JSON（JavaScript Object Notation）は、データの交換や保存に使用される軽量なデータ形式です。JSONでは、キーと値のペアからなるオブジェクトを持つことができます。キー（Key）を指定すると値を特定することができます。例だと、キー「name」の値は「"John Doe"」になります。

　このようにNext.jsはフロントエンドだけでなくバックエンドの機能も備えています。pages/api/inventory.tsのように、pages/api配下のファイルは、Next.jsが起動したサーバー上で動いています。バックエンド機能なので、設定を行えばデータベースにアクセスすることも可能です。フロントエンドもバックエンドもNext.jsで完結することができるのです。

APIで値を取得できることはわかりました。ではデータベースの値を取得したり操作したりするにはどうしたらよいでしょうか。次の節で見ていきましょう。

# 第5章 バックエンドにおけるモデル


　この節ではDjangoの仕組みを使ったアプリケーションのモデルの役割とDBの管理方法について学習します。この節ではAPIを使った処理は登場しません。APIをやってDBを操作するための準備をするための節です。この準備では「モデル」というDjangoとデータベースを関連付けるようなファイルを作成します。

![](media/image13.png)

## 5-3-1 モデルとは何か


　実装を進める前に、モデルのイメージをもう少しつかんでおきましょう。まずモデルは、データベースに保存されているデータに関する情報を表しており、データが持っているフィールドとその動作を定義します。一般的に、各モデルはデータベースのテーブルに対応づけられます。Djangoの公式のページによればモデルの役割は次のように説明されています。

・モデルは各々 Python のクラスであり django.db.models.Model のサブクラス

・モデルの属性はそれぞれがデータベースのフィールドを表す

・これら全てを用いて、Django はデータベースにアクセスする自動生成された API を提供する

　つまり、Djangoにおいてモデルはデータベースのテーブル定義書としての役割とアプリケーションとしてのORマッパー的な役割をしてくれそうです。データモデルとアプリケーション上のモデルは一致します。

　例として、商品名というカラムを持つ商品テーブルをDjangoのモデルで表してみましょう。こちらは手を動かす必要はなく、コードの内容を見てもらえれば大丈夫です（コード5-3-1）。

コード5-3-1　モデルのサンプルコード

from django.db import models

class Product(models.Model):

\"\"\"

商品

\"\"\"

name = models.CharField(max\_length=100, verbose\_name=\'商品名\')

class Meta:

db\_table = \'product\'

verbose\_name = \'商品\'



　テーブルとコードの構造が紐づいていることをイメージできたでしょうか。それでは、モデルをプロジェクトで使用する方法や設計方法について学んでいきましょう。

## 5-3-2 モデルの利用


　定義したモデルを利用するには、Djangoにこれらのモデルを「利用する」ということを知らせる必要があります。これはDjangoのプロジェクト配下には複数のアプリケーションを作成することができるため、作成時点ではプロジェクトとアプリケーションに、特に関係性がないためです。

![](media/image1.png)

図5-3-1　プロジェクトとアプリケーションの関係







　このconfig配下にurlの設定や環境などの設定ファイルも入れて管理しています。これらのファイルはどのアプリケーションでも共通して使用されます。

#### Step: アプリ用のオリジナルのモデルファイルのマイグレーション設定を確認しよう


　設定ファイルを編集して、設定値 INSTALLED\_APPS に、定義した models.py を含むモジュール名を追加します（コード5-3-2、コード5-3-3）。

コード5-3-2　共通設定ファイル（config/settings.py）

##### Backend


INSTALLED\_APPS = \[

（中略）

\"rest\_framework\", \# 3章で追加したもの

\"api.inventory\", \# 前節で追加したアプリケーションを読み込む

\]



コード5-3-3　在庫管理アプリ設定ファイル（api/inventory/apps.py）

##### Backend


from django.apps import AppConfig

class InventoryConfig(AppConfig):

default\_auto\_field = \"django.db.models.BigAutoField\"

name = \"api.inventory\" \# 修正



### アプリケーションの識別子

　ここで修正したnameに記載した「api.inventory」はこのアプリケーションを識別するための名前です。この名前を用いてINSTALLED\_APSにアプリケーションの追加をしています。もちろん、当初設定されていた「inventory」でも問題はないのですが、本稿ではフォルダ構成と一致させるために修正を行っています。

　このINSTALLED\_APPS内には、今後も作成したアプリケーションなどを追記していく機会があります。ここにはDjangoインスタンスの中で有効化されている全てのDjangoアプリケーションの名前を保持しています。アプリは複数のプロジェクトによって使用されることができますし、また、他の開発者が彼らのプロジェクトで使用するためにパッケージして配布することもできます。次に示すのは公式ドキュメントからの引用です【※5-1】。


　デフォルトでは、INSTALLED\_APPSには以下のアプリケーションが入っています。

・django.contrib.admin - 管理（admin）サイト

・django.contrib.auth - 認証システム

・django.contrib.contenttypes - コンテンツタイプフレームワーク

・django.contrib.sessions - セッションフレームワーク

・django.contrib.messages - メッセージフレームワーク

・django.contrib.staticfiles - 静的ファイルの管理フレームワーク

　今回は、バックエンドはREST APIサーバーとして利用するので、3-3-2項で準備したrest\_frameworkというモジュールも追加しています。rest\_frameworkについては後ほど説明します。

##### Backend


INSTALLED\_APPS = \[

\#\...,

\"rest\_framework\",

\#\...,

\]



## 5-3-3 モデルの設計


　前節でDjangoにおけるモデルはデータベースのテーブルに対応づけられることを説明しました。ということは、モデルを作成するにはDBのテーブル設計が終わっている必要があります。今回の在庫管理アプリケーションで必要なテーブルについて、さっそく設計していきましょう。フロントエンドで作成した商品登録と在庫管理のテーブルに範囲を絞って考えます。

　以下にER図として表しました（図5-3-2）。

![](media/image32.png)

図5-3-2　ER図

　構造について少し見てみましょう。まず商品マスタがあります。これは商品名や価格など、商品についての情報のみを持っています。そして、それに紐づく売上と仕入のテーブルがあります。在庫管理なので、それぞれの商品を仕入れるシーンと、仕入れた商品を顧客に売却するシーンがあります。

　実際のテーブル設計は、アプリケーション化する対象の業務などを分析したり、関連するIOを収集したりして進めますが、今回はサンプルとしてシンプルでわかりやすいテーブルで進めます。

### 商品マスタ

　それでは、上記のテーブルをDjangoのモデルに落とし込んでみましょう。

**Step: テーブル定義を元にアプリ用のオリジナルの商品モデルファイルを作成しよう**

まずは商品マスタです。

コード5-3-4　モデル（api/inventory/models.py）

##### Backend


from django.core.validators import MinValueValidator

from django.db import models



\# Create your models here.というコメントを削除し以下を追記する

class Product(models.Model): ❶

\"\"\"

商品

\"\"\"

name = models.CharField(max\_length=100, verbose\_name=\'商品名\') ❷

price = models.IntegerField(verbose\_name=\'価格\', validators=\[MinValueValidator(0)\])

description = models.TextField(verbose\_name=\'商品説明\', null=True, blank=True)

class Meta: ❸

db\_table = \'product\'

verbose\_name = \'商品\'

verbose\_name\_plural = \'商品一覧\'



### テーブル定義とモデル設定の対応

　各コードの記述が、どのようにテーブル定義と対応しているのか確認していきましょう。まず、モデルを作成するときは❶のようにDjangoのModelクラスを継承している必要があります。このクラスがテーブルと対応します。Pythonもオブジェクト指向プログラミングをサポートしているため、クラスを定義し継承することができます。

### モデルフィールドオプション

### null=True

データベースでNULL値を許可します

### blank=True

フォームで空欄を許可します

### primary\_key

　次にカラム定義する❷を見てみましょう。主キーとなるidの定義はあるでしょうか。実は、カラム: idは自動的に生成されるため、モデルに記載する必要はありません。ただ、主キーにid以外の任意の名称をつけたい場合もあるでしょう。そういった、明示的に主キーを指定したい場合は、次に示す例のようにprimary\_key=Trueを指定してください。この例ではProductクラスに主キーとなるカラム: product\_idを記載し、オプションでprimary\_keyとして指定しています。

##### Backend


 product\_id = models.CharField(max\_length=100, primary\_key=True, verbose\_name=\'商品ID\')



　次にnameです。物理名がname、論理名は商品名としていて、型は文字列で最大文字数などの条件があります。これらはModelのフィールドおよびフィールドオプションを利用して設定します。今回は文字列でフィールドの型はVARCHAR、長さが100なので、次のようなコードになります。

##### Backend


name = models.CharField(max\_length=100, verbose\_name=\'商品名\')



　置き換えると次のようになります。

物理名 = models.フィールドの型(max\_length=最大長, verbose\_name=論理名)

　指定できるフィールドとそのフィールドの引数の詳細は公式ドキュメント【※5-2】を参照してください。よくテーブルで使われるデータ型との対応例を挙げておきます。


・INTEGER→BigIntegerField(\*\*options)

・VARCHAR→CharField(max\_length=None, \*\*options)

・BOOLEAN→BooleanField(\*\*options)

　次にpriceですが、これはnameとほぼ同じなので解説しなくても大丈夫でしょう。最後に❸のclass Metaを見てみましょう。class Metaではフィールドで指定できないテーブルの設定を行うことができます（追加の設定なので設定しなくても構いません）。

　今回の例ではdb\_tableで物理名、verbose\_nameで論理名を明示的に指定しています。その他、テーブルコメントやデフォルトのソート順を指定することもできます。テーブル名はclass Metaで指定しない場合、クラス名から自動的に生成されます。

**Step: テーブル定義を元にアプリ用のオリジナルの仕入・売上モデルファイルを作成しよう**

### 仕入テーブル

　次は仕入テーブルを見てみましょう。今後モデルを追加するときも、モデル別にファイルを作成するのではなく、models.pyに追記しています（コード5-3-5）。

コード5-3-5　モデル（backend/api/inventory/models.py）

##### Backend


from django.core.validators import MinValueValidator

from django.db import models

from django.utils.timezone import now

\# Create your models here.というコメントを削除し以下を追記する

class Product(models.Model):

（省略）

\# ファイルの最後に以下を追記する

class Purchase(models.Model):

\"\"\"

仕入

\"\"\"

product = models.ForeignKey(Product, on\_delete=models.CASCADE)

quantity = models.IntegerField(verbose\_name=\'数量\', validators=\[MinValueValidator(0)\])

purchase\_date = models.DateTimeField(verbose\_name=\'仕入日時\', default=now)

class Meta:

db\_table = \'purchase\'

verbose\_name = \'仕入\'

verbose\_name\_plural = \'仕入一覧\'



### 制約の付与

　ほとんど同じ構成ですが、1点だけproductの記述が異なり、外部キー制約を付与しています。

##### Backend


 product = models.ForeignKey(Product, on\_delete=models.CASCADE)



売上テーブル

　売上テーブルも同様に作成しましょう（コード5-3-6）。細かな名称以外は仕入れテーブルと同じです。

コード5-3-6　モデル（backend/api/inventory/models.py）

##### Backend


from django.db import models

\# Create your models here.というコメントを削除し以下を追記する

class Product(models.Model):

（省略）

class Purchase(models.Model):

（省略）

\# ファイルの最後に以下を追記する

class Sale(models.Model):

\"\"\"

売上

\"\"\"

product = models.ForeignKey(Product, on\_delete=models.CASCADE)

quantity = models.IntegerField(verbose\_name=\'数量\', validators=\[MinValueValidator(0)\])

sale\_date = models.DateTimeField(verbose\_name=\'売上日時\', default=now)

class Meta:

db\_table = \'sale\'

verbose\_name = \'売上\'

verbose\_name\_plural = \'売上一覧\'



　このモデルを利用してDBの更新操作などを行っていきます。

## 5-3-4 モデルの生成


　前節では、プログラムレベルでのデータモデルの設計を行いました。今度はこの定義を元にデータベースのテーブルを作成しましょう。次のような流れになります（図5-3-3、図5-3-4）。

① モデルを元にDDLとなるようなマイグレーションファイルを生成する

![](media/image46.png)

図5-3-3　①で扱う範囲

② 生成されたマイグレーションファイルを元にDBに変更を加える。

![](media/image34.png)

図5-3-4　②で扱う範囲

　まずは先ほど作成したモデルクラスがapi/inventory/models.pyにあることを確認しましょう。このモデルを使ってDjangoは次のことを実行できます。

・アプリケーションのデータベーススキーマの作成（CREATE TABLE文を実行）

・作成されたテーブルにPythonから参照や登録操作を行えるデータベースAPIの作成

#### Step: オリジナルのモデルファイルを元にDMLに相当するマイグレーションファイルを作成しよう


　では、次のコマンドをターミナルで実行してみましょう。

##### Backend


python manage.py makemigrations inventory



#### Step: マイグレーションファイルが作成されたか確認しよう


　実行するとinventory のmigrationフォルダ配下に、次のようなマイグレーションファイルが作成されます。

Migrations for \'inventory\':

api/inventory/migrations/0001\_initial.py

\+ Create model Product

\+ Create model Purchase

\+ Create model Sale



図5-3-4　マイグレーションファイルの作成結果

![](media/image35.png)

　初回の作成なので0001\_xxxという番号がついていますが、これは自動的に採番されていきます。makemigrations を実行することで、Djangoにモデルを変更したこと（今回の場合は、新規の作成となる）を伝え、変更を「マイグレーション」の形で保存できました。

　マイグレーションファイル作成の準備ができました。それでは、図4-3-2の通りにmakemigrationを使用してマイグレーションファイルの作成を進めていきます。

### マイグレーションコマンド実行時のエラー

　もし以下のように「inventoryがインストールされていません」といったメッセージが出たら設定ファイルbase.pyまたはapps.pyに正しく設定をしているか確認してください。

config.settings.development

No installed app with label \'inventory\'.



　もし次のようなエラーが出ていたら、backend フォルダ直下でコマンドを実行できているか確認してください。

python: can\'t open file \'/workspaces/app/backend/api/manage.py\': \[Errno 2\] No such file or directory



　以下のコマンドでbackendディレクトリに移動し、マイグレーションコマンドを再実行します。

cd /workspaces/app/backend/

python manage.py makemigrations inventory



　もし以下のように「django.core.exceptions.ImproperlyConfigured: Cannot import \'inventory\_db\'. Check that \'api.inventory\_db.apps.inventoryDbConfig.name\' is correct.」いったメッセージが出たら設定ファイルbase.pyまたはapps.pyに正しく設定をしているか確認してください。アプリケーションのパスをapi/inventoryにしました。それにあわせて、アプリケーション名を作成時のinventoryからapi.inventoryに修正する必要があります。

django.core.exceptions.ImproperlyConfigured: Cannot import \'inventory\_db\'. Check that \'api.inventory\_db.apps.inventoryDbConfig.name\' is correct.

##### 


class inventoryDbConfig(AppConfig):

:

name = \"inventory\" → name = \"api.inventory\"

:



## 5-3-4 マイグレーションファイル


#### Step: 作成したマイグレーションファイルの内容を確認しよう


　さっそくこの生成されたマイグレーションファイルをエディターで開き、内容を見てみましょう。全てのコードを載せると長くなるため、一部のみ抜粋しています（コード5-3-7）。

コード5-3-7　モデルから生成されたマイグレーションファイル（api/inventory/migrations/0001\_initial.py）

##### Backend


import django.core.validators

import django.db.models.deletion

import django.utils.timezone

from django.db import migrations, models

class Migration(migrations.Migration):

initial = True

dependencies = \[\]

operations = \[

migrations.CreateModel(

name=\"Product\",

fields=\[

(

\"id\",

models.BigAutoField(

auto\_created=True,

primary\_key=True,

serialize=False,

verbose\_name=\"ID\",

),

),

(\"name\", models.CharField(max\_length=100, verbose\_name=\"商品名\")),

(

\"price\",

models.IntegerField(

validators=\[

django.core.validators.MinValueValidator(0)\],

verbose\_name=\"価格\",

),

),

(

\"description\",

models.TextField(blank=True, null=True,

verbose\_name=\"商品説明\"),

),

\],

options={

\"verbose\_name\": \"商品\",

\"verbose\_name\_plural\": \"商品一覧\",

\"db\_table\": \"product\",

},

),

\#\...,

),

\]



#### Step: マイグレーションファイルの内容をSQLに変換しよう


　作成したモデルの内容と似た内容が記載されています。異なる点として、省略していたidが自動的に追加されています。これだけ見ても、まだ何が起こるかわかりにくいですね。今度は、このファイルを元に実行される処理をSQLの形で出力し、具体的にどのようにDBに反映されるのか考えてみましょう。

　次のコマンドを実行してください。この手順はDjangoの動作を理解するための操作なので、実際の開発の際には必要ありません。

##### コマンドプロンプト（Ubuntu）


python manage.py sqlmigrate inventory 0001



　次のような出力が得られます。全てのコードを載せると長くなるため、一部のみ抜粋しています。

(0.006)

SELECT VERSION(),

@\@sql\_mode,

@\@default\_storage\_engine,

@\@sql\_auto\_is\_null,

@\@lower\_case\_table\_names,

CONVERT\_TZ(\'2001-01-01 01:00:00\', \'UTC\', \'UTC\') IS NOT NULL

; args=None; alias=default

(0.002) SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED; args=None; alias=default

(0.026) SHOW FULL TABLES; args=None; alias=default

(0.005) SELECT \`django\_migrations\`.\`id\`, \`django\_migrations\`.\`app\`, \`django\_migrations\`.\`name\`, \`django\_migrations\`.\`applied\` FROM \`django\_migrations\`; args=(); alias=default

CREATE TABLE \`product\` (\`id\` bigint AUTO\_INCREMENT NOT NULL PRIMARY KEY, \`name\` varchar(100) NOT NULL, \`price\` integer NOT NULL, \`description\` longtext NULL); (params None) ❶

CREATE TABLE \`sales\` (\`id\` bigint AUTO\_INCREMENT NOT NULL PRIMARY KEY, \`quantity\` integer NOT NULL, \`sales\_date\` datetime(6) NOT NULL, \`product\_id\` bigint NOT NULL); (params None)

（中略）



　❶あたりから、CREATE文をはじめとするDDLが生成されていることがわかります。このようにDjangoではModelからマイグレーションファイルを生成し、そのマイグレーションファイルをDDLのように使用して、DBのテーブルを管理する仕組みが提供されています。

　ここで1つ疑問が生じます。テーブル定義を変更するためにモデルに修正が入った場合は、マイグレーションファイルはどうなってしまうのでしょうか。実はモデルの修正に対応したマイグレーションファイルが追加で生成されます。こちらは第8章のDDLの章で詳しく解説します。

#### Step: オリジナルのマイグレーションファイルからテーブルを作成しよう


　今度は実際に実行してテーブルを作成しましょう。次のコマンドを実行します。

python manage.py migrate



#### Step: マイグレーションの結果を確認しよう


db.sqlite3 が作成される。マイグレートした内容は、以下のコマンドでsqlite3 をインストールし、確認可能。

sudo apt update && sudo apt install -y sqlite3



コマンドベースで確認する

sqlite3 db.sqlite3



5-3-x mysqlをベースに開発環境を再構築
-------------------------------------

Dockerfile **New**

FROM python:3.12-slim

WORKDIR /workspaces/full-stack-web-development-backend

ENV TZ=Asia/Tokyo

ARG DEBIAN\_FRONTEND=noninteractive

RUN apt-get update \\

&& apt-get install -y \--no-install-recommends tzdata build-essential default-libmysqlclient-dev pkg-config \\

&& ln -snf /usr/share/zoneinfo/\$TZ /etc/localtime && echo \$TZ \> /etc/timezone \\

&& rm -rf /var/lib/apt/lists/\*

COPY requirements.txt .

RUN pip install \--no-cache-dir -r requirements.txt

COPY . .



docker-compose.yml **New**

services:

db:

image: mysql:8

environment:

MYSQL\_ROOT\_PASSWORD: rootpass

MYSQL\_DATABASE: app

MYSQL\_USER: app

MYSQL\_PASSWORD: app\_pass

TZ: Asia/Tokyo

ports:

\- \"3306:3306\"

volumes:

\- db\_data:/var/lib/mysql

app:

build: .

command: \[\"sleep\", \"infinity\"\]

ports:

\- \"8000:8000\"

volumes:

\- .:/workspaces/full-stack-web-development-backend

environment:

DB\_ENGINE: mysql

MYSQL\_HOST: db

MYSQL\_PORT: 3306

MYSQL\_DATABASE: app

MYSQL\_USER: app

MYSQL\_PASSWORD: app\_pass

depends\_on:

\- db

volumes:

db\_data:



.devcontainer/devcontainer.json

{

\"name\": \"full-stack-web-development-backend\",

\"dockerComposeFile\": \[

\"../docker-compose.yml\"

\],

\"service\": \"app\",

\"workspaceFolder\": \"/workspaces/full-stack-web-development-backend\",

\"postCreateCommand\": \"pip install -r requirements-dev.txt \|\| true\",

\"features\": {

// Install Git

\"ghcr.io/devcontainers/features/git:1\": {},

// Install default MySQL client

\"ghcr.io/rocker-org/devcontainer-features/apt-packages:1\": {

\"packages\": \"default-mysql-client\"

}

},

\"customizations\": {

\"vscode\": {

\"extensions\": \[

\"ms-python.python\",

\"charliermarsh.ruff\",

\"ms-python.vscode-pylance\"

\]

}

}

}



config/settings.py

DATABASES = {

\"default\": {

\"ENGINE\": \"django.db.backends.mysql\",

\"NAME\": os.getenv(\"MYSQL\_DATABASE\", \"app\"),

\"USER\": os.getenv(\"MYSQL\_USER\", \"app\"),

\"PASSWORD\": os.getenv(\"MYSQL\_PASSWORD\", \"app\_pass\"),

\"HOST\": os.getenv(\"MYSQL\_HOST\", \"db\"),

\"PORT\": int(os.getenv(\"MYSQL\_PORT\", 3306)),

\"OPTIONS\": {

\"charset\": \"utf8mb4\",

},

\"CONN\_MAX\_AGE\": 60,

}

}

\# DATABASES = {

\# \"default\": {

\# \"ENGINE\": \"django.db.backends.sqlite3\",

\# \"NAME\": BASE\_DIR / \"db.sqlite3\",

\# }

\# }



requirements.txt

asgiref==3.9.1

Django==5.2.4

djangorestframework==3.16.0

sqlparse==0.5.3

mysqlclient==2.2.4



コンテナーのリビルドを実行し、環境の再構築し、マイグレーションの再実行

python manage.py migrate



コマンドベースで確認する

mysql \--ssl=0 -hdb -uapp -papp\_pass app



show tables;

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+

\| Tables\_in\_app \|

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+

\| auth\_group \|

\| auth\_group\_permissions \|

\| auth\_permission \|

\| auth\_user \|

\| auth\_user\_groups \|

\| auth\_user\_user\_permissions \|

\| django\_admin\_log \|

\| django\_content\_type \|

\| django\_migrations \|

\| django\_session \|

\| product \|

\| purchase \|

\| sale \|

+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--+



　実際にテーブルが作成されたか確認してみましょう。事前に導入していたMySQL Workbenchを立ち上げて、「Nabigater」タブの下部「Schema」をクリックし、現在操作しているSchemaのオブジェクトブラウザを表示してテーブルの一覧を見てください（図5-3-5）。

![](media/image42.png)

図5-3-5　MySQL Workbenchの表示例

### デフォルトで作成されるテーブル

　確かにモデルで定義したテーブルが作成されていることが確認できました。また、それ以外にauth\_やdjango\_で始まるいくつかのテーブルがあります。これらのテーブルは何でしょうか。

　auth\_で始まるテーブルはDjangoがデフォルトで提供してくれる管理機能のテーブルです。このテーブルを利用すればユーザー管理機能やグループ、権限の機能などを実装するのに使用することができます。在庫管理アプリケーションではログイン機能を実行するためにauth\_userテーブルを利用します。django\_で始まるテーブルはDjangoの機能を管理するテーブルです。例えばdjango\_migrationsテーブルのデータを見てみましょう。先ほど操作したMySQL Workbenchのテーブル一覧にある「django\_migrations」テーブルを右クリックし、「Select Rows - Limit 100」を選択して保存されているレコードを表示してください（図5-3-6）。

![](media/image47.png)

図5-3-6　MySQL Workbenchの表示例

　各アプリケーションでのmigrationファイルの実行状況を確認することができます。このようにDjangoでは基本的なユーザー管理機能や権限に関する機能、そしてマイグレーション機能がついています。

### 実行したコマンドの意味

　最後に実行したコマンドがどのような要素で成り立っているのか見てみましょう。大きく4つに分けることができます。

① python（pythonを実行）

② manage.py（実行対象のpythonファイル）

③ migrate（pythonファイルで実行できる動作）

④ \--settings config.settings.development（pythonファイルから指定できるオプション）

　前半2つの①python、②manage.pyは一般的なpython実行時の指定で、後半2つの③migrateと④settings以降がDjango特有の指定です。③のmigrateについては、すでにmakemigrationsやsqlmigrationsなど別の名称で指定して使ってきました。4-3-1項で一覧を挙げているので確認してみてください。また④のsettingsは第8章で使い分けていきます。

　この節では、モデルの生成方法とそのモデルがどのようにDBに影響を与えるか、学びました。DBの設計とモデルは密接に関係していることがわかったのではないでしょうか。次の節からは、このモデルを利用して、具体的なデータ操作を解説します。


----------------------------------------------------------------------------------









### Djangoのマイグレーションとは？

　Djangoではマイグレーションという仕組みでモデルを生成します。モデルは、データベースで管理する表のようなものです。テーブルとも呼びます。

　Djangoのマイグレーションは、データベースのスキーマ（構造）の変更を管理し、バージョン管理するためのシステムです。開発中にモデル（models.pyで定義）の変更が頻繁に行われることが想定されるため、これらの変更をデータベースに適用する方法が必要です。マイグレーションは、この問題を解決するためのメカニズムとして導入されました。マイグレーションには次の特徴があります。

・自動生成：モデルの変更からマイグレーションのコードを自動生成する

・適用&ロールバック：マイグレーションをデータベースに適用することや、前の状態に戻すことができる

・依存関係管理：複数のアプリやマイグレーション間の依存関係をトラックし、正しい順序でマイグレーションを適用する

　Djangoはmanage.pyコマンドで制御できます。以下は、主要なmanage.pyコマンドです。

makemigrations

　モデルの変更を検出し新しいマイグレーションのコードを生成します。

python manage.py makemigrations



migrate

　生成されたマイグレーションをデータベースに適用します。

python manage.py migrate



























#### Step: デフォルトのテーブルのマイグレーションを実行しよう　※ どこに入れるか要検討要検討


　まずは、モデルを定義しない状態で、初期のマイグレーションを実施してみましょう。次のコマンドをバックエンド側のVSCodeのコンソールから実行してください。

##### コマンドプロンプト（Ubuntu）


python manage.py migrate \--settings config.settings.development



　正常実行されると、次のようなログがコンソールに表示されます。

python manage.py migrate \--settings config.settings.development

(0.001)

SELECT VERSION(),

@\@sql\_mode,

@\@default\_storage\_engine,

@\@sql\_auto\_is\_null,

@\@lower\_case\_table\_names,

CONVERT\_TZ(\'2001-01-01 01:00:00\', \'UTC\', \'UTC\') IS NOT NULL

; args=None; alias=default

(0.001) SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED; args=None; alias=default

(0.001)

SELECT VERSION(),

@\@sql\_mode,

@\@default\_storage\_engine,

@\@sql\_auto\_is\_null,

@\@lower\_case\_table\_names,

CONVERT\_TZ(\'2001-01-01 01:00:00\', \'UTC\', \'UTC\') IS NOT NULL

; args=None; alias=default

(0.003) SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED; args=None; alias=default

(0.003) SHOW FULL TABLES; args=None; alias=default

(0.002) SHOW FULL TABLES; args=None; alias=default

Operations to perform:

Apply all migrations: admin, auth, contenttypes, sessions

Running migrations:

(0.002) SHOW FULL TABLES; args=None; alias=default

CREATE TABLE \`django\_migrations\` (\`id\` bigint AUTO\_INCREMENT NOT NULL PRIMARY KEY, \`app\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`applied\` datetime(6) NOT NULL); (params None)

(0.021) CREATE TABLE \`django\_migrations\` (\`id\` bigint AUTO\_INCREMENT NOT NULL PRIMARY KEY, \`app\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`applied\` datetime(6) NOT NULL); args=None; alias=default

Applying contenttypes.0001\_initial\...CREATE TABLE \`django\_content\_type\` (\`id\` integer AUTO\_INCREMENT NOT NULL PRIMARY KEY, \`name\` varchar(100) NOT NULL, \`app\_label\` varchar(100) NOT NULL, \`model\` varchar(100) NOT NULL); (params None)

（中略）

(0.002) INSERT INTO \`auth\_permission\` (\`name\`, \`content\_type\_id\`, \`codename\`) VALUES (\'Can add session\', 6, \'add\_session\'), (\'Can change session\', 6, \'change\_session\'), (\'Can delete session\', 6, \'delete\_session\'), (\'Can view session\', 6, \'view\_session\'); args=(\'Can add session\', 6, \'add\_session\', \'Can change session\', 6, \'change\_session\', \'Can delete session\', 6, \'delete\_session\', \'Can view session\', 6, \'view\_session\'); alias=default

(0.002) SELECT \`django\_content\_type\`.\`id\`, \`django\_content\_type\`.\`app\_label\`, \`django\_content\_type\`.\`model\` FROM \`django\_content\_type\` WHERE \`django\_content\_type\`.\`app\_label\` = \'sessions\'; args=(\'sessions\',); alias=default



#### Step: マイグレーションの結果テーブルが作成されていることを確認しよう


　SQLクライアント(MySQL Workbench)にて、テーブルが作成されていることを確認しましょう。2-3-1項「MySQL Workbench」を参考にしてください。

　図4-3-1のようなテーブルが作成されているはずです。こちらは、Djangoのマイグレーションで、デフォルトで作成されるテーブルとなります。

図4-3-1　作成テーブル

#### 





##### 











##### 

















#### 





##### 













#### 



##### 









##### 

























































##### 



















#### 





























# 第5章 モデルからデータベースを操作する


　前節まででDjangoからデータベースを操作する準備ができました。本節以降では、いよいよDjangoやライブラリを利用してデータを処理するAPIを実装していきたいと思います。図5-4-1の太い枠線で囲った部分を扱います。

![](media/image22.png)

図5-4-1　5-4節で扱う範囲

## 5-4-1 モデルを利用したテーブルデータの参照


#### Step: コマンドでPythonを実行する


　前節までのモデルの作成とモデルを元にしたデータベースへのマイグレーションが完了していることを前提に進めます。

　APIとして実装を進める前にモデルを使ってテーブルデータをうまく取得できるか確かめてみましょう。次のコマンドを実行してください。

##### Backend


python manage.py shell 



　このコマンドを実行すると対話型でPythonを実行できます。対話を終了するときは［Ctrl］+［D］を押してください。DBに接続するときはモデルを利用します。今回はProductのモデルを利用するので、次のようにプロンプトに入力してみてください。

#### Step: Pythonを実行して空のテーブルからデータを参照する


##### Backend


\>\>\> from api.inventory.models import Product

\>\>\> queryset = Product.objects.all()

\>\>\> print(queryset)



　次のような実行結果が表示されます。

(0.003)

SELECT VERSION(),

@\@sql\_mode,

@\@default\_storage\_engine,

@\@sql\_auto\_is\_null,

@\@lower\_case\_table\_names,

CONVERT\_TZ(\'2001-01-01 01:00:00\', \'UTC\', \'UTC\') IS NOT NULL

; args=None; alias=default

(0.000) SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED; args=None; alias=default

(0.008) SELECT \`product\`.\`id\`, \`product\`.\`name\`, \`product\`.\`price\`, \`product\`.\`description\` FROM \`product\` LIMIT 21; args=(); alias=default

\<QuerySet \[\]\>



### 取得結果

　\"SELECT \`product\`.\`id\`, \...FROM \`product\`;\"を実行してデータを取得しようとしています。取得した結果が \<QueryASet\[\]\> になります。ただ、productテーブルのデータを取得できるか確かめてみましょう。

### Step: 初期データの作成をする

まずは取得対象となるデータを登録しましょう。jsonで登録用データを作成します。

*fixtures/products.json*

\[

{

\"model\": \"inventory.product\",

\"pk\": 1,

\"fields\": {

\"name\": \"コットン100%バックリボンティアードワンピース（黒）\",

\"price\": 6900,

\"description\": \"大人の愛らしさを引き立てる、ナチュラルな風合い。リラックスxトレンドを楽しめる、上品なティアードワンピース。\"

}

},

{

\"model\": \"inventory.product\",

\"pk\": 2,

\"fields\": {

\"name\": \"ライトストレッチカットソー（ネイビー）\",

\"price\": 2980,

\"description\": \"しなやかな肌触りが心地よい、程よいフィット感のカットソー。ビジネスカジュアルにも普段使いにも使える、ベーシックなデザイン。\"

}

},

{

\"model\": \"inventory.product\",

\"pk\": 3,

\"fields\": {

\"name\": \"ベルト付きデニムパンツ（ブルー）\",

\"price\": 5980,

\"description\": \"定番のデニムパンツに、フェミニンなベルトをプラスしたスタイリッシュなアイテム。カジュアルにもきれいめにも合わせやすい。\"

}

},

{

\"model\": \"inventory.product\",

\"pk\": 4,

\"fields\": {

\"name\": \"レースフレアスカート（ホワイト）\",

\"price\": 4980,

\"description\": \"エレガントな雰囲気を醸し出すレーススカート。裏地付きで透け感も抑えられ、通年使えるおすすめアイテム。\"

}

}

\]



#### Step: 初期データの登録をする


先ほど作成したjsonデータを読み込むコマンドを実行します。ここではまだデータ読込の細かい仕組みは解説しません。9章で解説するので、いったんはこういうものなんだと思ってください。

python manage.py loaddata fixtures/products.json



##### Backend


\>\>\> from api.inventory.models import Product

\>\>\> queryset = Product.objects.all()

\>\>\> print(queryset)



　次のような実行結果が表示されます。

(0.003)

SELECT VERSION(),

@\@sql\_mode,

@\@default\_storage\_engine,

@\@sql\_auto\_is\_null,

@\@lower\_case\_table\_names,

CONVERT\_TZ(\'2001-01-01 01:00:00\', \'UTC\', \'UTC\') IS NOT NULL

; args=None; alias=default

(0.000) SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED; args=None; alias=default

(0.008) SELECT \`product\`.\`id\`, \`product\`.\`name\`, \`product\`.\`price\`, \`product\`.\`description\` FROM \`product\` LIMIT 21; args=(); alias=default

\<QuerySet \[\<Product: Product object (1)\>, \<Product: Product object (2)\>, \<Product: Product object (3)\>, \<Product: Product object (4)\>\]\>



#### Step: SQLで対象テーブルにデータを追加する


　ではproudctテーブルにデータを追加してから、同じようにprodcutテーブルのデータを取得できるか確かめてみましょう。

　まずMySQL Workbench で次のSQLを実行します。

##### MySQL Workbench


INSERT INTO product (

name,

price,

description

) VALUES (

\'シフォンプリーツスカート（ピンク）\',

3980,

\'軽やかなシフォン素材のプリーツスカート。女性らしい柔らかな印象を与え、デートやお出かけにぴったり。\'

);

#### Step: Pythonを実行して空のテーブルからデータを参照する


　その後に再度ターミナルに戻り、querysetを実行します。

##### Backend


\>\>\> from api.inventory.models import Product

\>\>\> queryset = Product.objects.all()

\>\>\> print(queryset)



　次のような出力が得られたのではないでしょうか。

(0.003)

SELECT VERSION(),

@\@sql\_mode,

@\@default\_storage\_engine,

@\@sql\_auto\_is\_null,

@\@lower\_case\_table\_names,

CONVERT\_TZ(\'2001-01-01 01:00:00\', \'UTC\', \'UTC\') IS NOT NULL

; args=None; alias=default

(0.000) SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED; args=None; alias=default

(0.008) SELECT \`product\`.\`id\`, \`product\`.\`name\`, \`product\`.\`price\`, \`product\`.\`description\` FROM \`product\` LIMIT 21; args=(); alias=default

\<QuerySet \[\<Product: Product object (1)\>, \<Product: Product object (2)\>, \<Product: Product object (3)\>, \<Product: Product object (4)\>, \<Product: Product object (5)\>\]\>



#### Step: Pythonの対話モードを終了する


対話を終了するときは［Ctrl］+［D］を押してください。

### 取得結果

　上記のように単純に取得するとオブジェクトとして取得され、フロントエンドに返したときに利用しにくい形式になっています。そのためserializerという変換の仕組みを噛ませてjson形式に変換して取得できるようにします。

![](media/image36.png)

図5-5-3　データの取得とシリアライズ

## 5-4-2 シリアライザー


　DjangoにもSerializerクラスがありますが 、REST frameworkではModelSerializerというモデルインスタンスとクエリセットのシリアライズ機能を可能にするクラスを提供しているのでこれを利用します。

#### Step: データをシリアライズする設定ファイルを作成しよう


新規にserializers.pyというファイルを作成してください（コード5-5-1）。こちらにシリアライズクラスをまとめて定義しましょう。

コード5-5-1　シリアライザー（api/inventory/serializers.py）**New**

##### Backend


from rest\_framework import serializers

from .models import Product, Purchase, Sale

class ProductSerializer(serializers.ModelSerializer):

class Meta:

model = Product

fields = \"\_\_all\_\_\"

class PurchaseSerializer(serializers.ModelSerializer):

class Meta:

model = Purchase

fields = \"\_\_all\_\_\"

class SaleSerializer(serializers.ModelSerializer):

class Meta:

model = Sale

fields = \"\_\_all\_\_\"



　まずは作成したモデルに対応するシリアライザークラスを作成します。この際、serializers.Model

Serializerクラスを継承させます。クラス名はどのモデルに対応するかわかりやすいように「モデル名＋Serializer」としています。

### シリアライズクラス

Djangoの提供するSerializerとの違いとして、ModelSerializerはモデルに対応するフィールドの自動生成やバリデーション、簡便なデータ操作のデフォルト実装も提供してくれます。今回は、こちらを使用します。

　追加設定としてインナークラス Metaを作成します。シリアライズしたいモデル名をmodelに指定し、フィールドをfieldsに指定します。全フィールドを使用する場合は'\_\_all\_\_'、全フィールドが不要であれば個別にフィールド名で指定します。多くの指定が可能なので、詳しく知りたい方は公式ドキュメント【※5-3】を参照してください。


#### Step: コマンドでデータのあるテーブルからシリアライズしたデータを取得してみよう


　先ほどモデルを取得しようとしたコマンドをシリアライズしてみましょう。対話型のPython実行の続きで、次のコマンドを実行します。

##### Backend


python manage.py shell 



##### Backend


\>\>\> from api.inventory.models import Product

\>\>\> from api.inventory.serializers import ProductSerializer

\>\>\> queryset = Product.objects.all()


## Footnotes

[^5-1]: 「はじめての Django アプリ作成、その2」 https://docs.djangoproject.com/ja/4.1/intro/tutorial02/\#database-setup
[^5-2]: 「フィールドの型」https://docs.djangoproject.com/ja/4.1/ref/models/fields/\#model-field-types
[^5-3]: 「Serializer relations」https://www.django-rest-framework.org/api-guide/relations/


\>\>\> serializer = ProductSerializer(queryset , many=True)

\>\>\> serializer.data



　次のような出力が得られます。先ほどのオブジェクトと異なり、開発者が読める形式で結果が返ってきます。ここまで完了したら［Ctrl］+［D］キーを押下して対話を終了させましょう。

(0.000)

SELECT VERSION(),

@\@sql\_mode,

@\@default\_storage\_engine,

@\@sql\_auto\_is\_null,

@\@lower\_case\_table\_names,

CONVERT\_TZ(\'2001-01-01 01:00:00\', \'UTC\', \'UTC\') IS NOT NULL

; args=None; alias=default

(0.000) SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED; args=None; alias=default

(0.000) SELECT \`product\`.\`id\`, \`product\`.\`name\`, \`product\`.\`price\`, \`product\`.\`description\` FROM \`product\`; args=(); alias=default

\[{\'id\': 1, \'name\': \'コットン100%バックリボンティアードワンピース（黒）\', \'price\': 6900, \'description\': \'大人の愛らしさを引き立てる、ナチュラルな風合い。リラックスxトレンドを楽しめる、上品なティアードワンピース。\'}, {\'id\': 2, \'name\': \'ライトストレッチカットソー（ネイビー）\', \'price\': 2980, \'description\': \'しなやかな肌触りが心地よい、程よいフィット感のカットソー。ビジネスカジュアルにも普段使いにも使える、ベーシックなデザイン。\'}, {\'id\': 3, \'name\': \'ベルト付きデニムパンツ（ブルー）\', \'price\': 5980, \'description\': \'定番のデニムパンツに、フェミニンなベルトをプラスしたスタイリッシュなアイテム。カジュアルにもきれいめにも合わせやすい。\'}, {\'id\': 4, \'name\': \'レースフレアスカート（ホワイト）\', \'price\': 4980, \'description\': \'エレガントな雰囲気を醸し出すレーススカート。裏地付きで透け感も抑えられ、通年使えるおすすめアイテム。\'}, {\'id\': 5, \'name\': \'シフォンプリーツスカート（ピンク）\', \'price\': 3980, \'description\': \'軽やかなシフォン素材のプリーツスカート。女性らしい柔らかな印象を与え、デートやお出かけにぴったり。\'}\]



## 5-5 参照系APIの作成

### 5-4-1 Djangoにおけるデータベースの操作ついて

　前節ではデータを格納するためのモデルを作成しました。本項ではそのモデルを利用して、実際にデータを取得したり更新したりする実装をしていきます。

　今回は取得したデータを表示するフロントエンドと実際にデータを取得するバックエンドをそれぞれ別々のアプリケーションとして実装します。バックエンドからは、いろいろなデータの渡し方がありますが、今回はjson形式で処理結果をフロントエンドに返します。

　DjangoにはRESTful APIを実装するための便利なフレームワークとしてDjango REST framework（以降、DRFと記述）というフレームワークが開発されています。Djangoと共同出資で開発が進められており、様々な機能がサポートされているので今回はこちらを使用しましょう。もちろんDRFを使用せずDjango単体でもAPIを実装することは可能です。しかし今回は、APIに特化したライブラリで処理もシンプルに記述できるようになるのでこちらを採用します。

### 5-5-1 APIの実装イメージ

　実装に入る前に、このAPIの実装のイメージをしておきましょう。章の頭で紹介した図よりも粒度を細かくして、データの流れもわかるようにしています（図5-5-1）。

![](media/image27.png)

図5-5-1　リクエストからレスポンスまでのデータの流れ

　大きく、リクエストURLのルーティングを行うurls.pyと、実際にDBからデータを取得するviews.py、そして取得したデータをユーザーが利用しやすい形に変換するserializers.pyから構成されます。

　まず、一番単純な商品テーブルの一覧をそのまま取得する実装をしてみましょう。5-3節で作成した商品マスタのデータを取得してみます。

![](media/image26.png)

図5-5-2　ER図

### 5-5-2 APIView

　さてシリアライズクラスを作成したので、今度はモデルを使ってデータを取得し、そのデータをシリアライズするクラスを作成していきます。この処理はviewクラスで行います。Djangoにおけるviewクラスはアプリケーションのリクエスト処理とレスポンス生成を担当するコンポーネントです。通常のDjangoではレスポンスとして画面表示用のHTMLを返しますが、今回はDRFを追加し、APIサーバーとして使用してjsonをレスポンスとして返します。

![](media/image12.png)

図5-5-4　データの取得とシリアライズ

#### Step: プログラムでデータを取得するためのAPIファイルを作成しよう

　DjangoではViewというクラスが提供されていますが、こちらはHTMLコンテンツなどを返すことを想定したクラスであり、APIとしては適していません。DRFではAPIViewというクラスを提供しています。そのため、よりRestAPIとして適した結果を返すことができるAPIViewを使用します。

　次のようにAPIViewクラスを継承して作成してみましょう（コード5-5-2）。

コード5-5-2　ビュー（api/inventory/views.py）

##### Backend

from rest\_framework import status \# \-\-\-\-\-\-\-\-\-\-\-\-- 追加

from rest\_framework.response import Response

from rest\_framework.views import APIView

from .models import Product \# \-\-\-\-\-\-\-\-\-\-\-\-- 追加

from .serializers import ProductSerializer \# \-\-\-\-\-\-\-\-\-\-\-\-- 追加

class ProductView(APIView): ❶

\"\"\"

商品操作に関する関数

\"\"\"

def get(self, request, format=None): ❷



\"\"\"

商品の一覧を取得する

\"\"\"

queryset = Product.objects.all() \# \-\-\-\-\-\-\-\-\-\-\-\-- 修正

serializer = ProductSerializer(queryset, many=True) \# \|

return Response(serializer.data, status.HTTP\_200\_OK) \# \-\-\-\-\-\-\--



　次に第4章で行ったように、urls.pyでこのviewをマッピングしましょう。urls.pyに次のように追記してください（コード5-5-3）。ここに記載したURLに対応するViewの処理が呼び出されます。

#### Step: APIのエンドポイントになるURLを確認しよう

5-3で設定したAPIを修正して商品一覧を取得するAPIを作成します。エンドポイントとなるURLが設定されているかを確認します。

コード5-5-3　URLのマッピング（config/urls.py）

##### Backend

urlpatterns = \[

(中略)

path(\'api/inventory/\', include(\'api.inventory.urls\')),

\]



またinventoryフォルダの直下に、次に示すurls.pyファイルが作成済みかも確認します（コード5-5-4）。

コード5-5-4　URLのマッピング（backend/api/inventory/urls.py）

##### Backend

from django.urls import path

from . import views

urlpatterns = \[

path(\'products/\', views.ProductView.as\_view()),

\]



5-3で設定済みのはずですが、もし未設定であれば修正してください。

#### Step: APIを実行しテーブルのデータを取得しよう

　これで準備が整いました。次のコマンドをターミナルで実行してサーバーを起動し、ブラウザから情報が取得できるか確認しましょう。

##### コマンドプロンプト（Ubuntu）

python manage.py runserver 0.0.0.0:8000 



#### Step: APIを実行しテーブルのデータを確認しよう

　コマンドを実行したら、http://localhost:8000/api/inventory/products/にアクセスしてみてください。商品一覧のレスポンスが返却されます（図5-5-5）。

図5-5-5　商品一覧の取得の表示例

![](media/image49.png)

　それではProductViewのコードの中を改めて見てみましょう。ここで気になるのは❶で継承しているAPIViewクラス、そして❷のget関数です。これはHTTP RequestのメソッドがGETメソッドだったときに呼ばれる関数になります。APIViewでは各HTTP Requestのメソッドに対応する関数が用意されており、それをオーバーライドして使います。

### REST API

　本アプリケーションではGETメソッドには商品一覧の取得処理を入れましたが、これはどのような観点で決めているのでしょうか。実はREST APIには設計方針が決まっており、GETなら参照、POSTなら新規追加、PUTなら更新となっています。

![](media/image25.png)

### APIViewの関数

　次はget関数の引数です。selfはこのクラスのインスタンス自体を指していて、Pythonのクラスメソッドを定義する場合に必ず指定する引数になります。selfを使用することで、メソッド内でクラスの属性や他のメソッドにアクセスすることができます。requestはDjangoのHTTP Requestオブジェクトです。リクエストに関する情報やデータが格納されています。例えば、リクエストヘッダーやクエリパラメーター、POSTデータなどが含まれています。formatはこのメソッドのオプションの引数で、レスポンスの形式を指定するために使用されます。デフォルトでNoneが指定され、レスポンスの形式はクライアントの要求に基づいて決定されます。formatパラメーターはレスポンスとして返す形式を変更したいときに使用します。

##### Backend

def get(self, request, format=None):



##### Backend

　次はquerysetです。QuerySetはデータベースからのオブジェクトのコレクションを表します。ゼロ、1つ、または多数のフィルターを含めることができます。フィルターは、指定されたパラメーターに基づいてクエリ結果を絞り込みます。

 queryset = Product.objects.all()



　今回はall()をつけて全件取得としました。こういった参照におけるQuerySetの役割はSQLのステートメントに相当します。フィルターはWHEREやLIMITまたSELECTなどの制限句です。Query

SetにおけるフィルターとSQLの句の対応例を見てみましょう（コード5-5-5）。

コード5-5-5　QuerySetと実行されるSQLの対応例

Product.objects.filter(price\_\_gt=1000)

\# 対応するSQL

SELECT \* FROM product WHERE price \> 1000;

Product.objects.order\_by(\'price\')

\# 対応するSQL

SELECT \* FROM product ORDER BY price ASC;

Product.objects.values(\'name\', \'price\')

\# 対応するSQL

SELECT name, price FROM product;



　上記は一部の例ですが、DjangoのQuerySetはSQLの様々な句やオプションに対応しています。詳細な情報はDjangoの公式ドキュメントを参照してください。

　また様々なフィルター部分も大切ですが、もう1つのポイントはメソッドチェーンになっていることです。Product.objectsによって取得されたManagerオブジェクトから再度Managerオブジェクトを返すfilterやorder関数によって、さらに複雑な条件で絞り込むことができます。

　メソッドチェーンは同じオブジェクト内のメソッドを連鎖的に呼び出す方法のことです。各メソッドで自身のオブジェクトを返すことで、次のメソッドを再び呼び出すことが可能になります。これで、商品一覧を取得することができました。

### serializer

　次はserializerです。serializerのコンストラクタの引数に、QuerySetとオプションを渡しています。この例では複数件の結果が返ってくるのでmany=Trueを指定しています。

##### Backend

serializer = ProductSerializer(queryset, many=True)



　最後にResponseです。このResponseはHTTPResponseを扱うためのクラスです。ViewクラスURLのマッピングによりリクエストがきて、その内容に応じてjsonといったレスポンスを返す役割をすると述べました。そのため、シリアライズされたjsonとそのときのHTTPStatusコードを設定して返しています。

##### Backend

 return Response(serializer.data, status.HTTP\_200\_OK)



### 5-5-3 APIView以外の取得方法

　実はもう1つ、DRFを用いてデータを取得する方法があります。

#### Step: プログラムでデータを取得するためのAPIファイルを作成しよう

先ほどのAPIViewを使用したコードと同じ動作をする関数を、ModelViewSetクラスを用いて作成してみましょう（コード5-5-6）。

コード5-5-6　ビュー（api/inventory/views.py）

##### Backend

from rest\_framework import status

from rest\_framework.response import Response

from rest\_framework.views import APIView

from rest\_framework.viewsets import ModelViewSet

from .models import Product

from .serializers import ProductSerializer

class ProductView(APIView):

\"\"\"

商品操作に関する関数

\"\"\"

def get(self, request, format=None):

\"\"\"

商品の一覧を取得する

\"\"\"

products = Product.objects.all()

serializer = ProductSerializer(products, many=True)

return Response(serializer.data, status.HTTP\_200\_OK)

class ProductModelViewSet(ModelViewSet):

queryset = Product.objects.all()

serializer\_class = ProductSerializer



#### Step: APIのエンドポイントになるURLを追加しよう

　urlsも追加します（コード5-5-7）。

コード5-5-7　URLのマッピング（backend/api/inventory/urls.py）

##### Backend

from django.urls import path

from . import views

urlpatterns = \[

path(\'products/\', views.ProductView.as\_view()),

path(\'products/model/\', views.ProductModelViewSet.as\_view({\'get\': \'list\'})),

\]



#### Step: APIを実行しテーブルのデータを確認しよう

　http://localhost:8000/api/inventory/products/model/と実行してみてください。先ほどと同じようなjsonが取得できます（図5-5-6）。

図5-5-6　別の方法による商品一覧の取得の表示例

![](media/image37.png)

### ModelViewSetとAPIView

　どちらでも取得できることはわかりましたが、どちらがよいのでしょうか。ModelViewSetはAPIViewとは異なり、自分で実装しなくても基本的な参照や更新といったCRUD操作を提供してくれます。そのため実装の負担も減りますし、コードもシンプルになります。

　ただし、動作を細かい記述なく実装できるようになっている反面、カスタマイズはしにくくなっています。図5-5-7のような関係性になっています。基底クラスになっているViewクラスはDjangoで定義されるクラスで、DRFが提供するAPIViewをはじめとするクラスのベースになっています。

![](media/image43.png)

図5-5-7　様々なView関連クラスとお互いの関係

　ここまで、DRFを使用した参照系APIの実装方法を学びました。冒頭で処理の中核として登場したモデルがビューや、シリアライザーを通じてどのように扱われているか確認できたでしょうか。また、APIを呼び出す際のURLとビューをどのように紐づけているかも理解することができたでしょうか。

　参照系APIの実装が完了したので、次の節では登録系APIの実装を行っていきます。参照系APIとの違いにも着目しながら進めてみましょう。

## 5-6 登録系APIの作成

　一覧を参照することができたので、今度は登録処理を行っていきましょう。

### 5-5-1 APIViewによる商品の登録

　APIView を使って登録処理を実装していきましょう。

#### Step: プログラムでデータを登録するため処理をAPIファイルに追加しよう

ProductViewクラス内に追記していきます。まずは新規登録の場合です（コード5-5-1）。ProductViewクラスの中のdef getの後にdef postを追加します。

コード5-5-1　ビュー（backend/api/inventory/views.py）

##### Backend

from rest\_framework import status

from rest\_framework.response import Response

from rest\_framework.views import APIView

from rest\_framework.viewsets import ModelViewSet

from .models import Product

from .serializers import ProductSerializer

class ProductView(APIView):

\"\"\"

商品操作に関する関数

\"\"\"

def get(self, request, format=None):

\"\"\"

商品の一覧を取得する

\"\"\"

products = Product.objects.all()

serializer = ProductSerializer(products, many=True)

return Response(serializer.data, status.HTTP\_200\_OK)

def post(self, request, format=None):

\"\"\"

商品を登録する

\"\"\"

serializer = ProductSerializer(data=request.data)

\# validationを通らなかった場合、例外を投げる

serializer.is\_valid(raise\_exception=True)

\# 検証したデータを永続化する

serializer.save()

return Response(serializer.data, status.HTTP\_201\_CREATED)

class ProductModelViewSet(ModelViewSet):

queryset = Product.objects.all()

serializer\_class = ProductSerializer

#### Step: APIのエンドポイントになるURLを確認しよう

　URL自体は商品検索のときに使用したURLと同じなので修正の必要はありません（コード5-5-2）。

コード5-5-2　URLのマッピング（backend/api/inventory/urls.py）

##### Backend

urlpatterns = \[

path(\'products/\', views.ProductView.as\_view()),



　ブラウザでhttp://localhost:8000/api/inventory/products/にアクセスしてください。図5-5-5ではGET用のボタンしかありませんでしたが、POST用のボタンが追加されています（図5-5-1）。

図5-5-1　商品登録の表示例

![](media/image9.png)

#### Step: データを登録する

　Contentの入力フィールドに以下のパラメータを入れPOSTボタンを押してみましょう。

##### ブラウザ（フォーム）

{

\"name\": \"フラワープリントワンピース（グリーン）\",

\"price\": 7980,

\"description\": \"華やかなフラワープリントが目を引く、リラックス感のあるワンピース。デイリーユースからお出かけまで幅広く活躍。\"

}

図5-5-2　商品登録時のパラメーターの入力例

![](media/image41.png)

#### Step: データの実行結果を確認する

　無事、登録することができました。登録に成功すると登録されたレコードがレスポンスとして返ってきます（図5-5-3）。

実行に成功すると以下のような登録内容が記載された画面が表示されます。

図5-5-2　商品登録APIの実行結果

![](media/image44.png)

商品一覧の参照結果も変わっているか確認しましょう。GETボタンを押下してください。6件の商品が登録されているはずです。

図5-5-2　商品参照APIの実行結果

![](media/image40.png)

### Media type

// TODO: （リクエストの種類、URL、ヘッダー、ボディなど）の例が不足しているため

### Content

// TODO: （リクエストの種類、URL、ヘッダー、ボディなど）の例が不足しているため

### HTTP メソッド

　うまく登録することはできましたが、URLは同一なのにどうやって参照処理か登録処理かを区別しているのでしょうか。5-1節で説明した通り、REST APIではHTTP メソッドの種類で処理を区別します。

### Serializerの処理の違い

　def getと違う点を見てきましょう。まずQuerySetの処理がありません。今回はDBに登録されたデータを元にするのではなく、requestデータをそのまま登録するので特に参照する処理が必要ないためです。

##### Backend

\# def getの処理

\# **queryset**= Product.objects.all()

\# serializer = ProductSerializer(**queryset**, many=True)

\# def postの処理

def post(self, **request**, format=None):

serializer = ProductSerializer(data=**request**.data)



　次に引数のrequestデータをシリアライズしています。登録前にモデルの登録用データにするために、対応するモデルのシリアライザーでシリアライズしています。参照処理も登録処理も同じ内容なのでシリアライザーも同じクラスを使っています。

　一方で、getのときは検索結果となるproductオブジェクトを渡していましたが、登録処理ではdata=xxxと引数を指定して渡しています。

##### Backend

 \# def getのシリアライザー

\# serializer = **ProductSerializer**(queryset, many=True)

\# def postのシリアライザー

serializer = **ProductSerializer**(data=request.data)



### キーワード引数

data=xxxといったメソッドの仮引数名で引数を指定する方法をキーワード引数といいます。これはPythonの記法です。

コラム開始＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

ここまでシリアライザークラスにモデルとどんな形式のデータがわたるかを引数として渡して、シリアライズを行ってきました。自分たちでは直接シリアライズの処理を書いていないので、なぜシリアライズが行われるか不思議ではないでしょうか。

ここでは少し詳細を眺めてみましょう。

### シリアライザークラスの継承関係

　シリアライザークラスの継承関係は次のようになっています（図5-5-4）。

![](media/image31.png)

図5-5-4　シリアライザークラスの継承関係

　ProductSerializerのコンストラクタは基底クラスで定義されたBaseSerializerが参照されています。処理が基底クラスに隠蔽されていてProductSerializerを見ただけでは何が起こっているのかわかりにくいため、簡単に定義を確認してみましょう。以降、コード5-5-3からコード5-5-5までは、DRFのコードなので実装の必要はありません。

コード5-5-3　 DRFで提供される継承したシリアライザークラスの実装（/usr/local/lib/python3.10/site-packages/rest\_framework/serializers.py）

##### Backend

class BaseSerializer(Field):

...

def \_\_init\_\_(self, instance=None, data=empty, \*\*kwargs):

self.instance = instance

if data is not empty:

self.initial\_data = data

self.partial = kwargs.pop(\'partial\', False)

self.\_context = kwargs.pop(\'context\', {})

kwargs.pop(\'many\', None)

super().\_\_init\_\_(\*\*kwargs)



　getメソッドのときには、引数にquerysetで生成されたモデルに対応するインスタンスを渡していました。\_\_init\_\_の第一引数のselfは無視されるので、2つ目の仮引数：instanceにquerysetのインスタンスが入っていました。

　それに対して、今回はキーワード引数により、第三引数のdataに値が入っています。この場合は、モデルの入力値として正しいかどうかはわからないものの、一旦初期データとしてinitial\_dataにrequestのデータが代入されています。

　次にシリアライズしたい値のvalidationチェックを行っています。

##### Backend

 serializer.is\_valid(raise\_exception=True)



　シリアライザーにdataキーワード引数が渡された場合は、.data表現にアクセスする前に.is\_valid()を呼び出す必要があります。is\_validでは先ほどrequestからinitial\_dataに代入したinitial\_dataのvalidationが行われます。もし、このときinitial\_dataに不整合があればエラーが発生します。

コード5-5-4　 DRFで提供される継承したシリアライザークラスの実装（/usr/local/lib/python3.10/site-packages/rest\_framework/serializers.py）

##### Backend

 def is\_valid(self, \*, raise\_exception=False):

assert hasattr(self, \'initial\_data\'), (

\'Cannot call \`.is\_valid()\` as no \`data=\` keyword argument was \'

\'passed when instantiating the serializer instance.\'

)

if not hasattr(self, \'\_validated\_data\'):

try:

self.\_validated\_data = self.run\_validation(self.initial\_data)

except ValidationError as exc:

self.\_validated\_data = {}

self.\_errors = exc.detail

else:

self.\_errors = {}

if self.\_errors and raise\_exception:

raise ValidationError(self.errors)

return not bool(self.\_errors)



　そのため、モデルに対応するかどうかわからないrequestデータなどを元にseriarizeする場合は、.is\_valid()を最初に呼び出すか、代わりに.initial\_dataにアクセスする必要があります。また、引数にraise\_exception=True を与えることで、 erorrs 情報を元に ValidationError を生成します。

##### Backend

raise ValidationError(self.errors)



　このErrorクラスを投げてくれるので例外を検知できます。今度はserializerの永続化です。

serializer.save()

コード5-5-5　 DRFで提供される継承したシリアライザークラスの実装

（/usr/local/lib/python3.10/site-packages/rest\_framework/serializers.py）

##### Backend

 def save(self, \*\*kwargs):

\"\"\"

Save and return a list of object instances.

\"\"\"

\# Guard against incorrect use of \`serializer.save(commit=False)\`

assert \'commit\' not in kwargs, (

\"\'commit\' is not a valid keyword argument to the \'save()\' method. \"

\"If you need to access data before committing to the database then \"

\"inspect \'serializer.validated\_data\' instead. \"

\"You can also pass additional keyword arguments to \'save()\' if you \"

\"need to set extra attributes on the saved model instance. \"

\"For example: \'serializer.save(owner=request.user)\'.\'\"

)

validated\_data = \[

{\*\*attrs, \*\*kwargs} for attrs in self.validated\_data

\]

if self.instance is not None:

self.instance = self.update(self.instance, validated\_data)

assert self.instance is not None, (

\'\`update()\` did not return an object instance.\'

)

else:

self.instance = self.create(validated\_data)

assert self.instance is not None, (

\'\`create()\` did not return an object instance.\'

)

return self.instance



　validateが完了したデータを元にデータベースに登録または更新を行い、その結果からインスタンスを作成します。

　最後にResponseです。シリアライズされたデータが登録データになるので、それをそのままレスポンスとして返しています。また、HTTPステータスコードは登録系のためAPI設計に従い、200ではなく201で返しています。

##### Backend

return Response(serializer.data, status.HTTP\_201\_CREATED)



　いろいろなクラスやメソッドが呼ばれていて混乱したかもしれません。ここまでの流れをまとめると、次のようになります（図5-5-5）。

![](media/image14.png)

図5-5-5　シリアライザークラスの役割

DRFに限らず、外部から受け取った文字列のデータをプログラム内部で扱いやすくするためにしばしばシリアライズという処理が行われます。こういった典型的な処理の流れを理解しておくことで、プログラムを追いやすくなったり理解がしやすくなります。

コラム終了＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

### 5-5-1 APIViewによる仕入れと売上の登録

　では、商品の仕入れと売上の登録処理も実装しましょう。

#### Step: プログラムでデータを登録するため処理をAPIファイルに追加しよう

商品の登録と同様に、views.pyとurls.pyに修正を加えます（コード5-5-6、コード5-5-7）。画面からそれぞれ仕入れ情報や売上情報のみを参照することはないため、登録処理のみ実装しています。

コード5-5-6　ビュー（api/inventory/views.py）

##### Backend



from rest\_framework import status

from rest\_framework.response import Response

from rest\_framework.views import APIView

from rest\_framework.viewsets import ModelViewSet

from .models import Product

from .serializers import ProductSerializer, PurchaseSerializer, SaleSerializer

class ProductView(APIView):

\"\"\"

商品操作に関する関数

\"\"\"

def get(self, request, format=None):

\"\"\"

商品の一覧を取得する

\"\"\"

products = Product.objects.all()

serializer = ProductSerializer(products, many=True)

return Response(serializer.data, status.HTTP\_200\_OK)

def post(self, request, format=None):

\"\"\"

商品を登録する

\"\"\"

serializer = ProductSerializer(data=request.data)

\# validationを通らなかった場合、例外を投げる

serializer.is\_valid(raise\_exception=True)

\# 検証したデータを永続化する

serializer.save()

return Response(serializer.data, status.HTTP\_201\_CREATED)

class ProductModelViewSet(ModelViewSet):

queryset = Product.objects.all()

serializer\_class = ProductSerializer

class PurchaseView(APIView):

def post(self, request, format=None):

\"\"\"

仕入情報を登録する

\"\"\"

serializer = PurchaseSerializer(data=request.data)

serializer.is\_valid(raise\_exception=True)

serializer.save()

return Response(serializer.data, status.HTTP\_201\_CREATED)

class SaleView(APIView):

def post(self, request, format=None):

\"\"\"

売上情報を登録する

\"\"\"

serializer = SaleSerializer(data=request.data)

serializer.is\_valid(raise\_exception=True)

serializer.save()

return Response(serializer.data, status.HTTP\_201\_CREATED)



#### Step: APIのエンドポイントになるURLを追加しよう

コード5-5-7　URLのマッピング（api/inventory/urls.py）

##### Backend

from django.urls import path

from . import views

urlpatterns = \[

path(\"products/\", views.ProductView.as\_view()),

path(\"products/model/\", views.ProductModelViewSet.as\_view({\"get\": \"list\"})),

path(\"purchases/\", views.PurchaseView.as\_view()),

path(\"sales/\", views.SaleView.as\_view()),

\]



#### Step: データをシリアライズする設定ファイルを確認しよう

5-4-2で作成したserializers.pyに、今回使用するシリアライザークラスが定義されているか確認しましょう。

コード5-5-1　シリアライザー（api/inventory/serializers.py）

##### Backend

from rest\_framework import serializers

from .models import Product, Purchase, Sale

class ProductSerializer(serializers.ModelSerializer):

class Meta:

model = Product

fields = \"\_\_all\_\_\"

class PurchaseSerializer(serializers.ModelSerializer):

class Meta:

model = Purchase

fields = \"\_\_all\_\_\"

class SaleSerializer(serializers.ModelSerializer):

class Meta:

model = Sale

fields = \"\_\_all\_\_\"



#### Step: データを登録しよう

まずは仕入れ情報から確認します。ブラウザで[[http://localhost:8000/api/inventory/purchases/]{.underline}](http://localhost:8000/api/inventory/purchases/) にアクセスしてください。　Contentの入力フィールドに以下のパラメータを入れPOSTボタンを押してみましょう。

##### ブラウザ（フォーム）

{

\"quantity\": 1,

\"purchase\_date\": \"2025-01-01\",

\"product\": 1

}



図5-5-2　仕入れ登録APIにパラメータを入力

![](media/image21.png)図5-5-2　仕入れ登録APIの実行結果

![](media/image52.png)

次に売上情報を確認します。ブラウザで[[http://localhost:8000/api/inventory/sales/]{.underline}](http://localhost:8000/api/inventory/sales/) にアクセスしてください。Contentの入力フィールドに以下のパラメータを入れPOSTボタンを押してみましょう。

##### ブラウザ（フォーム）

{

\"quantity\": 1,

\"sale\_date\":\"2025-01-01\",

\"product\": 1

}



図5-5-2　売上登録APIにパラメータを入力

![](media/image3.png)

図5-5-2　売上登録APIの実行結果

![](media/image16.png)

### 5-5-1 APIViewによる不正データの登録・参照

ここまでは正常系のデータ登録を確認しました。では、予期しないデータを入れたらどうなるでしょうか。

#### Step: 不正なデータを登録する

　ブラウザで[[http://localhost:8000/api/inventory/products/]{.underline}](http://localhost:8000/api/inventory/products/) にアクセスしてください。図5-5-5ではGET用のボタンしかありませんでしたが、POST用のボタンが追加されています（図5-5-1）。入力フィールドに何も入れないまま、POSTを実行してみましょう。

#### Step: データの実行結果を確認する

図5-5-2　商品登録時のパラメーター不正の表示例

![](media/image23.png)

　商品一覧のレスポンスが返却されています（図5-5-2）。エラーが発生しているのは入力内容に不備があり、例外が発生したためです。エラーの内容に従って必須項目を入力してPOSTしてみましょう。

### バリデーション

実装したAPIのコードの中には直接バリデーションに関する処理は記載していませんでした。このバリデーションはどこで発生したのでしょうか。少し考えてみましょう。

実はx-x-x で作成したモデルの設定に基づき、自動的にバリデーション処理が行われたのです。

// TODO: エラーケース（例: 必須項目が不足している場合、存在しないIDを更新・削除しようとした場合）のバリデーションやエラーレスポンスについても触れると、より堅牢なAPI設計の理解につながります。

### HTTP 400 Bad Request

この400という数字はHTTPステータスというリクエストに関してどんなレスポンスが得られたか、を簡潔なコードに分類したものです。このコードによりリクエストが成功したのか、失敗したのかなど大まかな情報を得ることがで来ます。

#### Step: 不正なデータを参照する

### 5-5-2 APIView以外の方法による登録

　今度は参照系APIのときと同じようにModelViewSetで登録処理を実装してみましょう。

#### Step: プログラムでデータを取得するためのAPIファイルを確認しよう

実は先ほどのコードで、すでに基本的なCRUD処理は実現されているため、views.pyファイルについては新たに実装を行う必要はありません。ProductModelViewSetクラスの現在の内容だけ確認しておきましょう。

コード5-5-8　ビュー（api/inventory/views.py）

##### Backend

from rest\_framework.response import Response

from rest\_framework.views import APIView

from .models import Product

from .serializers import ProductSerializer, PurchaseSerializer, SaleSerializer

from rest\_framework import status

from rest\_framework.viewsets import ModelViewSet

class ProductView(APIView):

（省略）

**class ProductModelViewSet(ModelViewSet):**

\"\"\"

商品操作に関する関数（ModelViewSet）

\"\"\"

queryset = Product.objects.all()

serializer\_class = ProductSerializer

class PurchaseView(APIView):

（省略）

class SaleView(APIView):

（省略）



#### Step: APIのエンドポイントになるURLの設定を修正しよう

　urls.pyは次のように\'get\': \'list\'の後に\'post\': \'create\'というパラメーターを追加します（コード5-5-9）。

コード5-5-9　URLのマッピング（api/inventory/urls.py）

##### Backend

from django.urls import path

from . import views

urlpatterns = \[

path(\'products/\', views.ProductView.as\_view()),

path(

\"products/model/\",

views.ProductModelViewSet.as\_view({\"get\": \"list\", \"post\": \"create\"}),

),

path(\'purchases/\', views.PurchaseView.as\_view()),

path(\'sales/\', views.SaleView.as\_view()),

\]



#### Step: データを登録する

　[[http://localhost:8000/api/inventory/products/model/]{.underline}](http://localhost:8000/api/inventory/products/model/) にアクセスしてContentの入力フィールドに以下のパラメータを入れPOSTボタンを押してみましょう。結果を確認してみましょう（図5-5-6）。

##### ブラウザ（フォーム）

商品名: リネンブレンドショートジャケット（ベージュ）

価格: 5490

商品説明: 軽やかなリネン混素材で、春夏にさらっと羽織れるショート丈ジャケット。カジュアルにもきれいめにも合わせやすく、ワンピースやデニムとの相性も抜群。



図5-5-6　商品登録の表示例

![](media/image15.png)

図5-5-6　商品登録の実行結果

![](media/image29.png)

こちらの方法でも登録できたでしょうか。

### ModelViewSetとHTTPメソッドのマッピング

　APIViewと同じようにPOSTが追加されていることがわかります。ここでのポイントはurls.py ファイルのasViweで設定されたオプションです。今は2つの引数が設定されています。

##### Backend

{

\'get\': \'list\',

\'post\': \'create\'

}



　1つ目のget、postがHTTPメソッド、2つ目のlist、createがViewSetに期待するactionになります。HTTPメソッドはわかりますが、listやcreateはどこから来たのでしょうか。ViewSetはlist、create、retrieve、update、destroyのアクションを自動的に提供するのです【※5-4】。

[^注4]: 「ViewSets」https://www.django-rest-framework.org/api-guide/viewsets/

　またなぜ、新たな実装を加えなくても更新処理が実現していたのでしょうか。それは基底クラスであるViewSetが標準で用意しているためです。これによりViewSet側ではすでに、更新・削除処理まで実装されており、urls側でルーティングさえすれば、いつでも更新・削除処理を呼び出すことができます。

### 5-5-3 APIViewによる更新

　次は商品の更新処理です。再び、APIVivewを使用した実装を行います。ProductViewクラスのpostメソッド以外を次のコードで上書きします（コード5-5-10、コード5-5-11）。

#### Step: プログラムでデータを更新するためのAPIファイルへの処理を追加しよう

コード5-5-10　ビュー（api/inventory/views.py）

##### Backend

from rest\_framework import status

from rest\_framework.exceptions import NotFound

from rest\_framework.response import Response

from rest\_framework.views import APIView

from rest\_framework.viewsets import ModelViewSet

from .models import Product

from .serializers import ProductSerializer, PurchaseSerializer, SaleSerializer

class ProductView(APIView):

\"\"\"

商品操作に関する関数

\"\"\"

def get\_object(self, pk):

\"\"\"

商品操作に関する関数で共通で使用する商品取得関数

\"\"\"

try:

return Product.objects.get(pk=pk)

except Product.DoesNotExist:

raise NotFound

def get(self, request, id: int \| None = None, format=None):

\"\"\"

商品の一覧を取得する

\"\"\"







if id is None:

queryset = Product.objects.all()

serializer = ProductSerializer(queryset, many=True)

return Response(serializer.data, status.HTTP\_200\_OK)

product = self.get\_object(id)

serializer = ProductSerializer(product)

return Response(serializer.data, status.HTTP\_200\_OK)

def post(self, request, format=None):

\"\"\"

商品を登録する

\"\"\"

serializer = ProductSerializer(data=request.data)

\# validationを通らなかった場合、例外を投げる

serializer.is\_valid(raise\_exception=True)

\# 検証したデータを永続化する

serializer.save()

return Response(serializer.data, status.HTTP\_201\_CREATED)

def put(self, request, id: int, format=None):

\"\"\"

商品情報を更新する

\"\"\"

product = self.get\_object(id)

serializer = ProductSerializer(instance=product, data=request.data)

serializer.is\_valid(raise\_exception=True)

serializer.save()

return Response(serializer.data, status.HTTP\_200\_OK)

class ProductModelViewSet(ModelViewSet):

（省略）

class PurchaseView(APIView):

（省略）

class SaleView(APIView):

（省略）



#### Step: APIのエンドポイントになるURLの設定を追加しよう

コード5-5-11　（api/inventory/urls.py）

##### Backend

from django.urls import path

from . import views

urlpatterns = \[

path(\"products/\", views.ProductView.as\_view()),

path(\"products/\<int:id\>/\", views.ProductView.as\_view()),

path(

\"products/model/\",

views.ProductModelViewSet.as\_view({\"get\": \"list\", \"post\": \"create\"}),

),

path(\"purchases/\", views.PurchaseView.as\_view()),

path(\"sales/\", views.SaleView.as\_view()),

\]



#### Step: 一意なデータを参照しよう

　ブラウザのURL欄に[[http://localhost:8000/api/inventory/products/1/]{.underline}](http://localhost:8000/api/inventory/products/1/) と入力して実行してみてください。今度は先ほどの商品一覧の取得と違いURLに指定したidに一致数商品の情報が表示されます。

![](media/image48.png)

#### Step: 一意なデータを更新しよう

後は登録の操作と同様にパラメーターを入力してPUTしてみましょう。

##### ブラウザ（フォーム）

{

\"name\":\"【更新後】コットン100％バックリボンティアードワンピース（黒）\",

\"price\":1234

}



図5-5-6　商品更新のパラメーター

![](media/image11.png)

図5-5-6　商品更新の実行結果

![](media/image50.png)

nameに【更新後】の文字列が追加され、priceが6900から1234に変更されました。正しく更新されたことが確認できました。

### プライマリキーによる検索

　では、コードの内容を見ていきましょう。まず❶と❷で既存の商品取得処理であるdef getに手を加えています。パラメーターからidを取得できた場合はidの一致する商品、取得できない場合は商品の一覧を取得するようにしています。次に❸で更新処理を追加しています。登録処理と異なる点は、更新対象となる商品のidを引数idから受け取っている点です。これによりまずは更新対象となるオブジェクトを、キーを元に取得します。

### 更新データの作成

また、追加で更新内容となるrequestデータも指定して更新データを作成します。以降の処理は登録処理と変わりません。またurls.pyでも❹のURLの指定に\<int：id\>という形でidをパラメーターとして渡すという指定をしています。

#### Step: 存在しないデータを参照してみよう

　ブラウザのURL欄に[[http://localhost:8000/api/inventory/products/100/]{.underline}](http://localhost:8000/api/inventory/products/100/) と入力して実行してみてください。今度は先ほどの商品一覧の取得と違いURLに指定したidに一致数商品の情報が表示されます。

図5-5-6　商品検索の実行結果

![](media/image53.png)

### NotFound

　このとき、更新対象が取得できない場合は例外を投げて処理を終了しています。

### 5-5-4 APIViewによる削除

　最後に削除処理です。

#### Step: プログラムでデータを削除するためのAPIファイルへの処理を追加しよう

ProductViewクラスに次のコードを追加します（コード5-5-12）。

コード5-5-12　ビュー（backend/api/inventory/views.py）

##### Backend

from rest\_framework import status

from rest\_framework.exceptions import NotFound

from rest\_framework.response import Response

from rest\_framework.views import APIView

from rest\_framework.viewsets import ModelViewSet

from .models import Product

from .serializers import ProductSerializer, PurchaseSerializer, SaleSerializer

class ProductView(APIView):

\"\"\"

商品操作に関する関数

\"\"\"

def get\_object(self, pk):

\"\"\"

商品操作に関する関数で共通で使用する商品取得関数

\"\"\"

try:

return Product.objects.get(pk=pk)

except Product.DoesNotExist:

raise NotFound

def get(self, request, id: int \| None = None, format=None):

\"\"\"

商品の一覧を取得する

\"\"\"

if id is None:

queryset = Product.objects.all()

serializer = ProductSerializer(queryset, many=True)

return Response(serializer.data, status.HTTP\_200\_OK)

product = self.get\_object(id)

serializer = ProductSerializer(product)

return Response(serializer.data, status.HTTP\_200\_OK)

def post(self, request, format=None):

\"\"\"

商品を登録する

\"\"\"

serializer = ProductSerializer(data=request.data)

\# validationを通らなかった場合、例外を投げる

serializer.is\_valid(raise\_exception=True)

\# 検証したデータを永続化する

serializer.save()

return Response(serializer.data, status.HTTP\_201\_CREATED)

def put(self, request, id: int, format=None):

\"\"\"

商品情報を更新する

\"\"\"

product = self.get\_object(id)

serializer = ProductSerializer(instance=product, data=request.data)

serializer.is\_valid(raise\_exception=True)

serializer.save()

return Response(serializer.data, status.HTTP\_200\_OK)

def delete(self, request, id: int, format=None):

\"\"\"

商品を削除する

\"\"\"

product = self.get\_object(id)

product.delete()

return Response(status=status.HTTP\_200\_OK)

class ProductModelViewSet(ModelViewSet):

（省略）

class PurchaseView(APIView):

（省略）

class SaleView(APIView):

（省略）



#### Step: 一意なデータを参照しよう

ブラウザのURL欄に[[http://localhost:8000/api/inventory/products/7/]{.underline}](http://localhost:8000/api/inventory/products/3/) と入力して実行してみてください。今度は先ほど異なりdeleteボタンが追加されていると思います。

図5-5-6　商品検索の実行結果

![](media/image5.png)

#### Step: 一意なデータを削除しよう

同じ画面でdeleteボタンを押下し、データが削除されるか確認してみてください。

図5-5-6　商品削除の実行結果

![](media/image7.png)

　こちらも更新処理と同様に、キーにより削除対象のオブジェクトを取得し、対象が存在しない場合は例外を投げます。削除対象が存在する場合は、削除をするため特にvalidationは行わず削除メソッドにて削除を行います。

　登録と更新、削除処理はHTTPメソッドによって処理を区別していました。また、商品IDといったプライマリーキーによって検索された結果から操作用のインスタンスを作成し、登録と更新、削除処理を行っていました。呼び出し元となるURLや使用するシリアライザーが同じでも、異なる処理がうまく実現されていることがわかったでしょうか。

　しかし、このままだとSQLでよく登場するJOINや、外部キー制約を持つ場合の処理といった複雑な処理に対応していません。次の節ではこの部分を解決していきましょう。

## 5-7 より複雑な参照・登録処理

### 5-7-1 より複雑な参照処理

　テーブル単位での参照・更新処理はわかりましたが、開発ではテーブルを結合した結果やカラムのデータを加工した結果を取得することもあります。そういった場合はどうするのでしょうか。

　次の仕入れ・売上テーブルから作成した在庫データを取得する処理を見てみましょう。

#### Step: データを変換するためのシリアライザーを追加しよう

コード5-7-2　シリアライザー（api/inventory/serializers.py）

##### Backend

from rest\_framework import serializers

from .models import Product, Purchase, Sale

class ProductSerializer(serializers.ModelSerializer):

class Meta:

model = Product

fields = \"\_\_all\_\_\"

class PurchaseSerializer(serializers.ModelSerializer):

class Meta:

model = Purchase

fields = \"\_\_all\_\_\"

class SaleSerializer(serializers.ModelSerializer):

class Meta:

model = Sale

fields = \"\_\_all\_\_\"

\# 仕入れ・売上情報の一覧

\# Modelに依存しないため、個別にフィールドを定義している

class InventorySerializer(serializers.Serializer):

id = serializers.IntegerField()

unit = serializers.IntegerField()

quantity = serializers.IntegerField()

type = serializers.IntegerField()

date = serializers.DateTimeField()



#### Step: プログラムでデータを参照するためのAPIファイルへの処理を追加しよう

コード5-7-1　ビュー（backend/api/inventory/views.py）

##### Backend

from django.db.models import F, Value

from rest\_framework import status

from rest\_framework.exceptions import NotFound

from rest\_framework.response import Response

from rest\_framework.views import APIView

from rest\_framework.viewsets import ModelViewSet

from .models import Product, Purchase, Sale

from .serializers import (

InventorySerializer,

ProductSerializer,

PurchaseSerializer,

SaleSerializer,

)

class ProductView(APIView):

（省略）

class ProductModelViewSet(ModelViewSet):

（省略）

class PurchaseView(APIView):

（省略）

class SaleView(APIView):

（省略）

\# 追記前はここが末尾

class InventoryView(APIView):

\"\"\"

在庫情報を取得する

\"\"\"

def get(self, request, id: int \| None = None, format=None):

if id is None:

\# 件数が多くなるので商品IDは必ず指定

return Response({}, status.HTTP\_400\_BAD\_REQUEST)

\# UNIONするために、それぞれフィールド名を再定義

purchase = (

Purchase.objects.filter(product\_id=id)

.prefetch\_related(\"product\")

.values(

\"id\",

\"quantity\",

type=Value(\"1\"),

date=F(\"purchase\_date\"),

unit=F(\"product\_\_price\"),

)

)

sales = (

Sale.objects.filter(product\_id=id)

.prefetch\_related(\"product\")

.values(

\"id\",

\"quantity\",

type=Value(\"2\"),

date=F(\"sale\_date\"),

unit=F(\"product\_\_price\"),

)

)

queryset = purchase.union(sales).order\_by(F(\"date\"))

serializer = InventorySerializer(queryset, many=True)

return Response(serializer.data, status.HTTP\_200\_OK)



#### Step: APIのエンドポイントになるURLの設定を追加しよう

コード5-7-3　（backend/api/inventory/urls.py）

##### Backend

from django.urls import path

from . import views

urlpatterns = \[

path(\"products/\", views.ProductView.as\_view()),

path(\"products/\<int:id\>/\", views.ProductView.as\_view()),

path(

\"products/model/\",

views.ProductModelViewSet.as\_view({\"get\": \"list\", \"post\": \"create\"}),

),

path(\"purchases/\", views.PurchaseView.as\_view()),

path(\"sales/\", views.SaleView.as\_view()),

path(\"inventories/\<int:id\>/\", views.InventoryView.as\_view()),

\]



#### Step: 一意なデータを参照しよう

ブラウザのURL欄に[[http://localhost:8000/api/inventory/inventories/1/]{.underline}](http://localhost:8000/api/inventory/inventories/1/) と入力して実行してみてください。

図5-5-6　仕入売上検索の実行結果

![](media/image10.png)

### 全体の処理の流れ

　複雑なので1行を分解して見ていきましょう。

##### Backend

Purchase.objects.filter(product\_id=id)



　まず、filterで仕入れ情報から特定の商品データに絞り込んでいます。WHERE句のイメージです。

##### Backend

.prefetch\_related(\'product\')



　次に.prefetch\_relatedによって、外部キーとして持っているprodduct\_idに紐づく商品情報をJOINしています。

##### Backend

.values(\"id\", \"quantity\", type=Value(\'1\'), date=F(\'purchase\_date\'), unit=F(\'product\_\_price\'))



　最後にvaluesによって取得するデータやカラム名の加工を行っています。\"id\"や\"quantity\"はそのままPurchaseに対応するカラムを取得しています。type=Value(\'1\')は、

新しいカラム名 = 取得値

という関係で、今回は1という定数にtypeという名称をつけて取得しています。Valueによって特定の値を指定しており、ちょうどASに対応しています。

　date=F(\'purchase\_date\')も上記のようにカラムの別名をつけていますが、こちらはFを指定しています。Fは特定の値を指定するValueと異なり、既存のカラム名を指定して参照するために使用します。SQLに対応させるとASにあたります。

　最後にunit=F(\'product\_\_price\')です。先ほどのdateの指定と似ていますが、実はこれはprefetch\_relatedによりJOINされたテーブルのカラムを取得しています。

新しいカラム名 = F(\'JOIN対象のテーブル名\_\_カラム名\')

　また、Valuesと同じように使われるannotaionというものもあります。こちらもValueのように別名をつけられるのですが、新たにカラムを追加するという点が異なります。

　では後続の処理をもう少し見ていきましょう。salesの処理はpurchaseと同じなので割愛します。

queryset = purchase.union(sales).order\_by(F(\"date\"))



　unionによって2つのquerysetを1つにまとめています。まとめた後にorder\_by(F(\"date\")により、日付カラムにて並べ替えを行っています。それぞれSQLのUNIONとORDER BYに相当します。このように通常のSQLによって実行する機能は、一通り実装することが可能です。

### 5-7-2 より複雑な登録処理

　売上の登録にチェックの処理を追加します。仕入れた数量よりも売上げた数量のほうが多く登録されないように、登録処理内でチェックをするようにします。

#### Step: 専用の例外クラスを作成しよう

新規にexception.pyファイルを作成し、以下のコードを入力しましょう。

コード5-7-5　例外（api/inventory/exceptions.py）**New**

##### Backend

from rest\_framework import status

from rest\_framework.exceptions import ValidationError

class BusinessException(ValidationError):

status\_code = status.HTTP\_422\_UNPROCESSABLE\_ENTITY



#### Step: プログラムでデータを参照するためのAPIファイルへの処理を追加しよう

SaleViewクラスのpostメソッド内を次のコードで上書きします（コード5-7-4、コード5-7-5）。

コード5-7-4　ビュー（api/inventory/views.py）

##### Backend

from django.db.models import F, Sum, Value

from django.db.models.functions import Coalesce

from rest\_framework import status

from rest\_framework.exceptions import NotFound

from rest\_framework.response import Response

from rest\_framework.views import APIView

from rest\_framework.viewsets import ModelViewSet

from api.inventory.exceptions import BusinessException

from .models import Product, Purchase, Sale

from .serializers import (

InventorySerializer,

ProductSerializer,

PurchaseSerializer,

SaleSerializer,

)

class ProductView(APIView):

（省略）

class ProductModelViewSet(ModelViewSet):

（省略）

class PurchaseView(APIView):

（省略）

class SaleView(APIView):

def post(self, request, format=None):

\"\"\"

売上情報を登録する

\"\"\"

serializer = SaleSerializer(data=request.data)

serializer.is\_valid(raise\_exception=True)

\# 在庫が売る分の数量を超えないかチェック

purchases = Purchase.objects.filter(

product\_id=request.data\[\"product\"\]

).aggregate(

quantity\_sum=Coalesce(Sum(\"quantity\"), 0)

) \# 在庫テーブルのレコードを取得

sales = Sale.objects.filter(product\_id=request.data\[\"product\"\]).aggregate(

quantity\_sum=Coalesce(Sum(\"quantity\"), 0)

) \# 卸しテーブルのレコードを取得

\# 在庫が売る分の数量を超えている場合はエラーレスポンスを返す

if purchases\[\"quantity\_sum\"\] \< (

sales\[\"quantity\_sum\"\] + int(request.data\[\"quantity\"\])

):

raise BusinessException(\"在庫数量を超過することはできません\")

serializer.save()

return Response(serializer.data, status.HTTP\_201\_CREATED)

class InventoryView(APIView):

（省略）



#### Step: データを登録しよう

次に売上情報を確認します。ブラウザで[[http://localhost:8000/api/inventory/sales/]{.underline}](http://localhost:8000/api/inventory/sales/) にアクセスしてください。Contentの入力フィールドに以下のパラメータを入れPOSTボタンを押してみましょう。

##### ブラウザ（フォーム）

{

\"quantity\": 1,

\"sale\_date\":\"2025-01-01\",

\"product\": 1

}



図5-5-2　売上登録APIにパラメータを入力

![](media/image18.png)

現在の在庫数量を超えて売ろうとした場合に、例外が発生します。

図5-5-2　売上登録APIの実行結果

![](media/image33.png)

### 例外処理

　それでは追加したコードの内容を見ていきましょう。❶では今まで登録した商品の仕入れ数、売上数の合計値をそれぞれ算出しています。5-7-1項より複雑な参照処理で行ったように、filterでidを元に特定の商品データに絞り込み、aggregateという集計関数のSumオプションで合計値を求めています。

　次に、❷では商品の仕入れ数、売上数の合計値を比較して、売上数のほうが多かった場合は登録されないように例外をスローしています。ここでスローする例外はこの在庫管理アプリケーション特有の例外になるため、カスタム例外として新しく定義した例外をスローしています。

　後続処理は他の更新処理と同様です。

　ここまでの内容で、典型的なCRUD処理は実装できるようになったはずです。実際の開発では、JOIN以外にも様々なSQLの処理が必要になりますが、今回の実装のようにそのSQLに対応するDjangoのメソッドを探して対応することになるでしょう。詳しくは公式のページを参照してみてください。

## 5-8 APIを管理する

### 5-8-1 APIを管理する

ここまででいろいろAPIを作成してきました。しかし複数のAPIがあると1画面1画面確認しなければいけなくなり少し不便です。もっと規模が大きくなっても簡単に確認できるようにAPIを管理する仕組みも作りましょう。

![](media/image8.png)

#### Step: DRF用のSwaggerをインストールする

以下のコマンドを実行してください。

##### Backend

pip install drf-yasg



次回まとめてインストールできるように requirements.txt も更新しておく。

requirements.txt

asgiref==3.9.1

Django==5.2.4

djangorestframework==3.16.0

sqlparse==0.5.3

mysqlclient==2.2.4

drf-yasg==1.21.10



#### Step: Djangoサーバーがライブラリを読み込むように設定する

次に、Djangoプロジェクトの設定ファイルにdrf-yasgを追加します。config/settings/[[base.py]{.underline}](http://base.py)に以下を追加します。

##### Backend

コード3-3-x　共通環境用の設定ファイル（config/settings.py）

\# Application definition

INSTALLED\_APPS = \[

\"django.contrib.admin\",

\"django.contrib.auth\",

\"django.contrib.contenttypes\",

\"django.contrib.sessions\",

\"django.contrib.messages\",

\"django.contrib.staticfiles\",

\"rest\_framework\",

\"drf\_yasg\",

\"api.inventory\",

\]



#### Step: Djangoで共通設定のAPIへのルーティングを設定する

次に、APIのエンドポイントを定義します。config/urls.pyを以下のように更新します。

##### Backend

コード3-3-x　共通環境用の設定ファイル（config/urls.py）

from django.contrib import admin

from django.urls import include, path

from drf\_yasg import openapi

from drf\_yasg.views import get\_schema\_view

from rest\_framework.permissions import AllowAny

\# Swagger用のスキーマビューを設定します。

schema\_view = get\_schema\_view(

openapi.Info(

title=\"Inventory API\", \# APIのタイトル

default\_version=\"v1\", \# APIのバージョン

description=\"API documentation for Inventory management\", \# APIの説明

),

public=True, \# 公開設定

permission\_classes=(AllowAny,), \# 誰でもアクセス可能に設定

)

urlpatterns = \[

path(\"admin/\", admin.site.urls),

path(\"api/inventory/\", include(\"api.inventory.urls\")),

path(

\"swagger/\",

schema\_view.with\_ui(\"swagger\", cache\_timeout=0),

name=\"schema-swagger-ui\",

),

\]



#### Step: Swaggerの管理画面を表示する

これで、Swagger UIを開くためにブラウザで[[http://localhost:8000/swagger/]{.underline}](http://localhost:8000/swagger/)　にアクセスしてください。作成したbackend取得APIが表示されたのではないでしょうか。

![](media/image17.png)

#### Step: Swaggerの管理画面から参照APIを実行する

/products/{id}/の「Try it out」ボタンを押下してください。

図5-5-2　売上登録APIの実行結果

![](media/image6.png)

id に1を入力し、「Execute」ボタンを押下してください。

図5-5-2　売上登録APIの実行結果

![](media/image19.png)

#### Step: Swaggerから実行した場合でも参照APIの結果が同じことを確認する

Responsesに実行結果が返ってきます。

図5-5-2　売上登録APIの実行結果

![](media/image4.png)

### Swagger

Swaggerは、APIの設計、構築、文書化を行うためのオープンソースフレームワークです。Swaggerは、APIの仕様を記述するための標準フォーマットであるOpenAPI Specification (OAS) を使用して、APIのインタラクティブなドキュメントを提供します。これにより、開発者はAPIのエンドポイント、リクエスト、レスポンスなどを視覚的に確認し、テストすることができます。

## 5-9 Gitに作業状態を残す

#### Step フロントエンドの初期状態をローカルのgitに保存する

ここまで実行できたでしょうか。問題なければ、いったんこの状態を保存するためにgithubに開発状態を連携したいと思います。

##### コマンドプロンプト（Ubuntu）

cd /usr/local/src/dev/\<REPO\>

git add .

git commit -m \"6章終了時点\"

#### 

#### Step ローカルのgitの状態をgithubに連携する

以下のコマンドを実行してください。

##### コマンドプロンプト（Ubuntu）

git push origin main

Enumerating objects: 25, done.

Counting objects: 100% (25/25), done.

Delta compression using up to 8 threads

Compressing objects: 100% (24/24), done.

Writing objects: 100% (25/25), 76.02 KiB \| 8.45 MiB/s, done.

Total 25 (delta 0), reused 0 (delta 0), pack-reused 0

To https://github.com/keiji-ueno/wfswd02.git

\* \[new branch\] main -\> main

5-10 本章のハンズオンチェック
==============================

以下の内容を実施できたでしょうか。問題がなければまとめの内容を確認して、次の章に進んでください。

✅Djangoを利用してデータベースを操作できるAPIを実装する

✅Swaggerを利用してAPIをブラウザから実行できるようにする

✅バックエンド環境をGithubのリポジトリに保存する

## 5-11 本章のまとめ

　本章では、Django REST Framework (DRF) を用いたバックエンドの構築に焦点を当て、Webアプリケーションの基盤となるAPIの実装についてハンズオンを通して学びました。

具体的には、以下の重要な概念と実装手法を習得しました。

-   Djangoプロジェクトとアプリケーションの構成: プロジェクトとアプリケーションの役割、そしてそれらがどのように連携して機能するのかを理解しました。

-   APIの設計とルーティング: URL設計の基本的な考え方と、DjangoにおけるAPIエンドポイントの定義方法を学びました。

-   モデルとデータベース連携: DjangoのORM（Object-Relational Mapping）を利用してデータベースと連携し、テーブルの定義からデータの操作までを一貫して行えるようになりました。

-   シリアライザーによるデータ変換: データベースのデータをJSON形式に変換し、APIを通じてフロントエンドに提供するためのシリアライザーの役割と実装方法を習得しました。

-   APIViewとModelViewSet: DRFが提供する基本的なAPIViewと、より高度な機能を提供するModelViewSetを用いて、参照、登録、更新、削除といったCRUD操作を実装しました。

-   ビジネスロジックの実装とバリデーション: データの一貫性を保ち、不正な操作を防ぐためのビジネスロジックの組み込み方、そしてDRFによるバリデーションの仕組みを学びました。

-   Swagger UIによるAPIドキュメント化: 開発効率を高めるためのAPIドキュメンテーションツールであるSwagger UIを導入し、APIの仕様確認やテストを容易に行えるようになりました。

本章で構築したバックエンドは、次章で学ぶフロントエンドとの連携の基盤となります。

次章では、本章で作成したバックエンドAPIを4章のハンズオンで作成したReactとNext.jsで構築されたフロントエンドアプリケーションから呼び出してみます。これによりユーザーが実際に操作できるフルスタックアプリケーションとして完成させることを目指します。本章で得た知識と経験を活かし、次のステップに進んでいきましょう。
