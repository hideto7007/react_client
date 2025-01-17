import axios, { AxiosInstance, Method } from 'axios'
import { Response, Result } from '@/src/common/presenter'

const BASE_URL: string | undefined =
  process.env.API_BASE_URL || 'http://localhost:8080'
// const BASE_URL: string | undefined = process.env.API_BASE_URL || 'http://host.docker.internal:8080'

class ApiClient {
  private readonly apiInstance: AxiosInstance

  constructor(
    header: Record<string, string> = { 'Content-Type': 'application/json' }
  ) {
    this.apiInstance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: header,
    })
  }

  private handleError(error: unknown): Response<unknown> {
    let res: Response<unknown> = {
      status: 500,
      data: {
        error_msg: '予期せぬエラー',
      },
    }
    if (axios.isAxiosError(error)) {
      res = {
        status: error.response?.status || 500,
        data: error.response?.data || 'サーバーエラー',
      }
    }
    return res
  }

  public async callApi<T>(
    endpoint: string,
    method: Method = 'get',
    data?: unknown
  ): Promise<Response<T> | Response<unknown>> {
    try {
      const res = await this.apiInstance.request({
        url: endpoint,
        method,
        data: ['post', 'put', 'delete'].includes(method.toLowerCase())
          ? data
          : undefined,
        params: method === 'get' ? data : undefined,
      })

      const okRes: Response<T> = {
        data: res.data as Result<T>,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      }
      return okRes
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export { ApiClient, BASE_URL }
