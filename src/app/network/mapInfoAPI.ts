// src/network/mapInfoAPI.ts
import { mapInfo } from '@/data/mapInfo'
import { apiHandler } from '@/network/apiHandler'

export const mapInfoAPI = async (uuid: string): Promise<mapInfo> => {
  return apiHandler<mapInfo>('GET', `/data/${uuid}`)
}
