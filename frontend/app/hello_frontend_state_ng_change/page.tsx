/*
【執筆メモStart】
フロントエンドでステートを使用します。

http://localhost:3000/hello_frontend_state_ng_change で表示します。

useEffectにて'変更'をdata変数に定義する前に、すでにレンダリングが完了しているので
「hello 初期値!」と画面に表示されます。

https://nextjs.org/docs/basic-features/data-fetching/client-side
【執筆メモEnd】
*/
'use client'

import { useEffect } from 'react'

export default function Page() {
  let data = { name: '初期値' }

  useEffect(() => {
    const change = { name: '変更' }
    data = change
  }, [])

  return <div>hello {data.name}!</div>
}