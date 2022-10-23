import axios from '../plugins/axios'
import { useState } from 'react'

export default function App() {
  const [message, setMessage] = useState([]);

  const [deliveryDate, setDeliveryDate] = useState()
  const [store, setStore] = useState()
  const onChangeDeliveryDate = ((e) => {
    setDeliveryDate(e.target.value)
  })
  const onChangeStore = ((e) => {
    setStore(e.target.value)
  })
  const doAdd = ((e) => {
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