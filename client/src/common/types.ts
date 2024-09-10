import { ReactNode } from "react";
import { Control, ControllerFieldState, FieldError, FieldErrors, FieldValues, Path, RegisterOptions, UseFormClearErrors, UseFormRegister, UseFormSetError, UseFormSetValue } from "react-hook-form";

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

interface Validate {
    payment_date: string | boolean | null;
    age: string | boolean | null;
    industry: string | boolean | null;
    total_amount: string | boolean | null;
    deduction_amount: string | boolean | null;
    take_home_amount: string | boolean | null;
    classification: string | boolean | null;
  }

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
    checkboxLabel: string;
    checked: boolean;
    onCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    // onCheckBox: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  }

interface editDialogProps {
    editDialogLabel: string;
    // checked: boolean;
    dialogOpen: boolean;
    row: AnnualIncomeManagementDeleteData | null;
    handleClose: () => void;
  }

interface CsvFileSetting {
  file: File | null;
}

interface FileSelectProps {
  setValue: UseFormSetValue<CsvFileSetting>;
  register: UseFormRegister<CsvFileSetting>;
  control: Control<CsvFileSetting, any>;
  errors: FieldErrors<CsvFileSetting>;
  setError: UseFormSetError<CsvFileSetting>;
  clearErrors: UseFormClearErrors<CsvFileSetting>;
};

interface AuthFormProps {
  email: string;
  password: string;
  confirmPassword?: string;  // Sign Upの場合のみ必要
}

interface PasswordFormProps {
  name: keyof AuthFormProps;
  label: string;
  control: Control<AuthFormProps>;  // Tに依存するControl型
  rules?: Omit<RegisterOptions<AuthFormProps>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined;
  fieldState?: ControllerFieldState;
  fullWidth?: boolean;
}

interface TextFormProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;  // Tに依存するControl型
  rules?: Omit<RegisterOptions<T>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined;
  fieldState?: ControllerFieldState;
  fullWidth?: boolean;
}

interface SideBarProps {
  name: string
  link: string
}

interface BoxProps {
  children: ReactNode;
  direction?: "row" | "column";
  wrap?: "wrap" | "nowrap";
  gap?: "none" | "narrow" | "medium" | "wide";
  width?: string;
  bordered?: boolean;
  valign?: "top" | "bottom" | "center";
  halign?: "left" | "right" | "center";
  itemValign?: "top" | "bottom" | "center" | "stretch";
  itemHalign?: "left" | "right" | "center" | "stretch";
  marginBottom?: string;
  display?: string;
}

interface CsvImportMainProps {};

export type {
    AnnualIncomeManagementKey,
    AnnualIncomeManagementData,
    AnnualIncomeManagementCreateData,
    AnnualIncomeManagementUpdateData,
    Validate,
    Column,
    ColumnNotEdit,
    AnnualIncomeManagementKeyNotEdit,
    EnhancedTableProps,
    AnnualIncomeManagementDeleteData,
    EnhancedTableToolbarProps,
    editDialogProps,
    Order,
    CsvFileSetting,
    FileSelectProps,
    CsvImportMainProps,
    TextFormProps,
    PasswordFormProps,
    AuthFormProps,
    SideBarProps,
    BoxProps
}