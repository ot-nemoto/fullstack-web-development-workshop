# 第12章 CI/CD

（前章の概要と学んだ内容の振返り）（本章の概要と学ぶ内容の頭出し）（本章のハンズオン内容の概要）

## 12-1 はじめに

### 12-1-1 本章の目的と概要

#### 本章で達成できること

（本章で達成できることの内容）

#### なぜ（本章の技術的要素）が必要なのか？

（本章の技術的要素が必要なことについての内容）

## 12-1-2 開発環境の準備

本章を開始するにあたって、第XX章のハンズオンが完了し、以下の環境が整っていることを前提とします。

- （前章の完了条件１）
- （前章の完了条件２）
- （前章の完了条件・・・）

これらの環境が整っていることを確認した上で、次のセクションに進んでいきましょう。もし未設定の箇所があればXX章に戻り、設定を見直してください。

## 12-1-3 この章からハンズオンを始める場合

XX章の最低限のアプリケーションのインストールおよびサービスへの登録を済ませて置いてください。

また、本章から始めたいという方は以下のリポジトリをクローンもしくはフォークして初めて見てください。

クローン or フォークコマンド

フォークが完了したら以下の操作でDockerコンテナを立ち上げてみてください。

DevContainorの展開

npmインストールとNext.jsの起動コマンド

本章以降は読者の理解度に合わせて好きな章からハンズオンを開始することができます。また、学習をはじめからやり直したいときなどご利用ください。

この章から新規にハンズオンを始める場合は以下のURLのリポジトリをクローンして始めてください。

