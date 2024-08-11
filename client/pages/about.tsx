import React from 'react';
import AboutChild from './AboutChild';


const About: React.FC = () => {
  return (
    <div>
      <h1>about Child</h1>
      <AboutChild
        name='hideto'
        title='テスト ページ'/>
    </div>
  );
};

export default About;

