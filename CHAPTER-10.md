# 第10章 はじめに

（前章の概要と学んだ内容の振返り）（本章の概要と学ぶ内容の頭出し）（本章のハンズオン内容の概要）

## 10-1 はじめに

### 10-1-1 本章の目的と概要

#### 本章で達成できること

（本章で達成できることの内容）

#### なぜ（本章の技術的要素）が必要なのか？

（本章の技術的要素が必要なことについての内容）

### 10-1-2 開発環境の準備

本章を開始するにあたって、第XX章のハンズオンが完了し、以下の環境が整っていることを前提とします。

- （前章の完了条件１）
- （前章の完了条件２）
- （前章の完了条件・・・）

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未設定の箇所があればXX章に戻り、設定を見直してください。

### 10-1-3 この章からハンズオンを始める場合

XX章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませて置いてください。

また、本章から始めたいという方は以下のリポジトリをクローンもしくはフォークして初めて見てください。

`# クローン or フォークコマンド`

フォークが完了したら以下の操作でDockerコンテナを立ち上げてみてください。

`# DevContainorの展開`

`# npmインストールとNext.jsの起動コマンド`

本章以降は読者の理解度に合わせて好きな章からハンズオンを開始することができます。また、学習をはじめからやり直したいときなどご利用ください。

この章から新規にハンズオンを始める場合は以下のURLのリポジトリをクローンして始めてください。

