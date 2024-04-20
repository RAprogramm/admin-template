import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from '@components/AuthContext'
import router from '@/router'

import { ToastContainer } from 'react-toastify'

const isDev = import.meta.env.VITE_NODE_ENV === 'dev'

const authUrl = isDev
  ? import.meta.env.VITE_DEV_AUTH_URL
  : import.meta.env.VITE_PROD_AUTH_URL

const container = document.getElementById( 'root' )
const root = ReactDOM.createRoot( container! )

root.render(
  <React.StrictMode>
    <AuthProvider
      authUrl={ authUrl || '' }
      isDev={ isDev }
    >
      <RouterProvider router={ router } />
    </AuthProvider>
    <ToastContainer
      position='bottom-right'
      closeOnClick
    />
  </React.StrictMode>
)
