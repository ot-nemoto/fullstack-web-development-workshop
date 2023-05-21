/*
【執筆メモStart】
子要素にレイアウトを適用する
https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
サイドバーを実装する
https://mui.com/material-ui/react-drawer/
【執筆メモEnd】
*/
"use client";

import {
  AppBar,
  Box,
  Divider,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240;

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            在庫管理システム
          </Typography>
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
          <ListItem>
            <ListItemText primary="商品一覧" />
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