[https://xxxx](https://xxxx)

クローンおよび開発環境の構築手順は、X章Y項を参考にしてください。

## 12-1-4 第12章に関する基礎知識

xxx

## 12-2 CI/CDによる開発プロセスの自動化

ソフトウェア開発において、コードを書き始めてからユーザーが使えるようになるまでには、様々な作業が必要です。この一連の流れを「開発プロセス」と呼びます。

この章では、この開発プロセスの中で発生する面倒で時間のかかる作業を、すべてコンピューターに任せて自動化するための方法を学びます。これが「CI/CD」の目的です。自動化することで、バグを早く見つけたり、新しい機能をすぐにユーザーに届けられるようになったりします。

### 12-2-1 CI/CDとは何か？

CI/CDは、2つの言葉の組み合わせです。

| **CI:** 継続的インテグレーション (*Continuous Integration*) | 開発チームのメンバーが書いたコードを、頻繁に（継続的に）一つの場所に統合（インテグレーション）し、すぐにテストすること。 |
| --- | --- |
| **CD:** 継続的デリバリー/デプロイメント (*Continuous Delivery/Deployment*) | CIでテストが成功したコードを、いつでも**デリバリー**（本番に出せる状態）出来る状態にし、または自動で**デプロイメント**（環境へ反映して動かす）まで行うこと。 |

要するに、「コードの結合とテストを自動で頻繁に行い（CI）、いつでもリリースできるようにする（CD）」この仕組みがCI/CDです。

重要なキーワードは「自動化」「継続的」です。

#### CI/CDが導入されていない世界線

CI/CDがない環境では、コードをリリースするために次のような問題が起こります。

| **リリース前の大きなストレス** | 開発の最後にまとめてコードを統合し、テストを行います。このとき初めて大きなバグが見つかると、原因究明と修正に時間がかかり、徹夜作業になることもあります。 |
| --- | --- |
| **手作業によるミス（ヒューマンエラー）** | コードをサーバーにアップロードしたり、設定ファイルを変更したりする作業を、人が手動で行います。手順が多くなると、うっかりミスでシステムを壊してしまうリスクが高まります。 |
| **リリースの頻度が低い** | リリース作業が大変なため、「次は3ヶ月後」のように間隔が空きがちです。ユーザーは新しい機能をなかなか使えず、開発者もフィードバックを得るのが遅くなります。 |

#### CI/CDが導入された世界線

CI/CDが導入されると、開発プロセスが劇的に改善されます。

| **安心感と品質の向上** | コードを少し変更するたびに自動でテストが走ります。これにより、**バグを「早期に」「小さなうち」に発見**できます。大きな問題に発展する前に修正できるため、開発者は安心してコードを書くことができます。 |
| --- | --- |
| **リリースが速く、安全に** | リリース作業は機械が自動で行うため、手動によるミスがゼロになります。また、ボタン一つ、あるいはコード変更と同時に自動でリリースされるため、ユーザーに**新しい機能をすぐに届けられます**。 |
| **チームの協力がスムーズに** | コードの統合が頻繁に行われるため、「誰かの変更が原因で自分のコードが動かなくなった」といった問題もすぐに分かります。チームでの連携がスムーズになります。 |

### 12-2-2 CI/CDを実行するための代表的なサービス

CI/CDの自動化を実現するためには、その作業を実行してくれるツールが必要です。

**主なCI/CDサービス（ツール）**

| **GitHub Actions** | コード管理で有名なGitHubが提供しているサービスです。GitHubにコードをプッシュするだけで、テストやデプロイを自動で実行できます。シンプルで人気が高く、この章でも利用します。 |
| --- | --- |
| **Jenkins** | 昔から使われている、自分でサーバーにインストールして使うCI/CDツールです。自由度が高い反面、自分で管理する必要があります。 |
| **CircleCI / GitLab CI** | GitHub Actionsと同じように、クラウド上で動作するCI/CDの自動化サービスです。 |
| **クラウドプロバイダーのサービス** | AWS (CodePipeline、CodeBuildなど) や Google Cloud (Cloud Buildなど) といった主要なクラウドサービスです。本番環境のインフラと密に連携することで、デプロイから運用・監視までを一元的に、管理するパイプラインを構築できます。 |

これらのサービスを利用することで、開発者は環境構築や面倒な作業から解放され、アプリの機能開発という最も大切な仕事に集中できるようになります。

本章のハンズオンでは、現代のソフトウェア開発に不可欠なCI/CDを、**GitHub Actions**というツールを使って実践的に学んでいきます。

## 12-3 GitHub ActionsによるCIの実装

CI（継続的インテグレーション）とは、開発者が自分の書いたコードを頻繁にメインのリポジトリに統合（インテグレーション）し、そのたびに自動でビルドやテストを実行することです。これにより、バグや統合時の問題を早期に発見し、開発の後半で大きな手戻りが発生するのを防ぎます。

これから実装するCIのワークフローは、以下の流れで自動実行させます。

1. 開発者がコードをフィーチャーブランチから main ブランチへ**プルリクエスト**を作成する。
2. GitHub Actionsがこれを検知し、定義されたCIワークフローを自動で起動する。
3. 実行環境（ランナー）上で、コードのチェックアウト、Node.js 環境のセットアップ、依存関係のインストールを実行する。
4. アプリケーションの各機能が正しく動作するかテストする。
5. テスト結果がプルリクエストの画面に表示される。

#### 品質チェック

- **静的解析（Lint）**：コードの文法的な誤りやコーディング規約違反をチェックする。
- **コード整形（Format）**：コードのスタイルを統一する。
- **ユニットテスト実行**: アプリケーションの各機能が正しく動作するかテストする。

#### 結果のフィードバック

- テスト結果がプルリクエストの画面に表示される。
- 設定に応じて、Slackなどの外部ツールに成功/失敗の通知が自動で送信される。

それでは、このCIの仕組みをGitHub Actionsを使って具体的に実装してみましょう。

### 12-3-1 CIワークフローの作成とテストの自動実行

#### STEP: ワークフローファイルを作成しよう

はじめに、アプリケーションのコードをプッシュまたはプルリクエストするたびに、テストを自動実行するCIワークフローを定義します。

**Frontend** `.github/workflows/test.yml` **new**

```yaml
name: Run tests

on:
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22.x]
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies
        run: yarn install
      - name: Run tests with Jest
        env:
          CI: true
        run: npm test -- --runInBand
```

**on:** セクションでは、このワークフローを実行するトリガーを定義しています。今回は main ブランチへのプルリクエスト時、または手動での実行のいずれかのタイミングで起動するように設定しています。

**jobs:** セクションでは、実行されるジョブ（test）の定義です。

このジョブでは、実行環境（runs-on）、実行戦略（strategy）、具体的な手順（steps）を指定しています。

実行環境は、最新バージョンの Ubuntu Linuxランナーを指定しています。

実行戦略は、Node.jsのバージョン 22.x を使用しています。

具体的な手順は、以下の通りです。

1. リポジトリのコードを、ランナーにチェックアウト（ダウンロード）
2. Node.js 環境をセットアップ
3. プロジェクトの依存関係をインストール（`yarn install`）
4. テスト実行（`npm test -- --runInBand`）

それでは、作成した Github Actions の設定をリポジトリにpushします。

mainブランチへプルリクエストを行う為、ブランチ（`feature/ci-add-tests`）を切って、プッシュしましょう。

#### STEP: ワークフローを実行しよう

次に、リポジトリのページへ移動し、Actions タブをクリックします。

![](media/image18.png)

*図12-3-1　Actions タブ*

先ほど設定したタスク（Run tests）が表示されているので、クリックします。

![](media/image11.png)

*図12-3-2　Run testsの選択*

Run testsのページでは、Run workflowをクリックし、ブランチ `feature/ci-add-tests` を選択して Run workflow をクリックします。

![](media/image15.png)

*図12-3-3　Run workflow実行*

ページを更新すると、Run tests が開始されていることが、確認できます。

#### STEP: Pull Requestして、ワークフローを実行しよう

次に、手動実行ではなく、自動で実行させてみましょう。ワークフローに定義したとおり、mainブランチにプルリクエストが行われることがトリガーになると定義しています。

それでは、リポジトリのページから、Pull Requests タブをクリックしましょう。

次にNew Pull Requestをクリックし、`feature/ci-add-tests` ブランチから main ブランチに対して、プリリクエストを作成します（`Create pull request`）。

![](media/image13.png)

*図12-3-4　Pull Request作成*

> **Hint:** プルリクエスト？
>
> 開発者が変更したソースコードをメインブランチに取り込むための依頼（マージリクエスト）をする仕組みです。これにより、コードの品質保証（レビュー）とメインブランチの保護が目的とされ、安全にコードを統合（マージ）できます。

![](media/image7.png)

*図12-3-5　プルリクエスト作成結果*

プルリクエストを作成したら、Github Actions でもテストが自動実行されていることを確認しましょう。

![](media/image14.png)

*図12-3-6　テスト自動実行*

手動時は、Run tests で開始されていましたが、今回は、プルリクエストのタイトルでワークフローが開始されていることが確認できると思います。

#### STEP: 実行結果を確認しよう

テストが完了すると結果が確認できます。

成功した場合はチェックの青のアイコンで表示されます。

![](media/image6.png)

*図12-3-7　テスト成功表示*

失敗した場合はアイコンで判別可能です。

![](media/image5.png)

*図12-3-8　テスト失敗表示*

また、ワークフローの詳細なステップを確認することで、どこで問題が発生したかを特定可能です。テストで失敗している場合、その原因を推測し、開発者にフィードバックすることで、コードの品質向上に繋がります。

![](media/image19.png)

*図12-3-9　テスト結果詳細*

プルリクエストの画面でも、テストが成功したことが確認できます。

### 12-3-2 CIの拡張：コード品質の自動チェック

CI（継続的インテグレーション）の初期段階では、主にコードが正しく動作するかを確認する「テストの自動実行」に焦点を当てました。

しかし、CIの役割はそれだけではなく、さらに一歩進んで、コードの「品質」と「一貫性」を担保するための自動チェックをワークフローに組み込むことで、開発プロセスをより強固にできます。

具体的には、テストカバレッジの測定、文法的な誤りや潜在的なバグを防ぐ静的解析（Lint）、チーム開発での可読性を高めるコード整形（Format）などが含まれます。これらの仕組みを導入することで、開発者はより安心して機能開発に集中できるようになります。

> **Hint:** カバレッジ？
>
> カバレッジ（Code Coverage: コード網羅率）とは、作成したテストがプログラムのコード全体をどれだけ実行したかを示す割合です。
>
> テストの網羅率を数値で確認することで、テストが不十分な部分や、テストケースが存在しないコード領域（バグが潜んでいる可能性がある箇所）を特定し、コードの品質向上に役立てることを目的としています。

> **Hint:** リンター（Linter: 静的解析）？
>
> コードを実行せずに、文法的な誤りや、潜在的なバグ、非推奨の書き方（アンチパターン）を自動的にチェックするツールです。
>
> これにより、問題を開発の早い段階で発見し、コードの品質を向上させることができます。

> **Hint:** フォーマッター（Formatter: コード整形）？
>
> インデントのスペース数、改行、セミコロンの有無など、コードの見た目に関するルールを統一し、自動的に整形するツールです。
>
> コードのスタイルが一貫することで、チーム開発における可読性とメンテナンス性が向上します。

#### STEP: カバレッジを取得しよう

作成済みのワークフローで実施したテストのカバレッジも取得するように、ワークフローに組み込みましょう。

**Frontend** `.github/workflows/test.yml`

```yaml
name: Run tests

on:
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22.x]
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies
        run: yarn install
      - name: Run tests with Jest
        env:
          CI: true
        run: npm test -- --runInBand --coverage
      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
```

修正したら、`feature/ci-add-tests` ブランチへプッシュしましょう。

`feature/ci-add-tests` ブランチは main ブランチへプルリクエスト中です。プルリクエストが更新されるので、再度 Github Actions が実行されます。

![](media/image12.png)

*図12-3-10　カバレッジレポート*

実行結果に Artifacts が追加されていることが確認できます。

`coverage-report` をクリックするとZIP形式の結果がダウンロードされます。ダウンロードしたファイルを解凍し、`coverage/lcov-report/index.html` をブラウザで開いてみましょう。

![](media/image17.png)

*図12-3-11　カバレッジ詳細結果*

現在は前章までのテストケースのみのため、網羅率は低いです。しかし、テストコードが整備されてくると、品質を担保するための指標となります。

#### STEP: 静的解析（Lint）とコード整形を実行しよう

コードの品質と一貫性を保つための「静的解析ツール（リンター）」と「コード整形ツール（フォーマッター）」を設定し、ワークフローに組み込みましょう。

**Frontend** `.github/workflows/test.yml`

```yaml
name: Run tests

on:
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22.x]
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies
        run: yarn install
      - name: Run linter
        run: yarn biome lint app/ plugins/
      - name: Run formatter
        run: yarn biome format app/ plugins/
      - name: Run tests with Jest
        env:
          CI: true
        run: npm test -- --runInBand --coverage
      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
```

修正をコミットし、リポジトリにプッシュしGithub Actions を実行してみましょう。

![](media/image9.png)

*図12-3-12　Linter・Formatter実行結果*

リンターおよびフォーマッターが成功していることが確認できると思います。

リンターの挙動を確認してみたい場合、未使用の変数の定義や、未使用ライブラリのimportすることで、リンターが反応します。

また、フォーマッターの挙動の確認では、インデントを変えてみたり、不要な空行を入れてみると、フォーマッターが反応します。

> **Column:** 外部サービスと連携
>
> ワークフローの実行結果（テスト成否、カバレッジなど）をSlackやDiscordに自動通知することで、チーム全体で迅速かつ確実に状況を共有し、**フィードバックの迅速化**と**開発プロセスの透明化**を実現します。
>
> **Slack（スラック）？**
>
> ビジネス向けのチャットツール（コラボレーションツール）です。チーム内でのコミュニケーションや情報共有を目的としています。または、GitHub Actionsなどの実行結果を特定のチャンネルに自動で通知するために使われます。
>
> **Discord（ディスコード）？**
>
> 元々はゲーマー向けに開発されたチャット/音声通話サービスですが、近年では開発者コミュニティや企業のチーム内コミュニケーションにも広く使われています。Slackと同様に、Webhook機能を利用してCI/CDの通知先として利用されます。

#### STEP: Slackの設定をしよう

CIワークフローの実行結果をSlackに自動通知するために、まずはSlack側でIncoming Webhooksを設定します。

![](media/image8.png)

*図12-3-13　Slack Webhook設定*

具体的な設定手順はSlackのUIによって変わる可能性がありますが、このステップでは、以下の2点を目的とします。

1. 通知先のチャンネルを決定する。
2. そのチャンネルへメッセージを送信するためのWebHook URLを取得する。

この後のステップで、この取得したWebHook URLを使用します。

#### STEP: GitHub Secretsの設定をしよう

WebHook URLは、外部サービスと連携するための**機密情報**です。これをワークフローファイル（.yml）に直接書き込むのはセキュリティ上好ましくありません。

そのため、GitHubが提供する**Secrets**機能を使って、このWebHook URLを安全に保存しましょう。Secretsに登録することで、ワークフロー内で環境変数として安全に利用できるようになります。

ここでは、WebHook URLを`SLACK_WEBHOOK_URL`という名前でGitHub Secretsに登録します。

![](media/image10.png)

*図12-3-14　GitHub Secrets設定*

#### STEP: 通知ステップを追加しよう

Slackへの通知を実現するため、ワークフローファイル（`.github/workflows/test.yml`）に新しいステップを追加します。

**条件付き実行の導入**

Slack通知ステップでは、`if:` キーワードを使って**ジョブの実行結果に応じて処理を分ける**ことが重要です。`if: success()` を指定したステップは成功時のみ、`if: failure()` を指定したステップは失敗時のみ実行されます。これにより、成功と失敗で異なるメッセージを通知したり、失敗時のみ特別な処理を実行したりすることができます。

**GitHub Actionsの活用**

本ワークフローでは、Slack公式が提供する信頼性の高い `slackapi/slack-github-action` を利用します。Actionsマーケットプレイスには様々なコミュニティ製Actionが存在しますが、プロダクション環境で利用する際は、**利用実績、メンテナンス頻度、セキュリティリスク**などを考慮して選択することが重要です。

この通知ステップで、Secretsに登録した`SLACK_WEBHOOK_URL`を環境変数として指定し、CIの実行結果やリンク情報を含めたメッセージをSlackチャンネルに送信するように設定します。

**Frontend** `.github/workflows/test.yml`

```yaml
name: Run tests

on:
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22.x]
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies
        run: yarn install
      - name: Run linter
        run: yarn biome lint app/ plugins/
      - name: Run formatter
        run: yarn biome format app/ plugins/
      - name: Run tests with Jest
        env:
          CI: true
        run: npm test -- --runInBand --coverage
      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
      - name: Notify Slack on success
        if: success()
        uses: slackapi/slack-github-action@v2.1.1
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {
              "text": "✅ Tests passed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "✅ All tests succeeded\n*Workflow:* `${{ github.workflow }}`\n*Repository:* `${{ github.repository }}`\n*Run:* <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|Open run>"
                  }
                }
              ]
            }
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v2.1.1
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {
              "text": "❌ Tests failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "❌ Test suite failed\n*Workflow:* `${{ github.workflow }}`\n*Repository:* `${{ github.repository }}`\n*Run:* <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|Open run>"
                  }
                }
              ]
            }
```

修正をコミットし、リポジトリにプッシュしGithub Actions を実行してみましょう。

![](media/image2.png)

*図12-3-15　Slack通知実行結果*

Slackに実行結果が通知されていることが確認できましたか？

この通知設定は、今回実装した「ジョブの成功・失敗両方のステータス通知」以外にも、様々な応用が可能です。

- **特定のステップの成否を通知する**: ジョブ全体ではなく、例えばテストステップのみの結果を通知することができます。
- **失敗時のみ通知する**: 成功時の通知ステップ（`if: success()` のブロック）を削除することで、テストが失敗した場合など、問題が発生した時にだけ通知を送るように運用できます。

これらの設定を活用することで、チームの開発プロセスに合わせた、よりきめ細やかなフィードバックを実現できます。

> **Column:** バッジを表示
>
> バッジを表示させることで、CI/CDの状態を視覚的に表示させることで、**プロジェクトの信頼性と透明性**を向上させます。
>
> また、READMEに表示することで、開発プロセスのステータスをチームや利用者に共有できます。
>
> **バッジ？**
>
> CI/CDの状態を視覚的に表示するために、主にGitHubなどのリポジトリのREADMEに埋め込まれる画像またはアイコンです。
>
> *e.g.*
>
> ![](media/image4.png)
>
> https://github.com/vercel/next.js

#### STEP: READMEを編集しよう

CIワークフローが正しく機能していることを、チームや外部の利用者に一目で伝えられるよう、リポジトリのトップページに**バッジ**を追加します。

GitHubからバッジのMarkdownを取得し、README.mdに貼り付けて、変更をリポジトリに反映させます。

GitHubリポジトリのページへ移動し、**Actions**タブ、左側のワークフロー一覧から、対象のワークフローを選択します。

画面上部にある「**Create status badge**」をクリック。

![](media/image1.png)

*図12-3-16　Create status badge*

画面上部にある「**Create status badge**」をクリック。

![](media/image16.png)

*図12-3-17　バッジMarkdown取得*

表示されたMarkdown形式のコードをコピーし、README.md を以下に書き換えましょう。

**Frontend** README.md

```markdown
# full-stack-web-development-frontend

[![Run tests](https://github.com/ot-nemoto/full-stack-web-development-frontend_3rd/actions/workflows/test.yml/badge.svg)](https://github.com/ot-nemoto/full-stack-web-development-frontend_3rd/actions/workflows/test.yml)
```

※バッジのURLは例です。ご自身の環境に合わせてください。

#### STEP: バッジを確認しよう

修正をコミットし、リポジトリにプッシュしましょう。

リポジトリのトップページに戻り、バッチが正しく表示されているかを確認しましょう。

※ `feature/ci-add-tests` ブランチで作業しているので、master ブランチではなく、`feature/ci-add-tests` ブランチのREADMEを確認します。

![](media/image20.png)

*図12-3-18　バッジ表示確認*

これにより、プロジェクトのコード品質が視覚的に伝わるようになり、開発プロセスの透明性が向上します。

バッジは他にも、テストカバレッジの達成率や、静的解析（Linter）の成功ステータスなど、様々な情報を表示するために利用できます。

これらのバッジを組み合わせることで、プロジェクトの健全性をより多角的に伝えることが可能になります。

## 12-4 継続的デプロイメント（CD）の実現

CI（継続的インテグレーション）でコードの品質が担保できたら、次はアプリケーションをインターネット上に公開する「デプロイ」の工程です。

昨今では、サーバーを自前で構築しアプリケーションをデプロイするケースは少なくなり、AWS、Azure、GCPといった主要なクラウドプロバイダーが提供するPaaS（Platform as a Service）やSaaS（Software as a Service）、そしてVercelのようなモダンな開発に特化したデプロイサービスを組み合わせて利用し、効率的にアプリケーションを公開するのが主流となっています。

> **Hint:** Vercel？
>
> Next.jsなどのモダンなWebアプリケーションのデプロイに特化したプラットフォーム（PaaS）です。
>
> GitHubなどのリポジトリと連携するだけで、自動ビルド、デプロイ、高速なコンテンツ配信を可能にし、開発者が機能開発に集中できるようにします。
>
> [https://vercel.com/](https://vercel.com/)

### 12-4-1 デプロイ先（アプリの公開場所）の選び方

アプリをインターネットに公開する「デプロイ」は、どこに公開するか（プラットフォーム）を選ぶことが重要です。ここでは、「運用・管理のしやすさ」と「将来的な機能拡張のしやすさ」のバランスを考えて選択します。

#### クラウドサービスの利用

現代の開発では、自分でサーバーをゼロから構築する代わりに、便利なクラウドサービスを利用するのが一般的です。

**PaaS (Platform as a Service) - 実行環境の提供:**

アプリケーションを実行するために必要な、OSやプログラミング言語の環境をセットで提供するサービスです。サーバーOSの管理や細かな環境設定をクラウド側が担当してくれるため、開発者はアプリの機能開発に集中できます。

Next.jsやDjangoなどのアプリケーションを実行するための環境がすぐに提供されるため、複雑な環境構築を待たずに、すぐにコードのデプロイと実行が可能になることや、OSのアップデートやパッチ適用を気にする必要がなくなります。

AWSでいうと、Amazon ECS や AWS Lambda がこれにあたります。

注釈: これらはPaaSの考え方をさらに特化させたもので、ECSは**CaaS**（Container as a Service）、Lambdaは**FaaS**（Function as a Service/サーバーレス）とも呼ばれます。

**SaaS (Software as a Service) - 特定機能の専門サービス:**

データベース（MySQLなど）のような、特定の機能に特化して提供されるサービスです。これらは「DBaaS（Database as a Service）」とも呼ばれます。

データの保存やバックアップといった重要な管理作業が自動化されます。特に、データベースを外部のSaaSに分けることで、アプリの実行環境とデータが分離され、データの安全性が向上します。

AWSでいうと、Amazon RDS や Amazon DynamoDB がこれにあたります。Amazon SES （Eメール送受信サービス）や Amazon QuickSight （BIサービス）もSaaSにあたります。

#### デプロイ手法

PaaSなどのサービスを利用する際、アプリを公開するまでの自動化のやり方には、主に2つの方法があります。

**リポジトリ連携型 - シンプルな自動更新:**

コードを管理しているGitHubなどのリポジトリと、PaaSなどのデプロイ先を直接連携させます。開発者がコードをGitHubにプッシュ（変更を送信）するだけで、自動でデプロイが実行され、アプリが更新されます。初心者でもすぐに導入しやすく、Vercelなどが代表例です。

**イメージデプロイ型 - 高い再現性のコンテナ化:**

アプリケーションと、その実行に必要な環境をすべてまとめて「Dockerイメージ」という実行可能なパッケージとして作成します。このイメージをGHCR (GitHub Container Registry)などの倉庫に保存し、デプロイ先で実行します。特定のプラットフォームに依存せず、どこでも全く同じ環境を再現できます。大規模なシステムや、インフラの要件が厳しいプロジェクトに適した、よりプロフェッショナルな手法です。

### 12-4-2 Dockerイメージの作成と保存

アプリケーションを「どこでも動くパッケージ（Dockerイメージ）」としてまとめ、GitHubが提供するレジストリ「GHCR (GitHub Container Registry)」に保存するワークフローを構築します。

#### STEP: ワークフローファイルを更新しよう

継続的デプロイメント（CD）の実現に向け、まずアプリケーションをコンテナ化するための Dockerfile を作成し、次にそのDockerイメージをビルドしてGitHub Container Registry (GHCR) に保存するためのGitHub Actionsワークフローファイルを作成します。

**Dockerfile の作成**

アプリケーションを軽量で実行可能なDockerイメージとしてパッケージ化するための設計図である Dockerfile をプロジェクトのルートに新規作成します。このファイルには、ベースイメージの指定、依存関係のインストール、ビルド、ポートの公開、アプリケーションの起動コマンドなどを記述します。

**Frontend** `Dockerfile` **new**

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
```

**GHCRへ公開するためのワークフローファイルの作成**

Dockerイメージを自動でビルドし、GHCRへプッシュするための新しいワークフローファイル `.github/workflows/publich-ghcr.yml` を作成します。

このワークフローは main ブランチへの push または手動実行をトリガーとし、以下の処理を実行します。

**Frontend** `.github/workflows/publich-ghcr.yml` **new**

```yaml
name: Publish to GHCR

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

このワークフローは main ブランチへの push または手動実行をトリガーとし、以下の処理を実行します。

**Docker Buildx のセットアップ**: マルチプラットフォーム対応のイメージビルド環境をセットアップします。

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
```

**コンテナレジストリへのログイン**: `GITHUB_TOKEN` を使用してGHCRにログインします。

```yaml
- name: Log in to Container Registry
  uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

**メタデータの抽出**: コミットSHAやブランチ名などからイメージのタグ情報を自動生成します。

```yaml
- name: Extract metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
    tags: |
      type=ref,event=branch
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      type=sha,prefix={{branch}}-
      type=raw,value=latest,enable={{is_default_branch}}
```

**ビルドとプッシュ**: Dockerfile を基にイメージをビルドし、生成されたタグ情報と共にGHCRへプッシュします。

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

アプリケーションをコンテナ化し、そのイメージを安全なレジストリに保存するまでの自動化パイプラインを構築しました。

#### STEP: 変更をプッシュして実行結果を確認しよう

作成した Dockerfile と新しいワークフローファイル（`.github/workflows/publich-ghcr.yml`）をコミットし、**プルリクエストを作成済みのブランチに**プッシュして、変更を反映させましょう。

次に、GitHubリポジトリの **Pull Requests** ページから、該当のプルリクエストを確認します。

プルリクエストを **マージ** し、**メインブランチ**（main ブランチ）に反映させましょう。このマージ操作（main へのプッシュ）をトリガーに、GitHub Actions のページで新しいワークフロー（Publish to GHCR）が開始されていることを確認します。

ワークフローの実行後、以下の項目を確認しましょう。

- **GitHub Actions のページ**：ビルドとプッシュのジョブが成功したか（緑色のチェックマーク）を確認します。
- **GitHub Packages のページ**：最後に、GitHubリポジトリの **Packages** タブに移動し、ビルドされたDockerイメージがGHCR（GitHub Container Registry）に正常にアップロードされ、利用可能になっていることを確認しましょう。

![](media/image3.png)

*図12-4-1　GHCRへのアップロード確認*

これらの確認をもって、CI/CDの次のステップである「Dockerイメージの自動ビルドとGHCRへの保存」が正しく実装されたことになります。

## 12-5 ハンズオンの内容

（ハンズオンの内容）

以降必要に応じて増減

## 12-6 Gitに作業状態を残す

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
 * [new branch]      main -> main
```

## 12-7 本章のまとめ

本章では、（技術的要素）を用いたXXXの構築に焦点を当て、（第X章のテーマ）についてハンズオンを通して学びました。

具体的には、以下の重要な概念とXXX手法を習得しました。

- （本章で学んだこと・できるようになったこと１）
- （本章で学んだこと・できるようになったこと２）
- （本章で学んだこと・できるようになったこと３）
- 以降、必要に応じて増減

本章で構築した（ハンズオンの成果物）は、次章で学ぶ（ハンズオンの成果物）の基盤となります。

（次章の概要と学ぶ内容の頭出し）（次章へ向けてステップとモチベーションの高める投げかけ）
