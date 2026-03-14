# 第8章 同期処理と非同期処理

第8章からは、これまでの応用・実践編として、実プロジェクトにおける要件や仕様を、実際にフルスタックの開発で実現する方法を解説していきます。まず第8章では、フルスタックの開発を選択する理由として、最も多く挙げられるであろう「非同期処理」がテーマです。同期処理・非同期処理とは何かといった基礎から始まり、実践的な実装方法を学習していきます。

## 8-1 はじめに

### 8-1-1 本章の目的と概要

#### 本章で達成できること

本章のハンズオンを実施すると、Webアプリケーションに同期処理・非同期処理の仕組みを理解し、DjangoとDjango REST Framework (DRF) を使って、非同期処理を実装できるようになります。

#### なぜ同期処理・非同期処理が必要なのか

操作に対する待ち時間などを感じさせにくくすることで、ユーザーエクスペリエンス（UX）を向上させるためです。

### 8-1-2 開発環境の準備

本章を開始するにあたって、第7章のハンズオンが完了し、以下の環境が整っていることを前提とします。

- Dockerコンテナ上でNext.jsとDjangoが動作し、7章で実装したフロントエンドとバックエンドの連携の実装が完了していること。
- Githubにバックエンドのリポジトリが作成されており、上記のコードまでコミットされていること。

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未実装の機能があれば5章に戻り、内容を見直してください。

### 8-1-3 この章からハンズオンを始める場合

2章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませて置いてください。

また、本章から始めたいという方は以下のリポジトリをクローンもしくはフォークして初めて見てください。

フォークが完了したら以下の操作でフロントエンドのDockerコンテナを立ち上げてみてください。

フォークが完了したら以下の操作でバックエンドのDockerコンテナを立ち上げてみてください。

本章以降は読者の理解度に合わせて好きな章からハンズオンを開始することができます。また、学習をはじめからやり直したいときなどご利用ください。

この章から新規にハンズオンを始める場合は以下のURLのリポジトリをクローンして始めてください。

クローンおよび開発環境の構築手順は、X章Y項を参考にしてください。

### 8-1-4 非同期処理・同期処理に関する基礎知識

本章では、Webアプリケーションのパフォーマンスとユーザー体験を向上させるための重要な概念である「非同期処理」と「同期処理」について学びます。これらの概念は、Webシステムがどのようにデータを処理し、ユーザーに結果を返すかを理解する上で不可欠です。

#### 同期処理

同期処理は、タスクが一つずつ順番に実行される方式です。あるタスクが完了するまで、次のタスクは開始されません。

例えば、あなたがレストランで料理を注文し、その料理ができるまで他のことは何もせずに待っている状態を想像してください。これが同期処理です。Webアプリケーションにおいては、フロントエンドがバックエンドにデータのリクエストを送り、バックエンドの処理が完了してレスポンスを返すまで、フロントエンドは「待ち」の状態になります。この方式は、処理の流れがシンプルで分かりやすい反面、時間がかかる処理があるとユーザーを待たせてしまうというデメリットがあります。

#### 非同期処理

非同期処理は、タスクが並行して実行される方式です。あるタスクが実行されている間でも、次のタスクを始めることができます。

再びレストランの例で考えてみましょう。あなたが料理を注文した後、席で雑誌を読んだり、友人と話したりしながら、料理ができるのを待つ状態です。Webアプリケーションにおいては、フロントエンドがバックエンドにデータのリクエストを送った後も、別の画面の描画やユーザーの操作を受け付け続けることができます。バックエンドの処理が完了したら、その結果を画面に反映します。この方式は、ユーザーを待たせる時間を減らし、スムーズな操作感を提供できるという大きなメリットがあります。

#### なぜ非同期処理が必要なのか

Webアプリケーションでは、データベースからの大量データ取得やファイルアップロードなど、時間がかかる処理が頻繁に発生します。同期処理では、これらの処理が完了するまで画面が固まってしまい、ユーザーは「待たされている」と感じてしまいます。非同期処理を導入することで、こうした待ち時間をユーザーに意識させにくくし、より快適なユーザーエクスペリエンス（UX）を実現できます。特に、ユーザーインターフェース（UI）を頻繁に更新する現代のWebアプリケーションでは、非同期処理が不可欠です。

## 8-2 非同期処理・同期処理の全体像

本章では、上記で解説した「同期処理」と「非同期処理」を、具体的なファイルアップロード機能の実装を通して学びます。

### 本章で実装する機能の概要

今回は、CSVファイルで売上データを一括登録する機能を例に、同期処理と非同期処理の両方を体験します。

- 同期処理によるファイル取り込み: 小さなファイルをアップロードし、その取り込み処理が完了するまでユーザーを待たせるパターンを実装します。これは、カード決済のような「処理の一貫性」が求められる場合に適した方式です。
- 非同期処理によるファイル取り込み: 大きなファイルをアップロードする場合を想定し、ファイルを受け取った後、実際のデータ取り込みはバックグラウンドで実行するパターンを実装します。これにより、ユーザーはすぐに次の操作に移れるようになります。

### 8-2-1 APIの一覧と機能分類

本章で実装するAPIは、以下の通りです。

| API | メソッド | URL | 役割 |
|-----|---------|-----|------|
| 同期処理登録 | POST | http://localhost:8000/api/inventory/sync/ | CSVファイルを同期的に取り込む |
| 非同期処理登録 | POST | http://localhost:8000/api/inventory/async/ | CSVファイルを非同期的に取り込む |
| 売上一覧参照 | GET | http://localhost:8000/api/inventory/summary/ | 月ごとの売上合計を取得する |

これらのAPIは、第7章までに構築したバックエンド環境に追加していきます。

### 8-2-2 非同期処理・同期処理の実装の流れ

本章のハンズオンでは、以下の流れで実装を進めます。

1. ファイルの準備: アップロード用のダミーCSVファイルを作成します。
2. バックエンドAPIの実装:
   - ルーティングの追加: 新しいAPIエンドポイントをurls.pyに追加します。
   - モデルの定義: アップロードしたファイル情報を保存する新しいモデル（SalesFile）を作成します。
   - 同期処理のAPI: CSVデータを取り込み、データベースに直接登録する同期処理APIを実装します。
   - 非同期処理のAPI: ファイルの受け取りと、そのファイル情報をデータベースに登録する部分（同期処理）だけを実装し、実際のデータ取り込みは後続のバッチ処理に任せます。
3. バッチ処理の実装: 非同期処理のコアとなる「バックグラウンドでデータを処理するバッチ処理」をDjangoのカスタムコマンドとして実装します。
4. フロントエンドの実装: アップロード用のUIを作成し、同期処理と非同期処理のそれぞれのAPIを呼び出せるようにします。

これらのステップを通じて、同期処理と非同期処理のそれぞれのメリット・デメリットを体感し、適切なユースケースを判断できるようになることを目指します。

## 8-3 同期処理・非同期処理

### 8-3-1 アーキテクチャを分ける理由

ここまで、フロントエンドとバックエンドを、1つのWebシステムとして実現することを目指してきました。しかし、なぜフロントエンドとバックエンドのアーキテクチャを分けて開発する必要があるのか考えてみましょう。

アーキテクチャを分ける理由の1つは、フロントエンドアーキテクチャとバックエンドアーキテクチャ、それぞれの強みを生かすことです。特にフロントエンドでは、ユーザーインターフェース（UI）とユーザーエクスペリエンス（UX）の向上が重要です。例えば、スマートフォン上でアプリケーションを使う場合、スワイプによってスムーズに画面を移動できるなど、使いやすさが求められます。ユーザーが次のページに移動する際に、逐一「次へ」ボタンを押して待たなければならないとしたら、ユーザーは不便を感じ、評価も低くなる可能性があります。

