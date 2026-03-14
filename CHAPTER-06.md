# 第6章 認証・認可機能の実装

前章では在庫管理アプリケーションがフロントエンドのみで動作するところまで実装をしました。この章ではまずバックエンドで動作するAPIを作成し、その後フロントエンドからバックエンドに向けてAPIを疎通するように連携させていきます。本章では、Webアプリケーションにおけるログイン機能と認証処理の重要性について解説し、Djangoにおける具体的な実装方法を学びます。特に、Django REST Framework (DRF) とJSON Web Tokens (JWT) を用いたトークン認証に焦点を当てます。

## 6-1 はじめに

### 6-1-1 本章の目的と概要

**本章で達成できること:** 本章のハンズオンを実施すると、Webアプリケーションにおけるユーザー認証の仕組みを理解し、DjangoとDjango REST Framework (DRF) を使って、セキュアなログイン機能とAPI認証を実装できるようになります。特に、現代のWebアプリケーションで広く使われているJSON Web Tokens (JWT) を用いた認証フローを構築し、その動作を検証します。

**なぜ認証が必要なのか？:** Webアプリケーションにおいて、認証は「誰がそのユーザーであるか」を確認する非常に重要なプロセスです。これにより、ユーザー固有のデータ（例: 在庫情報）へのアクセスを制限したり、プライバシーを保護したり、不正な操作を防いだりすることができます。認証がないと、誰でも自由にデータにアクセスできてしまい、セキュリティ上の大きな問題となります。

### 6-1-2 開発環境の準備

本章を開始するにあたって、第3章のハンズオンが完了し、以下の環境が整っていることを前提とします。

- Dockerコンテナ上でDjangoが動作し、5章で実装したCRUDのAPIが動作すること。
- Githubにバックエンドのリポジトリが作成されており、上記のコードまでコミットされていること。

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未実装の機能があれば5章に戻り、内容を見直してください。

### 6-1-3 この章からハンズオンを始める場合

2章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませて置いてください。

また、本章から始めたいという方は以下のリポジトリをクローンもしくはフォークして初めて見てください。

フォークが完了したら以下の操作でDockerコンテナを立ち上げてみてください。

本章以降は読者の理解度に合わせて好きな章からハンズオンを開始することができます。また、学習をはじめからやり直したいときなどご利用ください。

この章から新規にハンズオンを始める場合は以下のURLのリポジトリをクローンして始めてください。

https://xxxx

クローンおよび開発環境の構築手順は、X章Y項を参考にしてください。

### 6-1-4 認証処理の基礎知識

実装に入る前に認証についてのイメージを固めておきましょう。そもそも認証をすることでどのようなことを実現したいのでしょうか。

認証処理は、アプリケーションのセキュリティとユーザーや企業の重要なデータを保護するため重要になってきます。次に認証処理の役割と必要性について説明します。

#### 認証処理の役割

**アクセス制御**

アプリケーションのリソースや機能へのアクセスを制御します。認証されていないユーザーは、制限されたアクセスしか許可されません。認証を通過したユーザーのみが、アプリケーションの機能を利用したり、データにアクセスしたりできます。今回はアプリケーションのAPIの実行可否という形でこのアクセス制御を行います。

**ユーザー識別**

ユーザーの識別を行います。ユーザーがアプリケーションにログインすると、そのユーザーの情報（ユーザー名、メールアドレスなど）が識別されます。これにより、ユーザー固有の設定やデータにアクセスできるようになります。今回はユーザー固有のデータを使って何かする、ということはありませんがアクセス可能なユーザーが登録済みユーザーかどうかという識別を行います。

**ユーザーのプライバシー保護**

ユーザーのプライバシーを保護する役割も果たします。ユーザーは、自分の情報やデータが他の人からアクセスされないことを期待しています。認証を通過することで、ユーザーのデータへのアクセスを制限し、権限のないユーザーからの保護を提供します。今回はこちらの機能については考慮していません。

**トレースと監査**

アプリケーションのトレースと監査にも役立ちます。認証を通過したユーザーのアクティビティは、ログとして記録されます。これにより、特定のアクションや変更を行ったユーザーの追跡や、セキュリティ上の問題の特定が容易になります。今回は最も簡単に最終ログイン日時というデータを登録してみます。

認証はプライバシー保護の基盤となるもので、このハンズオンではユーザー固有のデータの暗号化といった高度な機能までは扱わないが、認証によってデータへのアクセスを制限する仕組みを実装します。

#### 認証方式について

認証方法には様々な種類がありますが、Djangoはデフォルトではsession認証となっています。他の認証方法にはSNSのアカウントを利用したソーシャル認証や、一時的な文字列を発行するトークン認証があります。本アプリケーションでJWT（JSON Web Tokens）というトークンを利用するトークン認証を実装していきます。

JWTやセッションは、認証処理の手段の一部です。JWTはトークンベースの認証方式であり、セッションはサーバー側で状態を管理する方法です。これらの仕組みは、認証を効率的かつ安全に実現するために使用されます。DjangoにおいてJWTを利用することは可能ですが、デフォルトの設定では利用できないので、こちらもDRFの機能を使って実装していきます。

## 6-2 認証処理の全体像

