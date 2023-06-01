/*
【執筆メモStart】
next/router -> navigationに置き換え
https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration

ログイン画面のレイアウトをよりそれっぽいものに変更
https://mui.com/material-ui/getting-started/templates/
https://github.com/mui/material-ui/tree/v5.13.3/docs/data/material/getting-started/templates/sign-in

エラーメッセージが複数のバリデーションチェックの内容を返せるように修正
https://react-hook-form.com/docs/useformstate/errormessage
【執筆メモEnd】
*/
"use client";
import { getCookie, setCookie } from "../../utils/cookie";
import {
  createTheme,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "../../plugins/axios";

type FormData = {
  username: string;
  password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  // TODO remove, this demo shouldn't need to reset the theme.
  const defaultTheme = createTheme();

  const onSubmit = (event: any): void => {
    const data: FormData = {
      username: event.username,
      password: event.password,
    };

    handleLogin(data);
  };

  const handleLogin = (data: FormData) => {
    console.dir(data);
    axios
      .post("/api/inventory/token", data)
      .then((response) => {
        console.dir(response);
        // バックエンドからの応答からトークンを取得
        const access = response.data.access;
        const refresh = response.data.refresh;

        // クッキーにトークンを保存
        setCookie("access", access, 60);
        setCookie("refresh", refresh, 60);
        router.push("/inventory");
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setAuthError("ユーザー名またはパスワードに誤りがあります。");
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            ログイン
          </Typography>
          {/* TODO: ref or inputRef を使うかについて要調査
          https://react-hook-form.com/docs/useform/register */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {authError && (
              <Typography variant="body2" color="error">
                {authError}
              </Typography>
            )}{" "}
            <TextField
              type="text"
              id="username"
              variant="filled"
              label="ユーザー名（必須）"
              fullWidth
              margin="normal"
              {...register("username", { required: "必須入力です。" })}
              error={Boolean(errors.username)}
              helperText={errors.username?.message?.toString() || ""}
            />
            <TextField
              type="password"
              id="password"
              variant="filled"
              label="パスワード（必須）"
              autoComplete="current-password"
              fullWidth
              margin="normal"
              {...register("password", {
                required: "必須入力です。",
                minLength: {
                  value: 8,
                  message: "8文字以上の文字列にしてください。",
                },
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message?.toString() || ""}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              ログイン
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