そこで、スムーズな画面移動を可能にする非同期処理を実現できることは、アーキテクチャを分ける大きなメリットの1つです。本章では、この非同期処理について解説します。非同期処理による「リアルタイム・ユーザーインターフェース」はフルスタック開発においても、最もユーザーニーズが高い機能です。非同期処理、同期処理について学びながら、開発を進めていきます。

#### 同期処理・非同期処理とは

特にスマートフォンなどで、いちいち送信ボタンを押さなくても、スムーズに画面間を行き来できるサービスを見たことはないでしょうか。

これまでの「トランシーバー型」のWebシステムは同期処理といい、「商品を表示」ボタンを押したら商品情報を取りに行って、画面を作成し、取得した商品を一度に表示していました（図8-1-1左）。

これに対して、非同期処理では、画面の遷移と非同期でデータを取りに行きます。そのため、まず画面が遷移してから、データを取りに行き、データが届くごとに表示をしていきます（図8-1-1右）。

この方式であれば、利用者を待たせることなく画面はスムーズに動き、一件目の商品情報をユーザーが閲覧しているうちに、他の商品の情報を取得できるため、非常にスムーズな画面遷移になります。

![同期・非同期処理](media/image8.png)

*図8-1-1　同期・非同期処理*

非同期処理の実現は、ReactのようなJavaScriptフレームワークとDjangoでのAPIの組み合わせを採用する大きな動機になります。一般的なサーバーサイドフレームワークは同期処理を前提としており、非同期処理の実装には手間がかかることが多いのです。

本書ではフルスタック開発としてフロントエンドとバックエンドのアーキテクチャを分けていますが、その最大の理由は、こうしたアーキテクチャの「いいとこ取り」のためです。他にも、様々な「いいところ」がReactやDjangoにはありますが、本書では、非同期処理とバッチ処理に焦点を当てて解説していきます。

### 8-3-2 同期処理の処理概要

同期処理とは、「送信」→「実行」→「結果」がシーケンシャル（順番）に処理される方式です（図8-1-2）。図の例に当てはめると「①アップロード」→「②ファイルの取り込み処理」→「③結果」が表示される流れになります。この処理の特徴は「取り込み処理が終わるまで待ってから、結果を表示する」ことです。

同期処理は、例えばカード決済の機能などに用いられています。決済処理が終わっていないのに「ありがとうございました」といった画面を表示しては、利用者に混乱を招くことになります。それを防ぐために、同期処理を用いることで、決済処理が終わってから「ありがとうございました」の画面を表示するようにしています。こうした「トランザクション一貫性」を求められる要件には同期処理が向いています。

![csvアップロード同期処理](media/image7.png)

*図8-1-2　csvアップロード同期処理*

## 8-4 同期処理を用いたファイル取込処理の実装

#### STEP: 実際に同期処理を作ってみよう

まずは、同期処理のシステムを構築します。構築の手順は以下の通りです。

① アップロードするファイルの用意。

② アプリケーションのルーティングの用意

③ データを格納するモデルの準備

④ ファイル取り込み処理の開発

### 1. アップロードするファイルの用意

ファイルをアップロードする機能を作成します。まずは、アップロード元となるファイルを用意しましょう。次のCSVファイル（sales_data.csv）を作成してください（コード8-1-1）。

#### コード8-1-1　sales_data.csv

```csv
product,date,quantity
1,2023-03-01,300
1,2023-03-15,100
1,2023-04-03,200
```

これから作成するものは次の2つです。

① アップロードされた売上ファイルをデータベースに取り込むプログラム

② 取り込んだ売上データを月ごとに集計して画面に表示する機能

この2つを含んだクライアント→サーバー→DBのデータの流れを図にすると、次の通りになります（図8-1-3）。

![クライアント→サーバー→DBのデータの流れ](media/image6.png)

*図8-1-3　クライアント→サーバー→DBのデータの流れ*

## 8-5 バックエンドでモデルを定義する

ファイルの用意、ルーティングの準備に続き、ファイルを取り込むモデル部分を用意しましょう。本項で作成するアプリケーションの概念図は次の通りです（図8-1-5）。先ほどのファイルをモデルに保管し、表示するまでの一連の構造をフロントエンドとバックエンドに分け、フルスタックで作成します。

![ファイルアップロード概念図](media/image3.png)

*図8-1-5　ファイルアップロード概念図*

### モデルの作り方

この項では、モデルの作り方だけではなく「外部キーの管理の仕方」と「Djangoならではのモデル機能」についても学んでいきます。これから作成するものは、次の2つです。

① アップロードしたファイル（データ）を格納するデータベースのテーブル

② 上図の②で使用するデータの保管先

作成に入る前に、ER図でこれから作成するモデルの概要を確認していきましょう。

まず、論理ER図を見るとわかるように、売上と売上ファイルは「1対N」の関係です。売上（Sales）には複数件の売上データがアップロードされて、取り込んだファイルの名前が SalesFileに保管されます。

前の章では、売上データを保持するためのモデルとして売上（Sales）を定義していました。この節では、そのモデル（Sales）はそのまま使い、新たにSalesFileを作成します。「物理ER図」が実際のモデルのプロパティなどの名前を表しています。

![論理ER図](media/image2.png)

*図8-1-6　論理ER図*

![物理ERモデル](media/image4.png)

*図8-1-7　物理ERモデル*

### 外部キー

モデルの親子関係を示すのに、外部キーというものを使用します。今回の例だと、SalesFileを親、Salesを子という関係で定義しています（コード8-1-4）。Sales（子）側に、SalesFile（親）への外部キー（models.ForeignKey）を定義します。外部キーを使用することで、複数のテーブル間で関連性を確立し、データの整合性を維持することができます。外部キー制約では、「親のモデルがいない子のモデル」は存在できません。SalesFileがない状態で、Salesが存在することはできないのです。制約を設けることで、データの整合性を維持することができます。

#### コード8-1-4　モデル定義の抜粋（api/inventory/models.py）

```python
class Sale(models.Model):
    """
    売上
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(
        verbose_name="数量", validators=[MinValueValidator(0)]
    )
    sale_date = models.DateTimeField(verbose_name="売上日時", default=now)
    import_file = models.ForeignKey(
        SaleFile,
        on_delete=models.CASCADE,
        verbose_name="売上ファイルID",
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "sale"
        verbose_name = "売上"
        verbose_name_plural = "売上一覧"
```

### Djangoならではの機能（choices）

SalesFileモデルには、取り込みの状態を管理するステータス（status）の項目を保持します。ステータスなど選択肢を定義する際に便利なのが、choicesというDjangoの機能です。Statusクラスには、次の値が設定されています（表8-1-1）。

**表8-1-1　Statusクラスの値**

| 実際の値 | 意味 | 定数名 |
|---------|------|--------|
| 0 | 同期 | SYNC |
| 1 | 非同期_未処理 | ASYNC_UNPROCESSED |
| 2 | 非同期_処理済 | ASYNC_PROCESSED |

下記のモデル定義ではStatusクラスに数値（IntegerChoices）の形で選択肢を定義しています（図8-1-5）。実際のモデルのレコードには0,1,2という数値が入ります。

なお、プログラム上では、同期はSYNC、非同期未処理はASYNC_UNPROCESSEDのように定数で扱うことができます。わざわざ定数にするには意味があります。実際のプログラム上で0,1,2といった値を判定していると、プログラムを読んだだけでは「何を判定しているかわからない」状態になってしまい、プログラムの保守性が下がり、メンテナンスがしづらくなってしまいます。メンテナンスを他の人に引き継ぐ際はもちろん、何年かして見返したときに自分でも意味がわからなくなる、といったことになってしまいます。