実際に手を動かす前に、Webアプリケーションにおける**「認証」と「認可」**の基本的な概念と、本書で実装する認証フローの全体像を理解しておきましょう。これにより、なぜこの後のハンズオンで特定の作業（トークンの発行、ヘッダーへの追加など）が必要なのかが明確になり、理解がしやすくなります。また「認証」と「認可」は言葉が似ていて混乱しやすい単語なので、しっかりと整理しておきましょう。

### 6-2-1 APIの一覧と機能分類

本章では以下の認証に関わるAPIを実装します。

| エンドポイント | メソッド | URL |
|---|---|---|
| ログイン | POST | http://localhost:8000/api/inventory/login/ |
| リフレッシュ | POST | http://localhost:8000/api/inventory/retry/ |
| ログアウト | POST | http://localhost:8000/api/inventory/logout/ |

#### なぜ「認証」が必要なのか？

Webサービスを利用する際、私たちは「ログイン」という操作を頻繁に行います。これは、システムに対して「私は誰であるか」を証明する行為であり、このプロセスを「認証 (Authentication)」と呼びます。認証がなければ、誰でも他人のプライベートな情報（例えば、SNSの投稿履歴やECサイトの購入履歴）にアクセスできてしまい、セキュリティ上の大きな問題となります。

認証は、以下の目的のために不可欠です。

- ユーザーの特定: 誰が操作を行っているのかを識別するため。
- プライバシーの保護: ユーザー固有のデータ（例：在庫情報）へのアクセスを制限するため。
- 不正操作の防止: 悪意のあるユーザーによるデータの改ざんや削除を防ぐため。

#### 認証の種類

認証にはいくつかの方法がありますが、本書では現代のWebアプリケーションで主流となっている「**トークン認証**」を採用します。

**トークン認証**は、ユーザー名とパスワードの代わりに「トークン」と呼ばれる一時的な鍵を使って認証を行う方法です。この方法には以下のメリットがあります。

- **ステートレス:** サーバー側でユーザーのログイン状態を保持する必要がなく、サーバーの負荷を軽減できます。
- **安全な通信:** ユーザー情報自体を何度もやり取りする必要がなく、セキュリティが高まります。
- **モバイルアプリとの親和性:** Webブラウザだけでなく、モバイルアプリなど様々なクライアントと連携しやすくなります。

この章では、トークン認証の中でも特に広く使われている**JWT (JSON Web Tokens)** を使用します。

### 6-2-2 認証処理の実装の流れ

![JWT認証フロー](media/image5.png)

*図6-2-1　JWT認証フローの概略図*

本書で構築する認証システムは、以下のステップで動作します。このフローを頭に入れておくと、これからのハンズオンがスムーズに進みます。

1. **ログインリクエスト:** ユーザーがログイン画面でユーザー名とパスワードを入力し、「ログイン」ボタンをクリックすると、フロントエンドからバックエンドに情報が送信されます。

2. **認証とトークン発行:** バックエンドは受け取ったユーザー名とパスワードを検証し、正しければ「JWT」という認証情報を含んだトークンを発行します。

3. **トークン返却:** バックエンドは発行したJWTをフロントエンドに返します。

4. **トークン保存:** フロントエンドは受け取ったJWTを安全な場所に保存します（例：ローカルストレージ）。

5. **APIリクエスト:** 次回以降、保護されたAPI（例：在庫情報を取得するAPI）にアクセスする際、フロントエンドは保存しておいたJWTをリクエストのヘッダーに含めて送信します。

6. **トークン検証と認可:** バックエンドはリクエストヘッダーに含まれるJWTを検証します。トークンが正しければ、そのリクエストは「認証されたユーザーからのもの」と判断され、リソースへのアクセスを許可します。このアクセス許可のプロセスを「認可 (Authorization)」と呼びます。

### 6-2-3 認証処理の実装範囲

この後のハンズオンでは、上記のフローを実際にコードに落とし込んでいきます。

- **セクション6.3以降:** バックエンド側でJWTを発行するためのAPIを作成します。ログインAPIやユーザー登録APIなどが含まれます。
- **セクション7.x（予定）:** 第4章で作成したフロントエンドのログイン画面から、このバックエンドAPIを呼び出す処理を実装します。これにより、フロントエンドとバックエンドが連携して動く様子を体験できます。

この章では、まずバックエンド側の認証機能を完成させ、次章でフロントエンドと連携させます。一つずつ着実にステップを踏んでいきましょう。

## 6-3 バックエンド：認証APIの作成

ここまでで通常のテーブルの参照・更新処理を学んできました。この項では、Django REST Framework (DRF) とdjangorestframework-simplejwtライブラリを用いて、バックエンドの認証APIを実装します。アクセス制御とユーザー識別ができるようになります。

### 6-3-1 認証処理の実装の準備

#### STEP: Djangoの組み込みのユーザーデータ

認証を実装する際は、アカウント情報といったデータが必要になります。本節では、6-3-4項で紹介したDjangoでデフォルトで作成されるユーザーテーブルを利用します。

#### STEP: 認証ライブラリをインストールしよう

**JWTの作成**

JWTを作成するためのDRF関連のライブラリを追加します。次のコマンドをターミナルで実行してください。

**Backend**

```bash
pip install djangorestframework-simplejwt
```

JWTを実現するためのライブラリはいくつかありますが、今回はDRFの公式で紹介されているSimple JWTを導入しました[^注1]。

