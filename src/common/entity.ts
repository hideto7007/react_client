import { BoxProps } from "@mui/material";
import { ReactNode } from "react";
import {
  Control,
  ControllerFieldState,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";

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

type Order = "asc" | "desc";

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
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
  required: boolean;
}

interface ColumnNotEdit {
  id: keyof AnnualIncomeManagementKeyNotEdit; // AnnualIncomeManagementData のプロパティ名のいずれか
  label: string;
  minWidth?: number;
  disablePadding: boolean;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
  required: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof AnnualIncomeManagementKeyNotEdit,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: readonly number[]; // 選択された行のIDを含む配列
  data: AnnualIncomeManagementDeleteData[]; // 選択された行のデータ
  onDelete: (
    data: AnnualIncomeManagementDeleteData[],
    selected: readonly number[],
  ) => void; // 削除時に呼ばれる関数
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
}

interface AuthFormProps {
  user_name: string;
  user_password: string;
  confirm_password?: string; // Sign Upの場合のみ必要
  nick_name?: string; // Sign Upの場合のみ必要
}

interface SigninResProps {
  data: AuthFormProps[];
}

interface SignUpResProps {
  data: AuthFormProps[];
}

interface PasswordFormProps {
  name: keyof AuthFormProps;
  label: string;
  control: Control<AuthFormProps>; // Tに依存するControl型
  rules?:
    | Omit<
        RegisterOptions<AuthFormProps>,
        "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
      >
    | undefined;
  fieldState?: ControllerFieldState;
  fullWidth?: boolean;
}

interface TextFormProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>; // Tに依存するControl型
  rules?:
    | Omit<
        RegisterOptions<T>,
        "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
      >
    | undefined;
  fieldState?: ControllerFieldState;
  fullWidth?: boolean;
}

interface SideBarProps {
  name: string;
  link: string;
}

interface ClassesProps {
  anchor: "bottom" | "left" | "right" | "top";
  classes: SideBarProps[];
  open: boolean; // サイドバーの開閉状態
  toggleDrawer: (
    open: boolean,
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

interface ToolbarProps {
  disabled: boolean;
}

// interface BoxProps {
//   children: ReactNode;
//   direction?: "row" | "column";
//   wrap?: "wrap" | "nowrap";
//   gap?: "none" | "narrow" | "medium" | "wide";
//   width?: string;
//   bordered?: boolean;
//   valign?: "top" | "bottom" | "center";
//   halign?: "left" | "right" | "center";
//   itemValign?: "top" | "bottom" | "center" | "stretch";
//   itemHalign?: "left" | "right" | "center" | "stretch";
//   marginBottom?: string;
//   display?: string;
// }

interface BreadcrumbsProps {
  marginBottom: string;
}

interface PathMapProps {
  about: string;
  posts: string;
  signup: string;
  signin: string;
  table: string;
  table1: string;
  csvimport: string;
}

interface CsvImportMainProps {}

interface FAToastProps {
  open: boolean;
  handleClose: () => void;
  vertical: "top" | "bottom";
  horizontal: "center" | "right" | "left";
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

interface FABackdropProps {
  overlayOpen: boolean;
}

interface FABoxProps extends BoxProps {
  noValidate?: boolean; // 追加プロパティを許容
}

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
  BoxProps,
  PathMapProps,
  BreadcrumbsProps,
  ClassesProps,
  ToolbarProps,
  FAToastProps,
  SigninResProps,
  SignUpResProps,
  FABackdropProps,
  FABoxProps,
};
