import { amenities } from '@/data/amenities'

export type datas = {
  mapId: number
  ownerId: number
  name: string
  nickname: string
  description: string
  status: string
  createdDate: string
  updatedDate: string
  frontUrl: string
  centralCoordinate: {
    lat: number
    lng: number
  }
  buildings: Array<amenities>
  points: Array<{
    id: number
    coordinate: {
      lat: number
      lng: number
    }
    memo: string
    type: string
  }>
}

export type mapListInfo = {
  statusCode: number
  message: string
  data: Array<datas>
}