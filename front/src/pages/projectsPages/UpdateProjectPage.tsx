import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { toast } from 'react-toastify'
import Form from 'react-bootstrap/Form'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import FormInput from '@components/FormInput'
import FileService from '@services/fileService'
import ImageUpload from '@components/ImageUpload'
import { projectSchema } from '@schemas/projectSchema'
import { getSingleProjectFn, updateProjectFn } from '@services/projectService'
import TagsInput from '@components/TagsInput'
import CoverPreview from '@components/Cover'

export type ProjectInput = TypeOf<typeof projectSchema>

interface UpdateProjectProps {
  projectID: string
  onUpdated: () => void
}

const UpdateProjectPage: React.ForwardRefRenderFunction<any, UpdateProjectProps> = ( { projectID, onUpdated }, ref ) => {
  const [ coverUrl, setCoverUrl ] = useState( '' )
  const [ prevCoverUrl, setPrevCoverUrl ] = useState( '' )

  const methods = useForm<ProjectInput>( {
    resolver: zodResolver( projectSchema )
  } )
  const { setValue, handleSubmit } = methods

  const onImageUpload = ( path: string ) => {
    if ( coverUrl && coverUrl !== prevCoverUrl ) {
      FileService.deleteImageFn( coverUrl ).catch( error => {
        console.error( 'Ошибка при удалении предыдущего изображения:', error )
      } )
    }
    setValue( 'cover', path, { shouldValidate: true } )
    setCoverUrl( path )
  }


  const updateProject: SubmitHandler<ProjectInput> = async () => {
    try {
      const formDataValues = methods.getValues()
      const formData = new FormData()

      formData.append( 'title', formDataValues.title )
      formData.append( 'description', formDataValues.description )
      formData.append( 'category', formDataValues.category )
      formData.append( 'cover', formDataValues.cover )

      formDataValues.tags?.flat().forEach( tag => formData.append( 'tags[]', tag.name ) )

      await toast.promise( updateProjectFn( projectID, formData ), {
        pending: 'Обновление проекта. Подождите...',
        success: 'Проект обновлен',
        error: 'Ошибка обновления'
      } )

      onUpdated()
    } catch ( error: any ) {
      const resMessage =
        error.response?.data?.message || error.message || 'An error occurred'
      toast.error( resMessage )
    }
  }

  useImperativeHandle( ref, () => ( {
    submitForm: () => {
      handleSubmit( updateProject )()
    },
  } ) )

  useEffect( () => {
    const fetchProject = async () => {

      try {
        const project = await getSingleProjectFn( projectID )

        setValue( 'title', project.data.project.title )
        setValue( 'description', project.data.project.description )
        setValue( 'category', project.data.project.category )
        setValue( 'cover', project.data.project.cover )

        setCoverUrl( project.data.project.cover )
        setPrevCoverUrl( project.data.project.cover )

        const tagsForForm = project.data.project.tags.map( tag => ( { name: tag } ) )
        setValue( 'tags', tagsForForm )

      } catch ( error: any ) {
        toast.error( error.response?.data?.message || error.message || 'An error occurred' )
      }
    }

    fetchProject()
  }, [ projectID, setValue ] )

  return (
    <section className='mt-auto'>
      <div className='container'>
        <FormProvider { ...methods }>
          <Form
            className='pt-2'
            onSubmit={ handleSubmit( updateProject ) }
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
          </Form>
        </FormProvider>
      </div>
    </section>
  )
}

export default forwardRef( UpdateProjectPage )
