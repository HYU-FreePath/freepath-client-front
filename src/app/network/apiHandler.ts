// src/network/apiHandler.ts
import { apiClient } from '@/network/apiClient'
import type { AxiosRequestConfig } from 'axios'

type ResponseTypeOption = 'json' | 'blob'

export const apiHandler = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  urlPath: string,
  payload?: unknown,
  responseType: ResponseTypeOption = 'json'
): Promise<T> => {
  const config: AxiosRequestConfig = { responseType }
  switch (method) {
    case 'GET':
      return apiClient.get<T>(urlPath, config).then(res => res.data as T)
    case 'POST':
      return apiClient.post<T>(urlPath, payload, config).then(res => res.data as T)
    case 'PUT':
      return apiClient.put<T>(urlPath, payload, config).then(res => res.data as T)
    case 'DELETE':
      return apiClient.delete<T>(urlPath, config).then(res => res.data as T)
  }
}
