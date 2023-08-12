import React, { useEffect, useState } from 'react'
import SubTitle from './utility/SubTitle'
import axios from 'axios'

const AzkarPageComp = () => {

  const [azkar, setAzkar] = useState({})
  const [filter, setFilter] = useState([])
  const [myChosen, setMyChosen] = useState('دعاء سيد الاستغفار')

  const clearSpecialCharacter = (arr) => arr.map(zekr => {
    return {
      ...zekr,
      content: zekr.content.replace(/n|\\|'|,\s+/g, ''),
    }
  })

  useEffect(() => {

    const getAzkar = async () => {

      const res = await axios.get('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json')

      setAzkar(res.data)
    }
    getAzkar()

  }, [])

  const handleClick = (e) => {
    // console.log(e.target.innerHTML);
    const myFilter = e.target.innerHTML.trim()
    setMyChosen(myFilter)

    // setFilter(azkar[`${myFilter}`].flat())
    setFilter(clearSpecialCharacter(azkar[`${myFilter}`].flat()));
  }



  return (
    <div>
      <div className="container">
        {/* sub title */}
        <SubTitle pageName='اذكار الصباح والمساء' />

        {/* category */}
        <div style={{ backgroundColor: 'var(--alt-color)' }} className="rounded px-2 py-3">
          <span className='fs-3 '>التصنيفات</span>

          <div className='mt-2 d-flex flex-wrap gap-1'>
            {
              (azkar && Object.keys(azkar).length) ?

                Object.keys(azkar).map((key, index) => {
                  return (
                    <span onClick={handleClick} className='rounded px-3 py-2 pointer' key={index} style={{ backgroundColor: 'var(--main-color)', color: 'var(--black)' }}  > {key}</span>
                  )
                })
                : // loading
                <div style={{ backgroundColor: 'var(--alt-color)' }} className="w-100 rounded my-3 d-flex justify-content-center align-items-center">
                  <div className="lds-dual-ring"></div>
                </div>
            }
          </div>
        </div>

        {/* content */}
        {
          myChosen &&
          <div className="fw-bold text-center mt-2 fs-3">
            {myChosen}
          </div>
        }
        {(filter && filter.length) ?
          filter.map((zekr, index) => {

            return <div key={index} style={{ background: 'var(--alt-color)' }} className="rounded px-2 py-3 my-3 " >
              <div className="content d-flex"> {zekr.content} {`(${+zekr.count} ${(+zekr.count > 2 && +zekr.count < 10) ? 'مرات' : 'مرة'})`} </div>
              {zekr.description && <div className="content d-flex justify-content-end "> {zekr.description} </div>}
            </div>

          }) :// 
          <div style={{ backgroundColor: 'var(--alt-color)' }} className="w-100 rounded my-3 px-2 py-3 fs-3 d-flex justify-content-center align-items-center">
            اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك وأنا على عَهْدِكَ وَوَعْدِكَ ما اسْتَطَعْتُ أعوذ بك من شر ما صنعتُ أَبُوءُ لك بنعمتك عليَّ وأَبُوءُ لك بذنبي فَاغْفرْ لي فإنه لا يغفر الذنوب إلا أنت
          </div>
        }

      </div>
    </div>
  )
}

export default AzkarPageComp