こうした「作成者にしか意味がわからない」数値で処理を行うことを「マジックナンバー」といい、一般的なプログラミングでは非推奨とされています。

#### コード8-1-5　モデル定義の抜粋（Status）（api/inventory/models.py）

```python
class Status(models.IntegerChoices):
    """
    状態
    """
    SYNC = 0, "同期"
    ASYNC_UNPROCESSED = 1, "非同期_未処理"
    ASYNC_PROCESSED = 2, "非同期_処理済"
```

#### STEP: SalesFileモデルを作ろう

すでにSalesモデルは前章で作成していますので、次にSalesFileモデルを作成しましょう（コード8-1-6）。SalesFileモデルは図の通り、file_name項目とstatus項目を保持します。status項目には先ほど説明したchoicesを指定しています。choicesを設定することで、status項目には0,1,2のいずれかが設定されることが明確になります。

#### コード8-1-6　モデル定義の抜粋（SalesFile）（api/inventory/models.py）

```python
class SaleFile(models.Model):
    """
    売上ファイル
    """
    file_name = models.CharField(max_length=100, verbose_name="ファイル名")
    status = models.IntegerField(choices=Status.choices, verbose_name="状態")

    class Meta:
        db_table = "sale_file"
        verbose_name = "売上ファイル"
        verbose_name_plural = "売上ファイル一覧"
```

#### STEP: マイグレーションの実行しよう

マイグレーションの実行の仕方については、4-3-1項の「モデルの作成」で学びました。その際に説明したように、まずmodeles.pyファイルを作成し、makemigrationコマンドでマイグレーションファイルを作ってから、migrateコマンドを実行します。

![マイグレーションの構造図（再掲）](media/image5.png)

*図8-1-8　マイグレーションの構造図（再掲）*

それでは今回作成するmodeles.pyを確認しましょう（コード8-1-7）。

#### コード8-1-7　モデル定義の全体（api/inventory/models.py）

```python
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.timezone import now

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

class Purchase(models.Model):
    """
    仕入
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(
        verbose_name="数量", validators=[MinValueValidator(0)]
    )
    purchase_date = models.DateTimeField(verbose_name="仕入日時", default=now)

    class Meta:
        db_table = "purchase"
        verbose_name = "仕入"
        verbose_name_plural = "仕入一覧"

class Status(models.IntegerChoices):
    """
    状態
    """
    SYNC = 0, "同期"
    ASYNC_UNPROCESSED = 1, "非同期_未処理"
    ASYNC_PROCESSED = 2, "非同期_処理済"

class SaleFile(models.Model):
    """
    売上ファイル
    """
    file_name = models.CharField(max_length=100, verbose_name="ファイル名")
    status = models.IntegerField(choices=Status.choices, verbose_name="状態")

    class Meta:
        db_table = "sale_file"
        verbose_name = "売上ファイル"
        verbose_name_plural = "売上ファイル一覧"

class Sale(models.Model):
    """
    売上
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(
        verbose_name="数量", validators=[MinValueValidator(0)]
    )
    sale_date = models.DateTimeField(verbose_name="売上日時", default=now)
    import_file = models.ForeignKey(
        SaleFile,
        on_delete=models.CASCADE,
        verbose_name="売上ファイルID",
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "sale"
        verbose_name = "売上"
        verbose_name_plural = "売上一覧"
```

次にVSCodeのターミナルを使用し、マイグレーションファイルを作成します。

#### Terminal

```bash
python manage.py makemigrations
```

api/inventory/migrations/0002_salefile_sale_import_file.py というマイグレーションファイルが作成されたでしょうか。それでは、ターミナルを使用し、マイグレーション処理を実施します。

#### Terminal

```bash
python manage.py migrate
```

MySQL Workbenchを起動して確認しましょう。sale_file テーブルと sale テーブルが、図8-1-9のように作成されていれば成功です。

*図8-1-9　テーブルが追加されている*

![テーブルが追加されている](media/image12.png)

#### Terminal (コマンドベース)

```bash
mysql --ssl=0 -uapp -p app
```

```sql
desc sale_file;
```

```
+----------+----------+------+-----+---------+----------------+
| Field    | Type     | Null | Key | Default | Extra          |
+----------+----------+------+-----+---------+----------------+
| id       | bigint   | NO   | PRI | NULL    | auto_increment |
| file_name| varchar(100) | NO |     | NULL    |                |
| status   | int      | NO   |     | NULL    |                |
+----------+----------+------+-----+---------+----------------+
```

```sql
desc sale;
```

```
+------------------+----------+------+-----+---------+----------------+
| Field            | Type     | Null | Key | Default | Extra          |
+------------------+----------+------+-----+---------+----------------+
| id               | bigint   | NO   | PRI | NULL    | auto_increment |
| quantity         | int      | NO   |     | NULL    |                |
| sale_date        | datetime | NO   |     | NULL    |                |
| product_id       | bigint   | NO   | MUL | NULL    |                |
| import_file_id   | bigint   | YES  | MUL | NULL    |                |
+------------------+----------+------+-----+---------+----------------+
```

## 8-6 ファイルをバックエンドで登録する

ここまでで、インポートするファイルの作成、ルーティングの設定、バックエンドにモデルの定義が完了し、プログラムを作成、実行するための準備が終わりました。次は、バックエンドのファイルを取り込む部分（図8-1-5中の②）を実装します。

本項での作業はバックエンド側で行うため、VSCodeはバックエンド側で利用してください。まずは、ファイルを取り扱うためのシリアライザーというものを定義します。シリアライザーとは、入力データをバリデーション（入力チェック）したり、Djangoで扱いやすいよう変換したりするクラスのことです。今回はシリアライザーにfileというフィールドを追加し、ファイルを取り扱えるようにします（コード8-1-8）。

#### コード8-1-8　シリアライザー（/api/inventory/serializers.py）

```python
from rest_framework import serializers

from .models import Product, Purchase, Sale

# 中略

class FileSerializer(serializers.Serializer):
    file = serializers.FileField()
```

それでは、SalesFilesテーブルにデータを入れていきましょう。

#### STEP: ファイルの登録処理を作ろう

##### requirements.txt

```
asgiref==3.9.1
Django==5.2.4
djangorestframework==3.16.0
sqlparse==0.5.3
mysqlclient==2.2.4
drf-yasg==1.21.10
djangorestframework_simplejwt==5.5.1
django-cors-headers==4.7.0
pandas==2.3.2
```

#### Terminal

```bash
pip install -r requirements.txt
```

ファイルの登録処理を実装します。先ほど仮実装したSalesSyncViewクラスに、次のように実装します（コード8-1-9）。

#### コード8-1-9　ファイル登録処理（api/inventory/views.py）

```python
from typing import Any, Dict, cast

import pandas as pd

from django.conf import settings
from django.db import transaction
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from api.inventory.authentication import RefreshJWTAuthentication
from api.inventory.exceptions import BusinessException
from .models import Product, Purchase, Sale, SaleFile, Status
from .serializers import (
    FileSerializer,
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SaleSerializer,
)

# 中略

class SaleSyncView(APIView):
    @transaction.atomic
    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = cast(Dict[str, Any], serializer.validated_data)
        filename = validated["file"].name
        with open(filename, "wb") as f:
            f.write(validated["file"].read())
        sale_file = SaleFile(file_name=filename, status=Status.SYNC)
        sale_file.save()
        df = pd.read_csv(filename)
        sales = [
            Sale(
                product_id=row["product"],
                sale_date=row["date"],
                quantity=row["quantity"],
                import_file=sale_file,
            )
            for _, row in df.iterrows()
        ]
        Sale.objects.bulk_create(sales)
        return Response(status=201)
```

