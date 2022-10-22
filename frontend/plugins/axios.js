import axios from 'axios';
import Error from 'next/error';

const axios_instance = axios.create();

// https://github.com/axios/axios#interceptors
// https://github.com/axios/axios#handling-errors

// Add a request interceptor
axios_instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios_instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);

    if (error.response.status == '400') {
      return Promise.reject(error);
    }

    // TODO エラーページ遷移
    window.location.href = '/error'
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);

    // TODO エラーページ遷移
    window.location.href = '/error'
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);

    // TODO エラーページ遷移
    window.location.href = '/error'
  }
  console.log(error.config);

  return Promise.reject(error);
});

export default axios_instance;
