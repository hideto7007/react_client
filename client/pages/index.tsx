import Link from 'next/link';
import React from 'react';
import { Breadcrumbs } from '@/common/component';

const Home: React.FC = () => {
  return (
    <div>
      <Breadcrumbs />  {/* Include Breadcrumbs at the top */}
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/Sample">Sample</Link></li>
          <li><Link href="/posts/1">Post 1</Link></li>
          <li><Link href="/table">Table</Link></li>
          <li><Link href="/table1">Table1</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
