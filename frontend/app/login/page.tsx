/*
【執筆メモStart】
next/router -> navigationに置き換え
https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration

ログイン画面のレイアウトをよりそれっぽいものに変更
https://mui.com/material-ui/getting-started/templates/
https://github.com/mui/material-ui/tree/v5.13.3/docs/data/material/getting-started/templates/sign-in
【執筆メモEnd】
*/
"use client";
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
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";

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
    // axios.post("/api/login", data).then((response) => {
    //   alert("ログインします");
    //   router.push("/inventory");
    // });
    router.push("/inventory");
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

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              type="text"
              id="username"
              variant="filled"
              label="ユーザー名（必須）"
              fullWidth
              margin="normal"
              {...register("username", { required: true })}
              error={Boolean(errors.username)}
              helperText={errors.username && "必須入力です。"}
            />
            <TextField
              type="password"
              id="password"
              variant="filled"
              label="パスワード（必須）"
              autoComplete="current-password"
              fullWidth
              margin="normal"
              {...register("password", { required: true })}
              error={Boolean(errors.password)}
              helperText={errors.password && "必須入力です。"}
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
