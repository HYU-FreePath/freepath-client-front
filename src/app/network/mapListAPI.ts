// src/network/mapListAPI.ts
import { mapListInfo } from '@/data/mapListInfo'
import { apiHandler } from '@/network/apiHandler'

export const mapListAPI = async (): Promise<mapListInfo> => {
  return apiHandler<mapListInfo>('GET', `/maps`)
}
