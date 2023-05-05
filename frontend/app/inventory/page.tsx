/*
【執筆メモStart】
【執筆メモEnd】
*/
"use client";

import { useState, useEffect } from "react";
import productsData from "./sample/dummy_products.json";
import Link from "next/link";

type FormData = {
  id: number | null;
  name: string;
  price: number;
  description: string;
};

export default function Page() {
  // 読込データを保持
  const [data, setData] = useState<Array<FormData>>([]);

  useEffect(() => {
    setData(productsData);
  }, []);

  // 登録データを保持
  const [id, setId] = useState<number | null>(0);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [description, setDescription] = useState<string>("");

  // submit時のactionを分岐させる
  const [action, setAction] = useState<string>("");

  const handleSubmit = (event: any): void => {
    const data: FormData = {
      id: id,
      name: name,
      price: Number(price),
      description: description,
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

  // 登録処理
  const handleShowNewRow = () => {
    setId(null);
    setName("");
    setPrice("0");
    setDescription("");
  };
  const handleAddCancel = () => {
    setId(0);
  };
  const handleAdd = (data: FormData) => {
    setId(0);
  };

  // 更新・削除処理
  const handleEditRow = (id: number | null) => {
    const selectedProduct: FormData = data.find((v) => v.id === id);
    setId(selectedProduct.id);
    setName(selectedProduct.name);
    setPrice(selectedProduct.price.toString());
    setDescription(selectedProduct.description);
  };
  const handleEditCancel = () => {
    setId(0);
  };
  const handleEdit = (data: FormData) => {
    setId(0);
  };
  const handleDelete = (id: number) => {
    setId(id);
  };

  return (
    <div>
      <h2>商品一覧</h2>
      <button type="button" onClick={handleShowNewRow}>
        商品を追加する
      </button>
      <form onSubmit={handleSubmit}>
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
            {id === null ? (
              <tr>
                <td></td>
                <td>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </td>
                <td></td>
                <td>
                  <button type="button" onClick={() => handleAddCancel()}>
                    キャンセル
                  </button>
                  <button type="submit" onClick={() => setAction("add")}>
                    登録する
                  </button>
                </td>
              </tr>
            ) : (
              ""
            )}
            {data.map((data: any) =>
              id === data.id ? (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>
                    <input
                      type="text"
                      id="name"
                      // FIXME: onChangeイベントが実行されない限り、valueに設定された値にdata.nameが入らず空になる
                      // defaultValueとvalueは同時に指定できない
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </td>
                  <td></td>
                  <td>
                    <button type="button" onClick={() => handleEditCancel()}>
                      キャンセル
                    </button>
                    <button type="submit" onClick={() => setAction("update")}>
                      更新する
                    </button>
                    <button type="submit" onClick={() => setAction("delete")}>
                      削除する
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.name}</td>
                  <td>{data.price}</td>
                  <td>{data.description}</td>
                  <td>
                    <Link href={`/inventory/${data.id}`}>在庫処理</Link>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEditRow(data.id)}
                    >
                      更新・削除
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </form>
    </div>
  );
}