コードの中身を具体的に見ていきましょう。

リクエストされたデータは、引数のrequest（❶）に設定されており、その中のrequest.dataにファイル内容が設定されています。 request.dataをFileSerializerでシリアライズします。serializer.is_validでバリデーションを行います。serializer.validated_data['file']にファイルの中身が設定されるので、open→f.write（❷）でファイルを開き、次の行で実行環境に保存（write）します。

コードの③の部分を確認してください。SalesFileモデルには「file_name」と「status」の項目があります。まずfile_nameには、先ほど取得したファイル名を設定します。statusは同期処理を実装するので、前項で作成した定数を用いてStatus.SYNC（0:同期処理）とします。

次に、最初に作成したCSVファイルのデータ（3行）をpandasというライブラリで読み取り、1行ずつSalesモデルに設定していきます（❹）。

最後に、処理が終了したことを返すためにHTTPステータス＝201でレスポンスを返却します。

### pandasライブラリとは

Pythonのpandasライブラリは、データを取り扱うためのライブラリです。CSVデータを「データフレーム（dataframe）」として扱うことができます。

#### コード8-1-10　変換対象のsales_data.csv

```csv
product,date,quantity
1,2023-03-01,300
1,2023-03-15,100
1,2023-04-03,200
```

**表8-1-2　変換後のデータフレーム**

| product | date | quantity |
|---------|------|----------|
| 1 | 2023-03-01 | 300 |
| 1 | 2023-03-15 | 100 |
| 1 | 2023-04-03 | 200 |

pandasという新しいライブラリを追加します。まずrequirements.txtにpandasを追加します。

#### コード8-1-11　ライブラリ（requirements.txt）

```
（中略）
pandas
```

次に、pip installでpandasをインストールします。

```bash
pip install -r requirements.txt
```

そして、pip freezeで依存関係を固定化します。

```bash
pip freeze > requirements.lock
```

#### STEP: curlコマンドで動作確認する

#### Terminal

```bash
curl -X POST http://localhost:8000/api/inventory/sync/ \
-H "Content-Type: multipart/form-data" \
-F "file=@sales_data.csv"
```

#### STEP: Swagger で動作確認する

LoginにSwaggerの定義を追加し、Swaggerからログイン可能にする。

#### Backend: （api/inventory/views.py）

```python
import pandas as pd

from django.db import transaction
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .exceptions import BusinessException
from .models import Product, Purchase, Sale, SalesFile, Status
from .serializers import (
    FileSerializer,
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SaleSerializer,
)

# 中略

class LoginView(APIView):
    """ユーザーのログイン処理

    Args:
        APIView (class): rest_framework.viewsのAPIViewを受け取る

    """

    # 認証クラスの指定
    # リクエストヘッダーにtokenを差し込むといったカスタム動作をしないので素の認証クラスを使用する
    authentication_classes = [JWTAuthentication]

    # アクセス許可の指定
    permission_classes = []

    @swagger_auto_schema(
        operation_description="ユーザーログイン - JWTトークンをCookieに設定",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["username", "password"],
            properties={
                "username": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="ユーザー名",
                    default="t-yamada",
                ),
                "password": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="パスワード",
                    default="password",
                ),
            },
        ),
        responses={
            200: openapi.Response(
                description="ログイン成功 - JWTトークンはCookieに設定されます",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(
                            type=openapi.TYPE_STRING, description="成功メッセージ"
                        ),
                    },
                ),
                headers={
                    "Set-Cookie": openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description="access=<token>; refresh=<token>; HttpOnly",
                    )
                },
            ),
            401: openapi.Response(
                description="認証失敗",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(
                            type=openapi.TYPE_STRING, description="エラーメッセージ"
                        ),
                    },
                ),
            ),
        },
    )
    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if type(serializer.validated_data) is dict:
            access = serializer.validated_data.get("access", None)
            refresh = serializer.validated_data.get("refresh", None)
            if access and refresh:
                response = Response(
                    {"message": "ログインに成功しました"}, status=status.HTTP_200_OK
                )
                max_age = settings.COOKIE_TIME
                response.set_cookie("access", access, httponly=True, max_age=max_age)
                response.set_cookie("refresh", refresh, httponly=True, max_age=max_age)
                return response
        return Response(
            {"message": "ユーザーの認証に失敗しました"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

# 中略

class SalesSyncView(APIView):
    parser_classes = [MultiPartParser]

    @transaction.atomic
    @swagger_auto_schema(
        operation_description="売上ファイルをアップロードして処理します",
        manual_parameters=[
            openapi.Parameter(
                'file',
                openapi.IN_FORM,
                description="アップロードするCSVファイル",
                type=openapi.TYPE_FILE,
                required=True,
            ),
        ],
        responses={
            201: "ファイルが正常に処理されました",
        },
    )
    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        filename = serializer.validated_data['file'].name
        with open(filename, 'wb') as f:
            f.write(serializer.validated_data['file'].read())
        sales_file = SalesFile(file_name=filename, status=Status.SYNC)
        sales_file.save()
        df = pd.read_csv(filename)
        sales_objects = [
            Sale(
                product_id=row['product'], sale_date=row['date'], quantity=row['quantity'], import_file=sales_file
            )
            for _, row in df.iterrows()
        ]
        Sale.objects.bulk_create(sales_objects)
        return Response(status=201)
```

#### Backend: config/urls.py

Swaggerの画面は認証なしで表示できるようにする

```python
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="Inventory API",  # APIのタイトル
        default_version="v1",  # APIのバージョン
        description="API documentation for Inventory management",  # APIの説明
    ),
    public=True,  # 公開設定
    permission_classes=(AllowAny,),  # 誰でもアクセス可能に設定
    authentication_classes=[],  # 認証クラスを空にして認証を無効化
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/inventory/", include("api.inventory.urls")),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
]
```

http://localhost:8000/swagger/

![Swagger画面](media/image11.png)

#### Terminal

```sql
select * from sale_file;

+----+------------------+--------+
| id | file_name        | status |
+----+------------------+--------+
| 1  | sales_data.csv   | 0      |
+----+------------------+--------+

select * from sale where import_file_id = 1;

+----+----------+---------------------------+--------------+------------------+
| id | quantity | sale_date                 | product_id   | import_file_id   |
+----+----------+---------------------------+--------------+------------------+
| 3  | 300      | 2024-02-29 15:00:00.000000 | 2            | 1                |
| 4  | 100      | 2024-03-14 15:00:00.000000 | 2            | 1                |
| 5  | 200      | 2024-04-02 15:00:00.000000 | 2            | 1                |
+----+----------+---------------------------+--------------+------------------+
```

## 8-7 フロントエンドからAPIを呼び出してファイルを登録する

ここまででバックエンドの部分を実装しました。次に、フロントエンドからファイルをアップロードする部分を作成します（図8-1-5中の①）。

ここからはフロントエンドのVSCodeに切り替えてください。画面左下のアイコンで「開発コンテナー」が起動しているかを確認しましょう。「><」と表示されている場合は、コマンドパレットから「コンテナーで再度開く」を選択してください。まず、ファイルをアップロードするために、mui-file-inputというパッケージをインストールします。3-2-4項で実施したように、下記のコマンドをフロントエンドのVSCodeのターミナルで実行してください。

#### STEP: ファイルアップロードUIの為のライブラリをインストール

#### Terminal

```bash
yarn add mui-file-input
```

正常にインストールされ、次の設定が追加されていることを確認してください（バージョン内容は、執筆時のものです）。package.jsonには、今回追加したmui-file-inputのパッケージが追加されています。yarn.lockには、パッケージのバージョンが固定化されています。

