import React from 'react'
import { Link } from 'react-router-dom'

const SubTitle = ({ pageName }) => {
  return (
    <div style={{ background: 'var(--alt-color)' }} className="sub-title rounded px-2 py-3 my-3 fs-4" >
      <Link className='fw-bold' to='/' > الرئيسيه </Link> / <span className='opacity-75'>{pageName}</span> 
    </div>
  )
}

export default SubTitle