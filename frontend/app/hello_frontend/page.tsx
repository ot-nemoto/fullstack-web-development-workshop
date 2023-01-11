/*
【執筆メモStart】
フロントエンド内でのAPI疎通が行えます。

http://localhost:3000/hello_frontend で表示します。

https://nextjs.org/docs/basic-features/data-fetching/client-side
【執筆メモEnd】
*/
'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState({ name: '' })

  useEffect(() => {
    axios.get('/api/hello')
      .then((res) => res.data)
      .then((data) => {
        setData(data)
      })
  }, [])

  return <div>hello {data.name}!</div>
}