**requirements.txt**

```
asgiref==3.9.1
Django==5.2.4
djangorestframework==3.16.0
sqlparse==0.5.3
mysqlclient==2.2.4
drf-yasg==1.21.10
djangorestframework_simplejwt==5.5.1
```

#### STEP: 認証ライブラリをDjangoに設定しよう

ライブラリを環境にインストールしただけでは、Djangoから使うことはできないため、base.pyにこのライブラリを使用する設定を追加します。認証クラスのリストに追加します（コード6-3-1）。

**コード6-3-1　共通設定ファイル（config/settings.py）**

**Backend**

```python
(略)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    },
    "loggers": {
        "django.db.backends": {
            "level": "DEBUG",
            "handlers": ["console"],
            "propagate": False,
        }
    },
}

# 認証設定
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated']
}
```

これで、REST APIの認証時にデフォルトではJWTAuthenticationを使うという設定になりました。

### 6-3-2 認証処理の実装

#### STEP: 認証を行うためのエンドポイントを設定しよう

トークンを発行するURLをurls.pyに追加します。ViewにはTokenObtainPairViewとTokenRefreshViewを指定します（コード6-3-2）。

**コード6-3-2　URLのマッピング（api/inventory/urls.py）**

**Backend**

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
]
```

views.pyにViewは追加しなくてよいのでしょうか。デフォルトの設定で利用するのであればSimpleJWT組み込みのViewだけで十分のため、新たにViewを追加する必要はありません。

#### STEP: 認証に使うユーザーを設定しよう

このままだと、認証するためのユーザー情報がありません。そこで、ユーザー情報を追加しましょう。本アプリケーションでは独自にユーザーテーブルは作成せずに、デフォルトで用意されているDjango組み込みのユーザーテーブルを使用します。

では、ターミナルで次のコマンドを実行してスーパーユーザーを作成しましょう。パスワードの入力を求められるので任意のパスワードを入力してください。今回は以下のような情報で登録を進ます。

- ユーザー名：t-yamada
- パスワード：password

以下のコマンドを実行して登録してみましょう。

**Backend**

```bash
python manage.py createsuperuser --username=t-yamada --email=t-yamada@example.com
```

途中パスワードのポリシーに抵触する旨のメッセージが表示されますが、無視して進めます。MySQL Workbenchから次のSQLを実行してDBに登録できたか確認してみましょう（図6-3-1）。

**図6-3-1　SQLを実行する**

```sql
SELECT VERSION(),
@@sql_mode,
@@default_storage_engine,
@@sql_auto_is_null,
@@lower_case_table_names,
CONVERT_TZ('2001-01-01 01:00:00', 'UTC', 'UTC') IS NOT NULL
;
```

```
(0.000) SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED; args=None; alias=default
(0.001)
SELECT
  table_name,
  table_type,
  table_comment
FROM information_schema.tables
WHERE table_schema = DATABASE()
; args=None; alias=default

(0.001) SELECT `django_migrations`.`id`, `django_migrations`.`app`, `django_migrations`.`name`, `django_migrations`.`applied` FROM `django_migrations`; args=(); alias=default

(0.001) SELECT `auth_user`.`id`, `auth_user`.`password`, `auth_user`.`last_login`, `auth_user`.`is_superuser`, `auth_user`.`username`, `auth_user`.`first_name`, `auth_user`.`last_name`, `auth_user`.`email`, `auth_user`.`is_staff`, `auth_user`.`is_active`, `auth_user`.`date_joined` FROM `auth_user` WHERE `auth_user`.`username` = 'root' LIMIT 21; args=('root',); alias=default

(0.000) SELECT `auth_user`.`id`, `auth_user`.`password`, `auth_user`.`last_login`, `auth_user`.`is_superuser`, `auth_user`.`username`, `auth_user`.`first_name`, `auth_user`.`last_name`, `auth_user`.`email`, `auth_user`.`is_staff`, `auth_user`.`is_active`, `auth_user`.`date_joined` FROM `auth_user` WHERE `auth_user`.`username` = 't-yamada' LIMIT 21; args=('t-yamada',); alias=default

Password:
Password (again):
このパスワードは一般的すぎます。
Bypass password validation and create user anyway? [y/N]: y

