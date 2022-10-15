// https://swr.vercel.app/ja/docs/getting-started
// https://swr.vercel.app/docs/data-fetching

import axios from 'axios'
import useSWR from 'swr'
import { useRouter } from 'next/router';

const fetcher = url => axios.get(url).then(res => res.data)

export default function swr() {
  return Profile()
}

function Profile() {
  const router = useRouter();
  let id = router.query.id
  console.log(id)

  const { data, error } = useSWR(`/api/product/modelview/product/${id}/`, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  // データをレンダリングする
  return (
    <div>
      <div>id:{data.id}</div>
      <div>name:{data.name}</div>
    </div>
  )
}