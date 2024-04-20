import { useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import FormInput from '@components/FormInput'
import { LoadingButton } from '@components/LoadingButton'
import useStore from '@store/index'
import ImageUpload from '@components/ImageUpload'
import TagsInput from '@components/TagsInput'
import { articleSchema } from '@schemas/articleSchema'
import { createArticleFn } from '@services/articleService'
import CoverPreview from '@components/Cover'
import FileService from '@services/fileService'

// FIX: remove image when form not submitted or leaved

export type ArticleInput = TypeOf<typeof articleSchema>

const AddArticlePage = () => {
  const { setRequestLoading, requestLoading } = useStore()
  const navigate = useNavigate()
  const [ coverUrl, setCoverUrl ] = useState( '' )

  const methods = useForm<ArticleInput>( {
    resolver: zodResolver( articleSchema )
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


  const addArticle: SubmitHandler<ArticleInput> = async () => {
    try {
      setRequestLoading( true )

      const formDataValues = methods.getValues()
      const formData = new FormData()

      formData.append( 'title', formDataValues.title )
      formData.append( 'content', formDataValues.content )
      formData.append( 'cover', formDataValues.cover )
      formDataValues.tags?.forEach( tag => formData.append( 'tags', tag.name ) )

      await toast.promise( createArticleFn( formData ), {
        pending: 'Добавление статьи. Подождите...',
        success: 'Статья добавлена',
        error: 'Ошибка добавления'
      } )

      setRequestLoading( false )
      navigate( '/admin/articles/list' )
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
            onSubmit={ handleSubmit( addArticle ) }
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
              label='Название статьи'
              name='title'
            />
            <TagsInput name='tags' />
            <FormInput
              label='Содержание статьи'
              name='content'
              type='textarea'
              as='textarea'
              style={ { height: '200px' } }
            />
            <div className='mt-3 d-flex'>
              <LoadingButton bigSize loading={ requestLoading }
                style={ { margin: 'auto' } }
                btnColor={ Object.keys( touchedFields ).length > 0 && Object.keys( errors ).length === 0 ? 'success' : 'secondary' }
              >
                Добавить статью
              </LoadingButton>
            </div>
          </Form>
        </FormProvider>
      </div>
    </section>
  )
}

export default AddArticlePage
