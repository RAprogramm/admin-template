import { useRef, useState } from 'react'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'

import { IArticle } from '@api/types/article'
import { IProject } from '@api/types/project'
import UpdateArticlePage from '@pages/articlesPages/UpdateArticlePage'
import UpdateProjectPage from '@pages/projectsPages/UpdateProjectPage'

interface EditProps {
  data: IArticle | IProject
  onUpdated: () => void
}

interface UpdateArticleFormMethods {
  submitForm: () => Promise<void>
}

const Edit: React.FC<EditProps> = ( { data, onUpdated } ) => {
  const formRef = useRef<UpdateArticleFormMethods | null>( null )
  const [ show, setShow ] = useState( false )

  const handleClose = () => setShow( false )
  const handleUpdate = async () => {
    if ( formRef.current ) {
      await formRef.current.submitForm()
      handleClose()
    }
  }

  return (
    <div className='me-2'>
      <OverlayTrigger
        key='top'
        placement='top'
        overlay={ <Tooltip id={ `tooltip-top` }>Редактировать</Tooltip> }
      >
        <i
          className='bi bi-pencil-fill h5'
          style={ { cursor: 'pointer' } }
          onClick={ () => setShow( true ) }
        ></i>
      </OverlayTrigger>

      <Modal
        show={ show }
        onHide={ () => setShow( false ) }
        aria-labelledby='example-custom-modal-styling-title'
        backdrop='static'
        keyboard={ false }
        centered
        size='xl'
      >
        <Modal.Body>
          { 'author_id' in data ? (
            <UpdateArticlePage articleID={ data.id } ref={ formRef } onUpdated={ onUpdated } />
          ) : (
            <UpdateProjectPage projectID={ data.id } ref={ formRef } onUpdated={ onUpdated } />
          ) }
        </Modal.Body>
        <Modal.Footer className='d-flex'>
          <div className='m-auto' >
            <Button
              variant='secondary'
              onClick={ handleClose }
            >
              Закрыть
            </Button>
            <Button
              variant='success'
              className='ms-2'
              onClick={ handleUpdate }
            >
              Обновить
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Edit
