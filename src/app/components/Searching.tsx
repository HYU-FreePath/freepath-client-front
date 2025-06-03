import { Dispatch, SetStateAction } from 'react'
import { amenities } from '@/data/amenities'
//import { pos } from '../../positions.json'

interface SearchingProps {
    pos: Array<amenities> | undefined
    value: string
    setIsVisibleId: Dispatch<SetStateAction<number | null>>
    setSearchVisible: Dispatch<SetStateAction<boolean>>
    setMapState: Dispatch<SetStateAction<{center: {lat: number, lng: number}, isPanto: boolean}>>
    setInputValue: Dispatch<SetStateAction<string>>
    plusLat: number
}

const Searching: React.FC<SearchingProps> = (
    { pos, value, setIsVisibleId, setSearchVisible, setInputValue, setMapState, plusLat }) => {

    const resultHandle = (id : number, lat : number, lng : number) => { 
        setInputValue('')
        setSearchVisible(false)
        setMapState(() => ({
            center: { lat: lat + plusLat, lng: lng},
            isPanto: false,
        }))

        // 렌더링 겹침 문제 해결 위해 시간 차를 두고 setIsVisibleId(id) 실행
        setTimeout(() => {
            setIsVisibleId(id)
        }, 1)
    }

    return (
        <>
            {value.length > 1 &&
                <ul id='searchedList' className='w-full mt-3'>
                    {pos && (() => {
                        const filteredPos = pos.filter((item: amenities) => item.title.includes(value))
                        
                        // 검색 결과가 1개일 때 자동으로 선택
                        if (filteredPos.length === 1) {
                            const {id, lat, lng} = filteredPos[0]
                            resultHandle(id, parseFloat(lat), parseFloat(lng))
                        } else if (filteredPos.length === 0) {
                            return (
                                <>
                                    <li className='p-2'>
                                        검색 결과가 없습니다.
                                    </li>
                                </>
                            )
                        }

                        return filteredPos.map((data : amenities) => (
                            <li
                                key={data.id}
                                className='border-b border-gray-300 cursor-pointer hover:bg-gray-200'
                                onClick={() => resultHandle(data.id, parseFloat(data.lat), parseFloat(data.lng))}
                            >
                                <div className='p-2'>
                                    {data.title}
                                </div>
                            </li>
                        ))
                    })()}
                    {pos === undefined && (
                        <li className='p-2'>
                            검색 결과가 없습니다.
                        </li>
                    )}
                </ul>
            }
        </>
    )
}

export default Searching