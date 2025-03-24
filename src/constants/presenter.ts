/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders,
} from "axios";

interface FieldError {
  field: string;
  message: string;
}

interface ValidateError {
  recode_rows?: number;
  result: FieldError[];
}

interface OkResponse {
  data: any;
  status: number;
  statusText?: string;
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config?: InternalAxiosRequestConfig<unknown>;
  request?: unknown;
}

// レスポンス型
interface Response {
  status: number;
  data: any;
  statusText?: string;
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config?: InternalAxiosRequestConfig<unknown>;
  request?: unknown;
}

// レスポンス要素の定義
interface UserInfo {
  user_id: string;
  user_email: string;
}

interface Amount {
  left_amount: number;
  total_amount: number;
}

interface EmailAuthToken {
  redis_key: string;
  user_email: string;
  user_name: string;
}

export type {
  ValidateError,
  OkResponse,
  Response,
  UserInfo,
  EmailAuthToken,
  Amount,
};
