import Link from 'next/link';
import React from 'react';
import { Breadcrumbs } from '@/common/component';
import SideBar from './SideBar'

const MONEY_MANAGEMENT = '/money_management'; // ベースパスを定義

const Home: React.FC = () => {
  return (
    <div>
      <Breadcrumbs />  {/* Include Breadcrumbs at the top */}
      <h1>お金管理アプリ</h1>
      <SideBar/>
    </div>
  );
};

export default Home;
