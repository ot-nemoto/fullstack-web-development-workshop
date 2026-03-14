# 第7章

前章では在庫管理アプリケーションがフロントエンドのみで動作するところまで実装をしました。この章ではまずバックエンドで動作するAPIを作成し、その後フロントエンドからバックエンドに向けてAPIを疎通するように連携させていきます。

## 7-1 はじめに

今までの章で行ったことの集大成となる章なので、各章の内容を振返ってみましょう。

4章ではフロントエンドを実装し、画面からAPIを呼び出す準備をすすめました。

5章ではバックエンドで動作する基本的なAPIを実装しました。

6章では、バックエンドに認証の仕組みを追加し、よりセキュアなAPIにしました。

本章では、バックエンドで動作するAPIをフロントエンドからそのAPIを連携させることで、フルスタックアプリケーションとしての動作を実現します。

これまでの章で行ってきた学習の集大成となる章です。これまでに学習した内容を振り返りながら、本章の目的と位置づけを確認しましょう。

- 第4章: フロントエンドの実装に焦点を当て、ReactとNext.jsを使ってユーザーが直接触れる画面を構築しました。ここでは、APIを呼び出すための準備も行いました。

- 第5章: バックエンドの実装に移り、DjangoとDRFを用いてデータの参照、登録、更新、削除といった基本的なAPIを作成しました。これにより、アプリケーションの「脳」となる部分が動き始めました。

- 第6章: バックエンドに認証の仕組みを追加し、Djangoのユーザー機能とJWT（JSON Web Tokens）を導入することで、よりセキュアなAPIへと進化させました。

本章では、これらの個別に実装してきたフロントエンドとバックエンドの要素を連携させます。具体的には、第4章で作成したフロントエンドの画面から、第5章で実装したバックエンドのAPI群を呼び出し、第6章で構築した認証機能を使ってセキュアにアクセスできるようにします。これにより、ユーザーが実際にログインし、データを操作できる「フルスタックアプリケーション」としての動作を完成させます。

### 7-1-1 本章の目的と概要

本章のハンズオンを実施すると、Webアプリケーションにおけるフロントエンドとバックエンドの「システム連携」の仕組みを総合的に理解し、フルスタックアプリケーションとしての動作を実現できるようになります。

具体的な学習目標は以下の通りです。

- ログイン機能の連携: 第4章で作成したフロントエンドのログイン画面と、第6章で実装したバックエンドの認証APIを連携させ、ユーザーが実際にログインできる仕組みを構築します。

- Next.jsのRewrite機能の活用: フロントエンドからバックエンドのAPIをシームレスに呼び出すために、Next.jsのRewrite機能を用いてURLの変換設定を行い、リクエストが正しくルーティングされるようにします。

- 参照系APIの連携: バックエンドで実装した商品一覧や商品在庫履歴の参照APIを、フロントエンドの各画面から呼び出し、データベースの実際のデータを表示できるようにします。

- 更新系APIの連携: 商品の登録・更新・削除、および在庫の仕入れ・卸しを行うAPIを、フロントエンドの入力フォームとボタンに紐付け、ユーザーの操作に応じてデータがリアルタイムに更新されるようにします。

- HTTPクライアント（axios）によるAPI連携: フロントエンドからバックエンドのAPIを呼び出すためのHTTPクライアントであるaxiosの基本的な使い方を習得し、リクエストの送信、レスポンスの受信、そしてエラーハンドリングの実装を学びます。

- 再認証処理の導入: トークン認証におけるアクセストークンの有効期限切れに対応するため、axiosのインターセプター機能を利用して、リフレッシュトークンによるアクセストークンの自動再取得とAPIリトライ処理を実装します。

これらの学習を通じて、個別に機能していたフロントエンドとバックエンドがどのように協調動作し、一つの完成されたWebアプリケーションとして機能するのかを、実践的に理解することを目指します。

### 7-1-2 開発環境の確認

本章を開始するにあたって、第4~6章のハンズオンが完了し、以下の環境が整っていることを前提とします。

- Dockerコンテナ上でNext.jsが動作し、アプリケーションの各画面が表示できること。

- Dockerコンテナ上でDjangoが動作し、アプリケーションの各APIが実行できること。

- Githubにバックエンドのリポジトリが作成されており、上記のコードまでコミットされていること。

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未実装の機能があれば5章に戻り、内容を見直してください。

### 7-1-3 この章からハンズオンを始める場合

2章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませて置いてください。

また、本章から始めたいという方は以下のリポジトリをクローンもしくはフォークして初めて見てください。

```bash
# クローン or フォークコマンド
git clone https://github.com/USERNAME/full-stack-web-development-frontend.git
cd full-stack-web-development-frontend
git clone https://github.com/USERNAME/full-stack-web-development-backend.git
cd full-stack-web-development-backend
```

フォークが完了したら以下の操作でフロントエンドのDockerコンテナを立ち上げてみてください。

