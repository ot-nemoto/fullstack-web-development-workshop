/*
【執筆メモStart】
フロントエンドでステートを使用します。

http://localhost:3000/hello_frontend_state で表示します。

https://nextjs.org/docs/basic-features/data-fetching/client-side
【執筆メモEnd】
*/
'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState({ name: '初期値' })

  useEffect(() => {
    const change = { name: '変更' }
    setData(change)
  }, [])

  return <div>hello {data.name}!</div>
}