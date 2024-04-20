import { Outlet } from 'react-router-dom'
import { ReactNode } from 'react'

import Header from '@components/Header'

type MainLayoutProps = {
  children?: ReactNode // Add children type
}

const MainLayout: React.FC<MainLayoutProps> = ( { children } ) => {
  return (
    <>
      <div className='container py-3'>
        <Header />
        { children || <Outlet /> }
      </div>
    </>
  )
}

export default MainLayout
