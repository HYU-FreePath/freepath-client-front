import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch'
import MapControls from '@/components/MapControls'
import { apiHandler } from '@/network/apiHandler'
import tw from 'twin.macro'
import styled from 'styled-components'

import { floors } from '@/data/floors'
interface FloorPlansState {
  title: string
  floors: Array<floors>
}

const CategoryItem = styled.button<{ isActive: boolean }>(({ isActive }) => [
    tw`flex-col bg-white py-1 px-3 mr-2 mb-2 border border-gray-300 shadow-sm rounded-2xl cursor-pointer 
        focus:outline-none transition-all duration-100 text-[0.9rem] justify-center items-center`,
    isActive && tw`bg-blue-500 text-white font-fBold`,
])
    
const CItemWrapper = styled.div`
    ${tw`flex justify-center items-center`}
`  

function FloorPlans() {
    const location = useLocation()
    const navigate = useNavigate()

    const { uuid, id } = useParams()
    const state = location.state as FloorPlansState
    const title = state?.title
    const floors = state?.floors

    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [isLoadError, setIsLoadError] = useState(false)
    const [rotate, setRotate] = useState(false)
    const [imageSize, setImageSize] = useState({ width: '100%', height: '100vh' })
    const [floor, setFloor] = useState('1F')
    const [imageSrc, setImageSrc] = useState('')

    useEffect(() => {
        if (floors.length > 0) {
            setFloor(floors[0].floorLabel) // 초기 플로어 설정
        } else {
            console.error('floors 배열이 비어 있습니다.')
            setIsLoadError(true) // 에러 상태로 전환
            setIsImageLoaded(false) // 이미지 로딩 실패 상태로 전환
        }
    }, [floors])

    useEffect(() => {
        const loadImage = async () => {
            const selectedFloorObj = floors.find(elem => elem.floorLabel === floor)
            const imagePath = selectedFloorObj?.planImageUrl ?? null
            //const imagePath = floors[0].planImageUrl ?? null
            setIsImageLoaded(false) // 로딩 상태로 전환
            setIsLoadError(false) // 에러 상태 해제

            try {
                const blob = await apiHandler<Blob>("GET", imagePath!, undefined, 'blob')
                const imageUrl = URL.createObjectURL(blob)
                setImageSrc(imageUrl)
                setIsImageLoaded(true)
            } catch (error) {
                console.error('이미지를 로드하는데 실패했습니다:', error)
                setIsImageLoaded(false)
                setIsLoadError(true)
            }
        }

        // 이미지 URL을 HTTP에서 다운로드
        loadImage()

        // 컴포넌트가 언마운트될 때 Blob URL 해제
        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [floor, id])

    useEffect(() => {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        }

        setViewportHeight()
        window.addEventListener("resize", setViewportHeight)

        return () => {
            window.removeEventListener("resize", setViewportHeight)
        }
    }, [])
    
    useEffect(() => {
        if (rotate) {
            setImageSize({ width: `100%`, height: `${window.innerWidth}px` })
        } else {
            setImageSize({ width: `100%`, height: '100vh' })
        }
    }, [rotate])

    // If no state is passed, redirect back to the previous page or a default route
    useEffect(() => {
        if (!title) {
            navigate('/'); // Redirect to home or another page if no id
        }
    }, [title, navigate])
    
    const handleFloorButton = (newFloor: string) => {
        if (newFloor !== floor) {
            setFloor(newFloor)
        }
    }

    const handleContextMenu = (e: { preventDefault: () => void }) => {
        e.preventDefault()
    }

    const goToHomeScreen = () => {
        if (window.history.state && window.history.length > 1) {
            navigate(-1)
        } else {
            navigate(`/${uuid}`, { replace: true })
        }
    }

    const Controls = ({ setTransform }: { setTransform: (x: number, y: number, scale: number) => void }) => {
        const { zoomIn, zoomOut } = useControls()

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        const handleRotate = () => {
            setRotate((prevRotate) => !prevRotate)

            if (rotate) {
                // 세로에서 가로로 변경될 때
                setTransform(0, 0, 1)
            } else {
                // 가로에서 세로로 변경될 때
                const newY = (viewportHeight - viewportWidth) / 2;  // 세로 중앙
                setTransform(0, newY, 1);
            }
        }

        return (
            <>
                <MapControls 
                    zoomIn={() => zoomIn()} 
                    zoomOut={() => zoomOut()}
                />
                <div className='absolute bottom-[45px] right-3 rounded-md border border-gray-400 overflow-hidden z-[2] touch-none'>
                    <button className='p-2 bg-white flex items-center justify-center'>
                    <img 
                        src='/images/rotate.svg'
                        alt='회전'
                        className='w-6'
                        onClick={handleRotate} />
                    </button>
                </div>
            </>
            
        )
    }

    return (
        <>
            <header className="fixed flex justify-between items-center top-0 left-0 w-full bg-white shadow-lg h-12 px-4 z-50 select-none touch-none">
                <div className='flex items-center'>
                    <button 
                        className='cursor-pointer' 
                        onClick={goToHomeScreen}
                        onContextMenu={handleContextMenu}
                    >
                        <img 
                            className='w-5' 
                            src='/images/arrow_back_black_36dp.svg'
                            alt='이전 화면으로 가기' />
                    </button>
                    <h1 className="ml-3 text-lg font-fBold tracking-tight">{title}</h1>
                </div>
            </header>
            <div className='absolute top-[60px] left-[13px] overflow-hidden z-[2] font-fMedium'>
                {
                    floors.map((fr) => (
                        <CategoryItem
                            key={fr.floorLabel}
                            onClick={() => handleFloorButton(fr.floorLabel)}
                            isActive={floor === fr.floorLabel}
                        >
                            <CItemWrapper>
                                {fr.floorLabel}
                            </CItemWrapper>
                        </CategoryItem>
                    ))
                }
            </div>
            {/* 이미지를 표시하는 div 입니다 */}
            <div>
                <TransformWrapper 
                    initialScale={1} 
                    minScale={1} 
                    maxScale={5}
                    centerOnInit={true}
                    centerZoomedOut={true}
                    limitToBounds={true} // 이미지 바깥을 벗어난 줌을 막기 위해 추가
                    disabled={(isImageLoaded && !isLoadError) ? false : true}
                >
                    {({ setTransform }) => (
                    <>  
                        <Controls setTransform={setTransform} />
                        <TransformComponent
                            wrapperStyle={{ height: '100vh', width: '100%', overflow: 'hidden' }}
                            contentStyle={{
                                height: imageSize.height,
                                width: imageSize.width,
                                objectFit: 'contain'
                            }}
                        >
                            {isLoadError && (
                                <div className="flex items-center justify-center w-screen h-screen">
                                    <p className="text-center font-fMedium text-lg">로딩 중 오류가 발생했습니다.</p>
                                </div>
                            )}
                            {!isImageLoaded && !isLoadError && (
                                <div className="flex items-center justify-center w-screen h-screen">
                                    <p className="text-center font-fMedium text-lg">로딩중...</p>
                                </div>
                            )}
                            {isImageLoaded && !isLoadError && (
                                <img
                                    //src="/images/test.png"
                                    src={imageSrc}
                                    alt={isImageLoaded ? `${title}의 평면도` : '사진이 로딩중 입니다.'}
                                    className={`p-12 object-contain ${rotate ? 'rotate-90' : ''}`}
                                    style={{ width: imageSize.width, height: imageSize.height }}
                                />
                            )}
                        </TransformComponent>
                    </> 
                    )}
                </TransformWrapper>
            </div>
        </>
    )
}

export default FloorPlans
