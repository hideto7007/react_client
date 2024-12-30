import { AxiosResponse } from "axios";

interface ErrorMsg {
  error_msg: string;
}

interface FieldError {
  field: string;
  message: string;
}

interface ValidateError {
  recode_rows: number;
  result: FieldError[];
}

interface ErrorResponse {
  status: number;
  data: ErrorMsg | ValidateError;
}

type OkResponse = AxiosResponse<never, never>;

export type { ErrorResponse, OkResponse };
