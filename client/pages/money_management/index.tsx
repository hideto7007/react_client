import React from 'react';
import { money_management_classes } from '@/common/linkpages'
import SideBar from './SideBar'


const Home: React.FC = () => {
  return (
    <div>
      <h1>お金管理アプリ</h1>
      <SideBar classes={money_management_classes}/>
    </div>
  );
};

export default Home;
