import { amenities } from '@/data/amenities'
import { specials } from '@/data/specials'

export type MapInfo = {
  statusCode: number
  message: string
  data: {
    meta: {
      title: string
      description: string
      lat: string
      lng: string
    },
    pos: Array<amenities>
    parking: Array<specials>
    ramp: Array<specials>
  }
}