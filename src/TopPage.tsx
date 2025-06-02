// src/app/pages/TopPage.tsx
import { useQuery } from '@tanstack/react-query'
import type { mapListInfo, datas } from '@/data/mapList'
import { mapListAPI } from '@/network/mapListAPI'

export default function TopPage() {
  // 1) useQuery의 제네릭 타입을 mapListInfo로 변경
  const {
    data: mapList,    // mapList는 mapListInfo 또는 undefined
    isLoading,
    isError,
    error,
  } = useQuery<mapListInfo, Error>({
    queryKey: ['mapInfoList'],
    queryFn: () => mapListAPI(),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="font-Ptd min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-teal-400 p-6">
      <div className="w-full max-w-lg bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl p-10 shadow-2xl">
        {/* 타이틀 */}
        <div className='flex justify-center items-center mb-10'>
          <img
            src='/images/logo.png'
            className='w-20 mr-3'
            alt='FreePath Logo'
          />
          <div className='flex flex-col justify-center'>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-left">
              FreePath
            </h1>
            <p className="text-gray-700 text-left">
              배리어프리맵 서비스 플랫폼
            </p>
          </div>
        </div>

        {/* 로딩 / 에러 처리 */}
        {isLoading ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : isError ? (
          <p className="text-center text-red-500">
            에러 발생: {error.message}
          </p>
        ) : (
          /* mapList.data는 이제 datas[] */
          <div className="grid gap-4">
            {mapList?.data
              .filter((item: datas) => item.status === 'DEPLOYING')
              .map((item: datas) => (
                <a
                  key={item.mapId}
                  href={item.frontUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block 
                    px-6 py-4 
                    bg-slate-100
                    rounded-xl 
                    shadow 
                    hover:shadow-xl 
                    transform hover:-translate-y-1 
                    transition 
                    hover:bg-gray-50
                  "
                >
                  <span className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <p className="text-gray-600 mt-2">
                    {item.description || '설명이 없습니다.'}
                  </p>
                </a>
              ))}
              {
                mapList?.data.length === 0 && (
                  <p className="text-center text-gray-700">
                    현재 서비스 중인 지도가 없습니다.
                  </p>
                )
              }
          </div>
        )}
      </div>
    </div>
  )
}
