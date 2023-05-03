/*
【執筆メモStart】
【執筆メモEnd】
*/
// べた書きのダミー値からファイル読込に変更
'use client'

import { useState, useEffect } from 'react';
import productsData from "./sample/dummy_products.json";
// ルーティングのために追加
import Link from "next/link";

export default function Page() {
  // 読込データを保持
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(productsData);
  }, [])

  return (
    <div>
      <h2>商品一覧</h2>
      <button>商品を追加する</button>
      <table>
        <thead>
          <tr>
            <th>商品ID</th>
            <th>商品名</th>
            <th>単価</th>
            <th>説明</th>
            {/* ルーティングのために追加 */}
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
{/* useStateでの置換えの際に削除
          <tr>
            <td>1</td>
            <td>コットン100％バックリボンティアードワンピース（黒）</td>
            <td>6900</td>
            <td>大人の愛らしさを引き立てる、ナチュラルな風合い。リラックス×トレンドを楽しめる、上品なティアードワンピース。</td>
            <td><button>更新・削除</button></td>
          </tr>
          <tr>
            <td>2</td>
            <td>ライトストレッチカットソー（ネイビー）</td>
            <td>2980</td>
            <td>しなやかな肌触りが心地よい、程よいフィット感のカットソー。ビジネスカジュアルにも普段使いにも使える、ベーシックなデザイン。</td>
            <td><button>更新・削除</button></td>
          </tr>
          <tr>
            <td>3</td>
            <td>ベルト付きデニムパンツ（ブルー）</td>
            <td>5980</td>
            <td>定番のデニムパンツに、フェミニンなベルトをプラスしたスタイリッシュなアイテム。カジュアルにもきれいめにも合わせやすい。</td>
            <td><button>更新・削除</button></td>
          </tr>
 */}
           {data.map((data: any) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.price}</td>
              <td>{data.description}</td>
              {/* ルーティングのために追加 */}
              <td><Link href={`/inventory/${data.id}`}>在庫処理</Link></td>
              <td><button>更新・削除</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}