```
# DevContainorの展開
# npmインストールとNext.jsの起動コマンド
```

フォークが完了したら以下の操作でバックエンドのDockerコンテナを立ち上げてみてください。

```
# DevContainorの展開
# Djangoの起動コマンド
```

本章以降は読者の理解度に合わせて好きな章からハンズオンを開始することができます。また、学習をはじめからやり直したいときなどご利用ください。

この章から新規にハンズオンを始める場合は以下のURLのリポジトリをクローンして始めてください。

[https://xxxx](https://xxxx)

クローンおよび開発環境の構築手順は、X章Y項を参考にしてください。

## 7-2 システム連携の全体像

これまでの章で、フロントエンドとバックエンドを個別に構築してきました。しかし、Webアプリケーションはこれらが連携して初めて一つのサービスとして機能します。本セクションでは、その「**連携**」がどのように行われるのか、全体的な仕組みとフローを理解することを目的とします。これにより、これからのハンズオンで実装するAPI連携のコードが、なぜ必要なのか、どのような役割を果たすのかを明確に理解できます。

#### システム連携の基本：APIの役割

フロントエンドとバックエンドは、**「API（Application Programming Interface）」**というインターフェースを介してデータをやり取りします。フロントエンドがWebブラウザ上でユーザーの操作を処理する「顔」だとすれば、バックエンドはデータの管理や認証といった「脳」の役割を果たします。APIは、この「顔」と「脳」をつなぐ「**神経**」のようなものです。

フロントエンドは、ユーザーからの操作に応じてAPIにリクエストを送り、バックエンドはリクエストに応じて必要な処理（データの取得、登録など）を実行し、その結果をフロントエンドに返します。

このデータのやり取りは、通常**JSON（JavaScript Object Notation）**というフォーマットで行われます。JSONは人間にもコンピューターにも分かりやすい、汎用的なデータ形式です。

#### フロントエンドとバックエンドの連携フロー

本書で実装する在庫管理アプリケーションを例に、具体的なシステム連携のフローを見てみましょう。

1. **データの表示（GETリクエスト）**

   - **ユーザーの操作:** ユーザーが在庫一覧ページを開きます。

   - **フロントエンドの役割:** ページが読み込まれた際、在庫データを取得するためにバックエンドのAPI（例：GET /api/items）にリクエストを送ります。

   - **バックエンドの役割:** リクエストを受け取り、データベースから在庫データを取得し、JSON形式でフロントエンドに返します。

   - **フロントエンドの役割:** 受け取ったJSONデータを画面上に表示します。

2. **データの登録（POSTリクエスト）**

   - **ユーザーの操作:** ユーザーが在庫登録フォームに商品情報を入力し、「登録」ボタンをクリックします。

   - **フロントエンドの役割:** 入力された商品情報をJSONデータにまとめ、バックエンドのAPI（例：POST /api/items）にリクエストを送ります。

   - **バックエンドの役割:** リクエストを受け取り、JSONデータを検証後、データベースに新しい商品情報を登録します。

   - **フロントエンドの役割:** 登録が成功したことを示すメッセージをユーザーに表示します。

3. **認証とAPI連携の組み合わせ**

   - 第6章で実装した認証機能が、このAPI連携に加わります。ログイン済みのユーザーからのリクエストであることを確認するために、**JWT**が重要な役割を果たします。

   - **フロントエンドの役割:** ユーザーがログインすると、バックエンドから返されたJWTを保存します。

   - **APIリクエスト時:** 次回以降、在庫データを取得・登録する際に、保存しておいたJWTをリクエストヘッダーに含めて送信します。

   - **バックエンドの役割:** APIリクエストを受け取ると、まずヘッダーに含まれるJWTを検証し、**正規のユーザーからのリクエストであるか**を確認します。検証が成功した場合のみ、データへのアクセスを許可します。

この一連の流れを図で示すと、以下のようになります。

### 7-2-2 システム連携処理の実装の流れ

この後のハンズオンでは、上記のフローを実際にコードに落とし込んでいきます。

- **「7-9 フロントからのつなぎ込み」:** 具体的には、フロントエンド（React/Next.js）のコードを修正し、axiosのようなHTTPクライアントライブラリを使ってバックエンドAPIにリクエストを送る処理を実装します。

- **認証の連携:** ユーザーがログインした際に取得したJWTをローカルストレージに保存し、その後のAPIリクエストに自動的に付与する仕組みを構築します。

- **データの表示・操作:** 取得したデータを画面に表示したり、フォームから入力されたデータをバックエンドに送信したりする処理を実装し、フルスタックアプリケーションとしての動作を完成させます。

さあ、これまでの学習の集大成として、いよいよフロントエンドとバックエンドを連携させ、アプリケーションを一つの形にしていきましょう。

### 7-1-3 システム連携処理の実装範囲

## 7-9 フロントからのつなぎ込み

ここまででAPIを利用して基本的なデータの参照と登録をできるようになりました。次はフロントエンドとこれらの処理をつなぎ、画面からデータの参照と更新を行えるようにしましょう。

### 7-9-1 つなぎ込みの準備

#### STEP 1：フロントエンドからリクエストを行うライブラリをインストールする

JavaScriptでHTTP通信をより簡単に扱うためにaxiosというHTTPクライアントライブラリをインストールします。

```bash
yarn add axios
```

#### STEP 2：Next.jsのRewrite機能によるルーティングを設定する

なぜこれでバックエンドと疎通可能なのでしょうか。実はフロントエンドのサーバーで任意のURLに変換されバックエンドにリダイレクトされています。

次のファイルで設定しています。

コード7-9-2 設定ファイル（next.config.js）

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://host.docker.internal:8000/api/:path*/",
      },
    ];
  },
};

