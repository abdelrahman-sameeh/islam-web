import { faLightbulb, faStarAndCrescent } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="navbar " >
        <Container className="d-flex justify-content-between align-items-center">
          <Link to='/' className="logo">
            <FontAwesomeIcon className="fs-1 " icon={faStarAndCrescent} />
          </Link>
          <button className="btn change-theme" >
            <FontAwesomeIcon style={{color:'var(--black)'}} className="fs-3 active" icon={faLightbulb} />
          </button>
        </Container>
      </div>
  )
}

export default Navbar