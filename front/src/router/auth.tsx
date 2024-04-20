import { Navigate, type RouteObject } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import LoginPage from '@pages/authPages/LoginPage'
import RegisterPage from '@pages/authPages/RegisterPage'
import ErrorPage from '@pages/ErrorPage'

const authRoutes: RouteObject = {
  element: <MainLayout />,
  children: [
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'register',
      element: <RegisterPage />
    },
    {
      path: '/',
      element: (
        <Navigate
          replace
          to='/login'
        />
      )
    },
    {
      path: '*',
      element: <ErrorPage />
    }
  ]
}

export default authRoutes
