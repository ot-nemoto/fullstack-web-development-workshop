/*
【執筆メモStart】
バックエンドへのAPI疎通が行えます。

http://localhost:3000/hello_backend で表示します。

https://swr.vercel.app/ja/docs/getting-started
https://swr.vercel.app/docs/data-fetching
【執筆メモEnd】
*/
'use client';

import axios from 'axios'
import useSWR from 'swr'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function Page() {
  const { data, error } = useSWR('/api/hello/backend', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  // データをレンダリングする
  return <div>hello {data.message}!</div>
}