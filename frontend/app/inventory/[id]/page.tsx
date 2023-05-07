/*
【執筆メモStart】
【執筆メモEnd】
*/
"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";

type FormData = {
  id: number;
  quantity: number;
};

export default function Page({ params }: { params: { id: string } }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 読込データを保持
  const [product, setProduct] = useState({ id: "", name: "" });
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`/api/inventory/products/${params.id}`).then((response) => {
      setProduct(response.data);
    });
    axios.get(`/api/inventory/inventories/${params.id}`).then((response) => {
      setData(response.data);
    });
  }, [refresh]);

  // submit時のactionを分岐させる
  const [action, setAction] = useState<string>("");

  const onSubmit = (event: any): void => {
    const data: FormData = {
      id: Number(params.id),
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
    const purchase = {
      quantity: data.quantity,
      purchase_date: new Date(),
      product: data.id,
    };
    axios.post("/api/inventory/purchases", purchase).then((response) => {
      console.log(response.data);
      alert("作成完了");
      setRefresh((n) => n + 1);
    });
  };
  const handleSell = (data: FormData) => {
    const sale = {
      quantity: data.quantity,
      sales_date: new Date(),
      product: data.id,
      import_file: 1,
    };
    axios.post("/api/inventory/sales", sale).then((response) => {
      console.log(response.data);
      alert("作成完了");
      setRefresh((n) => n + 1);
    });
  };

  return (
    <div>
      <h2>商品在庫管理</h2>
      <h3>在庫処理</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>商品名:</label>
          <span>{product.name}</span>
        </div>
        <div>
          <label>数量:</label>
          <input
            type="number"
            id="quantity"
            {...register("quantity", { required: true, min: 1, max: 99999999 })}
          />
          {errors.quantity && <div>1から99999999の数値を入力してください</div>}
        </div>
        <button type="submit" onClick={() => setAction("purchase")}>
          商品を仕入れる
        </button>
        <button type="submit" onClick={() => setAction("sell")}>
          商品を卸す
        </button>
      </form>
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
  );
}