export default nextConfig;
```

`async rewrites()`の関数がリダイレクトの設定になります。「/api/任意の文字列」で指定された一致するURLを「http://host.docker.internal:8000/api/任意の文字列/」に転送しています。反対に一致しないURLはリダイレクトされないため、Linkコンポーネントやpushで指定されているURLには影響がありません。

#### STEP 3：バックエンドでCORSの設定を追加する

```bash
pip install django-cors-headers
```

（requirements.txt）

```
asgiref==3.9.1
Django==5.2.4
djangorestframework==3.16.0
sqlparse==0.5.3
mysqlclient==2.2.4
drf-yasg==1.21.10
djangorestframework_simplejwt==5.5.1
django-cors-headers==4.7.0
```

（config/settings.py）※追記・変更箇所のみ記載

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
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# CORS設定
CORS_ALLOW_ALL_ORIGINS = True
```

### 7-9-1 ログイン画面のつなぎ込み

認証処理を先に実装しないと商品一覧などの認証が必要なAPIを事項しにくいため、先にログイン処理からつなぎ込みを行います。第5章のフロントエンドの開発で使用したVSCodeで開発するので、環境を間違えないように注意してください。

#### STEP 1：ログイン画面のコードを修正する

コード7-9-1 ログイン画面（app/login/page.tsx）

```typescript
"use client";

import {
  Box,
  Button,
  Container,
  CssBaseline,
  createTheme,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  } = useForm<FormData>();

  const [authError, setAuthError] = useState("");
  const router = useRouter();
  const defaultTheme = createTheme();

  const onSubmit = (data: FormData): void => {
    handleLogin(data);
  };

  const handleLogin = (data: FormData) => {
    axios
      .post("/api/inventory/login/", data)
      .then(() => {
        router.push("/inventory/products");
      })
      .catch(() => {
        setAuthError("ユーザー名またはパスワードに誤りがあります。");
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            ログイン
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {authError && (
              <Typography variant="body2" color="error">
                {authError}
              </Typography>
            )}{" "}
            <TextField
              type="text"
              id="username"
              variant="filled"
              label="ユーザー名（必須）"
              fullWidth
              margin="normal"
              {...register("username", { required: "必須入力です。" })}
              error={Boolean(errors.username)}
              helperText={errors.username?.message?.toString() || ""}
            />
            <TextField
              type="password"
              id="password"
              variant="filled"
              label="パスワード（必須）"
              autoComplete="current-password"
              fullWidth
              margin="normal"
              {...register("password", {
                required: "必須入力です。",
                minLength: {
                  value: 8,
                  message: "8文字以上の文字列にしてください。",
                },
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message?.toString() || ""}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              ログイン
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
```

❷の中のpost先のURLでトークンを生成するAPIを指定しています。ここで1つ疑問が湧きます。この画面からしていしているURLは/api/inventory/loginとなっており、実際にはhttp://localhost:3000/api/inventory/login に対してリクエストが送られるようになっています。

そのため、ポート番号が異なっておりバックエンドでAPIを叩くためのURL（http://localhost:8000/api/inventory/login ）と一致していません。

#### STEP 2：ログイン画面からログインできるか確認する

ブラウザのURLにhttp://localhost:3000/login/を入力し、ログイン画面を開いてください。

ログイン情報となるユーザー・パスワードには「6-8-2 認証処理の実装」で登録したログイン情報を入力してください。入力後にログインボタンを押してみましょう。一覧画面へ遷移したでしょうか。

#### STEP 3：ログイン画面のフロントエンドとバックエンドのリクエストフローを確認する

本当に認証のAPIが実行された後に画面遷移が行われているか開発者モードを使って確認してみましょう。ブラウザにログイン画面を開いている状態で、キーボードのF12を押しデベロッパーツールの開発者モードを開いてください。

次にデベロッパーツールのNetworkタブをクリックしてください。これで、ブラウザのリクエストとレスポンスが確認できるようになります。

