import React, { useState } from 'react';
import { AppBar, Toolbar, ToolbarProps, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FaceIcon from '@mui/icons-material/Face';
import { money_management_classes, mypage_classes } from '@/src/common/linkpages';
import { SideBar, SIDEBARWIDTH } from './SideBar';


const ToolBar: React.FC<ToolbarProps> = () => {
  // サイドバーの開閉状態を管理
  const [isMenuDrawerOpen, setMenuDrawerOpen] = useState(false); // メニューサイドバーの開閉状態
  const [isAccountDrawerOpen, setAccountDrawerOpen] = useState(false); // アカウントサイドバーの開閉状態

  // メニューサイドバーをトグルする関数
  const menuToggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setMenuDrawerOpen(open);
  };

  // アカウントサイドバーをトグルする関数
  const accountToggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setAccountDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: isMenuDrawerOpen || isAccountDrawerOpen ? `calc(100% - ${SIDEBARWIDTH}px)` : '100%',
          ml: isMenuDrawerOpen ? `${SIDEBARWIDTH}px` : 0, // 左側サイドバーの開閉に対応
          mr: isAccountDrawerOpen ? `${SIDEBARWIDTH}px` : 0, // 右側サイドバーの開閉に対応
          transition: 'width 0.3s, margin-left 0.3s, margin-right 0.3s',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start" // 左端に配置
            color="inherit"
            aria-label="menu"
            onClick={menuToggleDrawer(true)} // サイドバーを開く
          > {/* メニューボタン */}
              <MenuIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            お金管理アプリ
          </Typography>
            <IconButton
              edge="end" // 右端に配置
              color="inherit"
              onClick={accountToggleDrawer(true)} // サイドバーを開く
            > {/* アカウントボタン */}
              <FaceIcon />
            </IconButton>
        </Toolbar>
      </AppBar>
        <Toolbar />
      {/* サイドバーの表示・非表示 */}
      <SideBar
        anchor={"left"}
        classes={money_management_classes}
        open={isMenuDrawerOpen} // サイドバーの状態を渡す
        toggleDrawer={menuToggleDrawer} // サイドバーの開閉関数を渡す
      />
      <SideBar
        anchor={"right"}
        classes={mypage_classes}
        open={isAccountDrawerOpen} // サイドバーの状態を渡す
        toggleDrawer={accountToggleDrawer} // サイドバーの開閉関数を渡す
      />
    </>
  );
};


export default ToolBar;
