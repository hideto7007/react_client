import { Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { SideBarProps } from '@/common/types'
import { LinkBar } from '@/common/component';

const MONEY_MANAGEMENT = '/money_management'; // ベースパスを定義

const SideBar: React.FC = () => {

const classes: SideBarProps[] = [
    {
        name: "アバウト",
        link: `${MONEY_MANAGEMENT}/about`
    },
    {
        name: "csvインポート",
        link: `${MONEY_MANAGEMENT}/csvimport`
    },
    {
        name: "テーブル",
        link: `${MONEY_MANAGEMENT}/table`
    },
    {
        name: "テーブル1",
        link: `${MONEY_MANAGEMENT}/table1`
    },
]

  return (
    <List>
      {classes.map((val, idx) => {
        return (
          <LinkBar
            key={idx}
            name={val.name}
            link={val.link}
          ></LinkBar>
        );
      }
    )}
    </List>
  );
};

export default SideBar;