それではもう一度ログイン操作を行い、どのようなリクエストが行われたかURLを見てみてください。どんなリクエストが流れているでしょうか。

おそらくhttp://localhost:3000/api/inventory/login になっていることでしょう。

一方、Djangoのログを見てみてください。ログインAPIが実行されていることが確認できます。

図7-9-1のようなイメージです。

![](media/image1.png)

*図7-9-1　画面とAPIの対応関係*

### 7-9-2 参照系機能のつなぎ込み

#### 参照系API

#### STEP 1：商品一覧画面に参照系APIを実装する

次は商品一覧と商品在庫画面、それぞれにDBから取得した値を表示させます。先ほどのコードにREST APIを実行するコードを追加します。

コード7-9-3 商品一覧（app/inventory/products/page.tsx）

```typescript
"use client";

import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import type { AlertColor } from "@mui/material";

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
} from "@mui/material";

import axios from "axios";

import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";

type FormInput = {
  name: string;
  price: number | string;
  description: string;
};

type ProductData = {
  id: number | null;
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
  } = useForm<FormInput>();

  // 読込データを保持
  const [data, setData] = useState<Array<ProductData>>([]);

  const [open, setOpen] = useState(false);

  const [severity, setSeverity] = useState<AlertColor>("success");

  const [message, setMessage] = useState("");

  const result = (severity: AlertColor, message: string) => {
    setOpen(true);
    setSeverity(severity);
    setMessage(message);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/inventory/products/");
      setData(response.data);
    } catch (error) {
      console.error("商品データの取得に失敗しました:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [id, setId] = useState<number | null>(0);

  // submit時のactionを分岐させる
  const [action, setAction] = useState<string>("");

  const onSubmit = (event: FormInput): void => {
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
  const handleShowNewRow = () => {
    console.log("handleShowNewRow");
    setId(null);
    reset({
      name: "",
      price: "0",
      description: "",
    });
  };

  const handleAddCancel = () => {
    console.log("handleAddCancel");
    setId(0);
  };

  const handleAdd = (data: ProductData) => {
    console.log("handleAdd", data);
    result("success", "商品が登録されました");
    setId(0);
  };

  // 更新・削除処理、更新・削除行の表示状態を保持
  const handleEditRow = (id: number | null) => {
    console.log("handleEditRow", id);
    const selectedProduct: ProductData = data.find(
      (v) => v.id === id
    ) as ProductData;
    setId(selectedProduct.id);
    reset({
      name: selectedProduct.name,
      price: selectedProduct.price,
      description: selectedProduct.description,
    });
  };

  const handleEditCancel = () => {
    console.log("handleEditCancel");
    setId(0);
  };

  const handleEdit = (data: ProductData) => {
    console.log("handleEdit", data);
    result("success", "商品が更新されました");
    setId(0);
  };

  const handleDelete = (id: number) => {
    console.log("handleDelete", id);
    result("success", "商品が削除されました");
    setId(0);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      <Typography variant="h5">商品一覧</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleShowNewRow()}
      >
        商品を追加する
      </Button>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ height: 400, width: "100%" }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>商品ID</TableCell>
                <TableCell>商品名</TableCell>
                <TableCell>単価</TableCell>
                <TableCell>説明</TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {id === null ? (
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <TextField
                      type="text"
                      id="name"
                      {...register("name", {
                        required: "必須入力です。",
                        maxLength: {
                          value: 100,
                          message: "100文字以内の商品名を入力してください。",
                        },
                      })}
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message?.toString() || ""}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      id="price"
                      {...register("price", {
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
                      helperText={errors.price?.message?.toString() || ""}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      id="description"
                      {...register("description")}
                    />
                  </TableCell>
                  <TableCell />
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => handleAddCancel()}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={() => setAction("add")}
                    >
                      登録する
                    </Button>
                  </TableCell>
                </TableRow>
              ) : null}
              {data.map((data: ProductData) =>
                id === data.id ? (
                  <TableRow key={data.id}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>
                      <input
                        type="text"
                        id="name"
                        {...register("name", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                      {errors.name && (
                        <div>100文字以内の商品名を入力してください</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        id="price"
                        {...register("price", { min: 1, max: 99999999 })}
                      />
                      {errors.price && (
                        <div>1から99999999の数値を入力してください</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        id="description"
                        {...register("description")}
                      />
                    </TableCell>
                    <TableCell />
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => handleEditCancel()}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => setAction("update")}
                      >
                        更新する
                      </Button>
                      <IconButton
                        aria-label="削除する"
                        type="submit"
                        color="warning"
                        onClick={() => setAction("delete")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={data.id}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.price}</TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>
                      <Link href={`/inventory/products/${data.id}`}>
                        在庫処理
                      </Link>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="編集する"
                        color="primary"
                        onClick={() => handleEditRow(data.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
```

#### STEP 2：商品在庫画面に参照系APIを実装する