[https://xxxx](https://xxxx)

クローンおよび開発環境の構築手順は、X章Y項を参考にしてください。

### 10-1-4 （第X章のテーマ）に関する基礎知識

本章では（技術的要素１）で構成された（技術的要素２）である（技術的要素３）を使ってハンズオン行います。そのため、（技術的要素３）で開発をする場合、最低限の（技術的要素１）の知識が必要になります。そこで、まずはこの章を読み進めていく上で必要な（技術的要素１）の知識を振り返っておきましょう。（技術的要素１）について基本的な知識を持っている、という方は読み飛ばしても構いません。

#### （技術的要素１）に関する説明トピック

（技術的要素１）に関する説明トピックの内容

## 10-2 テストとは？テストの必要性

この章では、Webアプリケーションの品質を支える「テスト」について学んでいきます。「テスト」と聞くと、少し面倒なイメージや、難しそうな印象を持つかもしれません。しかし、この章を読み終える頃には、テストが開発者の強力な味方であり、安心して開発を進めるための「お守り」のような存在であることがきっと理解できるはずです。

### 10-2-1 テストとは？

あなたは料理を作るとき、完成する前に一度「味見」をしませんか？「塩は足りているか」「火は通り過ぎていないか」などを確認しますよね。

プログラムにおけるテストも、この「味見」と非常によく似ています。一言でいえば、**「自分の書いたプログラムが、思った通りに正しく動くかを確認する作業」**のことです。

例えば、ECサイトの「合計金額を計算する機能」を作ったとします。

- 100円の商品を2つカートに入れたら、合計金額は200円になるか？
- 消費税10%が正しく加算されているか？
- 送料無料の条件を満たしたら、送料が0円になっているか？

こうした様々なケースを想定し、一つひとつ「うん、ちゃんと動いているね」と確認していく。これがテストの基本的な考え方です。

### 10-2-2 なぜテストは必要なのか？

「ちゃんと考えてコードを書いたし、いくつか手で動かして確認したから大丈夫だよ」 そう思う気持ちもよく分かります。しかし、テストがない開発には、実はいくつかの「見えない恐怖」が潜んでいます。

**その1：小さな修正がすべてを壊す「ドミノ倒し」**

- アプリケーションが大きくなるにつれて、機能と機能は複雑に絡み合っていきます。ある日、ほんの小さな修正を加えたとします。その時は問題なく動いているように見えても、実はその修正が、まったく関係ないと思っていた別の機能を壊してしまうことがあるのです。
- テストがなければ、この「副作用」に気づくことができず、ユーザーが使う段階になって初めて重大なバグが発覚する...という事態になりかねません。

**その2：半年後の自分は「他人」**

- あなたが今日書いたコードの意図を、半年後のあなたは完璧に覚えているでしょうか？おそらく、多くの部分を忘れてしまっているはずです。
- いざ機能を追加・修正しようにも、「このコードを触ったら、どこに影響が出るか分からない...怖い...」と感じ、変更を加えるのが億劫になってしまいます。結果として、コードは改善されないまま放置され、どんどん複雑で触りにくいものになっていきます。

**その3：終わらない「手動確認」地獄**

- テストを書かない場合、機能を追加したり修正したりするたびに、アプリケーションの全機能を最初から手でポチポチと操作して、問題がないかを確認しなければなりません。
- 最初は数分で終わるかもしれませんが、機能が増えれば増えるほど、この確認作業は膨大な時間のかかる苦行へと変わっていきます。

### 10-2-3 テストがあった世界

こうした恐怖から私たちを解放してくれるのがテストです。テストを書くことは、単にバグを見つけるだけなく、開発者にとってたくさんの嬉しいメリットをもたらしてくれます。

**その１：未来の自分を助ける「お守り」になる**

- テストコードは、一度書いてしまえば、あとはコマンド一つで一瞬にしてすべてのチェックを実行してくれます。
- コードを修正したあと、テストを実行するだけで、意図しない影響（デグレ）が出ていないかを自動で知らせてくれます。これはいわば、未来の自分への「お守り」です。このお守りがあるおかげで、私たちは「この修正は大丈夫かな...」という不安から解放され、自信を持って大胆にコードの改善（リファクタリング）や機能追加に挑戦できるようになります。

**その2：「動く仕様書」になる**

- 良いテストコードは、そのプログラムが「何を目的とし、どのような動きを期待されているのか」を雄弁に物語ります。
- 例えば、「test_送料無料の条件を満たすと合計金額から送料が引かれること」というテストがあれば、それを見るだけで「ああ、この機能には送料無料のロジックがあるんだな」と誰でも理解できます。文章で書かれた仕様書と違い、**テストコードは常に実際のコードの動きと一致するため、最も信頼できる「動く仕様書」**として機能するのです。

**その3：品質への自信が生まれる**

- 全てのテストが通っている状態（よく「グリーンな状態」と言います）は、「アプリケーションの主要な機能は、少なくとも期待通りに動いている」という何よりの証拠です。
- この**「テストが通っているから大丈夫」という自信**は、アプリケーションをリリースする際の精神的な安定につながり、ユーザーに安心してサービスを使ってもらうための第一歩となります。

## 10-3 テストの種類と全体像

さて、「テストを書こう！」と決意したところで、次の疑問が湧いてくるかもしれません。「一体どんなテストを書けばいいんだろう？」と。

実は、「テスト」と一言でいっても、その目的や確認する範囲によっていくつかの種類に分かれています。これらをバランス良く組み合わせることが、品質の高いアプリケーションを作る鍵となります。

そのバランスを示す考え方として、**「テストピラミッド」**という有名なモデルがあります。

このピラミッドは、下にいくほど「数が多く、実行が速く、コストが安い」テストを、上にいくほど「数が少なく、実行が遅く、コストが高い」テストを表しています。

それでは、ピラミッドの各層が何を表しているのか、家づくりに例えながら見ていきましょう。

### 10-3-1 テストの種類

アプリケーション開発におけるテストは、**目的**や**対象範囲**によって多くの種類に分けられます。

以下に、代表的なテストの種類を体系的に整理して紹介します。

- **単体テスト（Unit Test）**
  - **目的**：個々のモジュールや関数・メソッドが仕様通りに動作するかを検証する。
  - **対象**：プログラムの最小単位（例：クラス、関数、コンポーネント）。
  - **実施タイミング**：開発初期（実装直後）。
  - **ツール例**：
    - JavaScript：Jest、Mocha
    - Java：JUnit
    - Python：pytest、unittest

- **結合テスト（Integration Test）**
  - **目的**：複数のモジュールを組み合わせたときに、正しく連携して動作するかを検証する。
  - **対象**：API ⇄ DB、フロント ⇄ バックエンド などの連携部分。
  - **実施タイミング**：単体テストの後。
  - **ツール例**：
    - Postman、Cypress、JUnit（統合テスト）

- **システムテスト（System Test）**
  - **目的**：完成したアプリ全体が仕様通りに動作するかを検証する。
  - **対象**：アプリ全体（本番に近い環境）。
  - **実施タイミング**：結合テストの後、リリース前。
  - **ツール例**：
    - Selenium、Playwright、Cypress

- **受け入れテスト（Acceptance Test / UAT）**
  - **目的**：ユーザーや顧客が求める要件を満たしているかを検証する。
  - **対象**：ユーザー視点のシナリオ全体。
  - **実施タイミング**：本番リリース直前。
  - **ツール例**：
    - Cucumber（BDD）、TestRail など

- **その他**
  - 回帰テスト（Regression Test）、パフォーマンステスト、セキュリティテスト、ユーザビリティテスト、静的テスト、他。

いかがでしたでしょうか。この解説で、読者は各テストの役割分担と、なぜユニットテストから学ぶべきなのかをスムーズに理解できるかと思います。

## 10-4 フロントエンドのテスト

### 10-4-1 テスト対象のロジック解説 (plugins/axios.ts)

#### STEP: テストする内容を整理する

**テスト対象**

**Frontend** `plugins/axios.ts`

```typescript
import axios from "axios";

const axios_instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

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

      // ログイン処理の場合はリトライしない
      if (originalConfig.url === "/api/inventory/login/") {
        return Promise.reject(error);
      }

      // リトライAPI自体の401エラーでの無限ループを防ぐ
      if (originalConfig.url === "/api/inventory/retry/") {
        window.location.href = "/login";
        return Promise.resolve(undefined);
      }

      return axios_instance
        .post("/api/inventory/retry/")
        .then(() => {
          return axios_instance(originalConfig);
        })
        .catch(() => {
          // リトライ自体が失敗した場合は強制的にリダイレクト
          window.location.href = "/login";
          // 確実に処理を終了させるため Promise.resolve で undefined を返す
          return Promise.resolve(undefined);
        });
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

`plugins/axios.ts` は、認証エラーが出たときに自動でリトライ or ログイン画面に飛ばすことで、アプリ全体の API エラーハンドリングを一元化することを目的とした機能になります。

**通常のレスポンス（200 など）**

そのまま呼び出し元に返す。特別な処理はしない。

**401 Unauthorized（認証エラー）のとき**

まず、`originalConfig.retry` フラグをチェックして「再試行中ではない」ことを確認。

- **ログインAPI（/api/inventory/login/）の401** は再試行しない為、そのままエラーとして呼び出し元に返す。
- **リトライAPI（/api/inventory/retry/）の401** は無限ループを防ぐ為、ログイン画面にリダイレクトする。
  それ以外のAPIでは、/api/inventory/retry/ にリクエストを送って認証の更新処理を行い、成功したら、元のリクエストを 1回だけ再試行。リトライ自体が失敗したらログイン画面にリダイレクトする。

**422 Unprocessable Entity（業務エラーなど）**

リダイレクトせず、そのままエラーを呼び出し元に返す。（例：フォームバリデーションエラーなど）

**その他のエラー（404, 500 など）**

ログイン画面（/login）にリダイレクト。

### 10-4-2 テスト環境のセットアップ

#### STEP: テストするための準備をする

**Frontend** `jest.config.js` **New**

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "plugins/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

module.exports = createJestConfig(customJestConfig);
```

`jest.config.js` は、**Jestがテストを実行するための全体的な設定を定義する**ファイルです。

`next/jest` を読み込むことで、Next.jsプロジェクトに最適化されたJestの基本設定（Babel連携やCSSモジュールの扱いなど）を自動的にセットアップしています。

`customJestConfig` では、プロジェクト固有の追加設定を定義しています。

- `setupFilesAfterEnv`: 各テストファイルが実行される**前**に必ず読み込むセットアップファイル（ここでは `jest.setup.js`）を指定しています。グローバルなモックなどはここに記述します。
- `testEnvironment`: テストを実行する環境を指定しています。`"node"` が指定されていますが、`"jsdom"` を指定するとブラウザに近い環境（`window` オブジェクトなど）がシミュレートされます。（※現状の設定は `"node"` ですが、`jest.setup.js` の内容を見ると `"jsdom"` の方が適している可能性があります）
- `collectCoverageFrom`: テストカバレッジ（テストがコードのどれくらいを網羅しているか）を計測する対象ファイルを指定しています。
- `testPathIgnorePatterns`: テスト対象から除外するディレクトリ（Next.jsのビルド成果物 `.next` など）を指定しています。

最後に `createJestConfig(customJestConfig)` を `module.exports` することで、Next.jsの基本設定とカスタム設定をマージしたものが、最終的なJestの設定として使われます。

**Frontend** `jest.setup.js` **New**

```javascript
// 既存の window / location を可能な限り引き継ぐ
const existingWindow = global.window ?? {};
const existingLocation = existingWindow.location ?? {};

// window を再定義（後で触れるよう writable に）
Object.defineProperty(global, "window", {
  value: {
    ...existingWindow,
    location: {
      ...existingLocation,
      href: "",
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
    },
  },
  writable: true,
});

// console.log, console.error のモック（テスト実行時のノイズを減らすため）
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};
```

`jest.setup.js` は、`jest.config.js` の `setupFilesAfterEnv` によって、**各テストが実行される直前に読み込まれるセットアップ用**のファイルです。

テスト全体で共通して必要な準備を行います。

**window.location のモック:**

テスト環境（特に `testEnvironment: "node"` の場合）には、ブラウザの `window` オブジェクトや `window.location`（URLの制御や画面遷移を行う機能）が存在しません。しかし、コンポーネントコード内では `window.location.href` を参照したり `window.location.assign`（画面遷移）を呼び出したりすることがあります。ここで `window.location` オブジェクトとそのメソッド（`assign` や `replace` など）を `jest.fn()` (Jestのモック関数) であらかじめ定義（モック）しておくことで、テスト実行時に「`window.location` がない」というエラーでテストが失敗するのを防ぎます。

**console.log / console.error のモック:**

テスト実行中に、コンポーネントやライブラリが `console.log` や `console.error`（意図的なデバッグ情報や、テスト上問題ない警告など）を出力することがあります。

これらがテスト結果のレポートに混じると、本当に重要な失敗（Fail）が見つけにくくなる（ノイズになる）ため、`jest.fn()` で出力を抑制し、テスト結果のコンソールをクリーンに保つために設定しています。

### 10-4-3 テストケースの実装と解説

#### STEP: 正常系のテストコードを作成する

まず正常系をテストしておくことで、「本来通るはずの処理が通る」ことを確認できます。

この確認があることで、エラー系テストの際に不具合の原因を素早く切り分けることができ、デバッグ効率も大幅に上がります。

**Frontend** `__tests__/plugins/axios.test.ts` **New**

```typescript
import MockAdapter from "axios-mock-adapter";
import axiosInstance from "@/plugins/axios";

describe("Axiosインスタンス - 認証インターセプター", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore(); // アダプタを解除（毎回 beforeEach で作り直す前提）
    jest.clearAllMocks(); // jest.fn() の呼び出し履歴だけをクリア
    window.location.href = ""; // リダイレクト検証後の後片付け
  });

  describe("基本的なHTTPリクエスト", () => {
    it("正常なGETリクエストが成功する", async () => {
      const responseData = { message: "success" };
      mock.onGet("/api/test").reply(200, responseData);

      const response = await axiosInstance.get("/api/test");

      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
    });

    it("正常なPOSTリクエストが成功する", async () => {
      const requestData = { name: "test" };
      const responseData = { id: 1, name: "test" };
      mock.onPost("/api/test", requestData).reply(201, responseData);

      const response = await axiosInstance.post("/api/test", requestData);

      expect(response.status).toBe(201);
      expect(response.data).toEqual(responseData);
    });
  });
});
```

#### STEP: テストを実行する

```bash
yarn test __tests__/plugins/axios.test.ts
```

```
 PASS __tests__/plugins/axios.test.ts (10.118 s)

Axiosインスタンス - 認証インターセプター

基本的なHTTPリクエスト

✓ 正常なGETリクエストが成功する (21 ms)

✓ 正常なPOSTリクエストが成功する (1 ms)
```

#### STEP: 認証エラーハンドリングのテストコードを作成する

次は「401が返ったときにどう振る舞うか」を段階的に検証します。ここでの目的は、自動リトライが一度だけ行われ、例外条件では正しくリダイレクト／rejectされることを保証することです。

テスト実装上のコツは、**axios-mock-adapterで呼び出し順を制御（replyOnce）しつつ、mock.historyを使ってどのエンドポイントが何回呼ばれたか**を検証すること。副作用については `window.location.href` を書き換え可能な形でモックし、**リダイレクトの有無**をはっきり観測します。これらをケースごとに小さなテストで積み上げれば、認証周りの挙動を安全に回帰テストできるようになります。

以下についてテストを作成します。

**認証エラー後の正常系**：
最初のリクエストが401 → /api/inventory/retry/を1回だけ呼ぶ → アクセス更新後に**元リクエストを1回だけ再実行**して成功。
→ 呼び出し回数（元リクエスト2回／retry 1回）を**回数で明示的に検証**し、無限ループがないことを示します。

**例外1（/loginはリトライしない）**：
/api/inventory/login/で401なら**リトライせずreject**。
→ /retryが呼ばれていないことも併せて確認します。

**例外2（/retry自体が失敗）**：
/api/inventory/retry/が401/5xxなら**/loginへリダイレクト**し、戻り値はundefinedで解決されることを確認します。
→ `window.location.href` をモックし、副作用を**検知できる形**にしておきます。

**再入防止（2回目401）**：
リトライ後の再試行でも401なら、`originalConfig.retry === true`が効いて**再試行せず**ログインへリダイレクト（undefined解決）。
→ /retryの呼び出しが**1回で止まっている**ことを確認します。

**Frontend** `__tests__/plugins/axios.test.ts`

```typescript
import MockAdapter from "axios-mock-adapter";
import axiosInstance from "@/plugins/axios";

describe("Axiosインスタンス - 認証インターセプター", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore(); // アダプタを解除（毎回 beforeEach で作り直す前提）
    jest.clearAllMocks(); // jest.fn() の呼び出し履歴だけをクリア
    window.location.href = ""; // リダイレクト検証後の後片付け
  });

  describe("基本的なHTTPリクエスト", () => {
    it("正常なGETリクエストが成功する", async () => {
      const responseData = { message: "success" };
      mock.onGet("/api/test").reply(200, responseData);

      const response = await axiosInstance.get("/api/test");

      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
    });

    it("正常なPOSTリクエストが成功する", async () => {
      const requestData = { name: "test" };
      const responseData = { id: 1, name: "test" };
      mock.onPost("/api/test", requestData).reply(201, responseData);

      const response = await axiosInstance.post("/api/test", requestData);

      expect(response.status).toBe(201);
      expect(response.data).toEqual(responseData);
    });
  });

  describe("認証エラー(401)のハンドリング", () => {
    it("401エラー時にリトライAPIを呼び出し、成功時は元のリクエストを再実行する", async () => {
      // 最初のリクエストで401、リトライで成功、元のリクエスト再実行で成功
      mock
        .onGet("/api/inventory/products/")
        .replyOnce(401)
        .onPost("/api/inventory/retry/")
        .replyOnce(200)
        .onGet("/api/inventory/products/")
        .replyOnce(200, { data: "success after retry" });

      const response = await axiosInstance.get("/api/inventory/products/");

      expect(response.status).toBe(200);
      expect(response.data.data).toBe("success after retry");

      // リトライAPIが呼ばれていることを確認
      const retryRequests = mock.history.post.filter(
        (req) => req.url === "/api/inventory/retry/"
      );

      expect(retryRequests).toHaveLength(1);
      // expect(JSON.parse(retryRequests[0].data)).toEqual({ refresh: "" });
    });

    it("ログインAPI(/api/inventory/login/)の401エラーはリトライしない", async () => {
      mock
        .onPost("/api/inventory/login/")
        .reply(401, { message: "Invalid credentials" });

      await expect(
        axiosInstance.post("/api/inventory/login/", {
          username: "test",
          password: "test",
        })
      ).rejects.toMatchObject({
        response: { status: 401 },
      });

      // リトライAPIが呼ばれていないことを確認
      const retryRequests = mock.history.post.filter(
        (req) => req.url === "/api/inventory/retry/"
      );

      expect(retryRequests).toHaveLength(0);
    });

    it("リトライAPI自体が失敗した場合、リダイレクトされる", async () => {
      mock
        .onGet("/api/test")
        .replyOnce(401)
        .onPost("/api/inventory/retry/")
        .replyOnce(500, { message: "Retry failed" });

      // 修正された実装では、リトライ失敗時に .catch() 内で強制的にリダイレクト
      // Promise.reject も実行されるが、実際の戻り値は undefined になる
      const result = await axiosInstance.get("/api/test");

      expect(result).toBeUndefined();
      expect(window.location.href).toBe("/login");

      // リトライAPIが呼ばれていることを確認
      const retryRequests = mock.history.post.filter(
        (req) => req.url === "/api/inventory/retry/"
      );

      expect(retryRequests).toHaveLength(1);
    });

    it("リトライAPIが401で失敗した場合もリダイレクトされる", async () => {
      mock
        .onGet("/api/test")
        .replyOnce(401)
        .onPost("/api/inventory/retry/")
        .reply(401, { message: "Retry failed" }); // 毎回401を返す

      // 修正された実装では、リトライ失敗時に .catch() 内で強制的にリダイレクト
      // ただし、複雑な処理により複数回リトライが発生する可能性がある
      const result = await axiosInstance.get("/api/test");

      expect(result).toBeUndefined();
      expect(window.location.href).toBe("/login");

      // リトライAPIが複数回呼ばれる可能性を考慮
      const retryRequests = mock.history.post.filter(
        (req) => req.url === "/api/inventory/retry/"
      );

      expect(retryRequests.length).toBeGreaterThanOrEqual(1);
    });

    it("401エラーが2回目の場合はリダイレクトされる", async () => {
      // 最初のリクエストで401、リトライ後の再リクエストでも401
      mock
        .onGet("/api/test")
        .replyOnce(401)
        .onPost("/api/inventory/retry/")
        .replyOnce(200)
        .onGet("/api/test")
        .replyOnce(401);

      // 実装では、2回目の401は originalConfig.retry=true のため、401として処理されず
      // else if 分岐でリダイレクトされる（明示的なreturnがないのでundefinedが返る）
      const result = await axiosInstance.get("/api/test");

      expect(result).toBeUndefined();
      expect(window.location.href).toBe("/login");

      // リトライAPIは1回のみ呼ばれることを確認
      const retryRequests = mock.history.post.filter(
        (req) => req.url === "/api/inventory/retry/"
      );

      expect(retryRequests).toHaveLength(1);
    });
  });

  describe("その他のエラーハンドリング", () => {
    it("422エラー(業務エラー)はリダイレクトしない", async () => {
      mock.onGet("/api/test").reply(422, {
        message: "バリデーションエラー",
        errors: { name: ["必須項目です"] },
      });

      await expect(axiosInstance.get("/api/test")).rejects.toMatchObject({
        response: { status: 422 },
      });

      // リダイレクトされていないことを確認
      expect(window.location.href).toBe("");
    });

    it("500エラーはログイン画面にリダイレクトし、undefinedを返す", async () => {
      mock.onGet("/api/test").reply(500, { message: "Internal Server Error" });

      // 実装では else if 分岐で window.location.href = "/login"; の後、
      // 明示的な return がないため undefined が返される
      const result = await axiosInstance.get("/api/test");

      expect(result).toBeUndefined();
      expect(window.location.href).toBe("/login");
    });

    it("404エラーはログイン画面にリダイレクトし、undefinedを返す", async () => {
      mock.onGet("/api/test").reply(404, { message: "Not Found" });

      // 実装では else if 分岐で window.location.href = "/login"; の後、
      // 明示的な return がないため undefined が返される
      const result = await axiosInstance.get("/api/test");

      expect(result).toBeUndefined();
      expect(window.location.href).toBe("/login");
    });

    it("ネットワークエラーでは else 分岐で Promise.reject される", async () => {
      mock.onGet("/api/test").networkError();

      // ネットワークエラーでは error.response が undefined になるため、
      // 最初の if も else if も満たさず、else { return Promise.reject(error); } に行く
      await expect(axiosInstance.get("/api/test")).rejects.toThrow();

      // リダイレクトされない（window.location.href は変更されない）
      expect(window.location.href).toBe("");
    });
  });

  describe("リクエストインターセプター", () => {
    it("デフォルトヘッダーが設定されている", () => {
      expect(axiosInstance.defaults.headers["Content-Type"]).toBe(
        "application/json"
      );
    });

    it("リクエストが正常に通過する", async () => {
      mock.onGet("/api/test").reply(200, { data: "test" });

      const response = await axiosInstance.get("/api/test");

      expect(response.status).toBe(200);
      expect(mock.history.get[0]?.headers?.["Content-Type"]).toBe(
        "application/json"
      );
    });

    it("multipart/form-dataでのファイルアップロード", async () => {
      const formData = new FormData();
      formData.append("file", new Blob(["test"], { type: "text/plain" }));

      mock
        .onPost("/api/inventory/sync/")
        .reply(200, { message: "File uploaded" });

      const response = await axiosInstance.post(
        "/api/inventory/sync/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.message).toBe("File uploaded");
    });
  });
});
```

```bash
yarn test __tests__/plugins/axios.test.ts
```

```
 PASS __tests__/plugins/axios.test.ts (10.118 s)

Axiosインスタンス - 認証インターセプター

基本的なHTTPリクエスト

✓ 正常なGETリクエストが成功する (21 ms)

✓ 正常なPOSTリクエストが成功する (1 ms)

認証エラー(401)のハンドリング

✓ 401エラー時にリトライAPIを呼び出し、成功時は元のリクエストを再実行する (14 ms)

✓ ログインAPI(/api/inventory/login/)の401エラーはリトライしない (131 ms)

✓ リトライAPI自体が失敗した場合、リダイレクトされる (6 ms)

✓ リトライAPIが401で失敗した場合もリダイレクトされる (3 ms)

✓ 401エラーが2回目の場合はリダイレクトされる (2 ms)

その他のエラーハンドリング

✓ 422エラー(業務エラー)はリダイレクトしない (2 ms)

✓ 500エラーはログイン画面にリダイレクトし、undefinedを返す (1 ms)

✓ 404エラーはログイン画面にリダイレクトし、undefinedを返す (1 ms)

✓ ネットワークエラーでは else 分岐で Promise.reject される (44 ms)

リクエストインターセプター

✓ デフォルトヘッダーが設定されている

✓ リクエストが正常に通過する

✓ multipart/form-dataでのファイルアップロード (1 ms)
```

## 10-5 バックエンドのテスト

### 10-5-1 テスト対象のロジック解説

#### STEP: テストする内容を整理する

**テスト対象**

**Backend** `api/inventory/view.py`

（中略）

```python
class SaleView(APIView):
    def post(self, request, format=None):
        """
        売上情報を登録する
        """
        serializer = SaleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 在庫が売る分の数量を超えないかチェック
        purchases = Purchase.objects.filter(
            product_id=request.data["product"]
        ).aggregate(
            quantity_sum=Coalesce(Sum("quantity"), 0)
        )  # 在庫テーブルのレコードを取得

        sales = Sale.objects.filter(product_id=request.data["product"]).aggregate(
            quantity_sum=Coalesce(Sum("quantity"), 0)
        )  # 卸しテーブルのレコードを取得

        # 在庫が売る分の数量を超えている場合はエラーレスポンスを返す
        if purchases["quantity_sum"] < (
            sales["quantity_sum"] + int(request.data["quantity"])
        ):
            raise BusinessException("在庫数量を超過することはできません")

        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

（中略）
```

`views/SaleView.py` は、クライアント（フロントエンド）から送信された新しい売上情報を受け取り、在庫数チェックを行った上でデータベースに登録することを目的とした機能になります。

**正常なリクエスト（バリデーション成功 ＆ 在庫が十分にある場合）**

まず、`SaleSerializer` を使ってリクエストデータの形式（必須項目、データ型など）が正しいか検証します。

検証が成功すると、次に在庫チェック処理を実行します。対象商品の「総仕入数（Purchaseの合計）」が、「既存の総売上数（Saleの合計） + 今回のリクエスト数量」を**上回っている（または等しい）**ことを確認します。

在庫が十分にある場合は `serializer.save()` を実行して売上情報をデータベースに保存し、`201 CREATED` ステータスと登録内容を返します。

**バリデーションエラー（400 Bad Requestなど）**

`serializer.is_valid(raise_exception=True)` が実行された時点で、リクエストデータ（`request.data`）が `SaleSerializer` の定義（例：`product`が必須、`quantity`が数値など）を満たしていない場合、DRF（Django Rest Framework）が自動的にエラーを捕捉します。

在庫チェック処理は実行されず、即座に `400 BAD REQUEST` ステータスと、どの項目がなぜ無効だったかの詳細なエラーメッセージを返します。

**在庫不足（業務エラー）**

シリアライザのバリデーションは成功したものの、在庫チェック処理で「総仕入数」が「既存の総売上数 + 今回のリクエスト数量」を**下回って**いた場合。

この場合、`BusinessException("在庫数量を超過することはできません")` が発生します。

データベースへの保存は行われず、（設定された例外ハンドラによりますが）通常 `400 BAD REQUEST` や `422 UNPROCESSABLE_ENTITY` ステータスで、"在庫数量を超過することはできません" というエラーメッセージを返します。

### 10-5-2 テスト環境のセットアップ

pytest を使ってDjangoのテストを実行するために、テスト専用の設定ファイルとライブラリを準備します。

#### STEP: テストするための準備をする

**① テスト用設定ファイル** (`config/settings/test.py`)

- テスト実行時のみ読み込まれる設定です。
- **データベース:** 本番DBを汚染しないよう、高速な「インメモリSQLite (:memory:)」を使用します。
- **認証:** テストの関心事をAPIのロジックに集中させるため、認証・権限チェックを無効化します。

**Backend** `config/settings/test.py` **New**

```python
from .base import *  # noqa

# テスト用のデータベース設定
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# テスト時は認証を無効化
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [],
}
```

`config/settings/test.py` は、pytest を実行する時だけに使われる、テスト専用のDjango設定ファイルです。

本番環境（production.py）や開発環境（development.py）の設定とは分離することで、テストを「安全」かつ「高速」に実行することを目的としています。

**② 開発用ライブラリ** (`requirements-dev.txt`)

- pytest と pytest-django をインストールします。

**Backend** `requirements-dev.txt`

```
ruff==0.12.4
setuptools==75.6.0
gitdb==4.0.12
GitPython==3.1.41
smmap==5.0.2
pytest==8.4.2
pytest-django==4.11.1
```

`requirements-dev.txt` は、アプリケーションを本番環境で動かすためには不要だが、開発やテストを行うために必要なライブラリを定義するためのファイルです。

pytestを使って単体テストを実行するため、追加します。

**Backend**

```bash
pip install -r requirements-dev.txt
```

**③ Pytest設定ファイル** (`pytest.ini`)

- pytest コマンド実行時に、`DJANGO_SETTINGS_MODULE` として `config.settings.test` を読み込むよう指示します。

**Backend** `pytest.ini` **New**

```ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
python_files = tests.py test_*.py *_tests.py
```

`pytest.ini` は、pytest コマンドを実行したときに、**pytest がどのように動作するかを制御**するための設定ファイルです。

**DJANGO_SETTINGS_MODULE = config.settings.test:**

- これが**3つのファイルをつなぐ最も重要な設定**です。
- pytest に対して、「Djangoの設定ファイルを読み込むときは、`config.settings.test`（先ほど作成した**テスト専用設定ファイル**）を使いなさい」と指示します。
- これにより、テスト実行時には自動的に「メモリ上のデータベース」が使われ、「認証がオフ」になります。

**python_files = tests.py test_*.py *_tests.py:**

- プロジェクト内のどのファイルを「テストコード」として認識するかを指定するパターンです。
- pytest は、このパターンに一致するファイル（例: `test_sales.py`）だけを探して実行します。

### 10-5-3 初期テストの実装と実行

SaleView の3つの振る舞い（正常系、業務エラー、バリデーションエラー）を検証するテストコードを実装します。

#### STEP: テストコードを作成する

**Backend** `api/inventory/tests/test_sale_view.py` **New**

```python
import pytest
from django.db.models import Sum
from rest_framework import status
from rest_framework.test import APIClient
from api.inventory.models import Product, Purchase, Sale

@pytest.fixture
def api_client():
    """APIクライアントのfixture"""
    return APIClient()

@pytest.mark.django_db
@pytest.mark.parametrize(
    "inventory_quantity, existing_sales, quantity",
    [
        (100, 0, 10),  # 正常な売上登録
        (100, 0, 100),  # 在庫数量ぎりぎりの売上登録
        (100, 50, 50),  # 既存売上がある場合の残り在庫内での売上
        (100, 0, 0),  # 売上数量0での売上登録
    ],
)
def test_post_sale_success_cases(
    api_client, inventory_quantity, existing_sales, quantity
):
    """
    売上登録の成功ケーステスト
    """
    # 商品と仕入を作成
    product = Product.objects.create(name="テスト商品", price=1000)
    if inventory_quantity > 0:
        Purchase.objects.create(product=product, quantity=inventory_quantity)

    # 既存売上を作成
    if existing_sales > 0:
        Sale.objects.create(product=product, quantity=existing_sales)

    sale_data = {
        "product": product.pk,
        "quantity": quantity,
    }

    response = api_client.post("/api/inventory/sales/", sale_data)

    assert response.status_code == status.HTTP_201_CREATED
    response_json = response.json()
    assert response_json["product"] == product.pk
    assert response_json["quantity"] == quantity

    # データベースに売上が登録されているか確認
    sales = Sale.objects.filter(product=product)
    expected_total = existing_sales + quantity
    assert sales.aggregate(Sum("quantity")).get("quantity__sum") == expected_total

@pytest.mark.django_db
@pytest.mark.parametrize(
    "inventory_quantity, existing_sales, quantity",
    [
        (100, 0, 101),  # 在庫数量を超える売上
        (100, 50, 51),  # 既存売上がある場合の残り在庫を超える売上
        (0, 0, 1),  # 仕入がない商品への売上
    ],
)
def test_post_sale_business_logic(
    api_client, inventory_quantity, existing_sales, quantity
):
    """
    ビジネスロジックのテスト
    """
    # 商品と仕入を作成
    product = Product.objects.create(name="テスト商品", price=1000)
    if inventory_quantity > 0:
        Purchase.objects.create(product=product, quantity=inventory_quantity)

    # 既存売上を作成
    if existing_sales > 0:
        Sale.objects.create(product=product, quantity=existing_sales)

    sale_data = {
        "product": product.pk,
        "quantity": quantity,
    }

    response = api_client.post("/api/inventory/sales/", sale_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

@pytest.mark.django_db
@pytest.mark.parametrize(
    "sale_data",
    [
        {"quantity": 10},  # productフィールドが不足
        {"product": "invalid_product_id"},  # quantityフィールドが不足
        {"product": 99999, "quantity": 10},  # 存在しない商品ID
    ],
)
def test_post_sale_validation_errors(api_client, sale_data):
    """
    バリデーションエラーのテスト（400 Bad Request）
    """
    Product.objects.create(id=1, name="テスト商品", price=1000)

    response = api_client.post("/api/inventory/sales/", sale_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
@pytest.mark.parametrize(
    "sale_data",
    [
        {"product": 1, "quantity": -1},  # quantityが負の数量
        {"product": 1, "quantity": "abc"},  # quantityが文字列
        {"product": 1, "quantity": ""},  # quantityが空文字列
        {"product": 1, "quantity": 1.5},  # quantityが小数点
    ],
)
def test_post_sale_quantity_validation_errors(api_client, sale_data):
    """
    数量に関するバリデーションエラーのテスト（400 Bad Request）
    """
    Product.objects.create(id=1, name="テスト商品", price=1000)

    response = api_client.post("/api/inventory/sales/", sale_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
```

テスト範囲や観点については、バックエンド（Django）のテストコードでは割愛します。ただ書き方については以下に補足します。

**@pytest.mark.django_db**

「このテスト関数は、データベースへのアクセス（`Product.objects.create`や`Sale.objects.filter`など）を許可します」という宣言です。

役割:

- テストが実行される直前に、`config/settings/test.py`で設定したテスト用データベース（メモリ上のSQLite）を準備します。
- テスト関数が終了すると、そのテストで行われた**変更（createやupdate）をすべて自動的にロールバック（取り消し）**します。
- これにより、`test_post_sale_success_cases`で作成された売上データが、後続の`test_post_sale_business_logic`に影響を与えないよう、テスト同士が独立して実行されることを保証します。

**@pytest.fixture と api_client**

`api_client`という名前の関数を、**「テスト用の準備処理（fixture）」**として定義しています。

役割:

- `@pytest.fixture`が付いていると、他のテスト関数（例: `test_post_sale_success_cases`）が引数で `api_client` を要求したときに、Pytestが自動的にこの`api_client`関数を実行し、その戻り値（`APIClient()`のインスタンス）を渡してくれます。
- `APIClient`は、Django Rest Frameworkが提供するテスト用クライアントで、`api_client.post(...)`のように、実際のHTTPリクエストを模倣したリクエストを（認証などをスキップして）テストコードから送信できます。

**@pytest.mark.parametrize(...)**

「1つのテスト関数を、複数の異なるパラメータ（データパターン）で繰り返し実行しなさい」という指示です。

役割:

- `test_post_sale_success_cases`を例にとると、`"inventory_quantity, existing_sales, quantity"`という引数名に対して、リスト内の4パターンの値（`(100, 0, 10)`、`(100, 0, 100)`など）を順番に当てはめて、合計4回テストを実行します。
- もしparametrizeを使わなければ、「正常な売上登録テスト」「在庫ぎりぎりテスト」... と、ほぼ同じ内容のテスト関数を4つ書かなければなりません。parametrizeは、冗長なテストコードを減らし、テストの意図（どのパターンを検証しているか）を明確にするために非常に有効です。

**assert response.status_code == status.HTTP_201_CREATED**

「`response`（APIからの返答）の`status_code`が、`201 CREATED`（リソースの作成に成功）と等しいこと」を検証（assert）しています。

役割:

- APIテストにおける最も基本的な検証です。`assert`（〜であることを確認する）文がTrueになればテストは成功、Falseになればテストは失敗（AssertionError）となります。
- `status.HTTP_201_CREATED`のように、201という生の数字（マジックナンバー）ではなく、`rest_framework.status`が提供する定数を使うことで、コードの可読性（「作成成功を期待している」という意図）を高めています。

#### STEP: テストを実行する

```bash
pytest -v
```

```
api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-0-10] PASSED [ 7%]

api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-0-100] PASSED [ 14%]

api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-50-50] PASSED [ 21%]

api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-0-0] PASSED [ 28%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[100-0-101] PASSED [ 35%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[100-50-51] PASSED [ 42%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[0-0-1] PASSED [ 50%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data0] PASSED [ 57%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data1] PASSED [ 64%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data2] PASSED [ 71%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data0] PASSED [ 78%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data1] PASSED [ 85%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data2] PASSED [ 92%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data3] PASSED [100%]
```

### 10-5-4 TDDによる仕様変更プロセス

#### STEP: 要件を変更する

**テスト駆動開発（TDD）による仕様変更のアプローチ**

ここで、「売上登録は、数量が1以上の場合のみ許可する」という仕様変更が発生したと仮定します。

テスト駆動開発（TDD）のアプローチでは、ソースコード（SaleView）を修正する前に、まずテストコードを「新しい仕様」に合わせて修正します。

#### STEP: テストケースの修正する

**Backend** `api/inventory/tests/test_sale_view.py`

```python
import pytest
from django.db.models import Sum
from rest_framework import status
from rest_framework.test import APIClient
from api.inventory.models import Product, Purchase, Sale

@pytest.fixture
def api_client():
    """APIクライアントのfixture"""
    return APIClient()

@pytest.mark.django_db
@pytest.mark.parametrize(
    "inventory_quantity, existing_sales, quantity",
    [
        (100, 0, 10),  # 正常な売上登録
        (100, 0, 100),  # 在庫数量ぎりぎりの売上登録
        (100, 50, 50),  # 既存売上がある場合の残り在庫内での売上
    ],
)
def test_post_sale_success_cases(
    api_client, inventory_quantity, existing_sales, quantity
):
    """
    売上登録の成功ケーステスト
    """
    # 商品と仕入を作成
    product = Product.objects.create(name="テスト商品", price=1000)
    if inventory_quantity > 0:
        Purchase.objects.create(product=product, quantity=inventory_quantity)

    # 既存売上を作成
    if existing_sales > 0:
        Sale.objects.create(product=product, quantity=existing_sales)

    sale_data = {
        "product": product.pk,
        "quantity": quantity,
    }

    response = api_client.post("/api/inventory/sales/", sale_data)

    assert response.status_code == status.HTTP_201_CREATED
    response_json = response.json()
    assert response_json["product"] == product.pk
    assert response_json["quantity"] == quantity

    # データベースに売上が登録されているか確認
    sales = Sale.objects.filter(product=product)
    expected_total = existing_sales + quantity
    assert sales.aggregate(Sum("quantity")).get("quantity__sum") == expected_total

@pytest.mark.django_db
@pytest.mark.parametrize(
    "inventory_quantity, existing_sales, quantity",
    [
        (100, 0, 101),  # 在庫数量を超える売上
        (100, 50, 51),  # 既存売上がある場合の残り在庫を超える売上
        (0, 0, 1),  # 仕入がない商品への売上
    ],
)
def test_post_sale_business_logic(
    api_client, inventory_quantity, existing_sales, quantity
):
    """
    ビジネスロジックのテスト
    """
    # 商品と仕入を作成
    product = Product.objects.create(name="テスト商品", price=1000)
    if inventory_quantity > 0:
        Purchase.objects.create(product=product, quantity=inventory_quantity)

    # 既存売上を作成
    if existing_sales > 0:
        Sale.objects.create(product=product, quantity=existing_sales)

    sale_data = {
        "product": product.pk,
        "quantity": quantity,
    }

    response = api_client.post("/api/inventory/sales/", sale_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

@pytest.mark.django_db
@pytest.mark.parametrize(
    "sale_data",
    [
        {"quantity": 10},  # productフィールドが不足
        {"product": "invalid_product_id"},  # quantityフィールドが不足
        {"product": 99999, "quantity": 10},  # 存在しない商品ID
    ],
)
def test_post_sale_validation_errors(api_client, sale_data):
    """
    バリデーションエラーのテスト（400 Bad Request）
    """
    Product.objects.create(id=1, name="テスト商品", price=1000)

    response = api_client.post("/api/inventory/sales/", sale_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
@pytest.mark.parametrize(
    "sale_data",
    [
        {"product": 1, "quantity": -1},  # quantityが負の数量
        {"product": 1, "quantity": "abc"},  # quantityが文字列
        {"product": 1, "quantity": ""},  # quantityが空文字列
        {"product": 1, "quantity": 1.5},  # quantityが小数点
        {"product": 1, "quantity": 0},  # quantityが0
    ],
)
def test_post_sale_quantity_validation_errors(api_client, sale_data):
    """
    数量に関するバリデーションエラーのテスト（400 Bad Request）
    """
    Product.objects.create(id=1, name="テスト商品", price=1000)

    response = api_client.post("/api/inventory/sales/", sale_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
```

まず、期待する動作が変わるテストケースを修正します。

**正常系テストから「0」を除外する** `test_post_sale_success_cases` から、`quantity: 0` を許容していたパラメータを削除します。

次に、**異常系テストに「0」を追加する** `quantity: 0` はバリデーションエラー（400 BAD REQUEST）になるべき、という新しい仕様を`test_post_sale_quantity_validation_errors`に追加します。

修正したら、テストを実行しましょう。

```bash
pytest -v
```

```
api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-0-10] PASSED [ 7%]

api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-0-100] PASSED [ 14%]

api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-50-50] PASSED [ 21%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[100-0-101] PASSED [ 28%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[100-50-51] PASSED [ 35%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[0-0-1] PASSED [ 42%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data0] PASSED [ 50%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data1] PASSED [ 57%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data2] PASSED [ 64%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data0] PASSED [ 71%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data1] PASSED [ 78%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data2] PASSED [ 85%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data3] PASSED [ 92%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data4] FAILED [100%]
```

```
api_client = <rest_framework.test.APIClient object at 0x7f90360e3140>, sale_data = {'product': 1, 'quantity': 0}

@pytest.mark.django_db
@pytest.mark.parametrize(
    "sale_data",
    [
        {"product": 1, "quantity": -1},  # quantityが負の数量
        {"product": 1, "quantity": "abc"},  # quantityが文字列
        {"product": 1, "quantity": ""},  # quantityが空文字列
        {"product": 1, "quantity": 1.5},  # quantityが小数点
        {"product": 1, "quantity": 0},  # quantityが0
    ],
)
def test_post_sale_quantity_validation_errors(api_client, sale_data):
    """
    数量に関するバリデーションエラーのテスト（400 Bad Request）
    """
    Product.objects.create(id=1, name="テスト商品", price=1000)

    response = api_client.post("/api/inventory/sales/", sale_data)

    > assert response.status_code == status.HTTP_400_BAD_REQUEST

E assert 201 == 400

E + where 201 = <Response status_code=201, "application/json">.status_code

E + and 400 = status.HTTP_400_BAD_REQUEST

api/inventory/tests/test_sale_view.py:128: AssertionError
```

この段階でpytestを実行すると、`quantity: 0`のテストケースが失敗（Fail）します。

なぜなら、ソースコード（SaleView）はまだ「0」を許可しており、400ではなく201を返してしまうからです。

テストが失敗することを確認することで、「これから修正する対象」を明確にします。

#### STEP: 変更された要件とテストケースに従ってソースコードを修正する

次に、失敗したテストをパスさせるためだけに、最小限のソースコード修正を行います。

モデルの定義で、quantityは0以上としていたので、最小値は 1 に変更します。

**Backend** `api/inventory/models.py`

（中略）

```python
class Sale(models.Model):
    """
    売上
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(
        verbose_name="数量", validators=[MinValueValidator(1)]
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

修正したら再度テストを実行しましょう。

```bash
pytest -v
```

```
api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-0-10] PASSED [ 7%]