(0.009) INSERT INTO `auth_user` (`password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES ('pbkdf2_sha256$1000000$MaNNPoHYuDldvov0yju4ny$+07moqB7EYFhmNIa+6AiXaedkO0kVrWEmcOqEUDX4+k=', NULL, 1, 't-yamada', '', '', 't-yamada@example.com', 1, 1, '2025-08-27 23:11:36.528231');

Superuser created successfully.
```

t-yamadaのユーザーが取得できたでしょうか。

#### STEP: 認証用のトークンを発行できるか確認しよう

JWTが発行できるか確認してみましょう。

これで、Swagger UIを開くためにブラウザで http://localhost:8000/swagger/ にアクセスしてください。作成したbackend取得APIが表示されたのではないでしょうか。

http://localhost:8000/api/inventory/token/にアクセスして、実行してみてください（図6-3-2）。

**図6-3-2　認証トークン取得の表示例**

![](media/image4.png)

*図6-3-2　認証トークン取得の表示例*

Usernameに「t-yamada」、Passwordに「password」を入力してPOSTボタンを押下してください。次のようなレスポンスが得られたでしょうか。「reflesh」と「access」に紐づく文字列は都度変わるので異なっていても問題ありません。

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.(略).vitzmOmzEd40H09V2eKK1wfIQT4ZCxTaWFU2moDz7JQ",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.(略).H9Lv0eh1VI-cy_upqLj4Y9k4YTZl07oWa97JNR2m96c"
}
```

もし、次のようなレスポンスであれば、ユーザー情報に誤りがあるかもしれません。もう一度、入力内容もしくはDBへの登録内容を確認してみてください。

**Backend**

```json
{
  "detail": "No active account found with the given credentials"
}
```

リフレッシュトークンとアクセストークンを取得することができました。それぞれ次のような役割を持っています。

#### access

APIの認証に試用し、リクエストを行ったときデータへのアクセス権限を制御するトークンです。通常はRequest HeaderのAuthorizationフィールドにBearerトークンとしてセットして、リクエストに付与します。サーバーはこのトークンを検証して、トークンが有効であればサーバーへのアクセスが許可されます。トークンには有効期限が設定されており、この有効期限が切れると同じトークンでも検証が通らなくなります。一般にアクセストークンの有効期限は短めに設定されています。

#### refresh

アクセストークンの再発行するために使用するトークンです。アクセストークンの有効期限が切れた場合に使用されます。クライアントはユーザーIDやパスワードを用いて再度認証を行うのではなく、リフレッシュトークンを使用して新しいアクセストークンを取得するリクエストを送信します。サーバーはリフレッシュトークンを検証し、新しいアクセストークンを発行します。これにより、ユーザーは改めてユーザー情報など入力することなくアクセストークンを再発行してリソースにアクセスできます。こちらのトークンにも有効期限は設定されていますが、一般的にアクセストークンより長期間に設定さることが多く、アクセストークンが失効した後もこのトークンを用いてアクセストークンを再発行してアプリケーションに再接続するという風に用いられます。

#### STEP: 商品一覧の取得に認証が必要になるようにしよう

先ほど作成したJWTを利用して、APIが本当に認証が必要になっているか確かめてみましょう。ログイン以外の各APIはJWT必須にします。以前に追加した、次の設定で独自のViewを利用したAPIは全て認証が必要となっています（コード6-3-4）。

**コード6-3-4　共通設定ファイル（backend/config/settings/base.py）**

**Backend**

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated']
}
```

もし各Viewで認証設定を分けて設定したい場合は、リクエストを処理するAPIViewを継承したクラスごとに認証設定を追加します（コード6-3-5）。

**コード6-3-5　ビュー（api/inventory/views.py）**

**Backend**

```python
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.inventory.exceptions import BusinessException

from .models import Product, Purchase, Sale
from .serializers import (
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SaleSerializer,
)

class ProductView(APIView):
    # 認証クラスの指定
    authentication_classes = [JWTAuthentication]
    # アクセス許可の指定
    # 認証済みのリクエストのみ許可
    permission_classes = [IsAuthenticated]

    # 商品操作に関する関数で共通で使用する商品取得関数
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise NotFound

    # 商品の一覧もしくは一意の商品を取得する
    def get(self, request, id=None, format=None):
        if id is None:
            queryset = Product.objects.all()
            serializer = ProductSerializer(queryset, many=True)
        else:
            product = self.get_object(id)
            serializer = ProductSerializer(product)
        return Response(serializer.data, status.HTTP_200_OK)

    # 商品を登録する
    def post(self, request, format=None):
        serializer = ProductSerializer(data=request.data)
        # validationを通らなかった場合、例外を投げる
        serializer.is_valid(raise_exception=True)
        # 検証したデータを永続化する
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

    # 商品を更新する
    def put(self, request, id, format=None):
        product = self.get_object(id)
        serializer = ProductSerializer(instance=product, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)

    def delete(self, request, id, format=None):
        product = self.get_object(id)
        product.delete()
        return Response(status = status.HTTP_200_OK)

class ProductView(APIView):
    （省略）

class ProductModelViewSet(ModelViewSet):
    （省略）

class PurchaseView(APIView):
    （省略）

class SalesView(APIView):
    （省略）

class InventoryView(APIView):
    （省略）
```

後ほど実装しますが、ログイン処理などで全てのユーザーがアクセスすることが可能なAPIなどには、次のように指定を空にします。

**Backend**

```python
# 指定の変更前
authentication_classes = [JWTAuthentication]
permission_classes = [IsAuthenticated]

# 指定の変更後
authentication_classes = []
permission_classes = []
```

#### 認証の種類と許可

`authentication_classes`でどのような認証を行うか、`permission_classes`でどのような許可を必要とするか、という2種類の設定を指定します。今回使用したJWTAuthenticationはJWTによるトークン認証を行い、IsAuthenticatedは認証が行われたユーザーのみアクセスを許可しています。

これらの指定自体はDRFの機能ですが、JWTAuthenticationは今回追加したSimpleJWTの機能になります。

#### STEP: 認証用トークンが機能しているか確認しよう

本当に認証が必要になったのか確認してみましょう。今まで商品一覧を表示できていたhttp://localhost:8000/api/inventory/products/を開いてみてください（図6-3-3）。

**図6-3-3　商品一覧を取得できずに認証エラーになる表示例**

次のようなレスポンスが得られるはずです。

