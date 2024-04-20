import { Link, NavLink } from 'react-router-dom'

const DefaultHeader = () => {
  return (
    <>
      <Link
        to='/'
        className='d-flex align-items-center text-dark text-decoration-none'
      >
        <h1 style={ { color: 'black', fontWeight: 'bold' } }>Rust</h1>
        <h1 style={ { color: '#4018ac', fontWeight: 'bold' } }>Admin</h1>
      </Link>
      <ul
        className='nav nav-pills d-inline-flex mt-2 mt-md-0 ms-md-auto'
        style={ { justifyContent: 'center' } }
      >
        <li className='nav-item '>
          <NavLink
            to='/register'
            className='nav-link'
          >
            Регистрация
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink
            to='/login'
            className='nav-link'
          >
            Вход
          </NavLink>
        </li>
      </ul>
    </>
  )
}

export default DefaultHeader
