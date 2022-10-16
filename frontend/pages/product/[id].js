// https://swr.vercel.app/ja/docs/getting-started
// https://swr.vercel.app/docs/data-fetching

import axios from 'axios'
import { useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router';

const fetcher = url => axios.get(url).then(res => res.data)

export default function swr() {
  return Profile()
}

function Profile() {
  const [name, setName] = useState()

  const onChangeName = ((e) => {
    setName(e.target.value)
  })

  const doUpdate = ((e) => {
    const ob = {
      name: name,
    }
    console.log(ob)
    axios.put(`/api/product/modelview/product/${id}`, ob)
      .then(function (response) {
        console.log(response.data);
        alert('更新完了')
      })
  })

  const doDelete = ((e) => {
    axios.delete(`/api/product/modelview/product/${id}`)
      .then(function (response) {
        console.log(response.data);
        alert('削除完了')
      })
  })


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
      <input type="text" onChange={onChangeName} />
      <button onClick={doUpdate}>Update</button>
      <button onClick={doDelete}>Delete</button>
    </div>
  )
}