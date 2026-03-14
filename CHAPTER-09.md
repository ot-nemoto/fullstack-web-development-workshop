# 第9章

この章ではアプリケーションのDB管理についてより深堀していきます。機能の実装からは少し離れて管理のパターンを学びましょう。

## 9-1 はじめに

前章までは主にアプリケーションの作り方について学んできました。第9章では、これまでのアプリケーション開発で触れてきたデータベースの管理について、さらに深く掘り下げて学びます。第4章から第8章までのハンズオンでは、Djangoのモデル機能を使ってテーブルを作成・更新する方法を学んできました。本章では、その仕組みがなぜ必要なのか、そして実際の開発現場でどのように応用されているのかを理解することが目的です。

### 9-1-1 本章の目的と概要

#### 本章で達成できること

- DDL（データ定義言語）の管理方法を理解できる。データベースのテーブル定義をDjangoのマイグレーション機能を使って管理する仕組みを、より深く理解します。
- DML（データ操作言語）の管理方法を習得できる。データベースに初期データやマスタデータを登録・更新する手法として、Djangoの「fixture」やカスタムマイグレーションを使いこなせるようになります。
- 環境ごとのデータ管理を学ぶ。開発環境、ステージング環境、本番環境といった複数の環境で、データベースの定義やデータを安全かつ効率的に管理する方法を学びます。

#### なぜ本章の技術的要素が必要なのか

Webアプリケーションは、リリース後も機能追加や改善が頻繁に行われます。それに伴い、データベースのテーブル構成（DDL）や、初期に登録しておくべきデータ（DML）も変更されることがあります。もしこれらの変更が適切に管理されていないと、環境によってデータベースの状態が異なってしまい、「開発環境では動くのに、本番環境では動かない」といった深刻な問題が発生する可能性があります。本章で学ぶ知識は、こうした現実的な課題を解決するために不可欠なスキルです。

### 9-1-2 開発環境の準備

本章を開始するにあたって、第XX章のハンズオンが完了し、以下の環境が整っていることを前提とします。

- Dockerコンテナ上でNext.jsとDjangoが動作し、第8章で実装した非同期処理・バッチ処理の機能が動作すること。
- GitHubにバックエンドのリポジトリが作成されており、上記のコードまでコミットされていること。

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未設定の箇所があればXX章に戻り、設定を見直してください。

### 9-1-3 この章からハンズオンを始める場合

XX章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませておいてください。

また、本章から始めたいという方は以下のリポジトリをクローンもしくはフォークして始めてください。

クローン or フォークコマンド

フォークが完了したら以下の操作でDockerコンテナを立ち上げてみてください。

DevContainerの展開

npmインストールとNext.jsの起動コマンド

本章以降は読者の理解度に合わせて好きな章からハンズオンを開始することができます。また、学習をはじめからやり直したいときなどご利用ください。

この章から新規にハンズオンを始める場合は以下のURLのリポジトリをクローンして始めてください。

