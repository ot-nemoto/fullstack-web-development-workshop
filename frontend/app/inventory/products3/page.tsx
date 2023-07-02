"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import productsData from "./sample/dummy_products.json";

export default function Page() {
  // 読込データを保持
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(productsData);
  }, []);

  // 読込データを保持
  const [shownNewRow, setShownNewRow] = useState(false);
  const handleShowNewRow = (event) => {
    event.preventDefault();
    setShownNewRow(true);
  };
  const handleAddCancel = (event) => {
    event.preventDefault();
    setShownNewRow(false);
  };
  const handleAdd = (event) => {
    event.preventDefault();
    // TODO: バックエンドを使用した登録処理を呼ぶ
    setShownNewRow(false);
  };

  return (
    <div>
      <h2>商品一覧</h2>
      <button onClick={handleShowNewRow}>商品を追加する</button>
      <table>
        <thead>
          <tr>
            <th>商品ID</th>
            <th>商品名</th>
            <th>単価</th>
            <th>説明</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {shownNewRow ? (
            <tr>
              <td></td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="number" />
              </td>
              <td>
                <input type="text" />
              </td>
              {/* ルーティングのために追加 */}
              <td></td>
              <td>
                <button onClick={handleAddCancel}>キャンセル</button>
                <button onClick={handleAdd}>登録する</button>
              </td>
            </tr>
          ) : (
            ""
          )}
          {data.map((data: any) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.price}</td>
              <td>{data.description}</td>
              <td>
                <Link href={`/inventory/products3/${data.id}`}>在庫処理</Link>
              </td>
              <td>
                <button>更新・削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
