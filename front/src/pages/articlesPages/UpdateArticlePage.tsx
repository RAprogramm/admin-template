import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { toast } from 'react-toastify'
import Form from 'react-bootstrap/Form'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import FormInput from '@components/FormInput'
import ImageUpload from '@components/ImageUpload'
import { articleSchema } from '@schemas/articleSchema'
import { getSingleArticleFn, updateArticleFn } from '@services/articleService'
import TagsInput from '@components/TagsInput'
import FileService from '@services/fileService'
import CoverPreview from '@components/Cover'

export type ArticleInput = TypeOf<typeof articleSchema>

interface UpdateArticleProps {
  articleID: string
  onUpdated: () => void
}

const UpdateArticlePage: React.ForwardRefRenderFunction<any, UpdateArticleProps> = ( { articleID, onUpdated }, ref ) => {
  const [ coverUrl, setCoverUrl ] = useState( '' )
  const [ prevCoverUrl, setPrevCoverUrl ] = useState( '' )

  const methods = useForm<ArticleInput>( {
    resolver: zodResolver( articleSchema )
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


  const updateArticle: SubmitHandler<ArticleInput> = async () => {
    try {
      const formDataValues = methods.getValues()
      const formData = new FormData()

      formData.append( 'title', formDataValues.title )
      formData.append( 'content', formDataValues.content )
      formData.append( 'cover', formDataValues.cover )

      formDataValues.tags?.flat().forEach( tag => formData.append( 'tags[]', tag.name ) )

      await toast.promise( updateArticleFn( articleID, formData ), {
        pending: 'Обновление статьи. Подождите...',
        success: 'Статья обновлена',
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
      handleSubmit( updateArticle )()
    },
  } ) )

  useEffect( () => {
    const fetchArticle = async () => {
      try {
        const article = await getSingleArticleFn( articleID )
        setValue( 'title', article.data.article.title )
        setValue( 'content', article.data.article.content )
        setValue( 'cover', article.data.article.cover )

        setCoverUrl( article.data.article.cover )
        setPrevCoverUrl( article.data.article.cover )

        const tagsForForm = article.data.article.tags.map( tag => ( { name: tag } ) )
        setValue( 'tags', tagsForForm )
      } catch ( error: any ) {
        toast.error( error.response?.data?.message || error.message || 'An error occurred' )
      }
    }

    fetchArticle()
  }, [ articleID, setValue ] )

  return (
    <section className='mt-auto'>
      <div className='container'>
        <FormProvider { ...methods }>
          <Form
            className='pt-2'
            onSubmit={ handleSubmit( updateArticle ) }
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
          </Form>
        </FormProvider>
      </div>
    </section>
  )
}

export default forwardRef( UpdateArticlePage )
