import React from 'react';
import AboutChild from './AboutChild';
import { Breadcrumbs } from '@/common/component';


const About: React.FC = () => {
  return (
    <div>
      <Breadcrumbs /> {/* パンくずを表示する */}
      <h1>about Child</h1>
      <AboutChild
        name='hideto'
        title='テスト ページ'/>
    </div>
  );
};

export default About;

