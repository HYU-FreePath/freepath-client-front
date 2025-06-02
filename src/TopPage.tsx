// src/app/pages/TopPage.tsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { mapListInfo } from '@/data/mapList'
import { mapListAPI } from '@/network/mapListAPI'

export default function TopPage() {
  // mapListInfo가 배열 형태(mapListInfo[])로 반환된다고 가정
  const {
    data: mapList = [],
    isLoading,
    isError,
    error,
  } = useQuery<mapListInfo[], Error>({
    queryKey: ['mapInfoList'],
    queryFn: () => mapListAPI(),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="font-Ptd min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-teal-400 p-6">
      <div className="w-full max-w-lg bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl p-10 shadow-2xl">
        {/* 타이틀 */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2 text-center">
          FreePath
        </h1>
        <p className="text-gray-700 text-center mb-8">
          배리어프리맵 서비스 플랫폼
        </p>

        {/* 로딩 / 에러 처리 */}
        {isLoading ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : isError ? (
          <p className="text-center text-red-500">
            에러 발생: {error.message}
          </p>
        ) : (
          /* 지도 리스트를 보여주는 그리드 */
          <div className="grid gap-4">
            {mapList
              .filter((item) => item.status === 'DEPLOYING')
              .map((item) => (
                <a
                  key={item.id}
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block 
                    px-6 py-4 
                    bg-white 
                    rounded-xl 
                    shadow 
                    hover:shadow-xl 
                    transform hover:-translate-y-1 
                    transition 
                    hover:bg-gray-50
                  "
                >
                  <span className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </span>
                </a>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
