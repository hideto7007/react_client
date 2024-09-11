import React from 'react';
import { Breadcrumbs } from '@/common/component';


const Account: React.FC = () => {
  return (
    <div>
      <Breadcrumbs marginBottom='5px'/> {/* パンくずを表示する */}
      <h1>アカウント</h1>
    </div>
  );
};

export default Account;

