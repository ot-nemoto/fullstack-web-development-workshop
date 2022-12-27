/*
【執筆メモStart】
フロントエンド内でのAPI疎通が行えます。

http://localhost:3000/hello_frontend_fetch で表示します。

https://swr.vercel.app/ja/docs/getting-started
https://swr.vercel.app/docs/data-fetching
【執筆メモEnd】
*/
'use client'

// TODO 作成中

import { useState } from 'react'

export default function Page() {
  const [data, setData] = useState({ data: [] })
  fetch('/api/hello').then(res => res.json()).then(res => setData(res))

  return <div>hello {data.name}!</div>
}