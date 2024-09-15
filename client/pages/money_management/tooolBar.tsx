import React, { useState } from 'react';
import { AppBar, Box, Toolbar, ToolbarProps, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { money_management_classes } from '@/common/linkpages';
import { SideBar, SIDEBARWIDTH } from './SideBar';
import { AccountMenu } from '@/common/component_sub';


const ToolBar: React.FC<ToolbarProps> = () => {
  // サイドバーの開閉状態を管理
  const [isDrawerOpen, setDrawerOpen] = useState(false); // サイドバーの開閉状態

  // サイドバーをトグルする関数
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setDrawerOpen(open);
  };

  return (
    <>
      {/* ツールバーの位置や幅を Drawer の開閉状態に応じて調整 */}
      <AppBar
        position="fixed"
        sx={{
          width: isDrawerOpen ? `calc(100% - ${SIDEBARWIDTH}px)` : '100%',
          ml: isDrawerOpen ? `${SIDEBARWIDTH}px` : 0,
          transition: 'width 0.3s, margin-left 0.3s',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start" // 左端に配置
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)} // サイドバーを開く
          >
              <MenuIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            お金管理アプリ
          </Typography>
          <AccountMenu /> {/* 右端にアカウントメニュー */}
        </Toolbar>
      </AppBar>
        <Toolbar />
      {/* サイドバーの表示・非表示 */}
      <SideBar
        classes={money_management_classes}
        open={isDrawerOpen} // サイドバーの状態を渡す
        toggleDrawer={toggleDrawer} // サイドバーの開閉関数を渡す
      />
    </>
  );
};


export default ToolBar;
