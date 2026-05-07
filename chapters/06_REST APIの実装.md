# Chapter 6：REST APIの実装（Django REST Framework）

この章では、Chapter 5で定義したモデルをもとに、フロントエンドから呼び出せるREST APIを実装します。Django REST Framework（DRF）を使うと、Serializerによるデータ変換とViewSetによるCRUD処理を少ないコードで実現できます。

> **この章が難しいと感じたら**：Serializer・ViewSet・Router は抽象的な概念で、初めて見ると理解しにくい章です。概念が理解しきれなくても、コードをコピーして先に進んで構いません。Chapter 8〜9 で実際にAPIを使いながら読み返すと理解しやすくなります。

## 6-1 RESTの概念

### RESTとは何か

**REST**（Representational State Transfer）はWebAPIの設計スタイルです。ルールではなく「こう設計するとわかりやすい」という規約のまとめです。

REST に従ったAPIを **RESTful API** または単に **REST API** と呼びます。本書のシステムはこのスタイルに従います。

### リソースとエンドポイントの関係

RESTではデータを**リソース**として捉えます。本（Book）・カテゴリ（Category）・貸出（Loan）がそれぞれリソースです。

各リソースにはURLの**エンドポイント**が対応します。リソース名は複数形で表記するのが慣例です。

| リソース | エンドポイント |
|---------|-------------|
| 本の一覧 | `/api/books/` |
| 特定の本 | `/api/books/{id}/` |
| カテゴリ一覧 | `/api/categories/` |

### HTTPメソッドとCRUDの対応

Chapter 1 で説明したHTTPメソッドが、CRUDの各操作に対応します。

| HTTPメソッド | CRUD | 操作 | エンドポイント例 |
|------------|------|------|--------------|
| GET | Read | 一覧・詳細取得 | `GET /api/books/` |
| POST | Create | 新規作成 | `POST /api/books/` |
| PUT / PATCH | Update | 更新 | `PUT /api/books/1/` |
| DELETE | Delete | 削除 | `DELETE /api/books/1/` |

## 6-2 APIエンドポイントの設計

実装前にエンドポイントの全体像を設計します。「コードを書く前に設計する」習慣は、後から仕様がブレるのを防ぎます。

### 設計の考え方

1. **リソースを特定する**：本・カテゴリ（Chapter 9で使用）
2. **各リソースの操作を決める**：一覧・詳細・作成・更新・削除のうち何が必要か
3. **URLとHTTPメソッドを割り当てる**

### エンドポイント一覧の設計

| URL | メソッド | 説明 |
|-----|---------|------|
| `/api/books/` | GET | 本の一覧を取得する |
| `/api/books/` | POST | 本を新規登録する |
| `/api/books/{id}/` | GET | 特定の本を取得する |
| `/api/books/{id}/` | PUT | 特定の本を更新する |
| `/api/books/{id}/` | DELETE | 特定の本を削除する |
| `/api/categories/` | GET | カテゴリ一覧を取得する |
| `/api/categories/` | POST | カテゴリを新規登録する |
| `/api/categories/{id}/` | GET | 特定のカテゴリを取得する |
| `/api/categories/{id}/` | PUT | 特定のカテゴリを更新する |
| `/api/categories/{id}/` | DELETE | 特定のカテゴリを削除する |

Chapter 10（認証）と Chapter 11（貸出）のエンドポイントはそれぞれの章で追加します。

## 6-3 Django REST Frameworkのセットアップ

### 🛠️ DRFをインストールする

```bash
pip install djangorestframework
echo "djangorestframework" >> requirements.txt
```

### 🛠️ settings.pyに追加する

