/*
【執筆メモStart】
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
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "../../../../plugins/axios";

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
    <Box>
      <Typography variant="h5">商品在庫管理</Typography>
      <Typography variant="h6">在庫処理</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <TextField
            disabled
            id="name"
            variant="filled"
            label="商品名"
            defaultValue={product.name}
          />
        </Box>
        <Box>
          <TextField
            type="number"
            id="quantity"
            variant="filled"
            label="数量"
            {...register("quantity", { required: true, min: 1, max: 99999999 })}
          />
          {errors.quantity && <div>1から99999999の数値を入力してください</div>}
        </Box>
        <Button
          variant="contained"
          type="submit"
          onClick={() => setAction("purchase")}
        >
          商品を仕入れる
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => setAction("sell")}
        >
          商品を卸す
        </Button>
      </Box>
      <Typography variant="h6">在庫履歴</Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{
            display: { mobile: "none", desktop: "table" },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>処理種別</TableCell>
              <TableCell>処理日時</TableCell>
              <TableCell>単価</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>価格</TableCell>
              <TableCell>在庫数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data: any) => (
              <TableRow key={data.id}>
                <TableCell>{data.type}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.unit}</TableCell>
                <TableCell>{data.quantity}</TableCell>
                <TableCell>{data.price}</TableCell>
                <TableCell>{data.inventory}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table
          sx={{
            display: { mobile: "table", desktop: "none" },
          }}
        >
          <TableBody>
            {data.map((data: any) => (
              <TableRow key={data.id}>
                <TableCell>
                  <Typography>処理種別：{data.type}</Typography>
                  <Typography>処理日時：{data.date}</Typography>
                  <Typography>単価：{data.unit}</Typography>
                  <Typography>数量：{data.quantity}</Typography>
                  <Typography>価格：{data.price}</Typography>
                  <Typography>在庫数：{data.inventory}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
