import Link from 'next/link';
import React from 'react';
import { Breadcrumbs } from '@/common/component';

const MONEY_MANAGEMENT = '/money_management'; // ベースパスを定義

const Home: React.FC = () => {
  return (
    <div>
      <Breadcrumbs />  {/* Include Breadcrumbs at the top */}
      <h1>お金管理アプリ</h1>
      <nav>
        <ul>
          <li><Link href={`${MONEY_MANAGEMENT}/signin`}>サインイン</Link></li>
          <li><Link href={`${MONEY_MANAGEMENT}/signup`}>サインアップ</Link></li>
          <li><Link href={`${MONEY_MANAGEMENT}/about`}>About</Link></li>
          <li><Link href={`${MONEY_MANAGEMENT}/Sample`}>Sample</Link></li>
          <li><Link href={`${MONEY_MANAGEMENT}/posts/1`}>Post 1</Link></li>
          <li><Link href={`${MONEY_MANAGEMENT}/table`}>Table</Link></li>
          <li><Link href={`${MONEY_MANAGEMENT}/table1`}>Table1</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;