import { MapInfo } from '@/data'
import { apiHandler } from '@/network/apiHandler'

export const MapInfoAPI = async (uuid: string): Promise<Array<MapInfo>> => {
  return apiHandler<Array<MapInfo>>(`/data/${uuid}`)
}
