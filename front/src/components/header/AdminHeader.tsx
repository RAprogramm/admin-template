import useStore from '@/store'
import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// BUG: does not changing after token expire

const AdminHeader = () => {
  const { authUser } = useStore()
  const location = useLocation()

  let basePath = '/admin/articles'
  if ( location.pathname.includes( '/articles' ) ) {
    basePath = '/admin/articles'
  } else if ( location.pathname.includes( '/projects' ) ) {
    basePath = '/admin/projects'
  } else if ( location.pathname.includes( '/users' ) ) {
    basePath = '/admin/users'
  }

  useEffect( () => {

  }, [ location, authUser ] )

  return (
    <>
      <ul className='nav nav-pills d-inline-flex justify-content-center'>
        {/* @ts-ignore */ }
        { authUser?.role !== 'user' && !( authUser?.role === 'admin' && location.pathname.includes( '/users' ) ) &&
          <li>
            <NavLink
              to={ `${ basePath }/add` }
              className='nav-link'
            >
              Добавить
            </NavLink>
          </li>
        }
        <li>
          <NavLink
            to={ `${ basePath }/list` }
            className='nav-link'
          >
            { ( authUser?.role === 'user' || ( authUser?.role === 'admin' && location.pathname.includes( '/users' ) ) ) ? 'Список' : 'Внести изменения' }
          </NavLink>
        </li>
      </ul>
    </>
  )
}

export default AdminHeader