**ブラウザ**

![](media/image1.png)

*図6-3-3　認証エラーの表示例*

リクエスト時にJWTを含めなかったため想定通り商品一覧は表示されず、エラーメッセージが返ってきました。認証が必要なAPIに対してリクエストヘッダーにJWTを含めずにAPIを叩こうとしたため、認証エラーとなりました。

今度はリクエストヘッダーにJWTを含めてリクエストを送ってみましょう。先ほどの画面からはリクエストヘッダーに含めるための機能がついていないため、curlを利用してリクエストを送ります。curl（カール）は、コマンドラインからHTTPやHTTPSを含む様々なプロトコルを使用してデータの送受信を行うためのツールです。もちろんpostmanといったAPIクライアントを使用しても構いません。

また、json形式が1文で返ってきて少し見づらいので、jqというコマンドラインでJSONデータの解析と操作を行うためのツールも使います。パイプ「|」でコマンドの出力を次のコマンドの引数として渡しています。まずは、トークンなしで実行し、ブラウザと同じレスポンスが得られることを確認しましょう。VSCodeで新しいターミナルをもう1つ開き、次のコマンドを実行してください。

**Backend**

```bash
curl -s -XGET http://localhost:8000/api/inventory/products/ | jq .
```

GETメソッドでレスポンスの形式をJSON形式でhttp://localhost:8000/api/inventory/products/にHTTPリクエストを送信する、という意味の指定です。次のような実行結果が表示されます。

> **Hint:** curl: command not found、jq: command not found とメッセージが出たら
>
> ```bash
> apt update && apt install -y curl jq
> ```

```json
{
  "detail": "認証情報が含まれていません。"
}
```

ブラウザと同じレスポンスが得られました。それではリクエストヘッダーにアクセストークンをつけてリクエストを送信してみましょう。アクセストークンがわからなければ図6-3-2の箇所を参考に再度取得してください。

**Backend**

```bash
# 取得したアクセストークンをAuthorizationヘッダーに設定
curl -s -XGET \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.(略).H9Lv0eh1VI-cy_upqLj4Y9k4YTZl07oWa97JNR2m96c' \
  http://localhost:8000/api/inventory/products/ | jq .
```

次のレスポンスが得られました。

```json
[
  {
    "id": 1,
    "name": "【更新後】コットン100％バックリボンティアードワンピース（黒）",
    "price": 1234,
    "description": "大人の愛らしさを引き立てる、ナチュラルな風合い。リラックスxトレンドを楽しめる、上品なティアードワンピース。"
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
  },
  {
    "id": 5,
    "name": "シフォンプリーツスカート（ピンク）",
    "price": 3980,
    "description": "軽やかなシフォン素材のプリーツスカート。女性らしい柔らかな印象を与え、デートやお出かけにぴったり。"
  },
  {
    "id": 6,
    "name": "フラワープリントワンピース（グリーン）",
    "price": 7980,
    "description": "華やかなフラワープリントが目を引く、リラックス感のあるワンピース。デイリーユースからお出かけまで幅広く活躍。"
  }
]
```

先ほどは認証エラーになりAPIが実行されませんでしたが、今度は実行され商品データを取得することができました。確かにトークンによって認証が行われたことが確認できました。

##### HTTPリクエスト

APIを実行したり、Webサイトのページの情報を取得するためにブラウザなどから送信する命令をHTTPリクエストといいます。認証のコマンドで実行した通り、HTTPリクエストにはトークンやどういう方式でリクエストをおくるかなど様々な情報を加えることができます。

たとえば例に出てきたリクエストを見てみましょう。

**Backend**

```bash
curl -s -XGET \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.(略).H9Lv0eh1VI-cy_upqLj4Y9k4YTZl07oWa97JNR2m96c' \
  http://localhost:8000/api/inventory/products/
```

これは以下のようになります。

- GETという方法で
- Authorization: Bearerに「eyJhb...」という文字列をセットして
- http://localhost:8000/api/inventory/products/にリクエストする

**Backend**

```bash
curl -s -XGET \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.(略).H9Lv0eh1VI-cy_upqLj4Y9k4YTZl07oWa97JNR2m96c' \
  http://localhost:8000/api/inventory/products/
```

このようにしてフロントエンドとバックエンドという別々のから命令などを送り、情報のやり取りを行います。

### 6-3-3 認証設定のカスタマイズ

#### STEP: 認証用のトークンに細かい設定を追加しよう

次はこのトークンをカスタマイズしてみましょう。トークンには有効時間の長さやどういった情報を含めるかなどの設定ができます。

以下のように設定をしてみましょう。

- アクセストークンの有効期限：15分
- リフレッシュトークンの有効期限：30日
- 新しいリフレッシュトークンを要求されたときの動作：新しいリフレッシュトークンを返す
- 最終ログインを誰が行ったか

では、上記を実現するためのコードを次のbase.pyに追加していきましょう（コード6-3-3）。

**コード6-3-3　共通設定ファイル（config/settings.py）**

**Backend**

```python
"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 5.1.6.

For more information on this file, see

https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see

https://docs.djangoproject.com/en/5.1/ref/settings/
"""

import os
from datetime import timedelta
from pathlib import Path

(略)

# 認証設定
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
}

# トークン設定
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS": True,
    "UPDATE_LAST_LOGIN": True,
}
```

