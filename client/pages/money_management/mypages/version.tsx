import React from 'react';
import { Breadcrumbs } from '@/common/component';


const Version: React.FC = () => {
  return (
    <div>
      <Breadcrumbs marginBottom='5px'/> {/* パンくずを表示する */}
      <h1>バージョン 1.0.0</h1>
    </div>
  );
};

export default Version;

