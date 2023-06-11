import React from 'react'
import { Container } from 'react-bootstrap'
import HomePageComp from '../components/HomePageComp'

function HomePage() {
  return (
    <div className='page'>
      <Container>
        <HomePageComp/>
      </Container>
    </div>
  )
}

export default HomePage