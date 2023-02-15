/*
【執筆メモStart】
売上ファイルの登録、売上の参照が行えます。

http://localhost:3000/sales で表示します。
【執筆メモEnd】
*/
'use client'

import axios from 'axios'
import { useState } from 'react'

export default function Page() {
  const [fileSync, setFileSync] = useState()

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