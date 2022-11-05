/*
【執筆メモStart】
バックエンドへのファイルアップロードの疎通が行えます。

http://localhost:3000/file で表示します。

ファイルとテキストを登録することができます。

【TODO】multiple属性（複数ファイル指定）のケースも実施できるとよい？
【TODO】ダウンロード機能があるとよい？

【執筆メモEnd】
*/
'use client'

import axios from '../../plugins/axios'
import { useState } from 'react'

export default function Page() {
  const [message, setMessage] = useState([])
  const [file1, setFile1] = useState()
  const [file2, setFile2] = useState()
  const [text, setText] = useState()
  const onChangeFile1 = ((e: any) => {
    setFile1(e.target.files[0])
  })
  const onChangeFile2 = ((e: any) => {
    setFile2(e.target.files[0])
  })
  const onChangeText = ((e: any) => {
    setText(e.target.value)
  })

  const doAdd = ((e: any) => {
    console.log(file1)
    console.log(file2)
    console.log(text)
    const params = {
      file1: file1,
      file2: file2,
      text: text,
    }
    axios.post(`/api/file/`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(function (response) {
        console.log(response);
        setMessage([]);
      })
      .catch(function (error) {
        setMessage(error.response.data);
      });
  })

  return (
    <div>
      <h4>{message}</h4>
      <label>ファイル1:</label>
      <input type="file" onChange={onChangeFile1} />
      <label>ファイル2:</label>
      <input type="file" onChange={onChangeFile2} />
      <label>テキスト:</label>
      <input type="text" onChange={onChangeText} />
      <button onClick={doAdd}>Add</button>
    </div>
  )
}