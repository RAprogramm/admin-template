import { useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import useStore from '@/store'
import FormInput from '@components/FormInput'
import { LoadingButton } from '@components/LoadingButton'
import ImageUpload from '@components/ImageUpload'
import TagsInput from '@components/TagsInput'
import { projectSchema } from '@schemas/projectSchema'
import { createProjectFn } from '@services/projectService'
import FileService from '@services/fileService'
import CoverPreview from '@/components/Cover'

// FIX: remove image when form not submitted or leaved

export type ProjectInput = TypeOf<typeof projectSchema>

const AddProjectPage = () => {
  const { setRequestLoading, requestLoading } = useStore()
  const navigate = useNavigate()
  const [ coverUrl, setCoverUrl ] = useState( '' )

  const methods = useForm<ProjectInput>( {
    resolver: zodResolver( projectSchema )
  } )

  const onImageUpload = ( path: string ) => {
    if ( coverUrl ) {
      FileService.deleteImageFn( coverUrl.split( '/' ).pop() as string ).catch( error => {
        console.error( 'Ошибка при удалении предыдущего изображения:', error )
      } )
    }
    setValue( 'cover', path, { shouldValidate: true } )
    setCoverUrl( path.split( '/' ).pop() as string )
  }

  const {
    setValue,
    handleSubmit,
    formState: { errors, touchedFields }
  } = methods


  const addProject: SubmitHandler<ProjectInput> = async () => {
    try {
      setRequestLoading( true )

      const formDataValues = methods.getValues()
      const formData = new FormData()

      formData.append( 'title', formDataValues.title )
      formData.append( 'description', formDataValues.description )
      formData.append( 'category', formDataValues.category )
      formData.append( 'cover', formDataValues.cover )
      formDataValues.tags?.forEach( tag => formData.append( 'tags', tag.name ) )

      await toast.promise( createProjectFn( formData ), {
        pending: 'Добавление проекта. Подождите...',
        success: 'Проект добавлен',
        error: 'Ошибка добавления'
      } )

      setRequestLoading( false )
      navigate( '/admin/projects/list' )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
    } finally {
      setRequestLoading( false )
    }
  }

  return (
    <section className='mt-auto'>
      <div className='container'>
        <FormProvider { ...methods }>
          <Form
            className='pt-2'
            onSubmit={ handleSubmit( addProject ) }
          >
            <ImageUpload
              onImageUpload={ onImageUpload }
              uploadUrl=''
            />
            <CoverPreview coverUrl={ coverUrl } />
            <FormInput
              name='cover'
              plaintext
              readOnly
              hidden
              feedbackStyle={ { textAlign: 'center' } }
            />
            <FormInput
              label='Название проекта'
              name='title'
            />
            <FormInput
              label='Категория проекта'
              name='category'
            />
            <TagsInput name='tags' />
            <FormInput
              label='Описание проекта'
              name='description'
              type='textarea'
              as='textarea'
              style={ { height: '200px' } }
            />
            <div className='mt-3 d-flex'>
              <LoadingButton bigSize loading={ requestLoading }
                style={ { margin: 'auto' } }
                btnColor={ Object.keys( touchedFields ).length > 0 && Object.keys( errors ).length === 0 ? 'success' : 'secondary' }
              >
                Добавить проект
              </LoadingButton>
            </div>
          </Form>
        </FormProvider>
      </div>
    </section>
  )
}

export default AddProjectPage