[https://xxxx](https://xxxx)

クローンおよび開発環境の構築手順は、X章Y項を参考にしてください。

### 9-1-4 第X章のテーマに関する基礎知識

本章では、Djangoが提供するマイグレーションという仕組みを中心にハンズオンを行います。そのため、SQLやデータベースについて基本的な知識を持っていると、より理解が深まります。もしデータベースの概念に不安がある場合は、第1章の「モデル層（データベース層）」の解説を振り返っておきましょう。

ここでは特に、開発現場でよく使われる「DDL（データ定義言語）」と「DML（データ操作言語）」という用語について簡単に復習します。

#### DDL（Data Definition Language）

データベースの構造（テーブルやカラムなど）を定義・変更するためのSQLです。`CREATE TABLE`や`ALTER TABLE`などがこれに該当します。Djangoのマイグレーションファイルが生成するものは、このDDLにあたります。

#### DML（Data Manipulation Language）

データベースに格納されたデータを操作するためのSQLです。`INSERT`（データの追加）、`UPDATE`（データの更新）、`DELETE`（データの削除）などがこれに該当します。本章では、このDMLを効率的に管理する方法を学びます。

## 9-2 第X章のテーマの全体像

（第X章のテーマの全体像の概要）

### 9-2-1 マイグレーション処理の分類

マイグレーション対象として大きく2つに分けています。

- DDL
- DML

またマイグレーションを実現する方法を大きく3つに分けています。

- Djangoデフォルトのマイグレーション
- Djangoデフォルトのマイグレーションをカスタマイズしマイグレーション関数を使ったマイグレーション
- Djangoデフォルトのマイグレーションをカスタマイズしfixtureを活用したマイグレーション

### 9-2-2 マイグレーション処理の実装の流れ

### 9-2-3 マイグレーション処理の実装範囲

この章の実装範囲は、バックエンドの中でもマイグレーションに関わる処理に限定しています。

## 9-1 データ構造（DDL）の管理

第4章～第7章まではモデルを生成する際には、Djangoのマイグレーションの仕組みを利用してDDLを作成していました。この章では、これ以外の方法も取り上げ、この仕組みの立ち位置を確認しつつ管理方法を見ていきましょう。

### 9-1-1 なぜDDLを管理するか

まずDBの役割を考えてみましょう。DBがあることで、アプリケーションで扱うデータの一貫性を保ちながら保管や共有ができます。また、適切な粒度でデータを扱うことで、効率よくデータを使用することができます。これらのデータ構造はDDLを元に作成されます。

#### DDL

では、そもそもDDLとは何でしょうか。私たちが普段よく実行しているSQLを分類してみましょう。図9-1-1のように2種類のSQLが存在します。

![SQLの分類](media/image17.png)

*図9-1-1　SQLの分類*

1つはCREATE文やALTER文といった、新しいテーブルやビューを作成・変更するSQLです。こういったデータベースの構造を決めるSQLをDDL（データ定義言語）といいます。データを集め、保存するために、データの保存先となるデータベースやテーブルは必ず作成します。DBを作成する上でDDL（データ定義言語）はとても重要な役割を担っているのです。

#### DML

もう1つはSELECT文やINSERT文といった、保存されたデータを参照・変更するSQLです。データを操作するSQLで、DML（データ操作言語）と呼ばれます。プロジェクトによってはGRANT文といった、権限設定を作成するDCLという分類もありますが、本書では設定を行わないため、割愛します。

#### 管理方法

DBはアプリケーションの機能の追加や修正などの過程で、日々変更が加えられていきます。アプリケーション開発当初からデータ構造が変わらないケースは稀でしょう。同じようにデータ定義を管理するDDLも日々変更が発生します（図9-1-2）。

![DDLの適用のイメージ](media/image10.png)

*図9-1-2　DDLの適用のイメージ*

もし、DDLが管理されていないとどうなってしまうでしょうか。そのDBの状態が最新だということはどうすればわかるでしょうか。こういったDBの状態を正しく保つためにはDDLの管理が不可欠になってきます。

### 9-1-2 DDLの管理のバリエーション

DDLの管理の必要性がわかったところで、次はその管理方法について考えていきます。次のようなバリエーションがあります。

#### SQLを自分たちでテーブル定義して、自分たちでフォルダ管理していくパターン

- レガシーなシステムで見かける
- フォルダの作成やDDLの適用は、人もしくは人がオリジナルで作成したプログラムなどを用いる

![手動による管理](media/image6.png)

*図9-1-3　手動による管理*

#### SQLを自分たちでテーブル定義して、ツールで管理していくパターン

- 管理はDDLを管理するためのフレームワークが行う
- デプロイ時に自動的に適用するといった人の手を介さない管理ができる
- SQL自体は自前で作成する必要がある

#### コードを元にテーブル定義を生成して、フレームワークで管理していくパターン

- 上記2つのパターンと異なり、DDL自体もフレームワーク側で生成する
- ユーザーはデータ定義のみを考えればよい

それぞれの違いをまとめると**表9-1-1**のようになります。

| | フォルダ管理 | SQLのみ管理 | データ定義のみ管理 |
|---|---|---|---|
| 管理の容易さ | △ | 〇 | ◎ |
| 管理の柔軟性 | ◎ | 〇 | △ |
| 学習コスト | 〇 | △ | △ |

評価は大きく2つの観点で行っています。

① フレームワークまたは特定のライブラリによって管理されているか

② SQLそのものを開発者が記述するか

それぞれの評価指針について、簡単に見ていきましょう。

まず、①についてです。フレームワークを使うと、そのフレームワークのルールに従った管理を行わなければいけません。そのため管理の柔軟性は、フォルダ管理に比べるとどうしても劣ってしまいます。また、フレームワークに沿った記載方法を学ぶ必要もあり、学習コストもかかります。しかし、管理方法がフレームワークに沿ってさえいれば常に一貫した運用を行うことができ、長期的に見れば管理自体は容易になります。

次に、②についてです。SQLをそのまま記述する場合は、普段記載しているSQLを記載することができるため、柔軟性も高く学習コストも小さくて済みます。一方、SQLを生成する別の言語で記載する場合は、①の場合と同様にルールに従って記載しなければいけないため、柔軟性は劣り、追加の学習も必要になります。ただ、SQLを生成してもらうと、SQLによる違いをプログラム側で吸収できるというメリットがあります。

### 9-1-3 DjangoにおけるDDL管理

上述の通り、Djangoはフレームワークで管理していくパターンです。第6章の内容と重複するところもありますが、復習も兼ねて振り返ってみましょう。

#### 新規にDBを作成する場合

図9-1-4はDjangoのDDL管理の全体像です。

![DjangoにおけるDDLの適用イメージ](media/image14.png)

*図9-1-4　DjangoにおけるDDLの適用イメージ*

本稿では以下の①～④の流れで管理を進めます。実際はモデルの設定ファイルを作成する前に、DBの設計を行うといった作業もありますが、Djangoの作業とは異なるので省いています。

① `config/settings`直下の`base.py`にモデル定義を含むアプリケーションを追加する

- デフォルトのプロジェクト構成であれば`settings.py`になる

② ①で追加したアプリケーションのモデルファイルを修正する

③ `makemigrations`コマンドにより、モデルファイルに従ってマイグレーションファイルが生成される

④ `migrate`コマンドにより、マイグレーションファイルに従ってDBが更新される

この章までは、この流れのように新規のDBにテーブルを追加するケースを扱いました。しかし前述したように、実際のアプリケーション開発ではデータ構造は日々変わっていきます。その場合、このDjangoのDDL管理ではどうなるでしょうか。

#### DB定義を更新する場合

新規にDBを利用した場合のDBに、次の変更を段階的に加えてみましょう。

① テーブルProductを追加する

② テーブルCategoryを追加し、テーブルProductに新規カラム：categoryを追加する

③ テーブルCategoryを削除する

#### STEP: モデルを追加する

まずは①ですが、第7章までの操作で、すでにProductを作成する0001_initial.pyは実行されています。未作成の方は、第7章の手順を確認し実行してください。次に②を実施していきます。以下のmodels.pyに、Categoryクラスを追加します（コード9-1-1）。また、Productクラスにもcategoryの設定を追加します。前提として、この章でのモデルに対する変更はDDLやDMLの動作を理解するための変更なので、これまでに作成した商品在庫機能としての使用はしません。そのため、バックエンドのビューファイルやフロントエンドの修正も行いません。

**コード9-1-1　モデル（backend/api/inventory/models.py）**

```python
# Backend api/inventory/models.py

# (中略)

class Category(models.Model):
    """
    カテゴリー
    """
    name = models.CharField(max_length=100, verbose_name="カテゴリ名")
    parent_category = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE
    )

    class Meta:
        db_table = "category"
        verbose_name = "カテゴリー"
        verbose_name_plural = "カテゴリー一覧"

class Product(models.Model):
    """
    商品
    """
    name = models.CharField(max_length=100, verbose_name="商品名")
    price = models.IntegerField(verbose_name="価格", validators=[MinValueValidator(0)])
    description = models.TextField(verbose_name="商品説明", null=True, blank=True)
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.CASCADE
    )

    class Meta:
        db_table = "product"
        verbose_name = "商品"
        verbose_name_plural = "商品一覧"

# (中略)
```

#### STEP: モデルからマイグレーションファイルを生成する

このファイルからマイグレーションファイルを生成してみましょう。

```bash
python manage.py makemigrations
```

次のような実行結果が表示されます。

```
Migrations for 'inventory':
  api/inventory/migrations/0003_category_product_category.py
    + Create model Category
    + Add field category to product
```

#### STEP: 生成したマイグレーションファイルを確認する

migrationsフォルダ配下に次の新しいマイグレーションファイル：0003_category_product_category.py が作成されます。マイグレーションファイルの適用状態について確認しましょう。

```bash
python manage.py showmigrations inventory
```

次のような実行結果が表示されます。

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [ ] 0003_category_product_category
```

#### migrationのオプション

初めて使用するオプションが2つ出てきました。`showmigrations`はプロジェクト内のマイグレーション状態を表示するコマンドです。マイグレーション済みのファイルには`[X]`が指定され、未対応のものは空になっています。`inventory`はコマンドの対象となるアプリケーションです。全てのマイグレーション結果を表示すると見づらいので、今回対象としているアプリケーションの`inventory`のみに絞っています。

#### STEP: 生成したマイグレーションファイルを適用する

では、このマイグレーションファイルをDBに適用しましょう。

```bash
python manage.py migrate inventory
```

意図した変更が適用されたか、MySQL Workbenchで確認しましょう。詳しい使い方は2-3-3項「MySQL Workbenchの使い方」を参照してください。

次のように今回定義したCategoryテーブルとcategory_idカラムが追加されています（図9-1-5）。

![MySQL Workbenchの表示イメージ](media/image5.png)

*図9-1-5　MySQL Workbenchの表示イメージ*

#### STEP: マイグレーションファイルの適用結果を確認する

migrationファイルの適用状態についても確認してみましょう。

```bash
python manage.py showmigrations inventory
```

次のような実行結果が表示されます。

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
```

#### migrationファイルの実行時の区別

横道にそれますが、ここで1つ気になることがあります。`migrate`コマンドの実行時、実行対象となるマイグレーションファイルはどうやって区別されているのでしょうか。`migrations`フォルダの中には`0001_initial.py`と`0002_category_product_category`の2つのファイルがありました。このとき、`0001_initial.py`は実行されなかったのでしょうか。

showmigrationsコマンドの実行結果からもわかる通り、Djangoではマイグレーションファイルの適用状態について管理しているため適用済みのものは再実行されません。

#### カラムとテーブル削除

DB定義更新の流れに戻りましょう。

#### STEP: モデルの定義を削除する

次は③の「Categoryテーブルを削除する」を進めます。models.pyの②で追加したCategoryに関するコードを削除しましょう（コード9-1-2）。

**コード9-1-2　モデル（backend/api/inventory/models.py）**

```python
# Backend api/inventory/models.py

# (中略)

class Product(models.Model):
    """
    商品
    """
    name = models.CharField(max_length=100, verbose_name="商品名")
    price = models.IntegerField(verbose_name="価格", validators=[MinValueValidator(0)])
    description = models.TextField(verbose_name="商品説明", null=True, blank=True)

    class Meta:
        db_table = "product"
        verbose_name = "商品"
        verbose_name_plural = "商品一覧"

# (中略)
```

#### STEP: 削除したモデルから新しいマイグレーションファイルを生成する

さっそく、マイグレーションを行い、変更を確認しましょう。

```bash
python manage.py makemigrations
```

```
Migrations for 'inventory':
  api/inventory/migrations/0004_remove_product_category_delete_category.py
    - Remove field category from product
    - Delete model Category
```

#### STEP: 生成したマイグレーションファイルを確認する

```bash
python manage.py showmigrations inventory
```

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
  [ ] 0004_remove_product_category_delete_category
```

#### STEP: 生成したマイグレーションファイルを適用する

```bash
python manage.py migrate inventory
```

#### STEP: マイグレーションファイルの適用結果を確認する

```bash
python manage.py showmigrations inventory
```

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
  [X] 0004_remove_product_category_delete_category
```

意図した変更が適用されたか、MySQL Workbenchで確認しましょう（図9-1-6）。②で追加したCategoryテーブルとそれに関連するカラムは削除されていたでしょうか。

![MySQL Workbenchの表示イメージ](media/image2.png)

*図9-1-6　MySQL Workbenchの表示イメージ*

#### 既存のDBを利用する場合

今回はDBを含め新規開発を行っていますが、プロジェクトによってはすでにDBが存在しているということもあるでしょう。

![DjangoにおけるDDLの適用イメージ](media/image12.png)

*図9-1-7　DjangoにおけるDDLの適用イメージ*

大きな違いとして、新規にテーブルを追加する場合は手動でモデルクラスを作成していましたが、既存テーブルが存在する場合はDB定義からモデルクラスを自動生成します。本項のアプリケーションは新規に作成した場合を想定しているため、この既存DBの例は紹介のみにとどめておきます。

具体的には次の流れで進めていきます。

① `inspectdb`コマンドにより、DB定義からモデルクラスを生成する

② `base.py`にモデルクラスを含むアプリケーションを追加する

③ ②に追加したアプリケーションに①で生成したモデルファイルを追加する

④ `makemigrations`コマンドにより、モデルファイルに従ってマイグレーションファイルを生成する

⑤ `migrate`コマンドにより、マイグレーションファイルに従ってDBを更新する

④でマイグレーションファイルを生成すると、既存のテーブル定義が再度適用されると思うかもしれません。実はデフォルトの動作ではモデルクラスがマイグレーション対象とならないように、アンマネージドモデルとして作成されるため、既存テーブルのマイグレーションは行われません。

ただし、1つ問題があります。この状態だと、今回だけでなく次回以降もマイグレーション対象とならないため、マネージドモデルに変更する必要があります。

### 9-1-4 頻繁なリリースやデータ定義のやり直しへの対応

運用を進めているとマイグレーション実施後に誤りに気づき、前のバージョンに戻したいというシーンも出てきます。どうしたらよいでしょうか。

#### 単純なmigrationのロールバック

前項の`showmigrations`コマンドで確認した通り、Djangoではマイグレーション履歴を管理しています。このmigration履歴に従って任意の履歴までロールバックすることができます。

次のような流れで実施します。

① migration履歴を確認し、ロールバック対象を決める

② 履歴のロールバックを行う

③ ロールバックされた履歴に対応するファイルを削除する

#### STEP: マイグレーションの履歴を確認する

まず履歴を確認してみましょう。

```bash
python manage.py showmigrations inventory
```

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
  [X] 0004_remove_product_category_delete_category  # 今回ロールバック対象にする履歴
```

#### STEP: マイグレーションの履歴を指定してロールバックする

この戻りたい履歴を指定してロールバックします。今回の例では `0004_remove_product_category_delete_category` のmigrationを取り消し、その1つ前の`0003_category_product_category` までロールバックします。それでは次のコマンドを実行してみましょう。

```bash
python manage.py migrate inventory 0003_category_product_category
```

汎用的に記載すると次のようになります。

```bash
python manage.py migrate <アプリケーション名> <前のmigrationファイル名>
```

もう一度、migration履歴を確認してみましょう。

#### STEP: マイグレーションのロールバックの適用結果を確認する

```bash
python manage.py showmigrations inventory
```

次のような出力が得られたと思います。

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
  [ ] 0004_remove_product_category_delete_category  # 未適用に戻っている
```

履歴からチェックマークのXが消え、空欄になっていることがわかります。これで履歴のロールバックは完了しました。また、テーブルの状態も確認してみてください。0004 で削除されたproductのcategoryカラムおよびCategoryテーブルが復活していることがわかります。

データ状態はどうでしょうか。あくまで履歴を戻しただけのため、DBの適応状態は戻すことはできません。DBはバックアップから戻しましょう。また、モデルファイルはどうでしょうか。こちらも0003の生成したモデルに戻るわけではなく、最新のマイグレーションファイルである0004を生成した状態から変わっていません。コード9-1-2のカテゴリーを削除したコードは、コード9-1-1を参考にして削除前の状態に戻してください。

さて、ただマイグレーションされた状態を戻したいだけであれば、ここまでの操作で十分です。しかし、開発では適用したマイグレーションファイルそのものが間違っていたため、取り消した部分を新たに作り直したいということもあるでしょう。次はマイグレーションファイルそのものを再作成してみましょう。

#### モデル定義毎のmigrationのロールバック

##### STEP: 不要なマイグレーション関連ファイルを削除する

まずは誤った内容のマイグレーションファイルを削除します。1点注意しなければならないのは、キャッシュファイルも作成されているのでそれも削除しなければいけない点です。キャッシュファイルはマイグレーション関連のコマンドを実行すると自動的に生成されます（コード9-1-3）。

**コード9-1-3　自動生成されたキャッシュファイル**

```
api/inventory/migrations/
├── 0001_initial.py
├── 0002_salefile_sale_import_file.py
├── 0003_category_product_category.py
├── 0004_remove_product_category_delete_category.py  # 削除する
├── __init__.py
└── __pycache__
    ├── 0001_initial.cpython-312.pyc
    ├── 0002_salefile_sale_import_file.cpython-312.pyc
    ├── 0003_category_product_category.cpython-312.pyc
    ├── 0004_remove_product_category_delete_category.cpython-312.pyc  # 削除する
    └── __init__.cpython-312.pyc
```

履歴を確認してみてください。

##### STEP: マイグレーションの履歴を確認する

```bash
python manage.py showmigrations inventory
```

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
```

これで完全に履歴を戻すことができました。後は今までと同じようにモデルファイルを更新し、マイグレーションファイルを新たに生成していく流れになります。

> **注:** Modelの定義も元に戻しておきましょう（後続の処理の為）

### 9-1-5 環境（開発／ステージング／本番）ごとのデータ構造の管理

次に、環境ごとのmigration方法について考えます。2-1節で説明したように、開発時には多くの環境をまたがってリソースの管理が必要となります。

![開発環境構成図（再掲）](media/image1.png)

*図9-1-8　開発環境構成図（再掲）*

基本的に開発環境とステージング環境、本番環境は別々のDBで管理されています。これらの環境で管理を分けたい内容には、次のようなものが挙げられます。

- DBの接続先
- DDLの適用の進捗

Djangoでは`settings.py`といった環境設定を記載するファイルがあります。本稿ではsettings.pyをbase.pyという名前に変えて、共通の設定と環境ごとの設定を分けて管理できるように、次のように設定します。

```
config/settings/base.py    // 環境ごとに共通の設定
config/settings/development.py  // 環境ごとの設定
```

![各環境にインポートするファイル（再掲）](media/image9.png)

*図9-1-9　各環境にインポートするファイル（再掲）*

#### STEP: マイグレーションの対象となるDBを設定する

開発環境ごとの設定となるdevelopment.pyを準備します。`config/settings.py` を `config/settings/base.py` に名称を変更し、development.py を作成します。

![設定ファイルのイメージ](media/image8.png)

**コード9-1-4　開発環境設定ファイル（backend/config/settings/development.py）**

```python
# Backend config/settings/development.py - New

from .base import * # noqa

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "app",
        "USER": "app",
        "PASSWORD": "app_pass",
        "HOST": "db",
        "PORT": 3306,
        "OPTIONS": {
            "charset": "utf8mb4",
        },
        "CONN_MAX_AGE": 60,
    }
}
```

次に、今までデフォルト settings.py で起動していたものを、settings/development.py で起動するように manage.py を変更する。

**Backend manage.py**

```python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()
```

ステージング環境、本番環境を作成して設定ファイルによって使い分けてみましょう。今は開発環境用のDBしかないため、それぞれの環境のDBを作成します。スキーマの作成の方法については、2-3-3項を参考にしてください。この操作ではapp_stagingとapp_productionの2つのスキーマを追加で作成します。

SQLクライアントでそれぞれデータベースを追加できたか確認しましょう（図9-1-10）。

![MySQL Workbenchの表示イメージ](media/image16.png)

*図9-1-10　MySQL Workbenchの表示イメージ*

#### STEP: マイグレーションの対象となる本番環境と検証環境のDBの設定を追加する

今回はDockerという共通のホスト上に、複数のデータベースを作成したため、異なるデータベース名となっていますが、実際の開発では同一の名前のデータベースを、異なるホスト上に作成することが多いでしょう。

では、ステージング環境や本番環境用の設定ファイルも追加してみましょう（コード9-1-5）。

**コード9-1-5　ステージング環境設定ファイル**

```python
# Backend config/settings/staging.py - New

