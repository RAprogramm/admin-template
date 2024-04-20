import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

import FileService from '@services/fileService'

interface ImageUploadResponse {
  status: number
  statusText: string
  data: string
  headers: Object
  config: Object
  request: XMLHttpRequest
}

type ImageUploadProps = {
  onImageUpload: any
  uploadUrl: string
}

const ImageUpload: React.FC<ImageUploadProps> = ( {
  onImageUpload,
  uploadUrl,
} ) => {
  const {
    setValue,
    formState: { errors }
  } = useFormContext()
  const [ progress, setProgress ] = useState<number>( 0 )
  const [ uploading, setUploading ] = useState<boolean>( false )

  const handleFileChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    const files = event.target.files
    if ( files && files.length > 0 ) {
      const file = files[ 0 ]
      setValue( 'coverFile', file )
      uploadFile( file )
    }
  }

  const uploadFile = async ( file: File ) => {
    try {
      setUploading( true )
      const upload = FileService.upload( file, uploadUrl, ( event: any ) => {
        setProgress( Math.round( ( 100 * event.loaded ) / event.total ) )
      } ).then( ( response: ImageUploadResponse ) => {
        const responseData = JSON.parse( response.data )
        onImageUpload( responseData.file_path )
      } )
      await toast.promise( upload, {
        pending: 'Загрузка обложки. Подождите...',
        success: 'Обложка успешно загружена!',
        error: 'Ошибка загрузки'
      } )
      setUploading( false )
    } catch ( err: any ) {
      const errorMessage =
        err.response?.data?.message || 'Ошибка при загрузке изображения'
      toast.error( errorMessage )
      setUploading( false )
    }
  }

  return (
    <Form.Group
      controlId='coverFile'
      className='mb-4'
    >
      { progress > 0 && !uploading && (
        <Form.Text>Загружено на { progress }%</Form.Text>
      ) }
      { uploading && <Form.Text>Идет загрузка...{ progress }%</Form.Text> }
      <Form.Control
        type='file'
        accept='image/*'
        onChange={ handleFileChange }
        disabled={ uploading }
        isInvalid={ !!errors[ 'coverFile' ]?.message }
      />
      <Form.Control.Feedback type='invalid'>
        { errors[ 'coverFile' ]?.message as string }
      </Form.Control.Feedback>
    </Form.Group>
  )
}

export default ImageUpload
