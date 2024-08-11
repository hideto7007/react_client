import axios, { AxiosInstance } from "axios";

// const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
// const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://host.docker.internal:8080'

const apiClient: AxiosInstance = axios.create({
  // baseURL: BASE_URL,
  // リクエストヘッダ
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;