コード7-9-4 商品在庫（app/inventory/products/[id]/page.tsx）

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
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";

import { useParams } from "next/navigation";

import { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";

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
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // 読込データを保持
  const [product, setProduct] = useState<ProductData>({
    id: 0,
    name: "",
    price: 0,
    description: "",
  });

  const [data, setData] = useState<Array<InventoryData>>([]);

  // submit時のactionを分岐させる
  const [action, setAction] = useState<string>("");

  const [open, setOpen] = useState(false);

  const [severity, setSeverity] = useState<AlertColor>("success");

  const [message, setMessage] = useState("");

  const result = (severity: AlertColor, message: string) => {
    setOpen(true);
    setSeverity(severity);
    setMessage(message);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = useCallback(async () => {
    try {
      const [productResponse, inventoryResponse] = await Promise.all([
        axios.get(`/api/inventory/products/${id}`),
        axios.get(`/api/inventory/inventories/${id}`),
      ]);

      setProduct(productResponse.data);

      const inventoryData: InventoryData[] = [];

      let key: number = 1;

      let inventory: number = 0;

      inventoryResponse.data.forEach((e: InventoryData) => {
        // 売るときは在庫数から引く
        inventory += Number(e.type) === 1 ? e.quantity : e.quantity * -1;

        const newElement = {
          id: key++,
          type: e.type,
          date: e.date,
          unit: e.unit,
          quantity: e.quantity,
          price: e.unit * e.quantity,
          inventory: inventory,
        };

        inventoryData.unshift(newElement);
      });

      setData(inventoryData);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = (event: FormData): void => {
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
  const handlePurchase = (data: FormData) => {
    result("success", "商品を仕入れました");
    console.log("handlePurchase", data);
  };

  const handleSell = (data: FormData) => {
    result("success", "商品を卸しました");
    console.log("handleSell", data);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      <Typography variant="h5">商品在庫管理</Typography>
      <Typography variant="h6">在庫処理</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <TextField
            disabled
            fullWidth
            id="name"
            label="商品名"
            variant="filled"
            value={product.name}
          />
        </Box>
        <Box>
          <TextField
            type="number"
            id="quantity"
            variant="filled"
            label="数量"
            {...register("quantity", {
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
            helperText={errors.quantity?.message?.toString() || ""}
          />
        </Box>
        <Button
          variant="contained"
          type="submit"
          onClick={() => setAction("purchase")}
        >
          商品を仕入れる
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => setAction("sell")}
        >
          商品を卸す
        </Button>
      </Box>
      <Typography variant="h6">在庫履歴</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>処理種別</TableCell>
              <TableCell>処理日時</TableCell>
              <TableCell>単価</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>価格</TableCell>
              <TableCell>在庫数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data: InventoryData) => (
              <TableRow key={data.id}>
                <TableCell>{data.type}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.unit}</TableCell>
                <TableCell>{data.quantity}</TableCell>
                <TableCell>{data.price}</TableCell>
                <TableCell>{data.inventory}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
```

#### STEP 2：DBの値が表示されているか確認する

今度は第5章とは異なり、DBに登録したデータが表示されたでしょうか。こちらは先ほどのログイン画面と異なり、ボタンイベントに紐づいてAPIが実行されるのではなく、画面読み込み時に処理が実行されています。またaxiosの第二引数にopenという引数が指定されている点が大きく異なります。

```javascript
const [open, setOpen] = useState(false);
```

ステートの`open`が更新されると、useEffectで指定している`open`も更新されます。そして、再度useEffectの処理が実行され、結果的に更新されたデータが再描画されます。

### 7-9-3 更新系機能のつなぎ込み

参照系APIが完了したので、今度は更新系APIのつなぎ込みも行います。今回は、商品一覧には登録と更新、削除ボタン、商品在庫には仕入れと卸しボタンがあるため、それぞれの更新機能をつなぎ込みます。

#### STEP 1：商品一覧画面に新規登録処理を実装する

まずは新規登録処理から実装しましょう。この処理は画面イメージの通り、一覧画面から行います。入力欄と登録ボタンを追加して、イベントに登録APIを紐づけてみます。

コード7-9-5 商品一覧（app/inventory/products/page.tsx）

```typescript
const handleAdd = (data: ProductData) => {
  axios
    .post("/api/inventory/products/", data)
    .then(() => {
      result("success", "商品が登録されました");
      // 商品追加成功後にデータを再取得
      fetchData();
      setId(0);
      reset({
        name: "",
        price: "0",
        description: "",
      });
    })
    .catch((error) => {
      console.error("商品の登録に失敗しました:", error);
      result("error", "商品の登録に失敗しました");
    });
};
```

さっそく動作を確認してみましょう。新たに登録したデータが一覧に追加されたでしょうか。

#### STEP 2：商品一覧画面に更新処理を実装する

次はこちらのデータを更新してみましょう。

コード7-9-6 商品一覧（app/inventory/products/page.tsx）

```typescript
const handleEdit = (data: ProductData) => {
  axios
    .put(`/api/inventory/products/${data.id}/`, data)
    .then(() => {
      result("success", "商品が更新されました");
      // 商品更新成功後にデータを再取得
      fetchData();
      setId(0);
    })
    .catch((error) => {
      console.error("商品の更新に失敗しました:", error);
      result("error", "商品の更新に失敗しました");
    });
};
```

一覧の表示も変わったでしょうか。

#### STEP 3：商品一覧画面に削除処理を実装する

では最後に削除処理です。

コード7-9-7 商品一覧（app/inventory/products/page.tsx）

```typescript
const handleDelete = (id: number) => {
  axios
    .delete(`/api/inventory/products/${id}/`)
    .then(() => {
      result("success", "商品が削除されました");
      // 商品削除成功後にデータを再取得
      fetchData();
      setId(0);
    })
    .catch((error) => {
      console.error("商品の削除に失敗しました:", error);
      result("error", "商品の削除に失敗しました");
    });
};
```

ここでaxiosについてもう少し深堀します。このライブラリが何をやっているかわからないと他のライブラリに置き換えるときや、自前で同様の動作を実装しようとしたときに困ってしまうからです。まずaxiosは何をやってくれているのでしょうか。公式のドキュメントでは、次のような特徴が挙げられます[^注1]。

[^注1]: https://github.com/axios/axios#features

- ブラウザからXMLHttpRequest を作成する

- Node.jsからhttpリクエストを行う

- Promise APIをサポート

- リクエストとレスポンスをインターセプトする

- リクエストとレスポンスのデータを変換する

- リクエストのキャンセル

- JSONデータの自動変換

- データオブジェクトの自動シリアル化multipart/form-dataと7-www-form-urlencoded本体エンコーディング

- XSRFから保護するためのクライアント側のサポート

この中で、実装の際にポイントになるところは次のような点です。

- Promise APIをサポート

- リクエストとレスポンスをインターセプトする

- リクエストとレスポンスのデータを変換する

- JSONデータの自動変換

まずはXMLHttpRequestから見ていきましょう。これはJavaScript を使ってブラウザと WEB サーバー間でデータの送受信を行う際に利用できるオブジェクトです。この中にはHTTPRequestのパラメーターやResposeのデータが入っています。これにより、バックエンドとなるAPIサーバーとのやり取りが実現します。

次にPromiseです。これは非同期通信を処理するためのオブジェクトです。Promiseがベースとなっているので、async awaitを使用することができます。インターセプトはリクエストやレスポンスの前後に共通の処理を挟み込みたい場合に使用します。

次はデータの変換です。バックエンドではシリアライザーを利用してjson形式からオブジェクトへの変換を行っていました。フロントエンドではaxiosがこの変換を担います。

![](media/image3.png)

*図7-9-2　画面とAPIの対応関係の詳細*

このようにライブラリを導入することで、アプリケーションの様々な機能の実装を省略できます。導入するライブラリの選定の1つとして考えてみてください。

#### STEP 4：商品在庫画面に仕入れ・卸し処理を実装する

残りの商品在庫の更新処理も追加していきましょう。

コード7-9-8 商品在庫（app/inventory/products/[id]/page.tsx）

```typescript
// 仕入れ・卸し処理
const handlePurchase = (data: FormData) => {
  const purchase = {
    quantity: data.quantity,
    purchase_date: new Date(),
    product: data.id,
  };

  axios
    .post("/api/inventory/purchases/", purchase)
    .then(() => {
      result("success", "商品を仕入れました");
      // 仕入れ処理成功後にデータを再取得とフォームリセット
      fetchData();
      reset({ quantity: 0 });
    })
    .catch((error) => {
      console.error("仕入れ処理に失敗しました:", error);
      result("error", "仕入れ処理に失敗しました");
    });
};

const handleSale = (data: FormData) => {
  axios
    .post("/api/inventory/sales/", sale)
    .then(() => {
      result("success", "商品を卸しました");
      // 卸し処理成功後にデータを再取得とフォームリセット
      fetchData();
      reset({ quantity: 0 });
    })
    .catch((error) => {
      console.error("卸し処理に失敗しました:", error);
      result("error", "卸し処理に失敗しました");
    });
};
```

商品一覧と異なり、登録用のメソッドが受け取った引数❶をAPIにそのまま登録用のパラメーターとして渡していません。❷で現在の日時と商品IDを入れ直してから、渡しています。

### 7-9-4 再認証処理のつなぎ込み

それでは認証処理も連携させていきましょう。ログイン時のトークン周りの処理はバックエンド側に寄せてあるため、リトライの処理を実装します。次のような処理になります。

- リクエストに成功したら、何も行わない

- リクエストに失敗したら、リフレッシュトークンを取得し、アクセストークンの更新を行う

- アクセストークンの更新に成功したら、再度失敗したAPIリクエストを実行する

- アクセストークンの更新に失敗したら、APIリクエストは実行しない

- 再度APIリクエストの実行に失敗したら、処理を終了する

- その他処理に失敗したらログイン画面にリダイレクトさせる

#### STEP 1：HTTPクライアント（axios）に再認証処理を実装する

ではさっそく実装してみましょう。frontendフォルダの直下にpluginsフォルダを作成し、その中にaxios.tsファイルを作成してください。そしてコード7-9-9の内容を追加してください。

コード7-9-9 HTTP クライアント（plugins/axios.ts）

```typescript
import axios from "axios";

const axios_instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axios_instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axios_instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalConfig.retry
    ) {
      // 認証エラーの場合は、リフレッシュトークンを使ってリトライ
      originalConfig.retry = true;

      // 以下の場合はリトライしない
      // ログイン処理の場合
      if (originalConfig.url === "/api/inventory/login") {
        return Promise.reject(error);
      }

      return axios_instance
        .post("/api/inventory/retry", { refresh: "" })
        .then(() => {
          return axios_instance(originalConfig);
        })
        .catch((error) => Promise.reject(error));
    } else if (error.response && error.response.status !== 422) {
      // 認証エラーまたは業務エラー以外の場合は、適切な画面に遷移
      window.location.href = "/login";
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios_instance;
```

#### STEP 1-1：axiosインスタンスの作成とヘッダー設定

また各画面でこの再認証できるようにカスタマイズしたaxiosを使用するように修正します。

コード7-9-10 ログイン画面（app/login/page.tsx）

```typescript
import {
  Box,
  Button,
  Container,
  CssBaseline,
  createTheme,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import axios from "@/plugins/axios";
```

コード7-9-11 商品一覧（app/inventory/products/page.tsx）

```typescript
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import type { AlertColor } from "@mui/material";

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
} from "@mui/material";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import axios from "@/plugins/axios";
```

コード7-9-12 商品在庫（app/inventory/products/[id]/page.tsx）

```typescript
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
  TextField,
  Typography,
} from "@mui/material";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import axios from "@/plugins/axios";
```

バックエンドでの認証に成功した場合、accessトークンとrefreshトークンをcookieにセットしたレスポンスを取得できます。また、cookieへのセットや削除はバックエンドへの認証処理に任せているため、フロントエンドでは実装していません。これは、ReactやNext.jsではなく、あくまでaxiosの機能の説明になるので気をつけてください。ReactやNext.jsに限らず今回axiosで実装した内容は使用できます。

![](media/image2.png)

*図7-9-3　フロントエンドで使用する技術要素の関係図*

まず①のaxios.createでリクエスト実行時に使用するaxiosオブジェクトを生成しています。オブジェクトの生成時にデフォルトの設定として、コンテンツタイプを指定しています。他にもベースURLなど様々なデフォルト値を設定することができます。今回URL関連の処理は、Next.jsのrewrite処理に任せているため、axiosでは指定していません。

#### STEP 1-2：リクエストインターセプターの設定

次に、②のリクエスト送信前と③のレスポンス取得後に対するインターセプトの設定をする場所があります。

```typescript
axios_instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);
```

リクエスト送信前はデフォルトの記述で、特に何もしていません。

```typescript
axios_instance.interceptors.response.use(
  (response) => response,
  (error) => {
```

#### STEP 1-3：レスポンスインターセプターの設定

レスポンス取得後は成功の場合はそのまま処理を継続し、失敗の場合はその状態に応じて④以降のリトライ処理を実施します。

```typescript
if (
  error.response &&
  error.response.status === 401 &&
  !originalConfig.retry
) {
```

認証エラーの場合のみリトライしたいので、認証失敗時に返ってくるHTTPStatusコード：401かつ、初回の認証失敗時のみという条件にしています。また初回かどうかを判定するために、レスポンスのエラーに含まれていたconfigオブジェクトを取得し、retryプロパティを追加しています。

```typescript
if (originalConfig.url === "/api/inventory/login") {
  return Promise.reject(error);
}
```

また、ログインをするAPIについてはリトライをしても同じなのでリトライ対象から除外しています。

```typescript
return axios_instance
  .post("/api/inventory/retry", { refresh: "" })
  .then(() => {
    return axios_instance(originalConfig);
  })
  .catch((error) => Promise.reject(error));
```

リトライ対象として問題がなければ、リトライAPIを実行します。パラメーターにはrefleshトークンを指定するようになっていますが、実際には空を渡しています。これは問題ないのでしょうか。実はコード7-8-11で実装した通り、refleshトークンはリクエストが持っているcookieをバックエンドで取り出して使用するので、パラメーターとしては指定する必要のない作りにしています。そのため空で渡しています。リトライAPIの処理に成功すればthen側の処理に進み、axios_instance(originalConfig)で再度originalConfigの内容に基づいて、リクエストを送信します。本当にリトライされて、再度同じAPIが実行されるか試してみましょう。

#### STEP 3：アクセストークンの有効期限を短く設定する

ログイン後に一定時間が経過し、accessトークンの有効期限が失効した、という想定で動作確認してみます。まず、事前準備として早くaccessトークンが失効するように、次のコードを変更してみましょう。

コード7-9-13 共通設定ファイル（config/settings.py）

```python
SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer",),
    'ACCESS_TOKEN_LIFETIME': datetime.timedelta(minutes=1), # 15 → 1分に変更
    'REFRESH_TOKEN_LIFETIME': datetime.timedelta(days=30),
```

#### STEP 4：再認証処理の動作を検証する

http://localhost:3000/loginからログインしてください。

ログイン後に商品一覧画面が表示されます。1分待ってから、画面をリロードしてみてください。リトライ処理を導入する前であれば、認証に失敗し再度ログイン画面に遷移しますが、今回は認証失敗してもrefreshトークンによりaccessトークンが再取得され、そのトークンにより認証を行うことができました。

フロントエンドとバックエンドで連携することはできたでしょうか。このつなぎ込みをしていく過程で、フロントエンドはあくまで処理を呼んで画面を描画する役割で、処理の中核になる部分はバックエンド側にまとまっていることが実感できたと思います。

## 7-x Gitに作業状態を残す

### x.y.z Githubへの登録

#### Step フロントエンドの初期状態をローカルのgitに保存する

ここまで実行できたでしょうか。問題なければ、いったんこの状態を保存するためにgithubに開発状態を連携したいと思います。

##### コマンドプロンプト（Ubuntu）

```bash
cd /usr/local/src/dev/<REPO>
git add .
git commit -m "6章終了時点"
```

#### Step ローカルのgitの状態をgithubに連携する

以下のコマンドを実行してください。

##### コマンドプロンプト（Ubuntu）

```bash
git push origin main
```

```
Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
Delta compression using up to 8 threads
Compressing objects: 24/24), done.
Writing objects: (25/25), 76.02 KiB | 8.45 MiB/s, done.
Total 25 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/keiji-ueno/wfswd02.git
 * [new branch] main -> main
```

## 7-10 本章のハンズオンチェック

以下の内容を実施できたでしょうか。問題がなければまとめの内容を確認して、次の章に進んでください。

✅ DRFの認証機能を利用してDjangoに認証機能を組み込む

✅ デフォルトの認証機能をカスタマイズし、リクエスト時に認証が必要になるようにする

✅ バックエンド環境の認証実装をGithubのリポジトリに保存する

## 7-x 本章のまとめ

本章では、これまでの章で個別に構築してきたフロントエンドとバックエンドの要素を連携させ、一つの完成されたアプリケーションとしての動作を実現しました。

具体的にはこのハンズオンを通して、以下の考え方と実装手法を習得しました。

- フルスタック連携の全体像: フロントエンド（Next.js/React）とバックエンド（Django/DRF）がAPIを介してどのようにデータをやり取りし、ユーザーの操作を実現するのか、その全体的なフローを理解しました。

- ログイン・認証機能の完全連携: 第4章で構築したログイン画面と、第6章で実装したバックエンドの認証API（JWTベース）を連携させ、ユーザーが実際にログインできる堅牢な認証フローを完成させました。これにより、セキュリティとユーザー管理の基盤が確立されました。

- CRUD操作のフロントエンド連携: 第5章で実装したバックエンドの参照、登録、更新、削除（CRUD）APIを、フロントエンドの各画面（商品一覧、商品在庫）に統合しました。これにより、ユーザーの入力や操作がリアルタイムにデータベースに反映される動的なアプリケーションが実現しました。

- HTTPクライアントの活用と再認証メカニズム: axiosというHTTPクライアントライブラリを導入し、API通信を効率化しました。特に、JWTのライフサイクルに対応するため、アクセストークン失効時にリフレッシュトークンを用いて自動的に再認証を行う「インターセプター」の仕組みを実装し、ユーザーエクスペリエンスを向上させました。

本章で得たシステム連携の知識とスキルは、フルスタック開発の核心とも言える部分です。フロントエンドとバックエンドが密接に連携することで、単なる画面表示やデータ処理に留まらない、よりリッチでインタラクティブなWebアプリケーションが構築できることを実感できたでしょう。

本章までで基本的なシステム開発の考え方が身に付いたと思います。次章以降では、これまでの応用・実践編として、実プロジェクトにおける要件や仕様の実装に挑戦していきます。特に、フルスタック開発を選択する大きな理由となる「非同期処理」と「バッチ処理」のテーマに進みます。本章で身につけた連携の知識を土台として、さらに高度なアプリケーション開発へとステップアップしていきましょう。