`backend/config/settings.py` の `INSTALLED_APPS` に `rest_framework` を追加します。

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',  # 追加する
    'library',
]
```

## 6-4 Serializerの実装

### Serializerの役割

**Serializer**はPythonのモデルとJSONの間の**翻訳機**です。

PythonのオブジェクトをそのままブラウザへHTTPで送ることはできません。ブラウザが扱えるJSON（テキスト形式）に変換する必要があります。逆に、ブラウザから送られてきたJSONをPythonのモデルに変換するのもSerializerの仕事です。

```
モデル（Python） ──Serializer──→ JSON（APIレスポンス）
JSON（APIリクエスト） ──Serializer──→ モデル（Python）
```

Serializerを使わずにViewで直接JSONを組み立てることも技術的には可能ですが、バリデーション（入力チェック）やエラーレスポンスを自分で書く必要があり、コードが複雑になります。Serializerを使うことで変換・バリデーション・エラーレスポンスをまとめて扱えます。

リクエストデータの**バリデーション**（入力値の検証）もSerializerが担当します。「ISBNが13文字以内か」「必須フィールドが空でないか」といったチェックがここで行われます。

### 🛠️ ModelSerializerを実装する

`backend/library/` に `serializers.py` という新しいファイルを作成します。

```python
from rest_framework import serializers  # DRFのserializersモジュールを読み込む
from .models import Book, Category, Loan


class CategorySerializer(serializers.ModelSerializer):  # ModelSerializerはモデルと紐づいたSerializer
    class Meta:  # Metaクラスでこのシリアライザーの設定を定義する
        model = Category        # 対象のモデル
        fields = ['id', 'name'] # APIに含めるフィールド


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'publisher',
            'isbn',
            'category',
            'available_count',
        ]


class LoanSerializer(serializers.ModelSerializer):
    book_detail = BookSerializer(source='book', read_only=True)
    # source='book' で book フィールドの内容を BookSerializer で展開する。read_only=True で書き込み不可

    class Meta:
        model = Loan
        fields = [
            'id',
            'book',
            'book_detail',
            'user',
            'loan_date',
            'due_date',
            'return_date',
            'status',
        ]
        read_only_fields = ['loan_date', 'user']  # 自動セットするフィールドは読み取り専用にする
```

### 🛠️ バリデーションを書く

DRFのModelSerializerは、モデルの定義（`max_length`、`unique=True` 等）を自動的にバリデーションとして反映します。追加のバリデーションが必要な場合は `validate_フィールド名` メソッドを定義します。

```python
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publisher', 'isbn', 'category', 'available_count']

    def validate_isbn(self, value):  # validate_フィールド名という名前で定義する
        if not value.isdigit():  # isdigit()は文字列が数字のみで構成されているか判定する
            raise serializers.ValidationError("ISBNは数字のみで入力してください")
        return value

    def validate_available_count(self, value):
        if value < 0:
            raise serializers.ValidationError("貸出可能冊数は0以上にしてください")
        return value
```

バリデーションエラーが発生すると、DRFが自動的に HTTP 400 のレスポンスを返します。

## 6-5 ViewSetとRouterの実装

### ViewSetとは何か

**ViewSet**は1つのリソースに対するCRUD処理をまとめたクラスです。`ModelViewSet` を継承するだけで、一覧・詳細・作成・更新・削除のすべての処理が自動で用意されます。

**Router**はViewSetのURLを自動生成するツールです。`router.register('books', BookViewSet)` と書くだけで `/api/books/` と `/api/books/{id}/` の両方が生成されます。

### 🛠️ ModelViewSetを実装する

`backend/library/views.py` を以下のように書き換えます。Chapter 3で書いた `hello` 関数は削除します。

```python
from rest_framework import viewsets  # DRFのviewsetsモジュールを読み込む
from .models import Book, Category, Loan
from .serializers import BookSerializer, CategorySerializer, LoanSerializer


class CategoryViewSet(viewsets.ModelViewSet):  # ModelViewSetはCRUD全操作を提供するクラス
    queryset = Category.objects.all()          # 操作対象のQuerySet
    serializer_class = CategorySerializer      # 使用するSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
```

たったこれだけのコードで、Category・Book・Loan それぞれに対して一覧・詳細・作成・更新・削除の5つの操作が実装されました。

### 🛠️ RouterでURLを自動生成する

`backend/config/urls.py` を以下のように編集します。

```python
from django.contrib import admin
from django.urls import path, include  # includeは別のurls.pyを読み込むための関数
from rest_framework.routers import DefaultRouter  # RouterはViewSetのURLを自動生成する
from library import views

