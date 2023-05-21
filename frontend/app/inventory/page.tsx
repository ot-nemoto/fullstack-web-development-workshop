/*
【執筆メモStart】
各コンポーネントの見た目はMUIのデフォルトを適用しています
@mui/materialは最新、@material-ui/coreは以前のものなので参考コードを探すときは注意
https://mui.com/material-ui/getting-started/overview/
【執筆メモEnd】
*/
"use client";

import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

type FormData = {
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
  } = useForm();
  // 読込データを保持
  const [data, setData] = useState<Array<FormData>>([]);
  // データ更新の反映用
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios
      .get("/api/inventory/products")
      .then((res) => res.data)
      .then((data) => {
        setData(data);
      });
  }, [refresh]);

  // 登録データを保持
  const [id, setId] = useState<number | null>(0);

  // submit時のactionを分岐させる
  const [action, setAction] = useState<string>("");

  const onSubmit = (event: any): void => {
    const data: FormData = {
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

  // 登録処理
  const handleShowNewRow = () => {
    setId(null);
    reset({
      name: "",
      price: "0",
      description: "",
    });
  };
  const handleAddCancel = () => {
    setId(0);
  };
  const handleAdd = (data: FormData) => {
    axios.post("/api/inventory/products", data).then((response) => {
      console.log(response.data);
      alert("作成完了");
      setRefresh((n) => n + 1);
    });
    setId(0);
  };

  // 更新・削除処理
  const handleEditRow = (id: number | null) => {
    const selectedProduct: FormData = data.find((v) => v.id === id);
    setId(selectedProduct.id);
    reset({
      name: selectedProduct.name,
      price: selectedProduct.price,
      description: selectedProduct.description,
    });
  };
  const handleEditCancel = () => {
    setId(0);
  };
  const handleEdit = (data: FormData) => {
    axios.put(`/api/inventory/products/${data.id}`, data).then((response) => {
      console.log(response.data);
      alert("更新完了");
      setRefresh((n) => n + 1);
    });
    setId(0);
  };
  const handleDelete = (id: number) => {
    axios.delete(`/api/inventory/products/${id}`).then((response) => {
      console.log(response.data);
      alert("削除完了");
      setRefresh((n) => n + 1);
    });
    setId(0);
  };

  return (
    <div>
      <h2>商品一覧</h2>
      <Button variant="contained" onClick={() => handleShowNewRow()}>
        商品を追加する
      </Button>
      {/* formタグを生成する */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                    // registerで登録したフィールドがformのチェック対象になる
                    // registerで指定しないとonSubmitに渡すdataに入ってこない
                    {...register("name", { required: true, maxLength: 100 })}
                  />
                  {errors.name && (
                    <div>100文字以内の商品名を入力してください</div>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    id="price"
                    {...register("price", {
                      required: true,
                      min: 1,
                      max: 99999999,
                    })}
                  />
                  {errors.price && (
                    <div>1から99999999の数値を入力してください</div>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    id="description"
                    {...register("description")}
                  />
                </td>
                <td></td>
                <td>
                  <Button variant="outlined" onClick={() => handleAddCancel()}>
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={() => setAction("add")}
                  >
                    登録する
                  </Button>
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
                      {...register("name", { required: true, maxLength: 100 })}
                    />
                    {errors.name && (
                      <div>100文字以内の商品名を入力してください</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      id="price"
                      {...register("price", { min: 1, max: 99999999 })}
                    />
                    {errors.price && (
                      <div>1から99999999の数値を入力してください</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      id="description"
                      {...register("description")}
                    />
                  </td>
                  <td></td>
                  <td>
                    <Button
                      variant="outlined"
                      onClick={() => handleEditCancel()}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={() => setAction("update")}
                    >
                      更新する
                    </Button>
                    <Button
                      type="submit"
                      variant="outlined"
                      color="warning"
                      onClick={() => setAction("delete")}
                    >
                      削除する
                    </Button>
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
                    <Button
                      variant="contained"
                      onClick={() => handleEditRow(data.id)}
                    >
                      更新・削除
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </Box>
    </div>
  );
}
