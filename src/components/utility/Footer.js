import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Container } from 'react-bootstrap'

const Footer = () => {
  return (
    <div className="footer">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <span> تم الانشاء بواسطه <a className="fw-bold" target="_blank" href="https://www.linkedin.com/in/abdelrahman-gadallah-384508231/"> Abdelrahman Sameeh </a> </span>

            <div className="d-flex fs-3 gap-3">
              <a target="_blank" href="https://www.linkedin.com/in/abdelrahman-gadallah-384508231/">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a target="_blank" href="https://www.github.com/abdelrahman-sameeh/">
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </div>
        </Container>
      </div>
  )
}

export default Footer