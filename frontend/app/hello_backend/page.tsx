/*
【執筆メモStart】
バックエンドへのAPI疎通が行えます。

http://localhost:3000/hello_backend で表示します。

https://nextjs.org/docs/basic-features/data-fetching/client-side
【執筆メモEnd】
*/
'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState({ message: '' })

  useEffect(() => {
    axios.get('/api/hello/backend')
      .then((res) => res.data)
      .then((data) => {
        setData(data)
      })
  }, [])

  return <div>hello {data.message}!</div>
}