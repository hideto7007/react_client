
// 貯金額計算固定値
enum PriceManagementConst {
  SavingsPeriod = '貯蓄期間',
  MoneyReceived = '手取の月収',
  Bouns = 'ボーナス(1年の合計)',
  FixedCost = '固定費(家賃、光熱費、通信費、サブスクリプション、積み立て投資などなど・・・)',
  Loan = 'ローン(教育、車)',
  Privates = 'プライベート(月に自身が自由に使える)',
  Insurance = '保険(生命保険、任意保険など)'
}


// エラー定数
enum ErrorConst {
  InterServerError = 'サーバーエラー',
  ErrorMessage = 'サーバーダウン。もしくは、サーバー側で何か不具合が発生しました。'
}


// 位置調整定数
enum Align {
  Center = 'center',
  Right = 'right',
  Left = 'left',
  End = 'end',
}


// サイズ定数
enum Size {
  Small = 'small'
}


// Type定数
enum Type {
  Date = 'Date',
  Number = 'number',
  Submit = 'submit',
  Success = 'success',
  SuccessJp = '成功',
  Warning = 'warning',
  Error = 'error',
  ErrorJp = 'エラー',
  OK = 'OK',
  DeleteJp = '削除',
  EditJp = '編集',
  Edit = 'edit',
  UpdateJp = '更新',
  CreateJp = '新規登録',
  On = 'on',
  Off = 'off'
}


// 年収管理表
// 定数定義
enum ClassificationConst {
  Salary = '給料',
  Bonus = '賞与',
  OneTimePayment = '一時金',
  SmallToken = '寸志',
  Other = 'その他'
}

enum LabelConst {
  PaymentDate = '支給日',
  Age = '年齢',
  Industry = '業種',
  TotalAmount = '総支給',
  DeductionAmount = '差引額',
  TakeHomeAmount = '手取り',
  Classification = '分類',
  Edit = '編集'
}

enum KeyConst {
  IncomeForecastID = 'income_forecast_id',
  PaymentDate = 'payment_date',
  Age = 'age',
  Industry = 'industry',
  TotalAmount = 'total_amount',
  DeductionAmount = 'deduction_amount',
  TakeHomeAmount = 'take_home_amount',
  Classification = 'classification',
  UpdateUser = 'update_user',
  UserId = 'user_id',
  Edit = 'edit',
  Delete = 'delete'
}

// 定数リストを配列として作成
const classificationListConst = [
  ClassificationConst.Salary,
  ClassificationConst.Bonus,
  ClassificationConst.OneTimePayment,
  ClassificationConst.SmallToken,
  ClassificationConst.Other
] as const;

const labelListConst = [
  LabelConst.PaymentDate,
  LabelConst.Age,
  LabelConst.Industry,
  LabelConst.TotalAmount,
  LabelConst.DeductionAmount,
  LabelConst.TakeHomeAmount,
  LabelConst.Classification
] as const;

const keyListConst = [
  KeyConst.PaymentDate,
  KeyConst.Age,
  KeyConst.Industry,
  KeyConst.TotalAmount,
  KeyConst.DeductionAmount,
  KeyConst.TakeHomeAmount,
  KeyConst.Classification
] as const;

enum Auth {
  AuthToken = 'AuthToken',
  RefreshAuthToken = 'RefreshAuthToken',
  UserId = 'user_id',
  UserName = 'user_name',
  UserPassword = 'user_password'
}

// パス名とタイトルのマッピングを定義
const pathMap: { [key: string]: string } = {
  about: "アバウト",
  posts: "ポスト",
  signup: "サインアップ",
  signin: "サインイン",
  table: "テーブル",
  table1: "テーブル1",
  csvimport: "CSVインポート",
};


export { 
  PriceManagementConst,
  ErrorConst,
  Align,
  Size,
  Type,
  KeyConst,
  classificationListConst,
  labelListConst,
  keyListConst,
  LabelConst,
  Auth,
  pathMap
};