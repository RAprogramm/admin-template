import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const ErrorPage = ( { error }: { error?: string } ) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isDev = import.meta.env.VITE_NODE_ENV === 'development'
  const hostname = isDev ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_PROD_API_URL

  const navMsg = location.state?.error
  const msg = navMsg || error || `The targeted page "${ location.pathname }" was not found. Please confirm the spelling and try again.`

  return (
    <section id="Error" className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg text-center mb-4">{ msg }</p>
      <div className="d-flex flex-row justify-content-center gap-3">
        <Button variant="primary" onClick={ () => navigate( -1 ) }>Return to Previous Page</Button>
        <Button variant="secondary" onClick={ () => navigate( '/' ) }>Return to Home Page</Button>
        { isDev && (
          <Button variant="warning" onClick={ () => window.open( `${ hostname }/logout`, '_blank' ) }>Reset Authentication</Button>
        ) }
      </div>
    </section>
  )
}

export default ErrorPage
