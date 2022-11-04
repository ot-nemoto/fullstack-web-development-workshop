/*
【執筆メモStart】
axiosのインターセプタ―を定義しています。

リクエストの直前、リクエストの直後に実施する内容を定義しています。

レスポンスがエラー（2xx以外）で、422（業務エラー）でない場合は
専用のエラー画面に遷移しています。

本インスタンスをimportすることで、インターセプタ―が使用できるようになります。

https://axios.nuxtjs.org/extend/ を真似してpluginsディレクトリに配置しています。

https://github.com/axios/axios#interceptors
https://github.com/axios/axios#handling-errors

【執筆メモEnd】
*/
import axios from 'axios';
import Router from 'next/router';
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
    // ※【TODO】Next.js13にしてから正常に動作しない
    Router.push(String(error.response.status))
  } else {
    return Promise.reject(error);
  }
});

export default axios_instance;
