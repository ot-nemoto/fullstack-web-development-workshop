/*
【執筆メモStart】
フロントエンド内でのAPI疎通が行えます。

http://localhost:3000/hello_frontend_fetch で表示します。

https://nextjs.org/docs/basic-features/data-fetching/client-side
【執筆メモEnd】
*/
'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [data, setData] = useState({ name: '' })

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
      })
  }, [])

  return <div>hello {data.name}!</div>
}