/*
【執筆メモStart】
バックエンドDBへのAPI疎通が行えます。

http://localhost:3000/hello_backend_db で表示します。

https://nextjs.org/docs/basic-features/data-fetching/client-side
【執筆メモEnd】
*/
'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState({ message: '' })

  useEffect(() => {
    axios.get('/api/hello_db/backend')
      .then((res) => res.data)
      .then((data) => {
        setData(data)
      })
  }, [])

  return <div>hello {data.message}!</div>
}