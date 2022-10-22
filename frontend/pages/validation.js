import axios from 'axios'
import { useState } from 'react'

export default function App() {
  const [message, setMessage] = useState([]);

  const [name, setName] = useState()
  const onChangeName = ((e) => {
    setName(e.target.value)
  })

  const doAdd = ((e) => {
    const params = {
      name: name,
    }
    console.log(params)
    axios.post(`/api/validation/`, params)
      .then(function (response) {
        console.log(response);
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
      <input type="text" onChange={onChangeName} />
      <button onClick={doAdd}>Add</button>
    </div>
  )
}