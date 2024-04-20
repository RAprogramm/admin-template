import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import useStore from '@/store'
import { API } from '@/api'
import { GenericResponse } from '@api/types/response'
import DefaultHeader from '@header/DefaultHeader'
import UserHeader from '@header/UserHeader'
import AdminHeader from '@header/AdminHeader'
import { useEffect } from 'react'

const Header = () => {
  const { authUser, setAuthUser, setRequestLoading } = useStore()
  const user = authUser
  const navigate = useNavigate()
  const location = useLocation()

  const logoutUser = async () => {
    try {
      const logout = API.post<GenericResponse>( '/auth/logout' )
      setAuthUser( null )
      await toast.promise( logout, {
        pending: 'Очистка данных. Подождите...',
        success: 'Вы вышли из системы',
        error: 'Отказано в доступе'
      } )
      navigate( '/login' )
    } catch ( error: any ) {
      setRequestLoading( false )
      setAuthUser( null )
      navigate( '/login' )
    }
  }

  const paths = [ '/admin/articles', '/admin/projects', '/admin/users' ]
  const showSecondHeader =
    user && paths.some( ( path ) => location.pathname.startsWith( path ) )

  useEffect( () => {
  }, [ user ] )

  return (
    <>
      <div className='d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom'>
        { !user && <DefaultHeader /> }
        { user &&
          <UserHeader
            name={ user.name }
            role={ user.role }
            logoutUser={ logoutUser }
          />
        }
      </div>
      { showSecondHeader && (
        <div className='d-flex flex-column pb-4 mb-4 border-bottom'>
          <AdminHeader />
        </div>
      ) }
    </>
  )
}

export default Header