from .base import * # noqa

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "app_staging",
        "USER": "app",
        "PASSWORD": "app_pass",
        "HOST": "db",
        "PORT": 3306,
        "OPTIONS": {
            "charset": "utf8mb4",
        },
        "CONN_MAX_AGE": 60,
    }
}
```

本番環境用のファイルは一部省略して記載します。データベース名の指定のみが異なります。

**コード9-1-6　本番環境設定ファイル**

```python
# Backend config/settings/production.py - New

from .base import * # noqa

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "app_production",
        "USER": "app",
        "PASSWORD": "app_pass",
        "HOST": "db",
        "PORT": 3306,
        "OPTIONS": {
            "charset": "utf8mb4",
        },
        "CONN_MAX_AGE": 60,
    }
}
```

#### STEP: ステージング環境と本番環境のスキーマを作成する

検証用に staging / production 環境のスキーマを準備します。mysqlクライアントで接続し、スキーマを確認しましょう。

```bash
mysql --ssl=0 -uroot -prootpass
```

スキーマを確認し、app_staging / app_production を追加します。

```sql
SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| app                |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+

CREATE DATABASE app_staging;
CREATE DATABASE app_production;

SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| app                |
| app_production     |
| app_staging        |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

今回は開発環境と同様にappユーザで接続させます。appユーザにapp_stagingとapp_productionスキーマへの権限を追加します。

