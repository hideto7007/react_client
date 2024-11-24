import React from 'react';
import AboutChild from './AboutChild';
import { Breadcrumbs } from '@/src/common/component';


const About: React.FC = () => {
  return (
    <div>
      <Breadcrumbs marginBottom='5px'/> {/* パンくずを表示する */}
      <h1>about Child</h1>
      <AboutChild
        name='hideto'
        title='テスト ページ'/>
    </div>
  );
};

export default About;

