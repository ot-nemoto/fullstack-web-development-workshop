# Chapter 7：JavaScriptとNext.js基礎

Chapter 7 では `frontend/` だけを触ります。バックエンドには一切触れません。

この章ではTypeScriptの型の考え方、Next.jsの構造、Reactコンポーネントの基本を学び、モックデータを使って本の一覧画面を作ります。

## 7-1 TypeScriptの必要性と基本

### JavaScriptの問題点

JavaScriptはブラウザで動くプログラミング言語です。柔軟に書ける反面、**型がない**という特性から、実行するまでバグに気づけないことがあります。

```javascript
// JavaScriptではこういうバグが起きやすい
function getBookTitle(book) {
    return book.titel  // "title" のタイプミス。でも実行されるまでエラーにならない
}
```

### TypeScriptとは何か

**TypeScript**はJavaScriptに型を追加した言語です。コードを書いている最中にエラーが検出されるため、バグを早期に発見できます。

```typescript
// TypeScriptなら型ミスをコード編集中に発見できる
interface Book {
    id: number
    title: string
}

function getBookTitle(book: Book) {
    return book.titel  // ← VSCodeが即座に「titleというプロパティはない」と警告する
}
```

TypeScriptで書いたコードは最終的にJavaScriptに変換（トランスパイル）されてブラウザで動きます。

### 型の書き方

**プリミティブ型**（基本の型）

```typescript
const count: number = 3       // 数値
const title: string = "本のタイトル"  // 文字列
const isAvailable: boolean = true    // 真偽値（true または false）
```

変数名の後に `: 型名` と書きます。ただし、値から型が明らかな場合は省略でき、TypeScriptが自動的に型を推論します。

```typescript
const count = 3          // TypeScriptが number と推論する
const title = "タイトル"  // TypeScriptが string と推論する
```

**interface**（オブジェクトの型定義）

```typescript
interface Book {       // interfaceはオブジェクトの形を定義する
    id: number
    title: string
    author: string
    available_count: number
    category: number | null  // number または null（| はユニオン型：どちらかの型）
}
```

**配列の型**

```typescript
const books: Book[] = []        // Book型の配列
const titles: string[] = []     // string の配列
```

### なぜ本書でTypeScriptを使うのか

初心者のうちは「型を書くのが手間」と感じるかもしれません。しかし、プロジェクトが大きくなるほど型の恩恵は大きくなります。コードを読んだだけで「この変数に何が入るか」がわかるため、チームでの開発でも理解しやすいコードになります。

現在のフロントエンド開発ではTypeScriptが標準的な選択肢です。

## 7-2 Next.jsのプロジェクト構造

### App Routerの概念

Next.jsには**App Router**という仕組みがあります。`src/app/` ディレクトリの中のフォルダ・ファイル構成が、そのままURLのパスになります。

```
src/app/
├── page.tsx          → localhost:3000/
├── books/
│   ├── page.tsx      → localhost:3000/books/
│   └── [id]/
│       └── page.tsx  → localhost:3000/books/1/ （[id]はURLパラメータ）
```

コードを書いてファイルを置くだけでルーティングが設定されます。

### ファイルベースルーティング

URLに対応するファイルを決まった名前で作成することを**ファイルベースルーティング**といいます。

| ファイル | URL |
|---------|-----|
| `app/page.tsx` | `/` |
| `app/books/page.tsx` | `/books/` |
| `app/books/[id]/page.tsx` | `/books/1/`、`/books/2/` 等 |
| `app/books/new/page.tsx` | `/books/new/` |

### page.tsx / layout.tsx / loading.tsx / error.tsx の役割

Next.jsでは特定のファイル名に特別な役割があります。

| ファイル名 | 役割 |
|-----------|------|
| `page.tsx` | そのURLのページ本体 |
| `layout.tsx` | 複数ページに共通するレイアウト（ヘッダー等） |
| `loading.tsx` | データ取得中に表示するローディング画面 |
| `error.tsx` | エラー発生時に表示する画面 |

`layout.tsx` をフォルダに置くと、そのフォルダ以下のページすべてに適用されます。

## 7-3 Reactコンポーネントの基本

### コンポーネントとは何か

**コンポーネント**はUIのパーツです。ボタン、カード、ナビゲーションバーなど、画面を構成する部品をコンポーネントとして定義し、組み合わせてページを作ります。