```sql
SHOW GRANTS FOR 'app'@'%';
+------------------------------------------------------+
| Grants for app@%                                   |
+------------------------------------------------------+
| GRANT USAGE ON *.* TO `app`@`%`                    |
| GRANT ALL PRIVILEGES ON `app`.* TO `app`@`%`       |
+------------------------------------------------------+

GRANT ALL PRIVILEGES ON `app_staging`.* TO `app`@`%`;
GRANT ALL PRIVILEGES ON `app_production`.* TO `app`@`%`;
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'app'@'%';
+-----------------------------------------------------------+
| Grants for app@%                                         |
+-----------------------------------------------------------+
| GRANT USAGE ON *.* TO `app`@`%`                          |
| GRANT ALL PRIVILEGES ON `app`.* TO `app`@`%`             |
| GRANT ALL PRIVILEGES ON `app_production`.* TO `app`@`%`  |
| GRANT ALL PRIVILEGES ON `app_staging`.* TO `app`@`%`     |
+-----------------------------------------------------------+
```

#### 環境ごとの管理方法

以前から実行コマンドの末尾には、設定ファイルを指定していました。実はこの設定ファイル名を適用したい環境に応じて切り替えることで、環境ごとの管理をすることができます。次に示すのは、ステージング環境のマイグレーション履歴を確認する例です。

```bash
python manage.py showmigrations inventory --settings config.settings.staging
```

```
inventory
  [ ] 0001_initial
  [ ] 0002_salefile_sale_import_file
  [ ] 0003_category_product_category
```

#### STEP: 検証環境にマイグレーションファイルを適用する

今回は、staging環境用のDBに 0003_category_product_category まで適用します。

```bash
python manage.py migrate inventory 0003_category_product_category --settings config.settings.staging
```

#### STEP: 本番環境にマイグレーションファイルを適用する

production環境のDBに0001_initialまでを適用し、同一のマイグレーションファイルを使用して各環境別に適用できているか確認します。

```bash
python manage.py migrate inventory 0001_initial --settings config.settings.production
```

それぞれの環境の履歴を確認しましょう。

#### STEP: 検証と本番環境のにマイグレーションの適用結果を確認する

```bash
python manage.py showmigrations inventory --settings config.settings.staging
```

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
```

```bash
python manage.py showmigrations inventory --settings config.settings.production
```

```
inventory
  [X] 0001_initial
  [ ] 0002_salefile_sale_import_file
  [ ] 0003_category_product_category
```

それぞれの環境にマイグレーションファイルが適用されました。最後に全てのmigration履歴を戻すコマンドを紹介しておきます。

```bash
python manage.py migrate <アプリケーション名> zero
```

ここまで、データ構造を管理するDDLに相当する部分をDjangoのモデルによって管理する方法を学びました。次の節では保管したデータを操作するDMLの管理方法を学びます。

## 9-2 マスタデータ（DML）の管理

データ定義が決まっても、実際に参照するデータがなければアプリケーションを使うことはできません。本節では、一覧画面などで実際に画面に映るデータを操作するDML（データ操作言語）について学習します。

### 9-2-1 なぜDMLを管理するか

前節のデータ定義で解説した内容と同じように、DBに保存されているデータも運用の過程で日々変更されていきます。データ定義は変わらないが新しいマスタデータが必要になった、他のシステムからデータ移行する必要が生じた、といったときにアプリケーションではなくデータメンテナンスの一環としてDMLを扱うケースもあります。そのため、DDLと同じように変更を管理する必要があります。

DDLと同様に、DMLの管理方法も考えてみましょう。こちらは9-1-2項で挙げた、DDLと同じ管理方法を用いることができます。Djangoにおける管理方法は次の項から考えていきましょう。

### 9-2-2 DjangoにおけるDML管理

Djangoはマイグレーションファイルを使ってDDL操作を管理していました。しかし、Djangoではフレームワークの標準の機能として、DML操作についてはマイグレーションで提供されていません。機能としてはDDLの操作に特化しています。そこで今回は、Djangoのマイグレーションファイルの仕組みを利用してDML管理も可能になるようカスタマイズしてみます。

#### STEP: マイグレーションファイルの内容を分析する

カスタマイズ方針を考えるために、生成されるマイグレーションファイルの中身を少し分析してみましょう。コード9-2-1は9-1節で生成したマイグレーションファイルの一部を抜粋したものです。

**コード9-2-1　マイグレーションファイル（api/inventory/migrations/0003_category_product_category.py）**

```python
# Generated by Django 5.2.4 on 2025-10-05 22:34

import django.db.models.deletion
from django.db import migrations, models

class Migration(migrations.Migration):  # ❶ Migrationクラスを継承

    dependencies = [  # ❷ 処理の依存関係の注入
        ('inventory', '0002_salefile_sale_import_file'),
    ]

    operations = [  # ❸ DB操作に関する指定
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='カテゴリ名')),
                ('parent_category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='inventory.category')),
            ],
            options={
                'verbose_name': 'カテゴリー',
                'verbose_name_plural': 'カテゴリー一覧',
                'db_table': 'category',
            },
        ),
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='inventory.category'),
        ),
    ]
```

まず❶からdjango.db.migrations.Migrationクラスを継承していることがわかります。マイグレーションファイルになる条件だと予想できます。Djangoの実装は公開されているので、コードの詳細を確認してみましょう（コード9-2-2）。英語の箇所は日本語に置き換えています。

**コード9-2-2　マイグレーションファイルの説明**

```python
import re

from django.db.migrations.utils import get_migration_name_timestamp
from django.db.transaction import atomic
from .exceptions import IrreversibleError

class Migration:
    """
    すべての移行の基本クラス。

    移行ファイルはこれを django.db.migrations.Migration からインポートします
    Migration というクラスとしてサブクラス化します。1つ以上
    次の属性の:

    - 操作: おそらくからの操作インスタンスのリスト
      django.db.migrations.operations
    - 依存関係: (app_path, migration_name) のタプルのリスト
    - run_before: (app_path, migration_name) のタプルのリスト
    - 置換: migration_names のリスト

    すべての移行は移行から始まり、ローダーまたは
    アプリのラベルと名前で初期化されたインスタンスとしてグラフ化します。
    """

    # この移行中に適用する操作
    operations = []

    # この移行の前に実行する必要があるその他の移行。
    # (app, migration_name) のリストである必要があります。
    dependencies = []

    # （中略）
```

#### STEP: 分析した内容を元にDMLを扱えるようにカスタマイズする

コード9-2-1に戻ると、❷でどのDDLの次に実行するか指定し、❸でDMLの操作を記載できればカスタマイズしたマイグレーションファイルとして組み込めそうです。

❷の部分は次のように、直前に実行されるマイグレーションファイルを指定しています。

```python
class Migration(migrations.Migration):
    dependencies = [
        (<アプリケーション名>, <直前に実行されるmigrationファイル名>),
    ]
