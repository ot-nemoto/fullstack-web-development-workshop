/*
【執筆メモStart】
商品の詳細表示、更新、削除が行えます。

http://localhost:3000/product/1 で参照します。
Updateボタンで更新します。
Deleteボタンで削除します。

https://nextjs.org/docs/basic-features/data-fetching/client-side
https://beta.nextjs.org/docs/api-reference/use-router
【執筆メモEnd】
*/
'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page({ params }: {
  params: { id: string },
}) {
  const [data, setData] = useState({ id: '', name: '' })
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

  useEffect(() => {
    axios.get(`/api/product/${id}/`)
      .then((res) => res.data)
      .then((data) => {
        setData(data)
      })
  }, [])

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