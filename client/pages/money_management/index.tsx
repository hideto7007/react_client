import React from 'react';
import { money_management_classes } from '@/common/linkpages'
import { AccountMenu } from '@/common/component_sub'
import SideBar from './SideBar'


const Home: React.FC = () => {
  return (
    <div>
      <h1>お金管理アプリ</h1>
      <SideBar classes={money_management_classes}/>
      <AccountMenu/>
    </div>
  );
};

export default Home;
