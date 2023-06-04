/*
【執筆メモStart】
各コンポーネントの見た目はMUIのデフォルトを適用しています
@mui/materialは最新、@material-ui/coreは以前のものなので参考コードを探すときは注意
https://mui.com/material-ui/getting-started/overview/
@mui/icons-materialで使用可能なアイコン一覧
https://mui.com/material-ui/material-icons/
【執筆メモEnd】
*/
"use client";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "../../../plugins/axios";
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
    const selectedProduct: FormData = data.find((v) => v.id === id) as FormData;
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
    <Box>
      <Typography variant="h5">商品一覧</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleShowNewRow()}
      >
        商品を追加する
      </Button>
      {/* formタグを生成する */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ height: 400, width: "100%" }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 40 }}>ID</TableCell>
                <TableCell>商品名</TableCell>
                <TableCell>単価</TableCell>
                <TableCell>説明</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {id === null ? (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      id="name"
                      variant="filled"
                      // registerで登録したフィールドがformのチェック対象になる
                      // registerで指定しないとonSubmitに渡すdataに入ってこない
                      {...register("name", { required: true, maxLength: 100 })}
                    />
                    {errors.name && (
                      <div>100文字以内の商品名を入力してください</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      id="price"
                      variant="filled"
                      {...register("price", {
                        required: true,
                        min: 1,
                        max: 99999999,
                      })}
                    />
                    {errors.price && (
                      <div>1から99999999の数値を入力してください</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      id="description"
                      variant="filled"
                      {...register("description")}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => handleAddCancel()}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={() => setAction("add")}
                    >
                      登録する
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}
              {data.map((data: any) =>
                id === data.id ? (
                  <TableRow key={data.id}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        id="name"
                        variant="filled"
                        {...register("name", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                      {errors.name && (
                        <div>100文字以内の商品名を入力してください</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        id="price"
                        variant="filled"
                        {...register("price", { min: 1, max: 99999999 })}
                      />
                      {errors.price && (
                        <div>1から99999999の数値を入力してください</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        id="description"
                        variant="filled"
                        {...register("description")}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => handleEditCancel()}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => setAction("update")}
                      >
                        更新する
                      </Button>
                      <IconButton
                        aria-label="削除する"
                        type="submit"
                        color="warning"
                        onClick={() => setAction("delete")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={data.id}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.price}</TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>
                      <Link href={`/inventory/products/${data.id}`}>
                        在庫処理
                      </Link>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="編集する"
                        color="primary"
                        onClick={() => handleEditRow(data.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {id === null ? (
                <TableRow>
                  <TableCell>
                    <Typography>ID：</Typography>
                    <Typography>
                      商品名：
                      <TextField
                        type="text"
                        id="name"
                        variant="filled"
                        {...register("name", {
                          required: true,
                          maxLength: 100,
                        })}
                      />
                      {errors.name && (
                        <div>100文字以内の商品名を入力してください</div>
                      )}
                    </Typography>
                    <Typography>
                      価格：
                      <TextField
                        type="number"
                        id="price"
                        variant="filled"
                        {...register("price", {
                          required: true,
                          min: 1,
                          max: 99999999,
                        })}
                      />
                      {errors.price && (
                        <div>1から99999999の数値を入力してください</div>
                      )}
                    </Typography>
                    <Typography>
                      説明：
                      <TextField
                        type="text"
                        id="description"
                        variant="filled"
                        {...register("description")}
                      />
                    </Typography>
                    <Typography>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => handleAddCancel()}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => setAction("add")}
                      >
                        登録する
                      </Button>
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}
              {data.map((data: any) =>
                id === data.id ? (
                  <TableRow key={data.id}>
                    <TableCell>
                      <Typography>ID：{data.id}</Typography>
                      <Typography>
                        商品名：
                        <TextField
                          type="text"
                          id="name"
                          variant="filled"
                          {...register("name", {
                            required: true,
                            maxLength: 100,
                          })}
                        />
                        {errors.name && (
                          <div>100文字以内の商品名を入力してください</div>
                        )}
                      </Typography>
                      <Typography>
                        価格：
                        <TextField
                          type="number"
                          id="price"
                          variant="filled"
                          {...register("price", {
                            required: true,
                            min: 1,
                            max: 99999999,
                          })}
                        />
                        {errors.price && (
                          <div>1から99999999の数値を入力してください</div>
                        )}
                      </Typography>
                      <Typography>
                        説明：
                        <TextField
                          type="text"
                          id="description"
                          variant="filled"
                          {...register("description")}
                        />
                      </Typography>
                      <Typography>
                        <Button
                          aria-label="キャンセル"
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => handleEditCancel()}
                        >
                          キャンセル
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<CheckIcon />}
                          onClick={() => setAction("update")}
                        >
                          更新する
                        </Button>
                        <IconButton
                          aria-label="削除する"
                          type="submit"
                          color="warning"
                          onClick={() => setAction("delete")}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={data.id}>
                    <TableCell>
                      <Typography>ID：{data.id}</Typography>
                      <Typography>商品名：{data.name}</Typography>
                      <Typography>価格：{data.price}</Typography>
                      <Typography>説明：{data.description}</Typography>
                      <Typography>
                        <Link href={`/inventory/products/${data.id}`}>
                          在庫処理
                        </Link>
                        <IconButton
                          aria-label="編集する"
                          color="primary"
                          onClick={() => handleEditRow(data.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
