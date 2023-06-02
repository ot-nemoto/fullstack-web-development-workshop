/*
【執筆メモStart】
子要素にレイアウトを適用する
https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
サイドバーを実装する
https://mui.com/material-ui/react-drawer/
【執筆メモEnd】
*/
"use client";

import { deleteCookie, getCookie } from "../../utils/cookie";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
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
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem component="a" href="/inventory/products" disablePadding>
            <ListItemButton>
              <ListItemText primary="商品一覧" />
            </ListItemButton>
          </ListItem>
          <ListItem component="a" href="/inventory/import_sales" disablePadding>
            <ListItemButton>
              <ListItemText primary="売上一括登録" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
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
