import axios, { type AxiosRequestConfig } from 'axios'

export const mockAxios = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

interface MockResponse<T> {
  code: number
  msg: string
  data: T
}

export async function requestMock<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await mockAxios.request<MockResponse<T>>(config)
  if (response.data.code !== 0) {
    throw new Error(response.data.msg || 'Mock 请求失败')
  }
  return response.data.data
}