api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-0-100] PASSED [ 14%]

api/inventory/tests/test_sale_view.py::test_post_sale_success_cases[100-50-50] PASSED [ 21%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[100-0-101] PASSED [ 28%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[100-50-51] PASSED [ 35%]

api/inventory/tests/test_sale_view.py::test_post_sale_business_logic[0-0-1] PASSED [ 42%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data0] PASSED [ 50%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data1] PASSED [ 57%]

api/inventory/tests/test_sale_view.py::test_post_sale_validation_errors[sale_data2] PASSED [ 64%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data0] PASSED [ 71%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data1] PASSED [ 78%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data2] PASSED [ 85%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data3] PASSED [ 92%]

api/inventory/tests/test_sale_view.py::test_post_sale_quantity_validation_errors[sale_data4] PASSED [100%]
```

今度は、`quantity: 0`のテストも400 BAD REQUESTを返すようになり、すべてのテストが成功（Pass）します。

**テスト駆動開発（TDD）のメリットと特徴**

このような「テスト先行」のアプローチには、以下のようなメリットがあります。

1. **仕様が明確になる（テストが仕様書になる）** 「quantity: 0は400エラー」という仕様が、曖昧なドキュメントではなく、実行可能な「テストコード」として定義されます。これにより、開発者は自分が何を実装すべきか正確に理解できます。

2. **リグレッション（デグレード）の防止** `quantity: 10`が成功し、`quantity: -1`が失敗するという既存の振る舞いを保証するテストも同時に実行されます。仕様変更（0の禁止）によって、既存の正しい動作（10の許可）が壊れていないことを即座に確認できます。

3. **安全なリファクタリング** テストが「お守り」となってコードの動作を保証してくれるため、開発者は安心してソースコードの改善（リファクタリング）に取り組むことができます。例えば、SaleViewの在庫チェックロジックをもっと効率的な方法に書き換えたとしても、テストスイートを実行するだけで、変更後も仕様通りに動いていることを保証できます。

4. **必要なコードだけを実装できる** TDDは「失敗したテストをパスさせるための最小限のコード」を書くことを推奨します。これにより、将来必要になるかもしれない「過剰な機能」や「複雑すぎる設計」を避け、シンプルで保守しやすいコードを維持することに繋がります。

## 10-6 Gitに作業状態を残す

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

## 10-7 本章のまとめ

本章では、（技術的要素）を用いたXXXの構築に焦点を当て、（第X章のテーマ）についてハンズオンを通して学びました。

具体的には、以下の重要な概念とXXX手法を習得しました。

- （本章で学んだこと・できるようになったこと１）
- （本章で学んだこと・できるようになったこと２）
- （本章で学んだこと・できるようになったこと３）
- 以降、必要に応じて増減

本章で構築した（ハンズオンの成果物）は、次章で学ぶ（ハンズオンの成果物）の基盤となります。

（次章の概要と学ぶ内容の頭出し）（次章へ向けてステップとモチベーションの高める投げかけ）
