import axios from "axios";
import { getCookie } from "../utils/cookie";

const axios_instance = axios.create({
  headers: {
    "Content-Type": "application/json",
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
    const originalConfig = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalConfig.retry
    ) {
      const refreshToken = getCookie("refresh");
      // 認証エラーの場合は、リフレッシュトークンを使ってリトライ
      originalConfig.retry = true;
      // 以下の場合はリトライしない
      // リフレッシュトークンが取得できない場合
      if (refreshToken === null || refreshToken === undefined) {
        window.location.href = "/login";
      }
      // ログイン処理の場合
      if (originalConfig.url === "/api/inventory/login") {
        return Promise.reject(error);
      }

      axios_instance
        .post("/api/inventory/retry", { refresh: refreshToken })
        .then((response) => {
          return axios_instance(originalConfig);
        })
        .catch(function (error) {
          return Promise.reject(error);
        });
    } else if (error.response && error.response.status !== 422) {
      // 認証エラーまたは業務エラー以外の場合は、適切な画面に遷移
      window.location.href = "/login";
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios_instance;
