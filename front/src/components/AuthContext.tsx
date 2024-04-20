import React, { createContext, useContext, useState } from 'react'

interface AuthContextProps {
  isAuthenticated: boolean
  updateAuthentication: ( value: boolean ) => void
  authEndpoint: string
}

const AuthContext = createContext<AuthContextProps | undefined>( undefined )

export const AuthProvider: React.FC<{
  children: React.ReactNode
  authUrl: string
  isDev: boolean
}> = ( { children, authUrl, isDev } ) => {
  //Ignore authentication requirement in development mode
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>( isDev )

  const updateAuthentication = ( value: boolean ) => {
    setIsAuthenticated( value )
  }

  const contextValue: AuthContextProps = {
    isAuthenticated,
    updateAuthentication,
    authEndpoint: authUrl,
  }

  return (
    <AuthContext.Provider value={ contextValue }>{ children }</AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext( AuthContext )
  if ( !context ) {
    throw new Error( 'useAuthContext must be used within an AuthProvider' )
  }
  return context
}

export const login = ( url: string ) => {
  if ( !url ) {
    throw new Error(
      'Login failed, please provide an authentication URL to the application config file.'
    )
  } else {
    window.open( url, '_blank' )
  }
}
