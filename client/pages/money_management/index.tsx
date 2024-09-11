import Link from 'next/link';
import React from 'react';
import { Breadcrumbs } from '@/common/component';
import SideBar from './SideBar'


const Home: React.FC = () => {
  return (
    <div>
      <h1>お金管理アプリ</h1>
      <SideBar/>
    </div>
  );
};

export default Home;
