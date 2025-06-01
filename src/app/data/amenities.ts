import { floors } from '@/data/floors'

export type amenities = {
    id: number
    title: string
    lat: string
    lng: string
    wheel: boolean
    elevator: boolean
    toilet: boolean
    dots: boolean
    caution: string
    floorplan: boolean
    floors: Array<floors>
}
