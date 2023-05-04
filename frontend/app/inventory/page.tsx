/*
【執筆メモStart】
【執筆メモEnd】
*/
'use client'

import { useState, useEffect } from 'react';
import productsData from "./sample/dummy_products.json";
import Link from "next/link";

export default function Page() {
  // 読込データを保持
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(productsData);
  }, [])

  // 登録データを保持
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState("")

  // 登録処理
  const [shownNewRow, setShownNewRow] = useState(false);
  const handleShowNewRow = () => {
    setEditingRow(0)
    setShownNewRow(true)
  };
  const handleAddCancel = () => {
    setShownNewRow(false)
  };
  const handleAdd = () => {
    // TODO: バックエンドを使用した登録処理を呼ぶ
    const ob = {
      name: name,
      price: price,
      description: description
    }
    console.dir(ob)
    setShownNewRow(false)
  };

  // 更新・削除処理
  const [editingRow, setEditingRow] = useState(0);
  const handleEditRow = (id) => {
    setShownNewRow(false)
    setEditingRow(id)
  };
  const handleEditCancel = (id) => {
    setEditingRow(0)
  };
  const handleEdit = (id) => {
    const ob = {
      id: id,
      name: name,
      price: price,
      description: description
    }
    console.dir(ob)
    setEditingRow(0)
  };
  const handleDelete = (id) => {
    const ob = {
      id: id
    }
    console.dir(ob)
    setEditingRow(0)
 };

  return (
    <div>
      <h2>商品一覧</h2>
      <button type="button" onClick={handleShowNewRow}>商品を追加する</button>
      <table>
        <thead>
          <tr>
            <th>商品ID</th>
            <th>商品名</th>
            <th>単価</th>
            <th>説明</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {shownNewRow ? (
            <tr>
              <td></td>
              <td><input 
                type="text" 
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              /></td>
              <td><input 
                type="number" 
                id="price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              /></td>
              <td><input 
                type="text" 
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              /></td>
              <td></td>
              <td><button onClick={() => handleAddCancel()}>キャンセル</button><button onClick={() => handleAdd()}>登録する</button></td>
            </tr>
          ) : ""}
          {data.map((data: any) => (
            editingRow === data.id ? (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td><input 
                  type="text" 
                  id="name"
                  // FIXME: onChangeイベントが実行されない限り、valueに設定された値にdata.nameが入らず空になる
                  // defaultValueとvalueは同時に指定できない
                  // defaultValue={data.name} 
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                /></td>
                <td><input 
                  type="number" 
                  id="price"
                  // defaultValue={data.price} 
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                /></td>
                <td><input 
                  type="text" 
                  id="description"
                  // defaultValue={data.description} 
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                /></td>
                <td></td>
                <td><button onClick={() => handleEditCancel(data.id)}>キャンセル</button><button onClick={() => handleEdit(data.id)}>更新する</button><button onClick={() => handleDelete(data.id)}>削除する</button></td>
              </tr>
            ) : (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.price}</td>
                <td>{data.description}</td>
                <td><Link href={`/inventory/${data.id}`}>在庫処理</Link></td>
                <td><button onClick={() => handleEditRow(data.id)}>更新・削除</button></td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  )
}