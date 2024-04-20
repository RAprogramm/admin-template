import { Role, roles } from '@/utils/roleDescriptor'
import { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

interface UserHeaderProps {
  name: string
  role: string
  logoutUser: () => Promise<void>
}

const UserHeader: React.FC<UserHeaderProps> = ( { name, role, logoutUser } ) => {
  const isFirstNavbarActive = ( path: string ): boolean => {
    return location.pathname.includes( path )
  }
  const [ roleView, setRoleView ] = useState<JSX.Element | string>( '' )
  const [ rights, setRights ] = useState<string>( '' )

  useEffect( () => {
    const roleDescription = ( roles as { [ key: string ]: Role } )[ role ]?.roleDescriptor || 'Неизвестная роль'
    const rightsDescription = ( roles as { [ key: string ]: Role } )[ role ]?.rightsDescription || 'Нет описания прав'

    setRoleView(
      <span className='text-danger fw-bold'>{ roleDescription }</span>
    )
    setRights( rightsDescription )
  }, [ role ] )

  return (
    <>

      <ul className='navbar-nav'>
        <li className='nav-item font-weight-semibold d-none d-lg-block ms-0'>
          <h3 className='welcome-text'>
            Здравствуйте,
            <span className='text-black fw-bold'> { name }</span>
          </h3>
          <OverlayTrigger
            key='bottom'
            placement='bottom'
            overlay={ <Tooltip id={ `tooltip-${ role }` }>{ rights }</Tooltip> }
          >
            <h6 className='welcome-sub-text text-body-tertiary'>
              Ваша роль <span
                className='text-danger fw-bold'
                style={ { cursor: 'pointer' } }
              >{ roleView }</span>
            </h6>
          </OverlayTrigger>
        </li>
      </ul>

      <ul
        className='nav nav-pills d-inline-flex mt-2 mt-md-0 ms-md-auto'
        style={ { justifyContent: 'center' } }
      >
        { role === 'admin' && (
          <li>
            <NavLink
              to='/admin/users/list'
              className={ `nav-link ${ isFirstNavbarActive( '/admin/users' ) ? 'active' : '' }` }
            >
              Участники
            </NavLink>
          </li>
        ) }
        <li>
          <NavLink
            to='/admin/projects/list'
            className={ `nav-link ${ isFirstNavbarActive( '/admin/projects' ) ? 'active' : '' }` }
          >
            Проекты
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/admin/articles/list'
            className={ `nav-link ${ isFirstNavbarActive( '/admin/articles' ) ? 'active' : '' }` }
          >
            Статьи
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/admin/profile'
            className='nav-link'
          >
            Профиль
          </NavLink>
        </li>
        <li className='nav-item'>
          <Link
            onClick={ logoutUser }
            to='/'
            className='nav-link'
          >
            Выход
          </Link>
        </li>
      </ul>
    </>
  )
}

export default UserHeader