```

では❸はどうでしょうか。Operationsで指定できる動作は決まっていそうなのでMigration Operationsを確認してみましょう。以下の2つがテーブルのレコード操作に使用できそうです。

- `RunSQL`
- `RunPython`

#### RunSQL

今回は次のような構成でOperationsからレコード操作する関数を呼び出し、DMLとして使用してみます。

![DjangoにおけるDMLの適用イメージ](media/image4.png)

*図9-2-1　DjangoにおけるDMLの適用イメージ*

RunSQLでは実行したいSQLを直接記述できます。次のように、0004_dml_insert_catagory_data.py を作成してください（コード9-2-3）。

**コード9-2-3　マイグレーション**

```python
# Backend api/inventory/migrations/0004_dml_insert_catagory_data.py - New

from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0003_category_product_category"),
    ]

    operations = [
        migrations.RunSQL(
            "INSERT INTO category( name, parent_category_id ) VALUES( 'メンズ', null ) ;",
        )
    ]
```

categoryテーブルにデータを追加するSQLが記載されています。さっそく、実行してみましょう。

--settings を指定していないので、接続先は開発環境（デフォルト）です

```bash
python manage.py migrate inventory 0004_dml_insert_catagory_data
```

想定された通り、INSERT文が実行されました。

#### STEP: マイグレーションファイルの実行結果を確認する

Categoryテーブルの中に意図したデータが登録されたかどうかも確認しましょう（図9-2-2）。

実行後、MySQLにログインし、categoryテーブルを確認します。

```bash
mysql --ssl=0 -uapp -papp_pass app
```

```sql
SELECT * FROM category;
+----+--------+---------------------+
| id | name   | parent_category_id  |
+----+--------+---------------------+
| 1  | メンズ | NULL                |
+----+--------+---------------------+
```

*図9-2-2　MySQL Workbenchの表示イメージ*

このようにマイグレーションファイルを自分で新たに作成し、RunSQLを使うことで、任意のSQLを実行できることがわかりました。

### 9-2-2 DjangoにおけるDML管理２

しかし、1点問題があります。9-1節でせっかくモデルに依存したテーブル管理が実現したのに、このようにSQLを直接書いてしまうと、そのモデルファーストな管理の利点を生かすことができません。また、SQLで書くことは、DBの種類によっては実行SQLの依存にもつながります。もう少しモデルに依存した書き方はできないでしょうか。

そこでもう1つの、RunPythonを使用します。こちらは先ほどのSQLを実行するためのRunSQLとは異なり、Pythonを実行することができます。これを使えばモデルを操作することができそうです。

#### STEP: DMLをコードベースで表現するようにカスタマイズする

次のファイルを追加してみましょう（コード9-2-4）。

**コード9-2-4　マイグレーション**

```python
# Backend api/inventory/migrations/0005_dml_insert_catagory_data_by_model.py - New

from django.db import migrations

def insert_category(apps, schema_editor):
    Category = apps.get_model("inventory", "Category")
    Category.objects.create(name="レディース", parent_category=None)

class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0004_dml_insert_catagory_data"),
    ]

    operations = [
        migrations.RunPython(insert_category),
    ]
```

#### RunPython

RunPythonから呼び出されている関数insert_categoryのappsとschema_editorという2つの引数の値は、どこから渡されているのでしょうか。実はこの2つの引数は自動的に入れられていて、

1つ目のappsにはmigrationに関連するモデルの情報、2つ目のschema_editorにはデータベースの変更や実行を管理するインスタンスが渡されます。

そのため、1つ目のインスタンスに対して操作を加えたいモデルのインスタンスを、アプリケーション名とモデル名を指定して取得し、その後、第6章のAPIViewの例で操作したようにモデルにデータを追加しています。さっそく、実行してみましょう。

```bash
python manage.py migrate inventory 0005_dml_insert_catagory_data_by_model
```

#### STEP: マイグレーションファイルの実行結果を確認する

想定した通り、INSERT文が実行されました。Categoryテーブルの中に意図したデータが登録されたかも確認しましょう（図9-2-3）。

```sql
SELECT * FROM category;
+----+----------+---------------------+
| id | name     | parent_category_id  |
+----+----------+---------------------+
| 1  | メンズ   | NULL                |
| 2  | レディース | NULL                |
+----+----------+---------------------+
```

*図9-2-3　データ確認*

#### カスタマイズ時のロールバック

また、RunSQLもRunPythonもデフォルトではマイグレーション履歴を元に戻すことはできません。もし戻せるようにしたい場合は、引数`reverse_sql`、もしくは`reverse_code`に元に戻す用のコードを実装する必要があります。わかりやすいSQLの対応を載せておきます（コード9-2-5）。こちらは実装をする必要はなく、説明を見るだけで大丈夫です。

**コード9-2-5　マイグレーション（api/inventory/migrations/0004_dml_insert_catagory_data.py）**

```python
migrations.RunSQL(
    "INSERT INTO category( name, parent_category_id ) VALUES( 'メンズ', null ) ;",
    "DELETE FROM category WHERE name = 'メンズ';",
)
```

コードだけだとわかりにくいので、図と対応させて整理してみましょう。まず次の3つのマイグレーションファイルがそれぞれmigrateコマンドによって実行されたと思ってください。

**コード9-2-6　マイグレーションファイル（0001_dml.py）**

```python
from django.db import migrations

def forwards_func(apps, schema_editor):
    print("0002_dmlに進む")

def reverse_func(apps, schema_editor):
    print("0001_dmlに戻る")

class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.RunPython(forwards_func, reverse_func),
    ]
```

**コード9-2-7　マイグレーションファイル（0002_dml.py）**

```python
from django.db import migrations

def forwards_func(apps, schema_editor):
    print("0003_dmlに進む")

def reverse_func(apps, schema_editor):
    print("0002_dmlに戻る")

class Migration(migrations.Migration):
    dependencies = [
        ("examlple", "0001_dml"),
    ]

    operations = [
        migrations.RunPython(forwards_func, reverse_func),
    ]
```

**コード9-2-8　マイグレーションファイル（0003_dml.py）**

```python
class Migration(migrations.Migration):
    dependencies = [
        ("examlple", "0002_dml"),
    ]

    operations = []  # 説明のために用意した実行しないファイルなので処理を記載していません
