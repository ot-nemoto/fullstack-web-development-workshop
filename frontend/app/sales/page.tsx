/*
【執筆メモStart】
売上ファイルの登録、売上の参照が行えます。

http://localhost:3000/sales で表示します。
【執筆メモEnd】
*/
'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

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

  const onChangeFileSync = ((e: any) => {
    setFileSync(e.target.files[0])
  })

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

  const onChangeFileAsync = ((e: any) => {
    setFileAsync(e.target.files[0])
  })

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
      <h2>通常のtable</h2>
      <table>
        <thead>
          <tr>
            <th>年月</th>
            <th>合計額</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data: any) => (
            <tr key={data.monthly_date}>
              <td>{data.monthly_date}</td>
              <td>{data.monthly_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <label>ファイル同期登録:</label>
        <input type="file" onChange={onChangeFileSync} />
        <button onClick={doAddSync}>Add</button>
      </div>
      <div>
        <label>ファイル非同期登録:</label>
        <input type="file" onChange={onChangeFileAsync} />
        <button onClick={doAddAsync}>Add</button>
      </div>
    </div>
  )
}