様々な設定をすることができますが、今回は次のような設定をしています。

- アクセストークンの有効期限：15分
- リフレッシュトークンの有効期限：30日
- リフレッシュトークンのローテート：新しいリフレッシュトークンを返す
- 最終ログイン：ログイン時に auth_user テーブルの last_login フィールドが更新する

#### STEP: 認証用トークンのログイン設定が反映されたか確認しよう

再度ログイン（トークン取得）。

```bash
curl -s -XPOST http://localhost:8000/api/inventory/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"t-yamada","password":"password"}' | jq .
```

`UPDATE_LAST_LOGIN`: でトークンの有効期限とログイン時の日時を更新する設定を加えました。この設定をした状態で再度リクエストを実行してみてください。その後、authユーザーの該当レコードのlast_loginカラムを見てみてください。最終ログイン日時に相当するlast_loginの値が更新されています。

```bash
mysql --ssl=0 -uapp -papp_pass app
```

```bash
select * from auth_user\G
```

```
*********************** 1. row ***********************
id: 1
password: pbkdf2_sha256$1000000$MaNNPoHYuDldvov0yju4ny$+07moqB7EYFhmNIa+6AiXaedkO0kVrWEmcOqEUDX4+k=
last_login: 2025-08-28 22:37:50.562218
is_superuser: 1
username: t-yamada
first_name:
last_name:
email: t-yamada@example.com
is_staff: 1
is_active: 1
date_joined: 2025-08-27 23:11:36.528231
```

#### STEP: 認証用トークンの有効時間設定が反映されたか確認しよう

##### JWTの有効期限の更新

今度は設定ファイルを修正してアクセストークンの有効期間を短くし、しばらく時間をおいてから同じリクエストを投げてみましょう（コード6-3-X）。

**コード6-3-X　共通設定ファイル（backend/config/settings/base.py）**

**Backend**

```python
（中略）

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ロギング設定

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
    },
}

# 追記前はここが末尾

# 認証設定

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated']
}

# トークン設定

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': datetime.timedelta(minutes=1),  #「15」を「1」に修正、検証が終わったら15に戻すこと
    'REFRESH_TOKEN_LIFETIME': datetime.timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'UPDATE_LAST_LOGIN': True,
}
```

同じcurlコマンドを実行してみます。

```bash
curl -s -XGET -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:8000/api/inventory/products/ | jq .
```

先ほどと同じトークンを利用したのに今度はエラーになってしまいました。

```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is expired"
    }
  ]
}
```

エラーメッセージにはトークンが不正か失効したと出ています。これはbase.pyで設定したトークンの有効期限を超過したため、トークンが失効し利用ができなくなったためです。ユーザー名とパスワードを使って再度トークンを取得してもよいですが、refreshトークンを利用して有効期限を更新してみましょう。

**Backend**

```bash
curl -s -XPOST \
  -H "Content-Type: application/json" \
  -d "{\"refresh\":\"$REFRESH_TOKEN\"}" \
  http://localhost:8000/api/inventory/token/refresh/ | jq .
```

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.(略).vitzmOmzEd40H09V2eKK1wfIQT4ZCxTaWFU2moDz7JQ",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.(略).H9Lv0eh1VI-cy_upqLj4Y9k4YTZl07oWa97JNR2m96c"
}
```

新たなaccessトークンとrefreshトークンを取得することができました。ユーザー情報を利用しなくても、リフレッシュトークンを利用すれば、利用期限が更新された新しいアクセストークンを取得することができます。

## 6-4 認証トークンのハンドリングとAPI連携

### 6-4-1 認証トークンの保存

#### accessトokenの自動セット

6-3ではaccessトークンをリクエストのヘッダーに入れて渡していました。

accessトークンの自動セットについて、アクセストークンを自動でセットしなければいけないことはわかりましたが、リクエストのたびに設定するのは少し面倒です。よくある実装としてはフロントエンドからのリクエストの際にヘッダーに付与する方法ですが、今回は認証機構の仕組みの勉強も含めてバックエンドで自動的にセットするようにしましょう。

#### STEP: 認証用トークンをハンドリングする仕組みを追加しよう

まずinventory配下にauthentication.pyを作成してください（コード6-3-7）。

**コード6-4-7　認証トークンハンドリング（api/inventory/authentication.py）**

**Backend**

```python
from rest_framework_simplejwt.authentication import JWTAuthentication

class AccessJWTAuthentication(JWTAuthentication):
    def get_header(self, request):
        token = request.COOKIES.get("access")
        request.META["HTTP_AUTHORIZATION"] = "{header_type} {access_token}".format(
            header_type="Bearer", access_token=token
        )  # ①
        return super().get_header(request)

class RefreshJWTAuthentication(JWTAuthentication):
    def get_header(self, request):
        refresh = request.COOKIES.get("refresh")
        request.META["HTTP_REFRESH_TOKEN"] = refresh
        return super().get_header(request)
