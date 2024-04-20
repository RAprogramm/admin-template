import { useEffect, useState } from 'react'
import Image from 'react-bootstrap/Image'
import { toast } from 'react-toastify'

import FileService from '@services/fileService'
import useStore from '@/store'
import MySpinner from '@components/Spinner'
import no_image from '@/images/no_image.jpg'

interface CoverPreviewProps {
  coverUrl: string
}

function CoverPreview ( { coverUrl }: CoverPreviewProps ) {
  const [ imageUrl, setImageUrl ] = useState( '' )
  const { setRequestLoading, requestLoading } = useStore()

  const [ isImageLoaded, setIsImageLoaded ] = useState( false )

  useEffect( () => {
    if ( coverUrl ) {
      setRequestLoading( true )
      {/* @ts-ignore */ }
      FileService.getImageFn( coverUrl.split( '/' ).pop() )
        .then( blob => {
          const url = URL.createObjectURL( blob )
          setImageUrl( url )
          setIsImageLoaded( false )
          return () => URL.revokeObjectURL( url )
        } )
        .catch( error => {
          toast.error( 'Failed to fetch image: ', error )
        } )
        .finally( () => setRequestLoading( false ) )
    } else {
      setImageUrl( no_image )
      setRequestLoading( false )
    }
  }, [ coverUrl, setRequestLoading ] )

  const onImageLoad = () => {
    setIsImageLoaded( true )
  }

  return (
    <div className='d-flex justify-content-center align-items-center' >
      { requestLoading && !isImageLoaded ? (
        <MySpinner color='primary' className='m-auto' style={ { width: '7rem', height: '7rem', fontSize: '30px' } } />
      ) : (
        <Image src={ imageUrl } rounded fluid className='m-auto img-fluid' onLoad={ onImageLoad } style={ { display: isImageLoaded ? 'block' : 'none', width: '100%', maxWidth: '1200px' } } />
      ) }
    </div>
  )
}

export default CoverPreview
