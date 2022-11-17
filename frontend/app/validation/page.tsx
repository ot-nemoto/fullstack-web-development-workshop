/*
【執筆メモStart】
バックエンドへのバリデーションの疎通が行えます。

http://localhost:3000/validation で表示します。

【シリアライザNG】配信日:"2022-10-10" ストア:"11111"
【業務エラー】配信日:"2022-10-10" ストア:"123"
【OK】配信日:"2022-10-10" ストア:"135"

【執筆メモEnd】
*/
'use client'

import axios from '../../plugins/axios'
import { useState } from 'react'

export default function Page() {
  const [message, setMessage] = useState([]);

  const [deliveryDate, setDeliveryDate] = useState()
  const [store, setStore] = useState()
  const onChangeDeliveryDate = ((e: any) => {
    setDeliveryDate(e.target.value)
  })
  const onChangeStore = ((e: any) => {
    setStore(e.target.value)
  })
  const doAdd = ((e: any) => {
    const sub = [{
      store: store
    }]
    const params = {
      delivery_date: deliveryDate,
      store: store,
      price_product: sub
    }
    console.log(params)
    axios.post(`/api/validation/`, params)
      .then(function (response) {
        console.log(response);
        setMessage([]);
      })
      .catch(function (error) {
        setMessage(error.response.data);
      });
  })

  return (
    <div>
      <h4>{message}</h4>
      <label>配信日:</label>
      <input type="text" onChange={onChangeDeliveryDate} />
      <label>ストア:</label>
      <input type="text" onChange={onChangeStore} />
      <button onClick={doAdd}>Add</button>
    </div>
  )
}