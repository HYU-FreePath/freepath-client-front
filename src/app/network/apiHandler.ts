import { mapInfo } from '@/data/mapInfo'
import { apiClient } from '@/network/apiClient'

export const apiHandler = async <T extends | mapInfo | Blob>(
    urlPath: string,
    responseType: 'json' | 'blob' = 'json' // 기본값을 json으로 설정
): Promise<T> => {
    return apiClient.get(urlPath, { responseType }).then((response) => {
        return response.data as T
    })
}