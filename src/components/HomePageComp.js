import { faClock } from "@fortawesome/free-regular-svg-icons"
import { faBookQuran } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

const HomePageComp = () => {

  return (
    <>
      {/* sub-title  */}
      <div className="sub-title fs-3 pt-3 ">
        مرحبا بك فى موقع <span className='fw-bold '>اسلام ويب</span>
      </div>

      {/* content */}
      <div style={{backgroundColor: 'var(--alt-color)'}} className="content rounded p-3 mt-4">

        <div className="sub-title fs-3">
          التصنيفات
        </div>

        <div className="links d-flex wrap gap-2">
          <div style={{backgroundColor:'var(--main-color)'}} className="link px-3 py-2 rounded w-fit">
            <Link  style={{color:'var(--black)'}} className=' fs-4' to='/quran' >  القران الكريم <FontAwesomeIcon icon={faBookQuran} /> </Link>
          </div>
          <div style={{backgroundColor:'var(--main-color)'}} className="link px-3 py-2 rounded w-fit">
            <Link  style={{color:'var(--black)'}} className=' fs-4' to='/azkar' > الاذكار <FontAwesomeIcon icon={faBookQuran} /> </Link>
          </div>
          <div style={{backgroundColor:'var(--main-color)'}} className="link px-3 py-2 rounded w-fit">
            <Link  style={{color:'var(--black)'}} className=' fs-4' to='/hadees' > الاحاديث النبويه <FontAwesomeIcon icon={faBookQuran} /> </Link>
          </div>
          <div style={{backgroundColor:'var(--main-color)'}} className="link px-3 py-2 rounded w-fit">
            <Link  style={{color:'var(--black)'}} className=' fs-4' to='/tafseer' > تفسير <FontAwesomeIcon icon={faBookQuran} /> </Link>
          </div>
          <div style={{backgroundColor:'var(--main-color)'}} className="link px-3 py-2 rounded w-fit">
            <Link  style={{color:'var(--black)'}} className=' fs-4' to='/azan' > مواقيت الصلاة <FontAwesomeIcon icon={faClock} /> </Link>
          </div>
        </div>

      </div>

    </>
  )

}

export default HomePageComp