フロントエンド側のVSCodeを使用して、app/inventory/に「import_sales」フォルダを作成してください（図8-1-10）。そこに新規ファイルで「page.tsx」を作成し、次のコードを書いてください（コード8-1-14）。

①作成
②コードを記載

![フロントエンドのファイル登録](media/image9.png)

*図8-1-10　フロントエンドのファイル登録*

#### Frontend

#### コード8-1-14　フロントエンドからファイル登録（app/inventory/import_sales/page.tsx）New

```typescript
"use client";

import type { AlertColor } from "@mui/material";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [message, setMessage] = useState("");

  const result = (severity: AlertColor, message: string) => {
    setOpen(true);
    setSeverity(severity);
    setMessage(message);
  };

  const [fileSync, setFileSync] = useState<File | null>(null);

  const onChangeFileSync = (newFile: File | null) => {
    setFileSync(newFile);
  };

  const doAddSync = () => {
    if (!fileSync) {
      result("error", "ファイルを選択してください");
      return;
    }

    const params = {
      file: fileSync,
    };

    axios
      .post("/api/inventory/sync/", params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        result("success", "同期ファイルが登録されました");
      })
      .catch((error) => {
        console.log(error);
        result("error", "同期ファイルの登録に失敗しました");
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      <Typography variant="h5">売上一括登録</Typography>
      <Box m={2}>
        <Typography variant="subtitle1">同期でファイル取込</Typography>
        <MuiFileInput value={fileSync} onChange={onChangeFileSync} />
        <Button variant="contained" onClick={doAddSync}>
          登録
        </Button>
      </Box>
    </Box>
  );
}
```

コードの中身を見ていきましょう。実行結果を表示する際に、❶の箇所にてMUIのSnackbar[^8-1]、Alert[^8-2]という機能を使用しています。Snackbarsは、画面の特定の位置に表示される小さなエリアで、通知をユーザーに伝えるために使われます。

[^8-1]: 「Snackbar」https://mui.com/material-ui/react-snackbar/
[^8-2]: 「Alert」https://mui.com/material-ui/react-alert/

通知するメッセージや重要度（Severity）をAlertで指定しています。SnackberやAlertの設定値については、❷のresult関数で設定できるようにしています。実行結果表示のような、機能にまたがって使用される機能については、共通化を検討するとよいでしょう。

MuiFileInputでアップロードするファイルを設定します。ファイルが設定されるとonChangeイベントにより❸のonChangeFileSyncイベントが呼び出されます。setFileSyncにより、fileSyncにファイルが設定されます。

登録（Add）ボタンが押されると、❹のdoAddSyncが呼び出されます。fileSyncステートをリクエストパラメーターに設定して、前項で作成した"/api/inventory/sync"をaxiosの機能を使って呼び出します。結果、前項で実装したバックエンド側の処理が呼び出されます。ファイルを送信してテーブルにデータが入ったことを確認できれば成功です。

それでは、画面からファイルを登録してみましょう。frontendとbackendを起動してhttp://localhost:3000/inventory/import_salesをブラウザで開きます。画面が開いたら、「同期でファイル取込」を選択する箇所で、先ほど作成したsales_data.csvを選択して「登録」ボタンを押下します。「同期ファイルが登録されました」と表示されたら登録成功です（図8-1-11）。

*図8-1-11　結果メッセージ*

MySQL Workbenchを開いて、Schemasタブを開き、tablesを表示します。その中からsalesテーブルもしくはsales_fileテーブルを選択し、右クリックで「Select Rows」を選択してください（図8-1-12）。データの中身が表示されます。2つのテーブルにデータが入っているか確認しましょう。

①Schemasタブを開く
②「Tables」を選択
③選択

![MySQL Workbenchによるデータ登録確認方法](media/image10.png)

*図8-1-12　MySQL Workbenchによるデータ登録確認方法*

## 8-8 データベースの売上数を年月ごとに返却する

それでは次に、データベースの売上データを年月ごとにバックエンドで集計してAPIレスポンスでフロントに返却する処理を作成しましょう（図8-1-5中の③）。再び、バックエンド側のVSCodeに戻って作業を続けてください。先ほど仮実装したSalesListクラスについて、コード8-1-15のように実装します。importも追加しています。

※serializersはViewで使うので記述する位置を下から移動
※SalesSerializerは名称から用途がわかりにくいので、SaleSummarySerializerに変更

年月ごとの売上数を'%Y-%m'のフォーマットに直してAPI返却できるよう、シリアライザーに追加しておきます（コード8-1-17）。

#### Backend

#### コード8-1-17　シリアライザー（api/inventory/serializers.py）

```python
from rest_framework import serializers

from .models import Product, Purchase, Sale

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

class InventorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    unit = serializers.IntegerField()
    quantity = serializers.IntegerField()
    type = serializers.IntegerField()
    date = serializers.DateTimeField()

class FileSerializer(serializers.Serializer):
    file = serializers.FileField()

class SaleSummarySerializer(serializers.Serializer):
    monthly_date = serializers.DateTimeField(format="%Y-%m")  # type: ignore
    monthly_price = serializers.IntegerField()
```

#### Backend

#### コード8-1-15　売上数を年月ごとに返却（api/inventory/views.py）

```python
from typing import Any, Dict, cast

import pandas as pd

from django.conf import settings
from django.db import transaction
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce, TruncMonth
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from api.inventory.authentication import RefreshJWTAuthentication
from api.inventory.exceptions import BusinessException
from .models import Product, Purchase, Sale, SaleFile, Status
from .serializers import (
    FileSerializer,
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SaleSerializer,
    SaleSummarySerializer,
)

（中略）

class SaleSummary(ListAPIView):
    queryset = (
        Sale.objects.annotate(monthly_date=TruncMonth("sale_date"))
        .values("monthly_date")
        .annotate(monthly_price=Sum("quantity"))
        .order_by("monthly_date")
    )
    serializer_class = SaleSummarySerializer
```

（api/inventory/urls.py）

```python
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [
    path("products/", views.ProductView.as_view()),
    path("products/<int:id>/", views.ProductView.as_view()),
    path(
        "products/model/",
        views.ProductModelViewSet.as_view({"get": "list", "post": "create"}),
    ),
    path("purchases/", views.PurchaseView.as_view()),
    path("sales/", views.SaleView.as_view()),
    path("inventories/<int:id>/", views.InventoryView.as_view()),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", views.LoginView.as_view()),
    path("retry/", views.RetryView.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("sync/", views.SaleSyncView.as_view()),
    path("summary/", views.SaleSummary.as_view()),
]
```

TruncMonth('sales_date')で年月ごとにデータを集計します。annotate(monthly_price=Sum('quantity'))で年月ごとの売上数を合計します。最後にorder_byで年月の昇順に並び替えてレスポンスに返却します。

SQLに直すとコード8-1-16のようになります。

#### コード8-1-16　売上を年月で集計するSQL

```sql
SELECT
    CAST(DATE_FORMAT(`sales`.`sales_date`, '%Y-%m-01 00:00:00') AS DATETIME) AS `monthly_date`,
    SUM(`sales`.`quantity`) AS `monthly_price`
FROM
    `sales`
GROUP BY CAST(DATE_FORMAT(`sales`.`sales_date`, '%Y-%m-01 00:00:00') AS DATETIME)
ORDER BY `monthly_date` ASC;
```

## 8-9 売上データを表示する

ここまでで、図8-1-5の概念図における①から③までの処理を作成しました。続いて、④の処理を実装します。ここまでできれば、同期処理でファイルをアップロードしてモデルに取り込み、集計結果を表示する一連の機能が完成します。

