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

リクエストヘッダーにJWTを加えます。
https://github.com/axios/axios#axioscreateconfig

【執筆メモEnd】
*/
import axios from "axios";
import { getCookie, setCookie } from "../utils/cookie";

const axios_instance = axios.create({
  headers: {
    Authorization: `Bearer ${getCookie("access")}`,
  },
});

axios_instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios_instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status != 422) {
      window.location.href = "/" + error.response.status;
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios_instance;
