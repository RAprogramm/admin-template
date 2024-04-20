import { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { IArticle } from '@api/types/article'
import { IProject } from '@api/types/project'
import FileService from '@api/services/fileService'

interface DeleteProps {
  data: IArticle | IProject
  onDelete: ( targetId: string ) => void
}

function Delete ( { data, onDelete }: DeleteProps ) {
  const [ show, setShow ] = useState( false )

  const handleDelete = async () => {
    if ( data.cover ) {
      try {
        const fileName = data.cover.split( '/' ).pop()
        if ( fileName ) {
          await FileService.deleteImageFn( fileName )
        }
      } catch ( error ) {
        console.error( 'Error deleting cover:', error )
      }
    }

    onDelete( data.id )
    setShow( false )
  }

  return (
    <div className=''>
      <OverlayTrigger
        key='top'
        placement='top'
        overlay={ <Tooltip id={ `tooltip-top` }>Удалить</Tooltip> }
      >
        <i
          className='bi-trash3-fill text-danger h5'
          style={ { cursor: 'pointer' } }
          onClick={ () => setShow( true ) }
        ></i>
      </OverlayTrigger>

      <Modal
        show={ show }
        onHide={ () => setShow( false ) }
        dialogClassName='modal-90w'
        aria-labelledby='example-custom-modal-styling-title'
        backdrop='static'
        keyboard={ false }
        centered
      >
        <Modal.Header>
          <Modal.Title id='example-custom-modal-styling-title'>
            Вы действительно хотите удалить "{ data.title }"?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={ () => setShow( false ) }
          >
            Отмена
          </Button>
          <Button
            variant='danger'
            onClick={ handleDelete }
          >
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Delete
