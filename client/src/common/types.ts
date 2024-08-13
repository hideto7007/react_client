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
interface AnnualIncomeManagementKeyNotEdit {
    payment_date: string;
    age: number;
    industry: string;
    total_amount: number;
    deduction_amount: number;
    take_home_amount: number;
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
    id: number;
    income_forecast_id: string;
    update_user: string;
    classification: string;
    user_id: number;
  }

interface AnnualIncomeManagementCreateData extends AnnualIncomeManagementData {}
  
interface AnnualIncomeManagementUpdateData extends AnnualIncomeManagementData {}

interface AnnualIncomeManagementDeleteData extends AnnualIncomeManagementData {}

type Order = 'asc' | 'desc';

interface Column {
    id: keyof AnnualIncomeManagementKey; // AnnualIncomeManagementData のプロパティ名のいずれか
    label: string;
    minWidth?: number;
    disablePadding: boolean;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
    required: boolean;
  }

interface ColumnNotEdit {
    id: keyof AnnualIncomeManagementKeyNotEdit; // AnnualIncomeManagementData のプロパティ名のいずれか
    label: string;
    minWidth?: number;
    disablePadding: boolean;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
    required: boolean;
  }

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof AnnualIncomeManagementKeyNotEdit) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    selected: readonly number[];  // 選択された行のIDを含む配列
    data: AnnualIncomeManagementDeleteData[];  // 選択された行のデータ
    onDelete: (data: AnnualIncomeManagementDeleteData[], selected: readonly number[]) => void;  // 削除時に呼ばれる関数
  }

export type {
    AnnualIncomeManagementKey,
    AnnualIncomeManagementData,
    AnnualIncomeManagementCreateData,
    AnnualIncomeManagementUpdateData,
    Column,
    ColumnNotEdit,
    AnnualIncomeManagementKeyNotEdit,
    EnhancedTableProps,
    AnnualIncomeManagementDeleteData,
    EnhancedTableToolbarProps,
    Order
}  