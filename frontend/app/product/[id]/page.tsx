/*
【執筆メモStart】
商品の詳細表示、更新、削除が行えます。

http://localhost:3000/product/1 で参照します。
Updateボタンで更新します。
Deleteボタンで削除します。

https://swr.vercel.app/ja/docs/getting-started
https://swr.vercel.app/docs/data-fetching
https://beta.nextjs.org/docs/api-reference/use-router
【執筆メモEnd】
*/
'use client';

import axios from 'axios'
import { useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function Page({ params }: {
  params: { id: string },
}) {
  const [name, setName] = useState()

  const onChangeName = ((e: any) => {
    setName(e.target.value)
  })

  const doUpdate = ((e: any) => {
    const ob = {
      name: name,
    }
    console.log(ob)
    axios.put(`/api/product/${id}`, ob)
      .then(function (response) {
        console.log(response.data);
        alert('更新完了')
        router.push('/product');
      })
  })

  const doDelete = ((e: any) => {
    axios.delete(`/api/product/${id}`)
      .then(function (response) {
        console.log(response.data);
        alert('削除完了')
        router.push('/product');
      })
  })

  const router = useRouter();
  let id = params.id
  console.log(id)

  const { data, error } = useSWR(`/api/product/${id}/`, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  // データをレンダリングする
  return (
    <div>
      <div>id:{data.id}</div>
      <div>name:{data.name}</div>
      <input type="text" onChange={onChangeName} />
      <button onClick={doUpdate}>Update</button>
      <button onClick={doDelete}>Delete</button>
    </div>
  )
}