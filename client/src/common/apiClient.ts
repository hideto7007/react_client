import axios, { AxiosInstance, Method } from "axios";
import { ErrorResponse, OkResponse } from "@/src/common/presenter";

const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
// const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://host.docker.internal:8080'


class ApiClient {
  private readonly apiInstance: AxiosInstance;

  constructor(header: Record<string, string> = { "Content-Type": "application/json" } ) {
    this.apiInstance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: header
    });
  }

  public async callApi(endpoint: string, method: Method = "get", data?: any): Promise<OkResponse | ErrorResponse> {
    try {
        // APIリクエストを実行（methodに応じてリクエスト）
        const res = await this.apiInstance.request({
          url: endpoint,
          method,
          data: ["post", "put", "delete"].includes(method.toLowerCase()) ? data : undefined, // POST, PUT, DELETEの場合のみdataを設定
          params: method === "get" ? data : undefined, // GETのみparamsを設定
        });
        return {
          status: res.status,
          data: res.data
        } as OkResponse;
    } catch (error) {
      return this.handleError(error)
    }
  }

  private handleError(error: unknown): ErrorResponse {
    if (axios.isAxiosError(error)) {
      const errorResponse: ErrorResponse = {
        status: error.response?.status || 500,
        data: error.response?.data || "サーバーエラーが発生しました",
      };
      return errorResponse;
    } else {
      return {
        status: 500,
        data: {
          'error_msg': "予期しないエラーが発生しました",
        }
      } as ErrorResponse;
    }
  }
}

export default ApiClient;