```

ポイントはもともと個別で使っていたJWTAuthenticationを継承することです。このクラスの中にheaderを生成するメソッドがあるので、このメソッドをオーバーライドして①のようにリクエストヘッダーにトークンを追加する処理を記載しています。トークンはリクエスト内のcookieに含まれるようにします。cookieが含まれる前提になっているので、apiでのトークン生成時にcookieにトークンをセットするようにします。

#### STEP: ハンドリングの仕組みを使うエンドポイントを追加しよう

認証の結果、取得したトークンをクッキーに保存するLoginViewクラスを追加します。

**コード6-4-8　ビュー（api/inventory/views.py）**

**Backend**

```python
from django.conf import settings
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from api.inventory.exceptions import BusinessException

from .models import Product, Purchase, Sale
from .serializers import (
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SaleSerializer,
)

class ProductView(APIView):
    # 認証クラスの指定
    # authentication_classes = [JWTAuthentication]
    # アクセス許可の指定
    # 認証済みのリクエストのみ許可
    # permission_classes = [IsAuthenticated]
    （中略）

class ProductModelViewSet(ModelViewSet):
    （省略）

class PurchaseView(APIView):
    （省略）

class SalesView(APIView):
    （省略）

class InventoryView(APIView):
    （省略）

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
```

**コード6-4-9　URLのマッピング（api/inventory/urls.py）**

**Backend**

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
]
```

**コード6-4-10　共通設定ファイル（config/settings.py）**

**Backend**

```python
(略)

# 認証設定

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "api.inventory.authentication.AccessJWTAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
}

# トークン設定

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS": True,
    "UPDATE_LAST_LOGIN": True,
}

# Cookieの有効期限（秒）

COOKIE_TIME = 60 * 60 * 12
```

##### カスタムした認証方式の反映

まず認証・認可の形式についてです。

**Backend**

```python
authentication_classes = [JWTAuthentication]
permission_classes = []
```

認証方法は特別な方法は使わないので、JWTAuthenticationを指定します。一方、認可についてはどのユーザーでもアクセス可能にするため、空の配列にして未指定の状態にします。

次にメソッド名ですが、こちらはAPIViewに従いHTTPメソッドpostで受けるようにするのでdef postとしています。シリアライザーはSimpleJWTで定義されるシリアライザーを使用します。その後同様にis_validでデータを検証します。validateが通ると、validate_dataにaccessトークンとrefreshトークンのそれぞれが保存されます。そして、次の①でそれぞれ取り出したトークンをレスポンスにクッキーとして保存します。改ざんを防ぐためにhttponlyのオプションを付与します。またcookieに保存期間を設定し、セキュリティ性を高めています。

#### STEP: カスタム認証でも正常に認証が行われるか確認しよう

先ほどは対応していないと説明した、ブラウザで動作確認をしていきます。まず http://localhost:8000/api/inventory/login で認証を行ってみましょう（図6-4-4）。

**図6-4-4　ログイン画面**

![](media/image2.png)

*図6-4-4　ログイン画面*

ログイン処理の入力値には、図6-4-1でも使用した、次のt-yamadaの情報を入力してPOSTボタンを押下してください。

**ブラウザ**

```json
{
  "username": "t-yamada",
  "password": "password"
}
```

![](media/image3.png)

次に、http://localhost:8000/api/inventory/products/ で商品一覧を検索してみます（図6-4-5）。

**図6-4-5　商品一覧画面**

先ほどは認証エラーになっていましたが、今度はcookieからトークンを渡し、認証処理の過程でリクエストヘッダーにトークンをセットしているので正常に認証が行われ、エラーになりません。

##### COOKIE_TIME

この設定値は本章では特に使用しません。7章のフロントエンドと連携したときに使用します。ブラウザ側でいつまでクッキーを保持するかという、有効期限に使用する設定値です。

### 6-4-2 認証トークンの再利用

#### STEP: リトライ処理のAPIを追加しよう

最後にトークンの再発行とログアウト処理も見てみましょう。RetryViewクラスを追加します。

**コード6-4-11　ビュー（api/inventory/views.py）**

**Backend**

```python
from django.conf import settings
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

from .models import Product, Purchase, Sale
from .serializers import (
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SaleSerializer,
)

class ProductView(APIView):
    （中略）

class ProductModelViewSet(ModelViewSet):
    （省略）

class PurchaseView(APIView):
    （省略）

class SalesView(APIView):
    （省略）

class InventoryView(APIView):
    （省略）

class LoginView(APIView):
    （中略）

class RetryView(APIView):
    authentication_classes = [RefreshJWTAuthentication]
    permission_classes = []

    def post(self, request):
        request.data["refresh"] = request.META.get("HTTP_REFRESH_TOKEN")
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if type(serializer.validated_data) is dict:
            access = serializer.validated_data.get("access", None)
            refresh = serializer.validated_data.get("refresh", None)

            if access and refresh:
                response = Response(
                    {"message": "トークンを更新しました"}, status=status.HTTP_200_OK
                )

                max_age = settings.COOKIE_TIME
                response.set_cookie("access", access, httponly=True, max_age=max_age)
                response.set_cookie("refresh", refresh, httponly=True, max_age=max_age)

                return response

        return Response(
            {"message": "ユーザーの認証に失敗しました"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
```

**コード6-4-12　URLのマッピング（api/inventory/urls.py）**

