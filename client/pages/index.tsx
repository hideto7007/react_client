import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/posts/1">Post 1</Link></li>
          <li><Link href="/table">table</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