router = DefaultRouter()
router.register('books', views.BookViewSet)          # /api/books/ と /api/books/{id}/ を生成
router.register('categories', views.CategoryViewSet) # /api/categories/ と /api/categories/{id}/ を生成
router.register('loans', views.LoanViewSet)          # /api/loans/ と /api/loans/{id}/ を生成

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # /api/ 以下にrouterで生成したURLを接続する
]
```

`router.register()` を3行書くだけで、以下の全URLが自動生成されます。

| URL | メソッド | 操作 |
|-----|---------|------|
| `/api/books/` | GET | 本の一覧取得 |
| `/api/books/` | POST | 本の新規登録 |
| `/api/books/{id}/` | GET | 特定の本の取得 |
| `/api/books/{id}/` | PUT / PATCH | 特定の本の更新 |
| `/api/books/{id}/` | DELETE | 特定の本の削除 |

`/api/categories/` と `/api/loans/` も同じ5操作が生成されます。合計15エンドポイントが、Router への3行の登録だけで用意されました。

ファイルを保存してDjangoを起動した状態で `http://localhost:8000/api/` にアクセスすると、DRFが提供するAPIブラウザ画面が表示されます。

## 6-6 PostmanによるAPIの確認

APIが正しく動いているか確認するために、**Postman**というツールを使います。ブラウザはGETリクエストしか簡単に送れませんが、PostmanはPOST・PUT・DELETEも含めてリクエストを自由に作成できます。

### 🛠️ Postmanをインストールする

1. `https://www.postman.com/downloads/` にアクセスする
2. OS に合わせたインストーラーをダウンロードする
3. インストールして起動する
4. アカウント登録を求められた場合は、スキップ（Skip and go to the app）を選択する

### 🛠️ 各エンドポイントにリクエストを送る

**カテゴリを作成する（POST）**

1. **New Request** をクリックする
2. メソッドを `POST` に変更する
3. URLに `http://localhost:8000/api/categories/` を入力する
4. **Body** タブ → **raw** → **JSON** を選択する
5. 以下のJSONを入力する

```json
{
    "name": "プログラミング"
}
```

6. **Send** をクリックする

```json
{
    "id": 1,
    "name": "プログラミング"
}
```

HTTP 201 と上記レスポンスが返れば成功です。

**本を登録する（POST）**

```json
{
    "title": "実践フルスタックWeb開発ワークショップ",
    "author": "山田太郎",
    "publisher": "技術出版社",
    "isbn": "9784000000010",
    "category": 1,
    "available_count": 3
}
```

**本の一覧を取得する（GET）**

1. メソッドを `GET` に変更する
2. URLを `http://localhost:8000/api/books/` にする
3. **Send** をクリックする

登録した本がリストで返ってきます。

### APIを単体で確認してからフロントと繋ぐ習慣

「フロントエンドで表示がおかしい」というとき、原因がAPIにあるのかフロントにあるのかを切り分けるのが重要です。Postmanを使えばAPIを単体で確認できるため、「APIは正しいのにフロントで表示がおかしい」なのか「そもそもAPIが間違ったデータを返している」なのかをすぐに判別できます。

実装中はPostmanで動作確認してからフロントに繋ぐ習慣をつけておきましょう。

## まとめ

- RESTの概念とリソース・エンドポイント・HTTPメソッドの対応を理解した
- 図書館システムのAPIエンドポイントを設計した
- DRFのModelSerializerでモデルとJSONの変換・バリデーションを実装した
- ModelViewSetとRouterを使ってCRUD APIを実装した
- PostmanでAPIを単体確認する習慣を身につけた

### 🛠️ 変更をコミットしてpushする

```bash
git add .
git commit -m "Chapter 6: REST APIの実装"
git push
```

---

次の章からはフロントエンドの実装に移ります。Chapter 7 では TypeScript と Next.js の基礎を学びます。
