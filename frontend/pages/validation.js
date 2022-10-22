import axios from 'axios'
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
        // https://github.com/axios/axios#handling-errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          setMessage(error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  })

  return (
    <div>
      <ul>
        {Object.keys(message).map(key => (
          <li key={key}>{key}: {message[key]}</li>
        ))}
      </ul>
      <label>配信日:</label>
      <input type="text" onChange={onChangeDeliveryDate} />
      <label>ストア:</label>
      <input type="text" onChange={onChangeStore} />
      <button onClick={doAdd}>Add</button>
    </div>
  )
}