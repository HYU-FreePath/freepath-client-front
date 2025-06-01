import { MapInfo } from '@/data/MapInfo'
import { apiHandler } from '@/network/apiHandler'

export const MapInfoAPI = async (uuid: string): Promise<MapInfo> => {
  return apiHandler<MapInfo>(`/data/${uuid}`)
}
