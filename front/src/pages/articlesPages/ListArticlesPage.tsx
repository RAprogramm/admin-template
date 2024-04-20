import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Delete from '@modals/DeleteModal'
import Edit from '@modals/EditorModal'
import Preview from '@modals/PreviewModal'
import useStore from '@/store'
import formatDate from '@utils/timeDate'
import { IArticle } from '@api/types/article'
import { deleteArticleFn, getArticlesFn, searchArticlesByTagsFn } from '@services/articleService'
import ListPagination from '@components/ListPagination'
import FilterTags from '@/components/FilterTags'

const ListArticles = () => {
  const { authUser, setRequestLoading, articlesLimit, setArticlesLimit, paginationCurrentArticlePage, setPaginationCurrentArticlePage } = useStore()

  const [ articles, setArticles ] = useState<IArticle[]>( [] )
  const [ currentPage, setCurrentPage ] = useState( paginationCurrentArticlePage )
  const [ totalPages, setTotalPages ] = useState( 1 )
  const [ totalResults, setTotalResults ] = useState( 1 )
  const [ searchingTags, setSearchingTags ] = useState( '' )

  const handleLimitChange = ( newLimit: number ) => {
    setArticlesLimit( newLimit )
    getArticles( currentPage, newLimit )
  }

  const getArticles = async ( page = currentPage, limit = articlesLimit ) => {
    try {
      setRequestLoading( true )
      const response = await getArticlesFn( page, limit )
      setRequestLoading( false )
      setArticles( response.articles )
      setTotalPages( response.total_pages )
      setTotalResults( response.total_results )

      setPaginationCurrentArticlePage( page )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
    }
  }

  const handleSearchByTags = async ( tags: string ) => {
    if ( !tags ) {
      getArticles()
      return
    }
    try {
      setRequestLoading( true )
      const response = await searchArticlesByTagsFn( tags )
      setRequestLoading( false )
      setArticles( response.articles )
      setSearchingTags( tags )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'Ошибка поиска' )
    }
  }

  const handleClear = () => {
    setSearchingTags( '' )
  }

  const deleteArticle = async ( articleId: string ) => {
    try {
      await toast.promise( deleteArticleFn( articleId ), {
        pending: 'Удаление статьи. Подождите...',
        success: 'Статья удалена',
        error: 'Ошибка удаления'
      } )

      setTotalResults( prevTotalResults => prevTotalResults - 1 )

      getArticles( currentPage ).then( () => {
        const newTotalPages = Math.ceil( totalResults / articlesLimit )
        if ( currentPage > newTotalPages ) {
          setCurrentPage( newTotalPages )
          getArticles( newTotalPages )
        }
      } )

    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'Произошла ошибка' )
      setRequestLoading( false )
    }
  }

  useEffect( () => {
    getArticles()
  }, [ paginationCurrentArticlePage ] )

  return (
    <section>
      <div className='d-flex m-auto justify-content-center align-items-center mb-3' style={ { width: '100%' } }>
        <FilterTags searchingTags={ searchingTags } onSearch={ handleSearchByTags } onClear={ handleClear } />
        <ListPagination
          currentPage={ currentPage }
          totalPages={ totalPages }
          onLimitChange={ handleLimitChange }
          limit={ articlesLimit }
          onPageChange={ ( page ) => {
            setPaginationCurrentArticlePage( page )
            setCurrentPage( page )
            getArticles( page )
          } }
        />
        <span className='mb-3'>Всего статей: <strong>{ totalResults }</strong></span>
      </div>
      <Table hover responsive='md'>
        <thead>
          <tr>
            <th>#</th>
            <th>Заголовок</th>
            { authUser?.role === 'admin' && <th>Автор</th> }
            <th>Создан</th>
            <th>Изменён</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          { articles.map( ( article: IArticle, index ) => (
            <tr key={ article.id } >
              <td>{ index + 1 }</td>
              <td>{ article.title }</td>
              { authUser?.role === 'admin' && <td>{ article.author_id }</td> }
              <td>{ formatDate( article.createdAt ) }</td>
              <td>{ formatDate( article.createdAt ) === formatDate( article.updatedAt ) ? '' : formatDate( article.updatedAt ) }</td>

              <td className='d-flex'>
                <Preview
                  data={ article }
                />
                { authUser?.role !== 'user' &&
                  <>
                    <Edit data={ article } onUpdated={ getArticles } />
                    <Delete
                      data={ article }
                      onDelete={ deleteArticle }
                    />
                  </>
                }
              </td>
            </tr>
          ) ) }

        </tbody>
      </Table>
    </section >
  )
}

export default ListArticles