前の項で作成したバックエンドAPIを通じて、売上数を取得して表示します（コード8-1-18）。フロントエンド側のVSCodeに戻って作業を続けてください。

#### Frontend

#### コード8-1-18　売上数を表示（app/inventory/import_sales/page.tsx）

```typescript
"use client";

import type { AlertColor } from "@mui/material";
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
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useCallback, useEffect, useState } from "react";
import axios from "@/plugins/axios";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [message, setMessage] = useState("");

  const result = (severity: AlertColor, message: string) => {
    setOpen(true);
    setSeverity(severity);
    setMessage(message);
  };

  type MonthlySummary = {
    monthly_date: string;
    monthly_price: number;
  };

  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>(
    [],
  );

  const fetchMonthlySummaries = useCallback(() => {
    axios
      .get("/api/inventory/summary/")
      .then((res) => res.data)
      .then((data) => {
        setMonthlySummaries(data);
      });
  }, []);

  useEffect(() => {
    fetchMonthlySummaries();
  }, [fetchMonthlySummaries]);

  const [fileSync, setFileSync] = useState<File | null>(null);

  const onChangeFileSync = (newFile: File | null) => {
    setFileSync(newFile);
  };

  const doAddSync = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!fileSync) {
      result("error", "ファイルを選択してください");
      return;
    }

    const params = {
      file: fileSync,
    };

    axios
      .post("http://localhost:8000/api/inventory/sync/", params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        result("success", "同期ファイルが登録されました");
        fetchMonthlySummaries(); // 集計データを再取得
        setFileSync(null); // ファイル選択をリセット
      })
      .catch((error) => {
        console.log(error);
        result("error", "同期ファイルの登録に失敗しました");
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      <Typography variant="h5">売上一括登録</Typography>
      <Box m={2}>
        <Typography variant="subtitle1">同期でファイル取込</Typography>
        <MuiFileInput value={fileSync} onChange={onChangeFileSync} />
        <Button variant="contained" onClick={doAddSync}>
          登録
        </Button>
      </Box>
      <Box m={2}>
        <Typography variant="subtitle1">年月ごとの売上数集計</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>処理月</TableCell>
                <TableCell>合計数量</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlySummaries.map((data: MonthlySummary) => (
                <TableRow key={data.monthly_date}>
                  <TableCell>{data.monthly_date}</TableCell>
                  <TableCell>{data.monthly_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
```

/api/inventory/summaryをaxiosの機能を使って、GETによりリクエストし、先ほどのバックエンド処理を呼び出します。@mui/materialのimport（Tableなど）を増やし、/api/inventory/summaryの呼び出し結果をdata変数に設定して表示しています。

レスポンス内容をsetDataでdataステートに設定します。data.mapにより、dataステートの内容をループしてHTMLのテーブルに出力します。データベースから月ごとの売上数が表示されたら成功です（図8-1-13）。http://localhost:3000/inventory/import_salesをブラウザで表示してみましょう。

*図8-1-13　月ごとの売上数表示*

売上ファイルをアップロードして、売上データを表示することができました。

## 8-10 非同期処理で改善したファイル取込処理の実装

第7章、冒頭の図8-1-1を思い出してみましょう。処理を一本の流れのように順番に行うことを同期処理、同時並行的に他の処理の完了を待たずに進めることを非同期処理と呼ぶのでした。

例えば、今回例に挙げたようなファイルアップロードの機能の場合、少量のデータ量であれば、リアルタイムで行う処理で問題ありません。では、中身が10万行、100万行にも及ぶファイルだったらどうでしょうか。バックエンドの処理が終わるまで、フロントエンドは待つことになり、画面上はずっと処理待ちの状態となってしまいます。

こういった場合には、非同期処理が有効な方法となります。ここからは非同期処理の具体的な実装方法を学んでいきましょう。

### 8-10-1 同期処理と非同期処理の構成

まず、今回のファイルアップロード処理で非同期にする機能を検討しましょう。先ほどの説明の通り、ファイルが巨大になった場合を考慮してみます。実際にデータが大きくなった場合に時間がかかると考えられるのは、ファイルを1行ずつ処理してモデルに登録する部分です。

![ファイルの容量が大きい場合、処理に時間がかかる部分](media/image1.png)

*図8-2-1　ファイルの容量が大きい場合、処理に時間がかかる部分*

api/inventory/views.pyのファイル登録同期処理API（class SalesSyncView）を参考にして、ファイル登録非同期処理（APIclass SalesAsyncView）を作成しましょう。バックグラウンドのVSCodeで作業を続けてください。

先ほどの処理を次の2つに分けてみます。

① ファイルを所定の場所に配置して、データベースにファイル名を登録する処理（同期処理）

② データベースのファイルから、売上データをデータベースに登録する処理（非同期処理）

①の処理は同期処理なのでブラウザ上で結果を待っている必要があります。ただ、②の時間がかかる処理は非同期で行われるため、全体としてブラウザ前での待ち時間は短くなります。

![同期処理／非同期処理のイメージ](media/image13.png)

*図8-2-2　同期処理／非同期処理のイメージ*

### 8-10-2 同期処理と非同期処理に分ける（バックエンド）

#### STEP: 同期処理部分（ファイル登録）を実装する

少しわかりにくいかもしれませんが、非同期処理に変更するコードのうち、ファイル登録の部分は同期処理にします。基本的には、これまでに作成したファイル登録の処理と同じですが、クラスの名前が非同期になっており、また、ステータスに非同期を書き込んでいる点が異なります。先ほど仮実装したSalesAsyncViewクラスについて、次のように実装します（コード8-2-1）。

#### Backend

#### コード8-2-1　ファイル登録処理（api/inventory/views.py）

```python
from typing import Any, Dict, cast

import pandas as pd

from django.conf import settings
from django.db import transaction
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce, TruncMonth
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from api.inventory.authentication import RefreshJWTAuthentication
from api.inventory.exceptions import BusinessException
from .models import Product, Purchase, Sale, SaleFile, Status
from .serializers import (
    FileSerializer,
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SaleSerializer,
    SaleSummarySerializer,
)

（中略）

class SaleAsyncView(APIView):
    parser_classes = [MultiPartParser]

    @transaction.atomic
    @swagger_auto_schema(
        operation_description="売上ファイルをアップロードします",
        manual_parameters=[
            openapi.Parameter(
                "file",
                openapi.IN_FORM,
                description="アップロードするCSVファイル",
                type=openapi.TYPE_FILE,
                required=True,
            ),
        ],
        responses={
            201: "ファイルが正常にアップロードされました",
        },
    )
    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = cast(Dict[str, Any], serializer.validated_data)
        filename = validated["file"].name
        with open(filename, "wb") as f:
            f.write(validated["file"].read())
        sale_file = SaleFile(file_name=filename, status=Status.ASYNC_UNPROCESSED)
        sale_file.save()
        return Response(status=201)
```

（api/inventory/urls.py）

```python
from django.urls import path

from . import views

urlpatterns = [
    path("products/", views.ProductView.as_view()),
    path("products/<int:id>/", views.ProductView.as_view()),
    path(
        "products/model/",
        views.ProductModelViewSet.as_view({"get": "list", "post": "create"}),
    ),
    path("purchases/", views.PurchaseView.as_view()),
    path("sales/", views.SaleView.as_view()),
    path("inventories/<int:id>/", views.InventoryView.as_view()),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", views.LoginView.as_view()),
    path("retry/", views.RetryView.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("sync/", views.SaleSyncView.as_view()),
    path("async/", views.SaleAsyncView.as_view()),
    path("summary/", views.SaleSummary.as_view()),
]
```

