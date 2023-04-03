/*
【執筆メモStart】
商品の一覧表示と追加が行えます。

http://localhost:3000/product/ で表示します。

通常のtableの表示の他に
MUIのDataGridも表示しています。 https://mui.com/x/react-data-grid/

IDを押下することで、詳細画面に移動します。

Addボタンで追加します。

https://nextjs.org/docs/basic-features/data-fetching/client-side
【執筆メモEnd】
*/
'use client'

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Link from "next/link";
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    axios.get('/api/product')
      .then((res) => res.data)
      .then((data) => {
        setData(data)
      })
  }, [refresh])

  const [name, setName] = useState()
  const onChangeName = ((e: any) => {
    setName(e.target.value)
  })


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
        setRefresh(n => n + 1) // useEffectを起動する為にsetRefreshを呼び出し
      })
  })

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
//        buildエラー回避・動作未確認
//        getRowId={(row) => row.id}
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