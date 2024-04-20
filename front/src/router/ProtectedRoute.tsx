import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAuthContext } from '@components/AuthContext'
import MainLayout from '@/layouts/MainLayout'
import useStore from '@/store'
import { getMyself } from '@services/userService'

type ProctectRouteProps = {
  children?: React.ReactNode
  isDev: boolean
  goToPath: string
  errorPath: string
}

const ProtectedRoute = ( {
  children,
  isDev,
  errorPath,
}: ProctectRouteProps ) => {
  const { isAuthenticated, updateAuthentication } = useAuthContext()
  const [ hasLoaded, setHasLoaded ] = useState( false )

  const { setAuthUser, setRequestLoading } = useStore()
  const navigate = useNavigate()

  const getUser = async () => {
    try {
      setRequestLoading( true )
      setRequestLoading( false )
      setAuthUser( await getMyself() )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
      navigate( '/login' )
    }
  }

  useEffect( () => {
    const authUser = getUser()
    const exist = !!authUser

    if ( isDev ) {
      console.log(
        `Application started in development mode. Bypassing 'ProtectedRoute'.`
      )
      updateAuthentication( true )
    } else {
      updateAuthentication( exist )
    }
    setHasLoaded( true )
  }, [ updateAuthentication, isDev ] )

  if ( !isAuthenticated && !hasLoaded ) {
    return (
      <Navigate
        to={ errorPath }
        replace
        state={ { error: 'Please complete the login process.' } }
      />
    )
  }

  return <MainLayout>{ children || <Outlet /> }</MainLayout>
}

export default ProtectedRoute