```

内部的には若い番号のファイルから実行されます。順番に見ていきましょう。

まずmigrationファイル（0001_dml）のRunPythonの第一引数に指定されている関数forwards_funcが実行され、「0002_dmlに進む」という出力が得られます。マイグレーションなのにテーブルやデータ操作を行っていないのでは、と気になるかもしれませんが、RunPython自体は任意のPythonの処理を実行するだけなので、今回のように出力するだけでも大丈夫です。

![初期状態から0001_dml.pyが実行](media/image9.png)

*図9-2-4　初期状態から0001_dml.pyが実行*

次にマイグレーションファイル（0002_dml）のRunPythonの第一引数に指定されている関数forwards_funcが実行され、「0003_dmlに進む」という出力が得られます。

さて、今度はこれまでのマイグレーション操作を、戻してみましょう。

![0001_dml.pyを実行後に0002_dml.pyが実行](media/image11.png)

*図9-2-5　0001_dml.pyを実行後に0002_dml.pyが実行*

直前のmigrationファイル（0002_dml）のRunPythonの第二引数に指定されている関数reverse_funcが実行され、「0002_dmlに戻る」という出力が得られます。次に0001_dmlのreverse_funcが実行されると、「0001_dmlに戻る」という出力が得られ、処理が終了します。

このようにマイグレーションはSQLのロールバックのように、単純にある地点までデータベースの状態を戻しているのではなく、期待した状態になるように戻るための操作をしてあげなければいけません。DDLのマイグレーションファイルの場合は、その操作をフレームワークが解決してくれているため意識をする必要がなかったのです。

![0002_dml.pyを実行後に初期状態に戻す](media/image15.png)

*図9-2-6　0002_dml.pyを実行後に初期状態に戻す*

### 9-2-3 環境（開発／ステージング／本番）ごとのマスタデータの管理

DDLの場合は、開発／ステージング／本番環境と全ての環境についてDDLを適用していました。ではDMLの場合はどうでしょうか。下記の3種類のデータについて分けて考えてみましょう。

① マスタデータ

② トランザクションデータ

③ テストデータ

#### マスタデータ

データベースやそのアプリケーションにおいて基本的な参照データになるものを指します。本章でいえば、カテゴリがこれにあたります。よくある例としては、国や都道県といった情報を持つ地域マスターや、製造業や宿泊業といった業種マスターなどがあります。基本的なデータになるため、全ての環境に適用させます。

#### トランザクションデータ

マスタデータと対象的に、随時利用者によってメンテナンスされていくデータをトランザクションデータと呼びます。例えば、社員データや商品のデータなどアプリケーションの機能によって頻繁に変更されるデータなどです。利用者の操作によってデータが登録されるため、環境によって異なるデータになります。

そうした場合に、画面からの変更ができないが値の変更をしたい、メンテナンスをしたいといったレコードが発生してきます。特定の環境にのみ適用させるDMLが必要でしょう。

#### テストデータ

2つ目のトランザクションデータの派生したデータになります。テスト環境などのテストデータを大量に登録する場合などがあります。また開発環境では、アプリケーションの基本的なマスタデータ以外にも、新たにプロジェクトに参加した開発者がすぐアプリケーションを動かすことができるようにサンプルデータを用意する場合もあります。この場合は、開発環境にのみ適用させるDMLが必要でしょう。

適用するシーンに違いはあるものの、環境別にDMLを適用する仕組みが必要です。環境ごとへの適用方法とマスタデータの用意方法の2つに分けて作成してみましょう。

#### 環境ごとへの適用方法

9-1節でマイグレーションコマンドの引数で、実行対象の環境を分けられることを説明しました。しかし、この方法だと図9-2-7のようにマイグレーションフォルダ配下にある全てのマイグレーションファイルが実行されてしまうため、適用対象を選択できても個別のマイグレーションファイル単位で適用の要否を設定することができません。

![環境ごとのマイグレーションの切り分け](media/image7.png)

*図9-2-7　環境ごとのマイグレーションの切り分け*

例えば、上記のようにマイグレーションファイルは全ての環境に適用されます。そのため、図9-2-8のように特定のDMLをステージング環境にのみ反映させることができません。

![環境ごとのmigrationの切り分け](media/image3.png)

*図9-2-8　環境ごとのmigrationの切り分け*

##### STEP: マイグレーションファイルに切り分け処理を追加する

この問題を解決するために、発想を少し変えて、マイグレーションファイルが適用されても特定の環境でしか処理が実行されないような実装をしてみましょう（コード9-2-9）。

**コード9-2-9　マイグレーション**

```python
# Backend api/inventory/migrations/0006_dml_insert_catagory_data_by_environment.py - New

from django.conf import settings
from django.db import migrations

def insert_category(apps, schema_editor):
    # 環境に依存する名称の設定ファイルを作成しているため、そこから環境を特定する
    setting_file = settings.SETTINGS_MODULE
    env_name = setting_file.split(".")[-1]

    # 環境ごとに処理を分ける
    if env_name == "development":
        # 開発環境での処理
        Category = apps.get_model("inventory", "Category")
        Category.objects.create(name="開発環境用のカテゴリ", parent_category=None)
    else:
        # ステージング環境や本番環境での処理
        pass

class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0005_dml_insert_catagory_data_by_model"),
    ]

    operations = [
        migrations.RunPython(insert_category),
    ]
```

さっそくコードを見てみましょう。前項で説明した通り、このアプリケーションではmanage.pyに引数として渡す設定ファイルで、環境を切り分けています。そのため、プログラムも設定ファイル名を利用して環境別の実装を実現します。具体的には次のコードです。

```python
setting_file = settings.SETTINGS_MODULE
env_name = setting_file.split('.')[−1]
```

ここで、設定ファイル名を加工して、変数env_nameに環境名を代入しています。またDjangoの環境変数が格納されるsettingsのSETTING_MODULEにはファイル名が入ってきます。その環境名を元にした条件分岐で処理を切り分けています。

```python
if env_name == 'development':
```

#### pass

また、ここで出てきたpassとは、Pythonの何もしないという意味のコードです。構文法的には文が必要なものの、コードとしては何も実行したくない場合に使用します。この例では、開発環境以外であるelse側では何も処理をしない、というのを強調する意味で使用しています。

もちろん早期リターンといった書き方もあるので1つの実装例として紹介します。

```python
# 開発環境以外は早期returnし何もしない
if env_name != 'development':
    return

Category = apps.get_model('inventory', 'Category')
Category.objects.create(name='開発環境用のカテゴリ', parent_category=None)
```

##### STEP: マイグレーションをそれぞれの環境で実行する

さて、開発環境とステージング環境のそれぞれに実行してみましょう。

```bash
python manage.py migrate inventory
```

```bash
python manage.py showmigrations inventory
```

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
  [X] 0004_dml_insert_catagory_data
  [X] 0005_dml_insert_catagory_data_by_model
  [X] 0006_dml_insert_catagory_data_by_environment
```

```bash
python manage.py migrate inventory --settings config.settings.staging
```

```bash
python manage.py showmigrations inventory --settings config.settings.staging
```

```
inventory
  [X] 0001_initial
  [X] 0002_salefile_sale_import_file
  [X] 0003_category_product_category
  [X] 0004_dml_insert_catagory_data
  [X] 0005_dml_insert_catagory_data_by_model
  [X] 0006_dml_insert_catagory_data_by_environment
```

##### STEP: マイグレーション結果がそれぞれの環境で変わったたか確認する

開発環境とステージング環境のCategoryテーブルをそれぞれ確認してみてください。開発環境のCategoryテーブルのみにデータが追加されていることが確認できます。

**開発環境**

```bash
mysql --ssl=0 -uapp -papp_pass app
```

```sql
SELECT * FROM category;
+----+---------------------------------+---------------------+
| id | name                            | parent_category_id  |
+----+---------------------------------+---------------------+
| 1  | メンズ                          | NULL                |
| 2  | レディース                      | NULL                |
| 3  | 開発環境用のカテゴリ            | NULL                |
+----+---------------------------------+---------------------+
```

**ステージング環境**

```bash
mysql --ssl=0 -uapp -papp_pass app_staging
```

```sql
SELECT * FROM category;
+----+------------+---------------------+
| id | name       | parent_category_id  |
+----+------------+---------------------+
| 1  | メンズ     | NULL                |
| 2  | レディース | NULL                |
+----+------------+---------------------+
```

#### マスタデータの用意方法

環境ごとに適用するマイグレーションファイルを分けることができました。次はマスタデータの用意方法について考えてみましょう。同じような方法で用意しようとするとコード9-2-10のようになります。

例えば9-1節でカテゴリテーブルを追加しました。画面から登録されていく商品と異なり、カテゴリは登録機能を想定していないため、最初からデータを用意しておかないといけません。次に示すのはサンプルです。内容を見るだけでよいので実装をする必要はありません。

**コード9-2-10　マイグレーション**

```python
from django.db import migrations

def insert_category(apps, schema_editor):
    Category = apps.get_model("inventory", "Category")
    categories = [
        {"name": "メンズ", "parent_category": None},
        {"name": "レディース", "parent_category": None},
        {"name": "キッズ", "parent_category": None},
    ]

    for category in categories:
        Category.objects.create(**category)

class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0003_dml_insert_catagory_data"),
    ]

    operations = [
        migrations.RunPython(insert_category),
    ]
```

大きく変更したのは、登録データをcategoriesという変数で定義し、createを用いた登録処理と分離したことです。2つのアスタリスクがついた見慣れない引数`**category`は可変長引数といいます。前の項までは、createメソッドの引数を一つ一つ指定していましたが、本例では可変長引数を用いてfor文で展開した登録データをそのまま渡しています。

前の項までは、データ数が少なくあまり気になりませんでしたが、例えばこのcategoryの件数が100件あったらどうでしょうか。大量のデータと処理が1つのファイルに同居することで見通しが悪くなりますし、データと処理それぞれの再利用性も下がります。

これをフレームワークの機能であるfixtureを利用してファイル単位でデータと処理を分離しましょう。

#### fixture

図9-2-9はfixtureを使用するときのフォルダ構成のイメージです。

![fixtureのイメージ](media/image13.png)

*図9-2-9　fixtureのイメージ*