Next.jsのコンポーネントはTypeScriptの関数として書き、JSXという記法でHTMLのような見た目のコードを返します。

```tsx
// シンプルなコンポーネント
function Greeting() {
    return <h1>こんにちは</h1>
}
```

### 🛠️ propsでデータを受け渡す

**props**は親コンポーネントから子コンポーネントへデータを渡す仕組みです。

`frontend/src/components/BookCard.tsx` を新規作成します。

```tsx
interface BookCardProps {  // このコンポーネントが受け取るpropsの型を定義する
    title: string
    author: string
    availableCount: number
}

export default function BookCard({ title, author, availableCount }: BookCardProps) {
    // { title, author, availableCount } は分割代入：propsオブジェクトから値を取り出す書き方
    return (
        <div>
            <h2>{title}</h2>
            <p>著者：{author}</p>
            <p>貸出可能：{availableCount}冊</p>
        </div>
    )
}
```

使い方：

```tsx
<BookCard title="実践フルスタックWeb開発" author="山田太郎" availableCount={3} />
```

### 🛠️ useStateで状態を管理する

**useState**はコンポーネント内で変化するデータ（状態）を管理するための仕組みです。

`frontend/src/components/Counter.tsx` を新規作成して動作を確認します。

```tsx
'use client'  // useStateはClient Componentでしか使えないため宣言が必要

import { useState } from 'react'  // reactからuseStateを読み込む

export default function Counter() {
    const [count, setCount] = useState(0)
    // useState(初期値) は [現在の値, 値を更新する関数] を返す

    return (
        <div>
            <p>カウント：{count}</p>
            <button onClick={() => setCount(count + 1)}>
                {/* onClick はクリック時に実行する関数を指定する */}
                +1
            </button>
        </div>
    )
}
```

`setCount` を呼ぶと `count` が更新され、コンポーネントが再レンダリング（再描画）されます。

> **Server ComponentとClient Component**：Next.jsのコンポーネントはデフォルトで**Server Component**（サーバー側で実行）です。`useState` などのブラウザの機能を使う場合は、ファイル先頭に `'use client'` を宣言して**Client Component**として使います。

### 🛠️ Counter を page.tsx に追加して動作確認する

`Counter` をブラウザで確認するため、`frontend/src/app/page.tsx` に一時的に追加します。

```tsx
import Counter from '@/components/Counter'

export default function Home() {
    return (
        <main>
            <Counter />
        </main>
    )
}
```

`http://localhost:3000/` を開き、**+1** ボタンをクリックするたびにカウントが増えることを確認してください。

確認できたら `Counter` の import と `<Counter />` を削除しておきます。この `Counter.tsx` 自体は次節以降で参照しないため、削除しても構いません。

## 7-4 コンポーネント構成の設計

### 画面をコンポーネントに分割する考え方

コンポーネントに分割するときの基準は「**再利用できるか**」と「**1つの責務に集中しているか**」です。

本の一覧ページを例にすると：

```
BooksPage（ページ全体）
├── BookList（本の一覧）
│   ├── BookCard（1冊分のカード）  ← 繰り返し使う
│   ├── BookCard
│   └── BookCard
└── Pagination（ページネーション）  ← 将来的に他のページでも使える
```

### 図書館システムのコンポーネント構成図

本書では次のような構成でコンポーネントを作っていきます。

```
src/
├── app/
│   ├── layout.tsx          ← ヘッダー・ナビゲーション（全ページ共通）
│   ├── page.tsx            ← トップページ
│   └── books/
│       ├── page.tsx        ← 本の一覧ページ（Chapter 9）
│       ├── new/
│       │   └── page.tsx    ← 本の登録ページ（Chapter 9）
│       └── [id]/
│           ├── page.tsx    ← 本の詳細ページ（Chapter 9）
│           └── edit/
│               └── page.tsx ← 本の編集ページ（Chapter 9）
└── components/
    ├── BookCard.tsx         ← 本1冊分のカード
    └── BookForm.tsx         ← 本の登録・編集フォーム
```

Chapter 7 では `books/page.tsx` をモックデータで実装します。Chapter 9 で残りのページを実装します。

## 7-5 モックデータによる本の一覧画面

APIができていなくても画面を作って確認するために、**モックデータ**（仮のデータ）を使います。Chapter 8 でAPIに切り替えます。

### 🛠️ モックデータを定義する

