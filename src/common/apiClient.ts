import axios, { AxiosInstance, Method } from "axios";
import {
  ErrorResponse,
  Response,
  OkResponse,
  Result,
} from "@/src/common/presenter";

const BASE_URL: string | undefined =
  process.env.API_BASE_URL || "http://localhost:8080";
// const BASE_URL: string | undefined = process.env.API_BASE_URL || 'http://host.docker.internal:8080'

class ApiClient {
  private readonly apiInstance: AxiosInstance;

  constructor(
    header: Record<string, string> = { "Content-Type": "application/json" },
  ) {
    this.apiInstance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: header,
    });
  }

  private handleError(error: unknown): ErrorResponse {
    if (axios.isAxiosError(error)) {
      const errorResponse: ErrorResponse = {
        status: error.response?.status || 500,
        error_data: error.response?.data || "サーバーエラーが発生しました",
      };
      return errorResponse;
    } else {
      return {
        status: 500,
        error_data: {
          error_msg: "予期しないエラーが発生しました",
        },
      } as ErrorResponse;
    }
  }

  public async callApi<T>(
    endpoint: string,
    method: Method = "get",
    data?: any,
  ): Promise<Response<T>> {
    try {
      const res = await this.apiInstance.request({
        url: endpoint,
        method,
        data: ["post", "put", "delete"].includes(method.toLowerCase())
          ? data
          : undefined,
        params: method === "get" ? data : undefined,
      });

      const okRes: OkResponse<T> = {
        data: res.data as Result<T>,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      };
      return okRes;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public isOkResponse<T>(response: Response<T>): response is OkResponse<T> {
    return "data" in response && "result" in response.data;
  }
}

export { ApiClient, BASE_URL };
