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
    "Content-Type": "application/json",
  },
});

axios_instance.interceptors.request.use(
  function (config) {
    const access = getCookie("access");
    if (access) {
      config.headers = {
        ...config.headers,
        Authorization: "Bearer " + access,
      };
    }
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
    const originalConfig = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalConfig.retry
    ) {
      console.dir(getCookie("refresh"));
      // 認証エラーの場合は、リフレッシュトークンを使ってリトライ
      originalConfig.retry = true;
      axios_instance
        .post("/api/inventory/token/refresh", { refresh: getCookie("refresh") })
        .then((response) => {
          // バックエンドからの応答からトークンを取得
          const access = response.data.access;
          const refresh = response.data.refresh;

          // クッキーにトークンを保存
          setCookie("access", access, 60);
          setCookie("refresh", refresh, 60);

          if (access) {
            originalConfig.headers = {
              ...originalConfig.headers,
              Authorization: "Bearer " + access,
            };
          }
          return axios_instance(originalConfig);
        })
        .catch(function (error) {
          return Promise.reject(error);
        });
    } else if (error.response && error.response.status !== 422) {
      // 認証エラーまたは業務エラー以外の場合は、適切な画面に遷移
      window.location.href = "/" + error.response.status;
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios_instance;
