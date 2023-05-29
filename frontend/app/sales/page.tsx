/*
【執筆メモStart】
売上ファイルの登録、売上の参照が行えます。

http://localhost:3000/sales で表示します。
【執筆メモEnd】
*/
'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { MuiFileInput } from 'mui-file-input'


export default function Page() {
  const [data, setData] = useState([])
  const [fileSync, setFileSync] = useState()

  useEffect(() => {
    axios.get('/api/sales')
      .then((res) => res.data)
      .then((data) => {
        setData(data)
      })
  }, [])

  const onChangeFileSync = (newFile: any) => {
    setFileSync(newFile)
  }

  const doAddSync = ((e: any) => {
    const params = {
      file: fileSync
    }
    axios.post(`/api/sales/sync`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  })

  const [fileAsync, setFileAsync] = useState()

  const onChangeFileAsync = (newFile: any) => {
    setFileAsync(newFile)
  }

  const doAddAsync = ((e: any) => {
    const params = {
      file: fileAsync
    }
    axios.post(`/api/sales/async`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  })

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>処理月</TableCell>
              <TableCell>合計数量</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data: any) => (
              <TableRow key={data.monthly_date}>
                <TableCell>{data.monthly_date}</TableCell>
                <TableCell>{data.monthly_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <MuiFileInput value={fileSync} onChange={onChangeFileSync} />
        <Button variant="contained" onClick={doAddSync}>登録</Button>
      </div>
      <div>
        <MuiFileInput value={fileAsync} onChange={onChangeFileAsync} />
        <Button variant="contained" onClick={doAddAsync}>登録</Button>
      </div>
    </div>
  )
}