/*
【執筆メモStart】
子要素にレイアウトを適用する
https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
サイドバーを実装する
https://mui.com/material-ui/react-drawer/
【執筆メモEnd】
*/
"use client";

import { useState } from "react";
import { deleteCookie, getCookie } from "../../utils/cookie";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Logout as LogoutIcon, Menu as MenuIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /** サイドバーの開閉を管理する */
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    console.dir(open);
    setOpen(open);
  };

  /** 各種画面への遷移を管理する */
  const router = useRouter();

  const isLoggedIn = () => {
    return getCookie("access") !== null && getCookie("refresh") !== null;
  };

  if (!isLoggedIn()) {
    router.replace("/login"); // ログインしていなければサインインページへ転送
  }

  // ログアウト処理
  const handleLogout = () => {
    deleteCookie("access");
    deleteCookie("refresh");
    router.replace("/login");
  };

  /** 開閉対象となるサイドバー本体 */
  const list = () => (
    <Box sx={{ width: 240 }}>
      <Toolbar />
      <Divider />
      <List>
        <ListItem component="a" href="/inventory/products" disablePadding>
          <ListItemButton>
            <ListItemText primary="商品一覧" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem component="a" href="/inventory/import_sales" disablePadding>
          <ListItemButton>
            <ListItemText primary="売上一括登録" />
          </ListItemButton>
        </ListItem>
        <Divider />
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton onClick={() => toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            在庫管理システム
          </Typography>
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={() => handleLogout()}
          >
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => toggleDrawer(false)} anchor="left">
        {list()}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // TODO: AppBarと被るため下にずらしている。本来は動的に取得すべき
          marginTop: "64px",
          background: "white",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