fixture自体はマイグレーションとは独立した機能なので、まずfixture単体でのマスタデータの登録を行い、その後マイグレーションファイルに組み込んでみます。

##### STEP: fixtureにマイグレーション時の登録データを用意する

まずはfixturesフォルダを作成して、そのフォルダ直下に登録データを記載したfixtureファイルを作成しましょう（コード9-2-11）。

**コード9-2-11　マイグレーション**

```yaml
# Backend api/inventory/fixtures/catagory_initial_data.yaml - New

- model: inventory.category
  fields:
    name: メンズ
    parent_category: null

- model: inventory.category
  fields:
    name: レディース
    parent_category: null

- model: inventory.category
  fields:
    name: キッズ
    parent_category: null
```

3件のデータを登録します。いずれもデータ構造は同じフォーマットなので、1件目の構成を見てみましょう。

まずmodelが指定されています。ここにはModelクラスを継承して作成したモデルを指定します。モデルはアプリケーション配下で定義するためアプリケーション名も含めています。

次はモデルで操作する対象をfieldsで指定しています。プライマリーキーとなるidは自動採番されるため、それ以外のfieldsに登録するデータを記載しています。もしプライマリーキーも指定して登録したい場合は、modelやfieldsと同じレベルでpkキーを指定してください。

```yaml
- model: <アプリケーション名>.<モデルクラス名>
  pk: <操作したいプライマリーキー>
  fields:
    <変数1>: <操作したいデータ1>
    <変数2>: <操作したいデータ2>
    ...
```

また今回はyaml形式で記載していますが、json形式もサポートされています。

##### STEP: fixtureに用意した登録データを登録する

データを登録してみましょう。マイグレーションファイルの場合はmigrateコマンドで処理を実行しましたが、fixtureの場合はloaddataコマンドを使用します。

```bash
python manage.py loaddata api/inventory/fixtures/catagory_initial_data
```

migrateコマンドでは、引数にアプリケーション名を指定していましたが、fixtureの場合はパスを含めたfixtureファイル名を指定しています。もちろんアプリケーション名を指定して読み込ませることもできます。もし、ファイル名のみで指定した場合は、全てのfixtureフォルダの中を探して同名のfixtureファイルを見つけて実行します。

#### マイグレーションファイル経由でのfixtureファイルの利用

コマンド単位でマスタデータを登録できることはわかりました。しかし、このままだと運用時に複雑なオペレーションになってしまい、ミスが起こりやすくなりそうです。マイグレーションファイルのように読み込ませることはできないでしょうか。

そこでRunPythonコマンドを使って、上記の処理をマイグレーションファイルに組み込みます。前の項ではモデルの操作にRunPythonを利用しました。実はRunPythonはモデル操作に限らず、いろいろなPython処理を実行できます。ここではRunPython を経由してloaddata処理を呼び出し、fixtures配下に置いたyaml形式のデータをマイグレーション時に読み込ませて登録します。作成したyamlファイルを元にfixtureを使ったマイグレーションファイルを作成してみましょう。

##### STEP: fixtureを読み込むユーティリティ関数を作成する

**コード9-2-13　マイグレーションユーティリティ**

```python
# Backend common/migrate_util.py - New

import os

from django.conf import settings
from django.core.management import call_command

def common_load_fixture(migration_filename):
    setting_file = settings.SETTINGS_MODULE  # ❶

    target = os.path.splitext(migration_filename)[0].replace("migrations", "fixtures")  # ❷

    base_yaml_name = target + "/base.yaml"

    call_command(
        "loaddata", "--settings", setting_file, "--format=yaml", base_yaml_name
    )  # ❸
```

##### STEP: ユーティリティ関数をマイグレーションファイルに組み込む

**コード9-2-12　マイグレーション**

```python
# Backend api/inventory/migrations/0007_dml_insert_catagory_data_by_fixture.py - New

from django.db import migrations

from common.migrate_util import common_load_fixture

def load_fixture(apps, schema_editor):
    common_load_fixture(__file__)  # ❺

class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0006_dml_insert_catagory_data_by_environment"),
    ]

    operations = [
        migrations.RunPython(load_fixture),  # ❹
    ]
```

最後にfixturesフォルダ配下に、新たに「0007_dml_insert_catagory_data_by_fixture」フォルダを作成し、その中にbase.yamlファイルを作成します。base.yamlの内容はコード9-2-11で使用したcatagory_initial_data.yamlと同じです。

**Backend api/inventory/fixtures/0007_dml_insert_catagory_data_by_fixture/base.yaml - New**

```yaml
- model: inventory.category
  fields:
    name: メンズ
    parent_category: null

- model: inventory.category
  fields:
    name: レディース
    parent_category: null

- model: inventory.category
  fields:
    name: キッズ
    parent_category: null
```

機能単位でファイルを分割しています。ファイルごとに次に示す役割を持っています。

- 0007_dml_insert_catagory_data_by_fixture.py
  - migrateコマンド実行時に呼び出されるマイグレーションファイル
  - ここからfixtureを実行するための関数を呼ぶ

- migrate_util.py
  - 本項でのポイントとなるloaddataを実行するファイル
  - fixtureファイルの保存場所を解決する
  - Pythonプログラムからloaddataコマンドを呼び出す
  - fixtureファイルパスを動的に生成する

- 0007_dml_insert_catagory_data_by_fixture/base.yaml
  - fixtureファイル本体
  - マイグレーションファイルからの読込対象を特定できるファイル名にしている

まずは、0007_dml_insert_catagory_data_by_fixture.pyから見ていきましょう。❹で今まで通り、処理を行う関数load_fixtureを呼んでいます。❺では引数は特に利用せず、common_load_fixtureという共通の関数に`__file__`という変数を渡しています。`__file__`にはその関数が実行されているファイルの絶対パスを取得します。こういった2つのアンダーバーで囲まれた変数やメソッドを特殊メソッドといいます。以前出てきた`__init__`もこれに該当します。

では、この絶対パスが渡されたmigrate_util.pyファイルでは何をしているか見ていきましょう。❶ではこの処理で使用する設定ファイル名を取得しています。❷ではこの処理で使用するfixtureファイルのパスを取得しています。マイグレーションファイル名と対応するようなfixtureファイルを用意しているため、直前のフォルダ名と拡張子のみ置き換えています。最後に❸です。Djangoの管理コマンドをコードから実行する`call_command`関数を用いてloaddataコマンドを実行しています。

##### STEP: ユーティリティ関数を使ったマイグレーションを実行する

それでは、さっそくマイグレーションを実行してみましょう。

```bash
python manage.py migrate inventory
```

##### STEP: fixtureの登録データを元に登録が実行されたか確認する

catagoryテーブルのデータを確認してください。図9-2-10のように、データを登録することはできたでしょうか。これでデータと処理を分割し、お互いに再利用性の高いコードにすることができました。

```bash
mysql --ssl=0 -uapp -papp_pass app
```

```sql
SELECT * FROM category;
+----+---------------------------------+---------------------+
| id | name                            | parent_category_id  |
+----+---------------------------------+---------------------+
| 1  | メンズ                          | NULL                |
| 2  | レディース                      | NULL                |
| 3  | 開発環境用のカテゴリ            | NULL                |
| 4  | メンズ                          | NULL                |
| 5  | レディース                      | NULL                |
| 6  | キッズ                          | NULL                |
| 7  | メンズ                          | NULL                |
| 8  | レディース                      | NULL                |
| 9  | キッズ                          | NULL                |
+----+---------------------------------+---------------------+
```

*図9-2-10　データ確認*

#### 環境ごとの適用方法

fixtureの読み込み時に引数によって適用環境を区別するような作りにしてみましょう。

**コード9-2-14　マイグレーション**

```python
# Backend api/inventory/migrations/0008_dml_insert_catagory_data_by_fixture_environment.py - New

from django.db import migrations

from common.migrate_util import common_load_fixture

def load_fixture(apps, schema_editor):
    common_load_fixture(__file__)  # ❷

class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0007_dml_insert_catagory_data_by_fixture"),
    ]

    operations = [
        migrations.RunPython(load_fixture),  # ❶
    ]
```

こちらの内容は、前項の0007_dml_insert_catagory_data_by_fixture.pyのdependenciesの指定を変えただけです。

