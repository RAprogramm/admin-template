import { useEffect, useState } from 'react'
import { Button, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { toast } from 'react-toastify'

import useStore from '@/store'
import { deleteUserFn, getUserFn, getUsersFn, updateUserRoleFn } from '@services/userService'
import { IUser, IUserRole } from '@api/types/user'
import formatDate from "@utils/timeDate"
import ListPagination from '@components/ListPagination'
import { Role, roles } from '@utils/roleDescriptor'

const ListUsers = () => {
  const { setRequestLoading, usersLimit, setUsersLimit, paginationCurrentUserPage, setPaginationCurrentUserPage } = useStore()
  const [ users, setUsers ] = useState<IUser[]>( [] )
  const [ targetUser, setTargetUser ] = useState<IUserRole>( { id: '', name: '', role: '' } )

  const [ currentPage, setCurrentPage ] = useState( paginationCurrentUserPage )
  const [ totalPages, setTotalPages ] = useState( 1 )
  const [ totalResults, setTotalResults ] = useState( 1 )

  const [ show, setShow ] = useState( false )
  const [ showDelete, setShowDelete ] = useState( false )

  const handleClose = () => setShow( false )
  const handleShow = async ( user_id: string ) => {
    try {
      await getUserById( user_id )
      setShow( true )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
    }
  }

  const handleShowDelete = async ( user_id: string ) => {
    try {
      await getUserById( user_id )
      setShowDelete( true )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
    }
  }

  const deleteUser = async () => {
    try {
      await toast.promise( deleteUserFn( targetUser.id ), {
        pending: 'Удаление пользователя. Подождите...',
        success: 'Пользователь удален',
        error: 'Ошибка удаления'
      } )
      setTotalResults( prevTotalResults => prevTotalResults - 1 )
      getUsers()
      setShowDelete( false )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'Произошла ошибка' )
      setRequestLoading( false )
    }
  }

  const handleLimitChange = ( newLimit: number ) => {
    setUsersLimit( newLimit )
    getUsers( currentPage, newLimit )
  }

  const getUserById = async ( user_id: string ) => {
    try {
      setRequestLoading( true )
      const response = await getUserFn( user_id )
      setTargetUser( response )
      setRequestLoading( false )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
    }
  }

  const updateRole = async ( user_id: string, role: string ) => {
    try {
      setRequestLoading( true )
      await toast.promise( updateUserRoleFn( user_id, role ), {
        pending: 'Обновление роли. Подождите...',
        success: 'Роль обновлена',
        error: 'Ошибка обновления роли'
      } )
      setRequestLoading( false )
    } catch ( error: any ) {
      setRequestLoading( false )
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
    }
  }

  const getUsers = async ( page = currentPage, limit = usersLimit ) => {
    try {
      setRequestLoading( true )
      const response = await getUsersFn( page, limit )
      setRequestLoading( false )
      setUsers( response.users )
      setTotalPages( response.total_pages )
      setTotalResults( response.total_results )
      setPaginationCurrentUserPage( page )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
    }
  }

  const capitalize = ( str: string ): string => {
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 )
  }

  useEffect( () => {
    getUsers()
  }, [ paginationCurrentUserPage ] )

  // FIX: add space between icon and word (upgrade permissions)
  // TODO: clickable email to send email 

  return (
    <section>
      <div className='d-flex'>
        <ListPagination
          currentPage={ currentPage }
          totalPages={ totalPages }
          onLimitChange={ handleLimitChange }
          limit={ usersLimit }
          onPageChange={ ( page ) => {
            setPaginationCurrentUserPage( page )
            setCurrentPage( page )
            getUsers( page )
          } }
        />
        <span>Всего пользователей: <strong>{ totalResults - 1 }</strong></span>
      </div>
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Имя</th>
            <th>ID</th>
            <th>Роль</th>
            <th>Email</th>
            <th>Подтверждён</th>
            <th>Создан</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          { users.map( ( user: IUser, index ) => (
            <tr key={ user.id }>
              <td>{ index + 1 }</td>
              <td>{ user.name }</td>
              <td>{ user.id }</td>
              <td>
                <>
                  <Button variant={ user.role === 'user' ? "success" : "warning" } onClick={ () => handleShow( user.id ) }>
                    <i className={ user.role === 'user' ? "bi bi-caret-up-square-fill" : "bi bi-caret-down-square-fill" } /> { capitalize( ( roles as { [ key: string ]: Role } )[ user.role ]?.roleDescriptor ) }
                  </Button>
                  <Modal show={ show } onHide={ handleClose }>
                    <Modal.Header closeButton>
                      <Modal.Title>Подтвердите перевод пользователя <strong>{ targetUser?.name }</strong> из роли { targetUser?.role === 'user' ? <strong className="text-success">наблюдатель</strong> : <strong className="text-warning">модератор</strong> } в роль { targetUser?.role === 'user' ? <strong className="text-warning">модератор</strong> : <strong className="text-success">наблюдатель</strong> }.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      { targetUser?.role }
                      <ul>
                        <li>
                          Модератор - модерация контента (Создание, изменение и удаление статей и проектов).
                        </li>
                        <li>
                          Наблюдатель - просмотр контента, без возможности внесения изменений.
                        </li>
                      </ul>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={ handleClose }>
                        Отмена
                      </Button>
                      <Button variant={ targetUser?.role === 'user' ? "warning" : "success" } onClick={ async () => { await updateRole( targetUser?.id, targetUser?.role === 'user' ? 'moderator' : 'user' ); await getUsers(); handleClose() } }>
                        Подтвердить
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              </td>
              <td>{ user.email }</td>
              <td>{ user.verified ? 'Да' : 'Нет' }</td>
              <td>{ formatDate( user.createdAt ) }</td>
              <td>
                <div className=''>
                  <OverlayTrigger
                    key='top'
                    placement='top'
                    overlay={ <Tooltip id={ `tooltip-top` }>Удалить</Tooltip> }
                  >
                    <i
                      className='bi-trash3-fill text-danger h5'
                      style={ { cursor: 'pointer' } }
                      onClick={ () => handleShowDelete( user.id ) }
                    ></i>
                  </OverlayTrigger>

                  <Modal
                    show={ showDelete }
                    onHide={ () => setShowDelete( false ) }
                    dialogClassName='modal-90w'
                    aria-labelledby='deleteusermodal'
                    backdrop='static'
                    keyboard={ true }
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title id='deleteusermodal'>
                        Вы действительно хотите удалить { targetUser?.name }?
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                      <Button
                        variant='secondary'
                        onClick={ () => setShowDelete( false ) }
                      >
                        Отмена
                      </Button>
                      <Button
                        variant='danger'
                        onClick={ deleteUser }
                      >
                        Удалить
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </td>
            </tr>
          ) ) }
        </tbody>
      </Table>
    </section >
  )
}

export default ListUsers
