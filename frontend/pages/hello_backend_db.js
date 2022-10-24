/*
【執筆メモStart】
バックエンドDBへのAPI疎通が行えます。

http://localhost:3000/hello_backend_db で表示します。

https://swr.vercel.app/ja/docs/getting-started
https://swr.vercel.app/docs/data-fetching
【執筆メモEnd】
*/
import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export default function swr() {
  return Profile()
}

function Profile() {
  const { data, error } = useSWR('/api/hello_db/backend', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  // データをレンダリングする
  return <div>hello {data.message}!</div>
}