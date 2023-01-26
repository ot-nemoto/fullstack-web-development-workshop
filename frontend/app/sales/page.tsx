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
  const [file, setFile] = useState()

  const onChangeFile = ((e: any) => {
    setFile(e.target.files[0])
  })

  const doAdd = ((e: any) => {
    const params = {
      file: file,
      hoge:"abc"
    }
    axios.post(`/api/sales/`, params, {
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
      <label>ファイル:</label>
      <input type="file" onChange={onChangeFile} />
      <button onClick={doAdd}>Add</button>
    </div>
  )
}