`frontend/src/types/index.ts` を新規作成して型定義をまとめます。

```typescript
export interface Category {  // exportで他のファイルからimportできるようにする
    id: number
    name: string
}

export interface Book {
    id: number
    title: string
    author: string
    publisher: string
    isbn: string
    category: number | null
    available_count: number
}

export interface Loan {
    id: number
    book: number
    book_detail: Book  // LoanSerializer が BookSerializer をネストして返す詳細情報
    user: number
    loan_date: string
    due_date: string
    return_date: string | null
    status: 'active' | 'returned'  // 文字列リテラル型：この2つの文字列しか入らない
}
```

`frontend/src/data/mockBooks.ts` を新規作成します。

```typescript
import { Book } from '@/types'  // @/ は src/ ディレクトリへのエイリアス（別名）

export const mockBooks: Book[] = [
    {
        id: 1,
        title: '実践フルスタックWeb開発ワークショップ',
        author: '山田太郎',
        publisher: '技術出版社',
        isbn: '9784000000010',
        category: 1,
        available_count: 3,
    },
    {
        id: 2,
        title: 'データベース設計入門',
        author: '鈴木花子',
        publisher: '学習出版社',
        isbn: '9784000000027',
        category: 1,
        available_count: 0,
    },
    {
        id: 3,
        title: 'Pythonプログラミング',
        author: '佐藤次郎',
        publisher: '技術出版社',
        isbn: '9784000000034',
        category: 1,
        available_count: 2,
    },
]
```

### 🛠️ 一覧表示コンポーネントを実装する

7-3 で作成した `frontend/src/components/BookCard.tsx` を以下のように書き換えます。

```tsx
import { Book } from '@/types'

interface BookCardProps {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-bold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-500">{book.publisher}</p>
            <div className="mt-2">
                {book.available_count > 0 ? (
                    <span className="text-green-600">貸出可能（{book.available_count}冊）</span>
                ) : (
                    <span className="text-red-500">貸出中</span>
                )}
                {/* 三項演算子: 条件 ? 真のとき : 偽のとき */}
            </div>
        </div>
    )
}
```

`frontend/src/app/books/page.tsx` を作成します。

```tsx
import { mockBooks } from '@/data/mockBooks'
import BookCard from '@/components/BookCard'

export default function BooksPage() {
    return (
        <main className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">本の一覧</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockBooks.map((book) => (
                    // .map() は配列の各要素に対して処理を実行して新しい配列を返す
                    <BookCard key={book.id} book={book} />
                    // key はReactがリスト要素を識別するために必要な一意の値
                ))}
            </div>
        </main>
    )
}
```

### 🛠️ Tailwind CSS をインストールする

Tailwind CSS はクラス名を HTML に直接書くスタイリング方法です。まずインストールと設定を行います。

フロントエンドウィンドウのターミナルで以下を実行します。

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

`frontend/postcss.config.mjs` を新規作成します。

```js
const config = {
    plugins: {
        '@tailwindcss/postcss': {},
    },
}

export default config
```

`frontend/src/app/globals.css` の先頭に1行追加します。

```css
@import "tailwindcss";

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  font-family: sans-serif;
}
```

### 🛠️ Tailwind CSSでスタイリングする

上記のコードではすでに Tailwind CSS のクラスを使っています。主なクラスの意味は次のとおりです。

| クラス | 意味 |
|--------|------|
| `border` | ボーダーを追加する |
| `rounded-lg` | 角を丸くする |
| `p-4` | padding を 1rem に設定する |
| `shadow-sm` | 薄い影をつける |
| `text-lg` | フォントサイズを大きくする |
| `font-bold` | 太字にする |
| `text-gray-600` | グレーの文字色にする |
| `grid grid-cols-3` | 3列のグリッドレイアウトにする |
| `gap-4` | グリッドのアイテム間隔を設定する |

ブラウザで `http://localhost:3000/books/` にアクセスして、本のカードが3つ表示されることを確認しましょう。

## まとめ

- TypeScriptの型によってコードの安全性が高まることを理解した
- Next.jsのApp Routerとファイルベースルーティングの仕組みを理解した
- propsでデータを渡す方法と、useStateで状態を管理する方法を習得した
- モックデータを使って本の一覧画面を実装した

---

次の章では、モックデータをAPIデータに切り替えるための接続設定を行います。
