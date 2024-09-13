import { Drawer, List, ListItem, MenuItem, MenuList, Paper, Stack, styled} from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { ClassesProps } from '@/common/types'
import { LinkBar } from '@/common/component';


const SideBar: React.FC<ClassesProps> = (props) => {

  return (
    <>
      <Drawer
        anchor="left" // 左側に表示
        open={props.open}
        onClose={props.toggleDrawer(false)} // サイドバー外をクリックしたら閉じる
      >
        <Box
          sx={{ width: 250 }}
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
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;


// <List>
    //   {props.classes.map((val, idx) => {
    //     return (
    //       <LinkBar
    //         key={idx}
    //         name={val.name}
    //         link={val.link}
    //       ></LinkBar>
    //     );
    //   }
    // )}
    // </List>