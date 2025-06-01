//import React from 'react'

export default function TopPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400">
        <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl max-w-md text-center">
          <h1 className="font-Ptd text-5xl font-extrabold text-gray-900 mb-4">FreePath</h1>
          <p className="text-lg text-gray-700 mb-8">
            배리어프리맵 서비스입니다.
          </p>

          <div className="space-y-4">
            <p>
              현재 운영 중
            </p>
            <a
              href="/hyu-erica-bfmap"
              className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              한양대학교 ERICA캠퍼스 배리어프리맵
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
