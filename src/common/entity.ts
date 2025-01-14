import { BoxProps, CircularProgressProps } from '@mui/material'
import {
  Control,
  ControllerFieldState,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  SubmitHandler,
  UseFormClearErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form'

// インターフェース定義
interface AnnualIncomeManagementKey {
  payment_date: string
  age: number
  industry: string
  total_amount: number
  deduction_amount: number
  take_home_amount: number
  edit: string
}

// インターフェース定義
interface AnnualIncomeManagementKeyNotEdit {
  payment_date: string
  age: number
  industry: string
  total_amount: number
  deduction_amount: number
  take_home_amount: number
}

// インターフェース定義
interface AnnualIncomeManagement {
  payment_date: string
  age: number
  industry: string
  total_amount: number
  deduction_amount: number
  take_home_amount: number
}

interface AnnualIncomeManagementData extends AnnualIncomeManagement {
  id: number
  income_forecast_id: string
  update_user: string
  classification: string
  user_id: number
}

type AnnualIncomeManagementCreateData = AnnualIncomeManagementData

type AnnualIncomeManagementUpdateData = AnnualIncomeManagementData

type AnnualIncomeManagementDeleteData = AnnualIncomeManagementData

type Order = 'asc' | 'desc'

interface Validate {
  payment_date: string | boolean | null
  age: string | boolean | null
  industry: string | boolean | null
  total_amount: string | boolean | null
  deduction_amount: string | boolean | null
  take_home_amount: string | boolean | null
  classification: string | boolean | null
}

interface Column {
  id: keyof AnnualIncomeManagementKey // AnnualIncomeManagementData のプロパティ名のいずれか
  label: string
  minWidth?: number
  disablePadding: boolean
  align?: 'right' | 'left' | 'center'
  format?: (value: number) => string
  required: boolean
}

interface ColumnNotEdit {
  id: keyof AnnualIncomeManagementKeyNotEdit // AnnualIncomeManagementData のプロパティ名のいずれか
  label: string
  minWidth?: number
  disablePadding: boolean
  align?: 'right' | 'left' | 'center'
  format?: (value: number) => string
  required: boolean
}

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof AnnualIncomeManagementKeyNotEdit
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

interface EnhancedTableToolbarProps {
  numSelected: number
  selected: readonly number[] // 選択された行のIDを含む配列
  data: AnnualIncomeManagementDeleteData[] // 選択された行のデータ
  onDelete: (
    data: AnnualIncomeManagementDeleteData[],
    selected: readonly number[]
  ) => void // 削除時に呼ばれる関数
  checkboxLabel: string
  checked: boolean
  onCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void
  // onCheckBox: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

interface editDialogProps {
  editDialogLabel: string
  // checked: boolean
  dialogOpen: boolean
  row: AnnualIncomeManagementDeleteData | null
  handleClose: () => void
}

interface CsvFileSetting {
  file: File | null
}

interface FileSelectProps {
  setValue: UseFormSetValue<CsvFileSetting>
  register: UseFormRegister<CsvFileSetting>
  control: Control<CsvFileSetting, unknown>
  errors: FieldErrors<CsvFileSetting>
  setError: UseFormSetError<CsvFileSetting>
  clearErrors: UseFormClearErrors<CsvFileSetting>
}

interface AuthFormProps {
  user_name: string
  user_password: string
  confirm_password?: string // Sign Upの場合のみ必要
  nick_name?: string // Sign Upの場合のみ必要
}

interface NewPasswordUpdateProps {
  token_id: string
  current_password: string
  new_user_password: string
  confirm_password: string
}

interface EmailCheckProps {
  user_name: string
}

interface PasswordResetProps {
  current_password: string
  new_user_password: string
  confirm_password: string
}

interface SingUpProps {
  redis_key: string
  auth_email_code: string
}

interface EntryAuthEmailProps {
  redis_key: string
  user_name: string
  nick_name: string
}

interface SigninResProps {
  data: AuthFormProps[]
}

interface TmpSignUpResProps {
  data: AuthFormProps[]
}

interface PasswordResetReqProps {
  data: PasswordResetProps[]
}

interface RequestDataProps<T> {
  data: T
}

interface PasswordFormProps {
  name: keyof AuthFormProps
  label: string
  control: Control<AuthFormProps> // Tに依存するControl型
  rules?:
    | Omit<
        RegisterOptions<AuthFormProps>,
        'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
      >
    | undefined
  fieldState?: ControllerFieldState
  fullWidth?: boolean
}

interface TextFormProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T> // Tに依存するControl型
  rules?:
    | Omit<
        RegisterOptions<T>,
        'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
      >
    | undefined
  fieldState?: ControllerFieldState
  fullWidth?: boolean
}

interface SideBarProps {
  name: string
  link: string
}

interface ClassesProps {
  anchor: 'bottom' | 'left' | 'right' | 'top'
  classes: SideBarProps[]
  open: boolean // サイドバーの開閉状態
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void
}

interface ToolbarProps {
  disabled: boolean
}

// interface BoxProps {
//   children: ReactNode
//   direction?: 'row' | 'column'
//   wrap?: 'wrap' | 'nowrap'
//   gap?: 'none' | 'narrow' | 'medium' | 'wide'
//   width?: string
//   bordered?: boolean
//   valign?: 'top' | 'bottom' | 'center'
//   halign?: 'left' | 'right' | 'center'
//   itemValign?: 'top' | 'bottom' | 'center' | 'stretch'
//   itemHalign?: 'left' | 'right' | 'center' | 'stretch'
//   marginBottom?: string
//   display?: string
// }

interface BreadcrumbsProps {
  marginBottom: string
}

interface PathMapProps {
  about: string
  posts: string
  signup: string
  signin: string
  table: string
  table1: string
  csvimport: string
}

type CsvImportMainProps = object

interface TWToastProps {
  open: boolean
  handleClose: () => void
  vertical: 'top' | 'bottom'
  horizontal: 'center' | 'right' | 'left'
  severity: 'success' | 'info' | 'warning' | 'error'
  message: string
}

interface TWBackdropProps {
  overlayOpen: boolean
}

interface TWBoxProps extends BoxProps {
  noValidate?: boolean // 追加プロパティを許容
}

interface EmailAuthProps {
  inputNum: number
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
  code: string[]
  setCode: (value: React.SetStateAction<string[]>) => void
  handleEntryEmail: () => Promise<void>
  isDisabled: boolean
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

interface EmailAuthToastProps {
  successOverlayOpen: boolean
  successOpen: boolean
  successHandleClose: () => void
  successMsg: string
  overlayOpen: boolean
  open: boolean
  handleClose: () => void
  msg: string
}

interface EmailSendProps {
  handleSubmit: UseFormHandleSubmit<EmailCheckProps, undefined>
  control: Control<EmailCheckProps, unknown>
  isValid: boolean
  onSubmit: SubmitHandler<EmailCheckProps>
}

interface ExternalSignButtonProps {
  label: string
  icon?: React.ReactNode
  onClick: () => void
}

interface TWCircularProgressProps extends CircularProgressProps {
  open: boolean
}

interface TWExternalTextProps {
  text: string
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
  NewPasswordUpdateProps,
  PasswordResetProps,
  PasswordResetReqProps,
  EmailCheckProps,
  EmailSendProps,
  SideBarProps,
  BoxProps,
  PathMapProps,
  BreadcrumbsProps,
  ClassesProps,
  ToolbarProps,
  TWToastProps,
  SigninResProps,
  TmpSignUpResProps,
  RequestDataProps,
  SingUpProps,
  EntryAuthEmailProps,
  TWBackdropProps,
  TWBoxProps,
  EmailAuthProps,
  EmailAuthToastProps,
  TWCircularProgressProps,
  ExternalSignButtonProps,
  TWExternalTextProps,
}