コードの中身を具体的に見ていきましょう。

#### ファイル登録処理

基本的な実装は8-1-3項で行った同期処理と同じです。ファイルを所定の場所に配置して、データベースにファイル名を登録します。

request.dataをFileSerializerでシリアライズします（❶）。serializer.is_validでバリデーションを行います（❷）。serializer.validated_data['file']にファイルの中身が設定されるので、ファイルを実行環境に保存します（❸）。SalesFileモデルに、先ほど取得したファイル名を設定します。今回は非同期処理を実装するので、ステータスをStatus.ASYNC_UNPROCESSEDとします。最後に、HTTPステータス＝201でレスポンスを返却します。

#### STEP: フロントエンドから実行しよう

続いて、次のようにコードを書きます（コード8-2-2）。

#### コード8-2-2　フロントエンドからファイル登録（app/inventory/import_sales/page.tsx）

```typescript
"use client";

import type { AlertColor } from "@mui/material";
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
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useCallback, useEffect, useState } from "react";
import axios from "@/plugins/axios";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [message, setMessage] = useState("");

  const result = (severity: AlertColor, message: string) => {
    setOpen(true);
    setSeverity(severity);
    setMessage(message);
  };

  type MonthlySummary = {
    monthly_date: string;
    monthly_price: number;
  };

  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>(
    [],
  );

  const fetchMonthlySummaries = useCallback(() => {
    axios
      .get("/api/inventory/summary/")
      .then((res) => res.data)
      .then((data) => {
        setMonthlySummaries(data);
      });
  }, []);

  useEffect(() => {
    fetchMonthlySummaries();
  }, [fetchMonthlySummaries]);

  const [fileSync, setFileSync] = useState<File | null>(null);

  const onChangeFileSync = (newFile: File | null) => {
    setFileSync(newFile);
  };

  const doAddSync = () => {
    if (!fileSync) {
      result("error", "ファイルを選択してください");
      return;
    }

    const params = {
      file: fileSync,
    };

    axios
      .post("/api/inventory/sync/", params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        result("success", "同期ファイルが登録されました");
        fetchMonthlySummaries(); // 集計データを再取得
        setFileSync(null); // ファイル選択をリセット
      })
      .catch((error) => {
        console.log(error);
        result("error", "同期ファイルの登録に失敗しました");
      });
  };

  const [fileAsync, setFileAsync] = useState<File | null>(null);

  const onChangeFileAsync = (newFile: File | null) => {
    setFileAsync(newFile);
  };

  const doAddAsync = () => {
    if (!fileAsync) {
      result("error", "ファイルを選択してください");
      return;
    }

    const params = {
      file: fileAsync,
    };

    axios
      .post("/api/inventory/async/", params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        result("success", "非同期ファイルが登録されました");
        setFileAsync(null); // ファイル選択をリセット
      })
      .catch((error) => {
        console.log(error);
        result("error", "非同期ファイルの登録に失敗しました");
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      <Typography variant="h5">売上一括登録</Typography>
      <Box m={2}>
        <Typography variant="subtitle1">同期でファイル取込</Typography>
        <MuiFileInput value={fileSync} onChange={onChangeFileSync} />
        <Button variant="contained" onClick={doAddSync}>
          登録
        </Button>
      </Box>
      <Box m={2}>
        <Typography variant="subtitle1">非同期でファイル取込</Typography>
        <MuiFileInput value={fileAsync} onChange={onChangeFileAsync} />
        <Button variant="contained" onClick={doAddAsync}>
          登録
        </Button>
      </Box>
      <Box m={2}>
        <Typography variant="subtitle1">年月ごとの売上数集計</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>処理月</TableCell>
                <TableCell>合計数量</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlySummaries.map((data: MonthlySummary) => (
                <TableRow key={data.monthly_date}>
                  <TableCell>{data.monthly_date}</TableCell>
                  <TableCell>{data.monthly_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
```

同期処理の実装では、フロントエンド側から/api/inventory/syncにアクセスして、バックエンドのAPI（SalesSyncView）を呼び出していました。フロントエンド側から/api/inventory/asyncにアクセスして、今回作成したバックエンドAPI（SalesAsyncView）を呼び出すようにします（❶）。/api/inventory/syncのときの実装をコピーして、変数／関数名と、メッセージを変更（Sync→Async、同期→非同期）します（❷）。

それでは、ファイルを登録してみましょう。frontendとbackendを起動してhttp://localhost:3000/inventory/import_salesをブラウザで開きます。画面が開いたら、「非同期でファイル取込」を選択する箇所で、先ほど作成したsales_data.csvを選択して「登録」ボタンを押下します。「非同期ファイルが登録されました」と表示されたら登録成功です。MySQL Workbenchを開いて、schemaタブからappデータベースを開き、その中のsales_fileテーブルにデータが入っているか確認してください（図8-2-3）。

*図8-2-3　レコードが追加されている*

## 8-11 非同期処理（バッチ処理）の構築

8-1-3項で行ったように、CSVファイルから売上データをモデルに登録します。こちらは非同期で行うのでバッチ処理を作成します。

#### STEP: バッチ処理を作成しよう

バッチ処理の作成は初めてなので、バックエンドのVSCodeを立ち上げてエクスプローラーより「batch/management/commands/」フォルダを作成、import_sales.pyファイルを作成する必要があります。VSCodeで「batch」ディレクトリを作成し、その配下に「management」ディレクトリを作成、さらにその配下にcommands」ディレクトリを作成して、次のimport_sales.pyファイルを作成してください（コード8-2-3）。

#### Backend

#### コード8-2-3　売上数登録処理（batch/management/commands/import_sales.py）New

```python
import pandas

from django.core.management.base import BaseCommand
from django.db import transaction

from api.inventory.models import Sale, SaleFile, Status

@transaction.atomic
def execute(download_history):
    entry = SaleFile.objects.select_for_update().get(pk=download_history.id)
    if entry.status != Status.ASYNC_UNPROCESSED:
        return
    filename = entry.file_name
    df = pandas.read_csv(filename)
    for _, row in df.iterrows():
        sales = Sale(
            product_id=row["product"],
            sale_date=row["date"],
            quantity=row["quantity"],
            import_file=entry,
        )
        sales.save()
    entry.status = Status.ASYNC_PROCESSED
    entry.save()

class Command(BaseCommand):
    def handle(self, *args, **options):
        while True:
            download_history = (
                SaleFile.objects.filter(status=Status.ASYNC_UNPROCESSED)
                .order_by("id")
                .first()
            )
            if download_history is None:
                # 実行中に未処理以外になった場合はスキップ
                break
            else:
                execute(download_history)
```

#### カスタムコマンド

バッチ実行には、Djangoのカスタムコマンド[^8-3]という仕組みを使用しています。カスタムコマンドとは、`python manage.py "任意のコマンド"`というように、オリジナルのPythonコマンドを作成できる機能です。

[^8-3]: 「How to create custom django-admin commands」 https://docs.djangoproject.com/en/4.1/howto/custom-management-commands/

アプリケーションディレクトリ（今回だとbatch）に「management/commands」ディレクトリを作成し、その配下にバッチ処理のファイルを配置することで、カスタムコマンド（バッチ処理）が使用できます。

カスタムコマンドをDjangoにアプリケーションとして認識させる必要があるので、INSTALLED_APPSに「"batch"」を追加しておきます（コード8-2-4）。

