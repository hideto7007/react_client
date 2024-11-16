import { Divider, Drawer, List } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { ClassesProps } from '@/common/entity'
import { LinkBar } from '@/common/component';


export const SIDEBARWIDTH: number = 140;


export const SideBar: React.FC<ClassesProps> = (props) => {

  return (
    <>
      <Drawer
        anchor={props.anchor}
        open={props.open}
        onClose={props.toggleDrawer(false)} // サイドバー外をクリックしたら閉じる
      >
        <Box
          sx={{ width: SIDEBARWIDTH }}
          role="presentation"
          onClick={props.toggleDrawer(false)}
          onKeyDown={props.toggleDrawer(false)}
        >
          <List>
            {props.classes.map((val, idx) => {
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
          {/* TODO:今後各カテゴリ毎にリンクを分ける際に Divider を使用してアンダーラインを引いて分ける */}
          {/* <Divider /> */}
          {/* <List>
            {props.classes.map((val, idx) => {
              return (
                <LinkBar
                  key={idx}
                  name={val.name}
                  link={val.link}
                ></LinkBar>
              );
            }
          )}
          </List> */}
        </Box>
      </Drawer>
    </>
  );
};
