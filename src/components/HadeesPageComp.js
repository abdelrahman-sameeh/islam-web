import React, { useEffect, useState } from 'react'
import SubTitle from './utility/SubTitle'
import axios from 'axios'
import ReactPaginate from 'react-paginate'

const HadeesPageComp = () => {

  const [ahadees, setHadees] = useState([])
  const [pageCount, setPageCount] = useState(1)

  const handlePageClick = (btn) => {
    setPageCount(btn.selected + 1)
  }

  useEffect(() => {
    
    const getHadees = async (page = 1) => {
      const res = await axios.get(`https://hadis-api-id.vercel.app/hadith/abu-dawud?page=${page}&limit=25`)
      setHadees(res.data)
    }

    getHadees(pageCount)

  }, [pageCount])


  return (
    <div>
      {/* sub title */}
      <SubTitle pageName='الاحاديث النبويه' />

      {/* content */}
      {(ahadees && ahadees.items) ?
        ahadees.items.map(hadees => {

          return <div key={hadees.number} style={{ background: 'var(--alt-color)' }} className="hadees rounded px-2 py-3 my-3 " >
            {hadees.arab}
          </div>

        })
        :
        // loading
        <div style={{ backgroundColor: 'var(--alt-color)' }} className="rounded my-3 d-flex justify-content-center align-items-center">
          <div className="lds-dual-ring"></div>
        </div>
      }


      {/* pagination */}
      {(ahadees && ahadees.pagination) &&
        <div className="d-flex justify-content-center align-items-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel="التالى"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            pageCount={ahadees.pagination.totalPages}
            previousLabel="السابق"
            containerClassName='pagination justify-content-center'
            pageClassName='page-item'
            pageLinkClassName='page-link'
            previousClassName='page-item'
            nextClassName='page-item'
            previousLinkClassName='page-link rounded'
            nextLinkClassName='page-link rounded'
            className='pagination p-0'
            breakClassName='page-link'
            activeClassName='active'
          />
        </div>
      }


    </div>
  )
}

export default HadeesPageComp