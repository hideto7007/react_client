import axios, { AxiosInstance, Method } from 'axios'
import { Response } from '@/src/constants/presenter'

const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL
// const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://host.docker.internal:8080'

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

  private handleError(error: unknown): Response {
    let res: Response = {
      status: 500,
      data: {
        result: '予期せぬエラー',
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

  public async callApi(
    endpoint: string,
    method: Method = 'get',
    data?: unknown
  ): Promise<Response> {
    try {
      const res = await this.apiInstance.request({
        url: endpoint,
        method,
        data: ['post', 'put', 'delete'].includes(method.toLowerCase())
          ? data
          : undefined,
        params: method === 'get' ? data : undefined,
      })

      const okRes: Response = {
        data: res.data,
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