#### コード8-2-4　INSTALLED_APPSの追加（config/settings.py）

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "drf_yasg",
    "corsheaders",
    "api.inventory",
    "batch",
]
```

コード8-2-3の❶にあるCommandクラスのhandle関数からスタートします。対象が複数ある場合もあるので、whileループを使用しています。SalesFileモデルのStatus.ASYNC_UNPROCESSEDである対象をid順に取得します。何らかの要因で実行中に未処理以外になる場合を考慮し、スキップ処理を実装します。スキップしなかった場合は❷のexecute関数を呼び出し、本処理を実施します。

execute関数でSalesFileモデルを取得します。実施中にモデルに変更されると不整合が発生するので、排他処理のためにselect_for_updateを実施します。こちらも、何らかの要因で実行中に未処理以外になる場合を考慮し、スキップ処理を実装します。実行環境に保存したファイルをpandasというライブラリで読み取り、1行ずつSalesモデルに設定していきます。最後に、StatusをASYNC_PROCESSEDにして処理終了となります。

#### STEP: バッチを実行しよう

カスタムコマンドの実行は前述の通り`python manage.py "任意のコマンド"`で実行できます。作成したバッチ処理を実行してみましょう。コマンド引数（"--settings config.settings.development"）は環境設定ファイルに/config/settings/development.pyを使用することを意味しています。

カスタムコマンドの任意のコマンドは「batch/management/commands/」フォルダ下に作成されたpyファイルの名前で決まります。今回は、import_sales.pyであるため、「import_sales」が任意のコマンド名となります。先ほどの「非同期でファイル取込」を実行した後に、次を実行してください。正常終了したら、MySQL Workbenchを開いてapp.salesテーブルにレコードが登録されていることを確認しましょう。

```bash
python manage.py import_sales
```

このように、非同期処理を活用することで、画面での操作待ちの時間を減らし、利便性の高いシステムを構築するための選択肢が増えるのです。

なお、集計処理の非同期対応は本書では割愛していますが、非同期にした分「未処理・処理済」を考慮して集計し、表示する必要が出てくることになります。

### 非同期処理としてバッチを利用する

今回は「python manage.py」コマンドによりバッチ処理を手動で実行しました。この方法だと、オンライン処理でファイルを登録するたびに、逐一実行する必要があります。他のバッチ実行方法もあるので、紹介します。実践は割愛しますが、こんな方法があるということを把握しておくとよいでしょう。非同期処理の実行方法の検討の際には以下の2点の考慮が必要です。

- 処理のタイミング
- ファイルの大きさや、一貫性など非機能要件

処理のタイミングがリアルタイムに近いのか、データ反映が翌日以降などで構わないのかといった問題は設計に大きな違いを及ぼします。今回のファイル処理を例に説明します。

#### 即時性が高い場合（リアルタイムに近い場合）

1つは、プログラムのプロセスを常に動かしておく方法です。例えば「ファイルがフォルダにあったら処理する」として、普段はファイルがないので、ただ待っている（無限ループなど）だけのプログラムを用意します。この方法はファイル以外にも「データベースの特定項目を監視して処理する」などの方法も可能です。

もう1つはAWSのS3などのクラウドサービスにはファイルが配置された場合に特定のバッチを起動するといった設定が可能です。

#### 即時性が低い場合

一般的なのは、決まった時間に起動する方法です。Linuxサーバーであればcronを使用できます。Linux上の「crontab」コマンドで、時間起動の表示・設定ができます。cronは「* * * * * （コマンド）」という形式で設定します。「*」の位置（左端から）分・時・日・月・曜日を表します。例えば「20 10 1 * * (コマンド)」であれば、毎月1日の10時20分に実行する設定になります。任意の時間に実施できるので、システム負荷が少ない深夜にバッチ処理を実行したい場合などに向いています。

また、バッチを作成する際には前述の処理の一貫性を設計考慮に入れなければいけません。同時に処理するファイルが2つ作成された場合には「処理順」は保証されません。例えば、予約のキャンセルデータを先に処理してしまい、予約データを後から取り込むようなことになれば、予約キャンセルデータは反映されないでしょう。

第7章では、同期処理と非同期処理を実装しました。同期処理のメリットとしては順番通り処理されるというわかりやすさと、技術コストが低いことです。非同期処理のメリットは、高い操作性と大量データの処理が両立できることです。処理量やユーザビリティを考慮して、同期処理／非同期処理のどちらにするかを検討していくとよいでしょう。

また、今回はオンライン処理とバッチ処理を、同じリポジトリの中で実装しました。そうすることで、オンライン処理／バッチ処理のどちらでも使用するコードを共通化することができます。今回の例では、モデルについて共通化しています。モデル以外にも、ロジックを共通化することも可能です。その際は、共通化したソースコードをどこに配置するかについて、プロジェクトごとに決めておくとよいでしょう。

## 8-12 Gitに作業状態を残す

### 8-12-1 Githubへの登録

#### STEP フロントエンドの初期状態をローカルのgitに保存する

ここまで実行できたでしょうか。問題なければ、いったんこの状態を保存するためにgithubに開発状態を連携したいと思います。

##### コマンドプロンプト（Ubuntu）

```bash
cd /usr/local/src/dev/<REPO>
git add .
git commit -m "8章終了時点"
```

#### STEP ローカルのgitの状態をgithubに連携する

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

## 8-13 本章のハンズオンチェック

以下の内容を実施できたでしょうか。問題がなければまとめの内容を確認して、次の章に進んでください。

- ✅同期処理を実装する
- ✅非同期処理を実装する
- ✅バッチ処理を実装する
- ✅バックエンド環境の認証実装をGithubのリポジトリに保存する

## 8-14 本章のまとめ

本章では、Webアプリケーションにおける非同期処理とバッチ処理の重要性とその具体的な実装方法について深く掘り下げて学びました。特に、ユーザーエクスペリエンス（UX）の向上や大量データの効率的な処理といった、実プロジェクトで求められる要件をフルスタック開発で実現する応用的な手法を学習しました。

具体的には、以下の重要なポイントを習得しました。

- **同期処理と非同期処理の概念**: 従来の同期処理と、ユーザーを待たせることなくスムーズな操作を可能にする非同期処理の違いを理解しました。これにより、アプリケーションの特性に応じた適切な処理方式を選択する重要性を学びました。
- **同期処理の実装**: ファイルアップロード機能を例に、同期処理のフロー（クライアント → サーバー → DB）を実際に構築し、その動作を確認しました。
- **非同期処理の実装（オンライン部分）**: 時間のかかる処理をバックグラウンドに分離するため、ファイルを所定の場所に配置し、ファイル名をデータベースに登録する「同期的な非同期処理開始部分」を実装しました。
- **非同期処理（バッチ処理）の構築**: Djangoのカスタムコマンド機能を利用して、データベースに登録されたファイルから売上データを読み込み、データベースに登録するバッチ処理を実装しました。これにより、非同期で時間のかかるデータ処理を実現するメカニズムを理解しました。
- **モデルにおける外部キーとchoices**: テーブル間の関連性を定義する外部キーの役割と、データの選択肢をコード上で管理するchoices機能（マジックナンバーの回避）について学びました。
- **pandasライブラリの利用**: CSVファイルなどのデータ操作に便利なPythonのpandasライブラリを導入し、ファイルからのデータ読み込みと処理に活用しました。

本章を通して、同期処理と非同期処理のそれぞれのメリット・デメリットを理解し、処理量やユーザビリティといった非機能要件を考慮して適切な処理方式を選択する判断基準を学びました。また、オンライン処理とバッチ処理を同一リポジトリ内で実装することで、コードの共通化が図れることも確認しました。本章で身につけた非同期処理とバッチ処理のスキルは、大規模なWebアプリケーション開発において不可欠な要素です。

次章では、これまでの章とは経路を変えて、Djangoのマイグレーション機能について深堀していきたいと思います。フルスタック開発における運用面でのテーマを考えてみたいと思います。