**コード9-2-15　マイグレーションユーティリティ**

```python
# Backend common/migrate_util.py

import os

from django.conf import settings
from django.core.management import call_command

def common_load_fixture(migration_filename):
    setting_file = settings.SETTINGS_MODULE

    env_name = setting_file.split(".")[-1]  # ❶

    target = os.path.splitext(migration_filename)[0].replace("migrations", "fixtures")

    base_yaml_name = target + "/base.yaml"

    env_yaml_name = target + "/" + env_name + ".yaml"

    # 共通データ
    if os.path.isfile(base_yaml_name):  # ❷
        call_command(
            "loaddata", "--settings", setting_file, "--format=yaml", base_yaml_name
        )

    # 環境別データ
    if os.path.isfile(env_yaml_name):  # ❸
        call_command(
            "loaddata", "--settings", setting_file, "--format=yaml", env_yaml_name
        )
```

**コード9-2-16　各環境共通の登録データ**

```yaml
# Backend api/inventory/fixtures/0008_dml_insert_catagory_data_by_fixture_environment/base.yaml - New

- model: inventory.category
  fields:
    name: 共通
    parent_category: null
```

**コード9-2-17　ステージング環境用の登録データ**

```yaml
# Backend api/inventory/fixtures/0008_dml_insert_catagory_data_by_fixture_environment/staging.yaml - New

- model: inventory.category
  fields:
    name: ステージング
    parent_category: null
```

マイグレーションユーティリティに修正を加えました。❶でstaging.pyといった環境設定ファイルの名称から実行対象の環境を判別します。その後、❷で各環境に共通のデータはbase.yaml、❸でstaging.yamlといった環境に応じたデータを利用します。

次のコマンドをターミナルで実行し、base.yamlの内容は開発環境とステージング環境の両方、staging.yamlの内容はステージング環境にのみ適用されていることを確かめてみましょう。

```bash
python manage.py migrate inventory
```

```bash
python manage.py migrate inventory --settings config.settings.staging
```

それぞれの環境の登録されたデータを確認しましょう。

```sql
SELECT * FROM category;
+----+---------------------------------+---------------------+
| id | name                            | parent_category_id  |
+----+---------------------------------+---------------------+
| 1  | メンズ                          | NULL                |
| 2  | レディース                      | NULL                |
| 3  | 開発環境用のカテゴリ            | NULL                |
| 4  | メンズ                          | NULL                |
| 5  | レディース                      | NULL                |
| 6  | キッズ                          | NULL                |
| 7  | メンズ                          | NULL                |
| 8  | レディース                      | NULL                |
| 9  | キッズ                          | NULL                |
| 10 | 共通                            | NULL                |
+----+---------------------------------+---------------------+
```

*図9-2-11　開発環境のデータ確認*

```sql
SELECT * FROM category;
+----+----------------+---------------------+
| id | name           | parent_category_id  |
+----+----------------+---------------------+
| 1  | メンズ         | NULL                |
| 2  | レディース     | NULL                |
| 3  | メンズ         | NULL                |
| 4  | レディース     | NULL                |
| 5  | キッズ         | NULL                |
| 6  | 共通           | NULL                |
| 7  | ステージング   | NULL                |
+----+----------------+---------------------+
```

*図9-2-12　ステージング環境のデータ確認*

staging.yamlに用意した登録データがステージング環境のみに登録されていたでしょうか。これで実行するコマンドの引数によって適用環境を選択できるようになりました。

### 9-2-4 変更の反映方法

DDLやDMLを環境に応じて柔軟に実行できることがわかりました。この実行のタイミング自体はどう管理すればよいでしょうか。

まず、重複して変更処理が実行されないかについてです。showmigrationsの結果からわかる通り、Djangoではフレームワークの機能としてマイグレーション履歴を管理しており、マイグレーションの未済についても記録しています。この履歴により、すでに実行済みのマイグレーションファイルは実行されることがありません。

開発環境であれば開発者本人が任意のタイミングで手動にてマイグレーションを実行しています。しかし、ステージング環境や本番環境においては次の理由から頻繁に利用することはありません。

- 適用のタイミングで作業者が対象の環境で実行しなければいけないという手間
- コマンドの実行誤りなどの運用上のリスク

一般的にはデプロイツールやCI/CDパイプラインを使用して、マイグレーションの実行も自動化することが多いです。いくつかツールの例を挙げます。

- Jenkins
- CircleCI
- CodePipeline (AWS)

これらはDjangoとは別の個別のツールなので詳しい説明は行いません。ただ、いずれのツールについてもその機能の1つを利用して、本番環境へのデプロイ時に自動的にmigrationを実行するといったことが実現可能です。

また手動・自動にかかわらず、デプロイ時にはバックアップを作成しておくことが重要です。テーブル定義の切り戻しは可能ですが、データの状態は復元されないためです。テーブル定義の変更によりデータが変更や破棄される場合には、リストアでないと対応することができません。

こういった運用はDjangoで構築したアプリケーションに限らず、一般的なアプリケーション全般に共通する対応です。

この章ではDDLとDMLに相当するファイルの管理方法と環境別の運用方法について学びました。ここまでの内容でアプリケーションの実装は一通りできるようになりました。しかし、実際の開発の現場ではプログラムの実装以外にも設計やプロジェクトの運営など、より幅広い知識が求められます。次の第III部からは、そういった現場で活きてくる様々な知識について広く見ていきます。

## 9-9 Gitに作業状態を残す

#### STEP: フロントエンドの初期状態をローカルのgitに保存する

ここまで実行できたでしょうか。問題なければ、いったんこの状態を保存するためにgithubに開発状態を連携したいと思います。

##### コマンドプロンプト（Ubuntu）

```bash
cd /usr/local/src/dev/<REPO>

git add .

git commit -m "6章終了時点"
```

#### STEP: ローカルのgitの状態をgithubに連携する

以下のコマンドを実行してください。

##### コマンドプロンプト（Ubuntu）

```bash
git push origin main
```

```
Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
Delta compression using up to 8 threads
Compressing objects: 100% (24/24), done.
Writing objects: 100% (25/25), 76.02 KiB | 8.45 MiB/s, done.
Total 25 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/keiji-ueno/wfswd02.git
 * [new branch] main -> main
```

## 9-10 本章のまとめ

本章では、Djangoのマイグレーション機能を中心に、Webアプリケーションの運用に不可欠なデータベースのDDL（データ定義言語）とDML（データ操作言語）の管理方法について深く掘り下げて学びました。単にアプリケーションを動かすだけでなく、その裏側を支えるデータの整合性を保つための実践的なノウハウを習得しました。

具体的には、以下の重要な概念と実装手法を習得しました。

- **DDLとDMLの管理**：CREATE TABLEなどのデータベースの構造を定義するDDLと、INSERTやUPDATEといったデータを操作するDMLの違いを理解し、それぞれを効率的に管理する必要性を学びました。
- **Djangoのマイグレーション活用**：DjangoのモデルからDDLを自動生成する仕組みに加え、モデルの変更に対応してマイグレーションファイルが追加される流れを実際に体験しました。
- **カスタムマイグレーション**：RunSQLやRunPythonといった機能を使い、マイグレーションファイルを使って任意のSQLやPythonコードを実行する方法を学びました。これにより、DDLだけでなく、マスタデータの登録といったDMLもマイグレーションの仕組みに乗せて管理できるようになりました。
- **fixtureによるデータ管理**：fixtureファイルを使ってマスタデータをコードと分離し、より再利用性と管理性の高いデータ管理を実現しました。
- **環境ごとのデータ管理**：開発環境、ステージング環境、本番環境といった複数の環境で、設定ファイル名を使って適用するDMLを切り分ける方法を学びました。これにより、テストデータは開発環境にだけ適用するといった、現実的な運用要件に対応できるようになりました。

本章で学んだ知識は、フルスタック開発者が直面するデータの変更や管理といった課題を解決するための強力な武器となります。データベースの変更履歴を正確に管理し、チーム全体で一貫した開発を進める上で非常に重要なスキルです。

次章では、いよいよ第III部に入り、ここまでの章で学んだプログラミングやツールの知識を応用した、より高度な開発テーマに取り組んでいきます。本章で身につけた管理のスキルを土台として、さらに大きなシステム開発へとステップアップしていきましょう。
