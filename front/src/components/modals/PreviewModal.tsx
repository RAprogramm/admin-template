import { Badge, Col, Container, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import { IArticle } from '@api/types/article'
import { IProject } from '@api/types/project'
import CoverPreview from '../Cover'
import formatDate from '@/utils/timeDate'
import { useState } from 'react'

interface PreviewProps {
  data: IArticle | IProject
  show?: boolean
  onHide?: () => void
}

const Preview: React.FC<PreviewProps> = ( { data } ) => {
  const [ show, setShow ] = useState( false )

  const handleClose = () => setShow( false )

  return (

    <div className='me-2'>
      <OverlayTrigger
        key='top'
        placement='top'
        overlay={ <Tooltip id={ `tooltip-top` }>Просмотр</Tooltip> }
      >
        <i
          className='bi bi-file-earmark-richtext h5'
          style={ { cursor: 'pointer' } }
          onClick={ () => setShow( true ) }
        ></i>
      </OverlayTrigger>
      <Modal
        show={ show }
        onHide={ handleClose }
        aria-labelledby='example-custom-modal-styling-title'
        backdrop='static'
        keyboard={ true }
        centered
        size='xl'
      >
        <Modal.Header closeButton >
          <Container>
            <Row>
              <Col sm={ 8 }><h1>title { data.title }</h1></Col>
              <Col sm className='m-auto'>
                { data.tags.map( ( tag, index ) => (
                  <Badge key={ index } bg="dark" className='me-1' style={ { fontSize: '15px' } }>{ tag }</Badge>
                ) ) }
              </Col>
            </Row>
            <Row>
              <Col sm style={ { color: 'grey', fontStyle: 'italic' } }>дата добавления <strong>{ formatDate( data.createdAt, 'long' ) }</strong></Col>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body>
          <section className='mt-auto'>
            <div className='container'>
              <div className='d-flex' style={ { flexDirection: 'column', padding: '50px' } }>
                <div className='mb-3'><CoverPreview coverUrl={ data.cover } /></div>
                <p style={ { fontSize: '20px', wordWrap: 'break-word' } }>{ 'author_id' in data ? data.content : data.description }</p>
              </div>
            </div>
          </section>
        </Modal.Body>
        <Modal.Footer >
          дата последних изменений <strong>{ formatDate( data.updatedAt, 'long' ) }</strong>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Preview
