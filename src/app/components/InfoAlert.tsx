  import React, { useState } from 'react'
  import axios from 'axios'
  import { useSpeechToText } from "./useSpeechToText"
  import { sendReportAPI, IssuePayload, IssueResponse } from '@/network/sendReportAPI'

  interface InfoAlertProps {
    targetName: string
    onClose: () => void
    setInputValue: (value: string) => void
    setShowResults: (value: boolean) => void
    code: string | undefined
  }

  const InfoAlert: React.FC<InfoAlertProps> = ({ targetName, onClose, setInputValue, setShowResults, code }) => {
    const { transcript, listening, toggleListening, abortListening, browserSupportsSpeechRecognition } = useSpeechToText()

    const [textValue, setTextValue] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextValue(e.target.value)
    }

    // 3. 버튼 클릭 시 실행될 함수
    const handleSubmit = async () => {
      // 빈 문자열이면 요청하지 않도록 막기
      if (!textValue.trim()) {
        setError('내용을 입력해주세요.')
        return
      }

      setLoading(true)
      setError(null)
      setSuccessMsg(null)

      const payload: IssuePayload = {
        content: textValue
      }

      let result: IssueResponse | null = null

      try {
        // code가 undefined일 수 있으니, 예외 처리 추가해도 좋습니다.
        if (!code) {
          throw new Error('유효한 코드가 지정되지 않았습니다.')
        }

        result = await sendReportAPI(code, payload)
        setSuccessMsg(`접수 성공 : ${result.statusCode}`)
      } catch (err: unknown) {
        // 1) AxiosError인지 검사
        if (axios.isAxiosError(err)) {
          if (err.response) {
            // err.response.status, err.response.data에 안전하게 접근 가능
            const status = err.response.status
            const data = err.response.data
            setError(`서버 에러: ${status} - ${JSON.stringify(data)}`)
            // 바로 alert에 띄우고 싶다면 아래처럼 로컬 변수 사용 권장
            alert(`서버 에러: ${status} - ${JSON.stringify(data)}`)
          } else {
            // 네트워크 에러 등, status가 없는 경우
            setError(`Axios 네트워크 에러: ${err.message}`)
            alert(`Axios 네트워크 에러: ${err.message}`)
          }
        }
        // 2) 일반 JS Error 객체인 경우
        else if (err instanceof Error) {
          setError(`알 수 없는 에러: ${err.message}`)
          alert(`알 수 없는 에러: ${err.message}`)
        }
        // 3) 그 외
        else {
          setError('알 수 없는 오류가 발생했습니다.')
          alert('알 수 없는 오류가 발생했습니다.')
        }
      } finally {
        setLoading(false)
        // 성공 여부와 관계없이 닫기 알림
        if (result && result.statusCode === 200) {
          alert('불편한 점이 접수되었습니다.')
        }
        onClose()
      }
    }

    const handleCloseButton = () => {
      abortListening()
      onClose()
    }

    const handleButton = () => {
      if (listening) {
        const value = transcript.replace(/(\s*)/g, "")
        if (value !== '') {
          setInputValue(value)
          setShowResults(true)
        }
        onClose()
      }
      toggleListening()
    }

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-fMedium tracking-tight"
      >
        <div className="bg-white p-5 rounded-md shadow-lg w-80 text-sm">
          <div className='flex justify-between items-center mb-3'>
            <h2 className="text-lg font-fBold tracking-tighter">
              {targetName === 'info' && '정보'}
              {targetName === 'pwa' && '앱 설치 안내'}
              {targetName === 'mic' && '음성 인식'}
              {targetName === 'report' && '불편 신고'}
            </h2>
            { // 음성 인식 닫기 버튼
              targetName === 'mic' && (
                <>
                  <button onClick={handleCloseButton}>
                    <img 
                      src='/images/x_button.svg'
                      alt='닫기'
                      className='w-7'
                    />
                  </button>
                </>
              )
            }
          </div>

          { // 개발 정보
            targetName === 'info' && (
              <>
                <p className='mb-4'>
                  Powered by FreePath
                  <br />
                  - 2025 소프트웨어융합대학 캡스톤디자인 -
                </p>

                <p>[개발진]</p>
                <p>Frontend: 이재형 (컴퓨터학부 21)</p>
                <p>Backend: 정윤성 (컴퓨터학부 20)</p>

                {/** 
                  <p className='mt-4'>[문의]<br/>
                    <a className='text-blue-500' href='mailto:alpha@hanyang.ac.kr'>
                      ehrc@hanyang.ac.kr
                    </a>
                  </p>
                */}
              </>
            )
          }

          { // PWA 설치 안내
            targetName === 'pwa' && (
              <>
                <p className='mb-4'>
                  iOS (iPhone)
                  <p>1. Safari로 접속</p>
                  <p>2. 공유 - '홈 화면에 추가'</p>
                </p>
                <hr />
                <p className='my-4'>
                  Android (Galaxy)
                  <p>1. 기본 브라우저로 접속</p>
                  <p>2. 상단 주소창의 설치 버튼 클릭</p>
                  <p className='mb-2'/>
                  <p>3. 없을 시, 메뉴( ⋮ ) 클릭 후</p>
                  <p>(크롬/웨일) '홈 화면에 추가'</p>
                  <p>(삼성 인터넷) '현재 페이지 추가' - '앱스 화면'</p>
                </p>
              </>
            )
          }
          
          {
            // 음성 인식 UI
            targetName === 'mic' && (
              <>
                <img
                    className='w-20 mx-auto mt-5' 
                    src='/images/mic.png'
                />
                <p className='text-center py-5'>
                  {browserSupportsSpeechRecognition === true ? 
                    (listening ? transcript : '음성 인식을 시작하세요.') 
                    : '지원하지 않는 브라우저입니다.'}
                </p>
              </>
            )
          }

          {
            targetName === 'report' && (
              <>
                <p className='mb-1'>
                  불편한 점에 대해 적어주세요
                </p>
                <p className='text-xs text-gray-500 mb-4'>
                  (예시: '길이 너무 좁아요', '정보가 잘못되었어요.')
                </p>
                <textarea
                  id="issue-textarea"
                  value={textValue}
                  onChange={handleChange}
                  rows={6}
                  placeholder="여기에 내용을 입력하세요."
                  className="w-full p-2 border rounded focus:outline-none focus:ring"
                />

                {error && <p className="text-red-500 mt-2">{error}</p>}
                {successMsg && <p className="text-green-500 mt-2">{successMsg}</p>}
              </>
            )
          }

          {
            targetName !== 'mic' ? (
              // 기본 닫기 버튼
              <>
                <div className="mt-4 flex justify-end">
                  {
                    targetName === 'report' ? (
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`
                          px-4 py-2 rounded-md mr-2
                          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}
                        `}
                      >
                        {loading ? '전송 중...' : '보내기'}
                      </button>
                    ) : null
                  }
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={onClose}
                  >
                    닫기
                  </button>
                </div>
              </>
            ) : (
              // 음성 인식 UI
              <>
                <button 
                  className="bg-blue-500 text-white w-full px-4 py-2 rounded-md"
                  onClick={handleButton}
                >
                  음성 인식 {listening ? '중지' : '시작'}
                </button>
              </>
            )
          }
        </div>
      </div>
    )
  }

  export default InfoAlert