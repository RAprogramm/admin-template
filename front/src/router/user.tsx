import type { RouteObject } from 'react-router-dom'

import ProfilePage from '@pages/ProfilePage'
import AddArticlePage from '@pages/articlesPages/AddArticlePage'
import ListProjectsPage from '@pages/projectsPages/ListProjectsPage'
import AddProjectPage from '@pages/projectsPages/AddProjectPage'
import ListUsersPage from '@pages/usersPages/ListUsersPage'
import ListArticlesPage from '@pages/articlesPages/ListArticlesPage'
import ProtectedRoute from '@router/ProtectedRoute'
import ErrorPage from '@pages/ErrorPage'

const isDev = import.meta.env.VITE_NODE_ENV === 'dev'

const userRoutes: RouteObject = {
  path: 'admin',
  element: (
    <ProtectedRoute
      isDev={ isDev }
      goToPath='/login'
      errorPath='/error'
    />
  ),
  children: [
    {
      index: true,
      path: 'profile',
      element: <ProfilePage />
    },
    {
      path: 'articles',
      children: [
        {
          path: 'add',
          element: <AddArticlePage />
        },
        {
          path: 'list',
          element: <ListArticlesPage />
        }
      ]
    },
    {
      path: 'users',
      children: [
        {
          path: 'list',
          element: <ListUsersPage />
        }
      ]
    },
    {
      path: 'projects',
      children: [
        {
          path: 'add',
          element: <AddProjectPage />
        },
        {
          path: 'list',
          element: <ListProjectsPage />
        }
      ]
    },
    {
      path: '*',
      element: <ErrorPage />
    }
  ]
}

export default userRoutes
