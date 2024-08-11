// インターフェース定義
interface AnnualIncomeManagementKey {
    payment_date: string;
    age: number;
    industry: string;
    total_amount: number;
    deduction_amount: number;
    take_home_amount: number;
    edit: string;
}

// インターフェース定義
interface AnnualIncomeManagement {
    payment_date: string;
    age: number;
    industry: string;
    total_amount: number;
    deduction_amount: number;
    take_home_amount: number;
}

interface AnnualIncomeManagementData extends AnnualIncomeManagement {
    income_forecast_id: string;
    update_user: string;
    classification: string;
    user_id: number;
  }

interface AnnualIncomeManagementCreateData extends AnnualIncomeManagementData {}
  
interface AnnualIncomeManagementUpdateData extends AnnualIncomeManagementData {}

interface Column {
    id: keyof AnnualIncomeManagementKey; // AnnualIncomeManagementData のプロパティ名のいずれか
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
    required: boolean;
  }

export type {
    AnnualIncomeManagementData,
    AnnualIncomeManagementCreateData,
    AnnualIncomeManagementUpdateData,
    Column
}