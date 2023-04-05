/*
【執筆メモStart】
フロントエンドでステートを使用します。

http://localhost:3000/hello_frontend_state_ng_change で表示します。

https://reactjs.org/docs/faq-state.html
setState() schedules an update to a component’s state object. When state changes, the component responds by re-rendering.
のとおり、ステートが変わると再レンダリング（Page()を再呼出）します。
ステートが変わる→再レンダリング→ステートが変わる…を無限に繰り返して
「Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.」エラーになります。

https://nextjs.org/docs/basic-features/data-fetching/client-side
【執筆メモEnd】
*/
'use client'

import { useState } from 'react'

export default function Page() {
  const [data, setData] = useState({ name: '初期値' })

  // yarn buildでエラーになるのでコメントアウトStart
  // const change = { name: '変更' }
  // setData(change)
  // yarn buildでエラーになるのでコメントアウトEnd

  return <div>hello {data.name}!</div>
}
