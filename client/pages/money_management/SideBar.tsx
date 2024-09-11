import { List} from '@mui/material';
import React from 'react';
import { ClassesProps } from '@/common/types'
import { LinkBar } from '@/common/component';


const SideBar: React.FC<ClassesProps> = (props) => {

  return (
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
  );
};

export default SideBar;
