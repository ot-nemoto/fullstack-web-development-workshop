/*
【執筆メモStart】
【執筆メモEnd】
*/
'use client'

import { useState, useEffect } from 'react';
import productsData from "../sample/dummy_products.json";
import inventoriesData from "../sample/dummy_inventories.json";

export default function Page({ params }: {
  params: { id: string },
}) {
  // 読込データを保持
  const [product, setProduct] = useState({ id: '', name: '' });
  const [data, setData] = useState([]);

  useEffect(() => {
    const selectedProduct = productsData.find(v => v.id === params.id)
    setProduct(selectedProduct);
    setData(inventoriesData);
  }, [])

  return (
    <div>
      <h2>商品在庫管理</h2>
      <h3>在庫処理</h3>
      <div>
        <label>商品名:</label>
        <span>{product.name}</span>
      </div>
      <div>
        <label>数量:</label>
        <input type="number" />
      </div>
      <button>商品を仕入れる</button>
      <button>商品を卸す</button>
      <h3>在庫履歴</h3>
      <table>
        <thead>
          <tr>
            <th>処理種別</th>
            <th>処理日時</th>
            <th>単価</th>
            <th>数量</th>
            <th>価格</th>
            <th>在庫数</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data: any) => (
            <tr key={data.id}>
              <td>{data.type}</td>
              <td>{data.date}</td>
              <td>{data.unit}</td>
              <td>{data.quantity}</td>
              <td>{data.price}</td>
              <td>{data.inventory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}