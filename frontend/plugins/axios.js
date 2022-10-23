import axios from 'axios';
import Router from 'next/router';

// https://github.com/axios/axios#interceptors
// https://github.com/axios/axios#handling-errors

const axios_instance = axios.create();

axios_instance.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios_instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response && error.response.status != 422) {
    Router.push(String(error.response.status))
  } else {
    return Promise.reject(error);
  }
});

export default axios_instance;
