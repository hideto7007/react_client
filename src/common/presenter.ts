import {
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders,
} from 'axios'

// レスポンスの型定義
interface ErrorMsg {
  error_msg: string
}

interface FieldError {
  field: string
  message: string
}

interface ValidateError {
  recode_rows?: number
  result: FieldError[]
}

interface ErrorResponse {
  status: number
  error_data: ErrorMsg | ValidateError
}

interface Result<T> {
  result: T[] | T
}

interface OkResponse<T> {
  data: Result<T>
  status: number
  statusText?: string
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders
  config?: InternalAxiosRequestConfig<unknown>
  request?: unknown
}

type Response<T> = OkResponse<T> | ErrorResponse

// レスポンス要素の定義
interface UserInfo {
  user_id: string
  user_name: string
}

interface EmailAuthToken {
  redis_key: string
  user_name: string
  nick_name: string
}

export type {
  ValidateError,
  ErrorResponse,
  OkResponse,
  Result,
  Response,
  UserInfo,
  EmailAuthToken,
}