**Backend**

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
]
```

ログインメソッドとは、①の部分が異なります。cookieからrefreshトークンを取り出してリフレッシュ用のシリアライザーの引数に指定しています。後続処理はログインメソッドと同じになります。

**Backend**

```python
request.data['refresh'] = request.META.get('HTTP_REFRESH_TOKEN')
serializer = TokenRefreshSerializer(data=request.data)
```

#### STEP: リトライ処理のAPIの動作を確かめよう

### 6-4-3 認証トークンの削除

#### STEP: ログアウト処理のAPIを追加しよう

次はログアウト処理です（コード6-4-13、コード6-4-14）。

**コード6-4-13　ビュー（api/inventory/views.py）**

**Backend**

```python
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product, Purchase, Sales
from .serializers import ProductSerializer, PurchaseSerializer, SaleSerializer, InventorySerializer
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from django.db.models import F, Value, Sum
from api.inventory.exception import BusinessException
from django.db.models.functions import Coalesce
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from api.inventory.authentication import RefreshJWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class ProductView(APIView):
    （中略）

class ProductModelViewSet(ModelViewSet):
    （省略）

class PurchaseView(APIView):
    （省略）

class SalesView(APIView):
    （省略）

class InventoryView(APIView):
    （省略）

class LoginView(APIView):
    （中略）

class RetryView(APIView):
    （中略）

# 追記前はここが末尾

class LogoutView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        response = Response(
            {"message": "ログアウトしました"}, status=status.HTTP_200_OK
        )

        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response
```

**コード6-4-14　URLのマッピング（api/inventory/urls.py）**

**Backend**

```python
from django.urls import path

from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('products/', views.ProductView.as_view()),
    path('products/<int:id>/', views.ProductView.as_view()),
    path('products/model/', views.ProductModelViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('purchases/', views.PurchaseView.as_view()),
    path('sales/', views.SalesView.as_view()),
    path('inventories/<int:id>/', views.InventoryView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.LoginView.as_view()),
    path('retry/', views.RetryView.as_view()),
    path('logout/', views.LogoutView.as_view()),
]
```

認証にはcookieに保存されたトークンを使用するため、そのトークンを削除しています。

ここまでの実装でバックエンドに必要な修正はほぼ全て行うことができました。

#### STEP: ログアウト処理のAPIの動作を確かめよう

次の節ではバックエンドの処理をフロントエンドから呼び出せるように、つなぎ込んでいきます。

## 6-5 Gitに作業状態を残す

### 6-5-1 Githubへの登録

#### STEP: フロントエンドの初期状態をローカルのgitに保存する

ここまで実行できたでしょうか。問題なければ、いったんこの状態を保存するためにgithubに開発状態を連携したいと思います。

**コマンドプロンプト（Ubuntu）**

```bash
cd /usr/local/src/dev/<REPO>
git add .
git commit -m "6章終了時点"
```

#### STEP: ローカルのgitの状態をgithubに連携する

以下のコマンドを実行してください。

**コマンドプロンプト（Ubuntu）**

```bash
git push origin main

Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
Delta compression using up to 8 threads
Compressing objects: 100% (24/24), done.
Writing objects: 100% (25/25), 76.02 KiB | 8.45 MiB/s, done.
Total 25 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/keiji-ueno/wfswd02.git
 * [new branch]      main -> main
```

## 6-6 本章のハンズオンチェック

以下の内容を実施できたでしょうか。問題がなければまとめの内容を確認して、次の章に進んでください。

- DRFの認証機能を利用してDjangoに認証機能を組み込む
- デフォルトの認証機能をカスタマイズし、リクエスト時に認証が必要になるようにする
- バックエンド環境の認証実装をGithubのリポジトリに保存する

## 6-7 本章のまとめ

本章では、Webアプリケーションにおけるユーザー認証の重要性と、その具体的な実装方法について深く掘り下げて学びました。特に、Django REST Framework (DRF) とJSON Web Tokens (JWT) を用いたセキュアなトークン認証システムを構築し、その動作を検証しました。

具体的には、以下の重要な概念と実装手法を習得しました。

- **認証の役割と必要性:** アプリケーションのセキュリティを確保し、ユーザーのプライバシーを保護するための認証の重要性を理解しました。

- **JWT認証フローの理解:** アクセストークンとリフレッシュトークンの発行、利用、更新、そしてそれらの有効期限管理を通じて、安全なAPI連携を実現するJWTの仕組みを習得しました。

- **バックエンド認証APIの実装:** DjangoのユーザーモデルとSimple JWTライブラリを活用し、ログイン、トークンリフレッシュ、ログアウトといった一連の認証APIを実装しました。

- **カスタム認証の実装:** リクエストヘッダーに自動でトークンを付与するためのカスタム認証クラスを実装し、より効率的なAPI連携の方法を学びました。

- **認証の検証:** curlコマンドやSwagger UIを通じて、認証が必要なAPIへのアクセス制御が正しく機能していることを確認しました。

本章で構築した認証機能は、フルスタックアプリケーションのセキュリティレベルを大きく向上させます。ユーザーが安心して利用できるシステムを構築する上で、認証は非常に重要な要素となります。

次章では、本章で実装したバックエンドの認証APIと、前々章（第4章）で作成したフロントエンドのログイン画面を連携させることで、ユーザーが実際にログインしてアプリケーションを利用できるようになります。いよいよ、フロントエンドとバックエンドが密に連携し、一つの「動く」フルスタックアプリケーションとして機能する様子を体験することになるでしょう。

[^注1]: https://www.django-rest-framework.org/api-guide/authentication/#json-web-token-authentication
