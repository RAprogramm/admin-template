import { createBrowserRouter } from 'react-router-dom'

import authRoutes from '@router/auth'
import userRoutes from '@router/user'

const routes = createBrowserRouter( [ authRoutes, userRoutes ] )

export default routes
