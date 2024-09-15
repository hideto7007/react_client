import React from 'react';
import { mypage_classes } from '@/common/linkpages'
import { BoxLayoutPadding, Breadcrumbs } from '@/common/component';


const Mypage: React.FC = () => {
  return (
    <BoxLayoutPadding>
      <Breadcrumbs
        marginBottom="12px"/> {/* パンくずを表示する */}
      <h1>マイページ</h1>
    </BoxLayoutPadding>
  );
};

export default Mypage;
