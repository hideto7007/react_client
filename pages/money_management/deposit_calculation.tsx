import React from 'react'
import { Breadcrumbs } from '@/src/common/component'

const DepositCalculation: React.FC = () => {
  return (
    <div>
      <Breadcrumbs marginBottom="5px" /> {/* パンくずを表示する */}
      <h1>貯金額算出</h1>
    </div>
  )
}

export default DepositCalculation
