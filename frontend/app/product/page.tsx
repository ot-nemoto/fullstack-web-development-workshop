/*
【執筆メモStart】
商品の一覧表示と追加が行えます。

http://localhost:3000/product/ で表示します。

通常のtableの表示の他に
MUIのDataGridも表示しています。 https://mui.com/x/react-data-grid/

IDを押下することで、詳細画面に移動します。

Addボタンで追加します。

https://swr.vercel.app/ja/docs/getting-started
https://swr.vercel.app/docs/data-fetching
【執筆メモEnd】
*/
'use client';

import axios from 'axios'
import useSWR from 'swr'
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react'
import Box from '@mui/material/Box';
import Link from "next/link";

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function Page() {
  const { data, error } = useSWR('/api/product/', fetcher)

  const [name, setName] = useState()
  const onChangeName = ((e: any) => {
    setName(e.target.value)
  })

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const columns = [
    {
      field: 'id',
      headerName: 'id',
    },
    {
      field: 'name',
      headerName: 'name',
    },
  ];

  const doAdd = ((e: any) => {
    const ob = {
      name: name,
    }
    console.log(ob)
    axios.post(`/api/product/`, ob)
      .then(function (response) {
        console.log(response.data);
        alert('作成完了')
      })
  })

  // データをレンダリングする
  return (
    <div>
      <h2>通常のtable</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data: any) => (
            <tr key={data.id}>
              <Link href={`/product/${data.id}`}>{data.id}</Link>
              <td>{data.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>MUIのDataGrid https://mui.com/x/react-data-grid/</h2>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.id}
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>

      <input type="text" onChange={onChangeName} />
      <button onClick={doAdd}>Add</button>
    </div>
  )
}