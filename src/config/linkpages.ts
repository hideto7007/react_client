import { SideBarProps } from '@/src/constants/entity'

const MONEY_MANAGEMENT = '/money_management'
const MYPAGE = '/mypages'

const money_management_classes: SideBarProps[] = [
  {
    name: '貯金額算出',
    link: `${MONEY_MANAGEMENT}/deposit_calculation`,
  },
  {
    name: 'csvインポート',
    link: `${MONEY_MANAGEMENT}/csvimport`,
  },
  {
    name: 'テーブル',
    link: `${MONEY_MANAGEMENT}/table`,
  },
  {
    name: 'テーブル1',
    link: `${MONEY_MANAGEMENT}/table1`,
  },
]

const mypage_classes: SideBarProps[] = [
  {
    name: 'アカウント',
    link: `${MONEY_MANAGEMENT}${MYPAGE}/account`,
  },
  {
    name: 'バージョン',
    link: `${MONEY_MANAGEMENT}${MYPAGE}/version`,
  },
]

export { money_management_classes, mypage_classes, MONEY_MANAGEMENT, MYPAGE }
