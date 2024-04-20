import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Delete from '@modals/DeleteModal'
import Edit from '@modals/EditorModal'
import useStore from '@/store'
import { deleteProjectFn, getProjectsFn, searchProjectsByTagsFn } from '@services/projectService'
import { IProject } from '@api/types/project'
import formatDate from "@utils/timeDate"
import ListPagination from '@components/ListPagination'
import Preview from '@modals/PreviewModal'
import FilterTags from '@components/FilterTags'

const ListProjects = () => {
  const { authUser, setRequestLoading, projectsLimit, setProjectsLimit, paginationCurrentProjectPage, setPaginationCurrentProjectPage } = useStore()

  const [ projects, setProjects ] = useState<IProject[]>( [] )
  const [ currentPage, setCurrentPage ] = useState( paginationCurrentProjectPage )
  const [ totalPages, setTotalPages ] = useState( 1 )
  const [ totalResults, setTotalResults ] = useState( 1 )
  const [ searchingTags, setSearchingTags ] = useState( '' )

  const handleLimitChange = ( newLimit: number ) => {
    setProjectsLimit( newLimit )
    getProjects( currentPage, newLimit )
  }

  const getProjects = async ( page = currentPage, limit = projectsLimit ) => {
    try {
      setRequestLoading( true )
      const response = await getProjectsFn( page, limit )
      setRequestLoading( false )
      setProjects( response.projects )
      setTotalPages( response.total_pages )
      setTotalResults( response.total_results )
      setPaginationCurrentProjectPage( page )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'An error occurred' )
    }
  }

  const handleSearchByTags = async ( tags: string ) => {
    if ( !tags ) {
      getProjects()
      return
    }
    try {
      setRequestLoading( true )
      const response = await searchProjectsByTagsFn( tags )
      setRequestLoading( false )
      setProjects( response.projects )
      setSearchingTags( tags )
    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'Ошибка поиска' )
    }
  }

  const handleClear = () => {
    setSearchingTags( '' )
  }

  const deleteProject = async ( project_id: string ) => {
    try {
      await toast.promise( deleteProjectFn( project_id ), {
        pending: 'Удаление проекта. Подождите...',
        success: 'Проект удален',
        error: 'Ошибка удаления'
      } )

      setTotalResults( prevTotalResults => prevTotalResults - 1 )

      getProjects( currentPage ).then( () => {
        const newTotalPages = Math.ceil( totalResults / projectsLimit )
        if ( currentPage > newTotalPages ) {
          setCurrentPage( newTotalPages )
          getProjects( newTotalPages )
        }
      } )

    } catch ( error: any ) {
      toast.error( error.response?.data?.message || error.message || 'Произошла ошибка' )
      setRequestLoading( false )
    }
  }

  useEffect( () => {
    getProjects()
  }, [ paginationCurrentProjectPage ] )

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-4">
        <FilterTags searchingTags={ searchingTags } onSearch={ handleSearchByTags } onClear={ handleClear } />
        <ListPagination
          currentPage={ currentPage }
          totalPages={ totalPages }
          onLimitChange={ handleLimitChange }
          limit={ projectsLimit }
          onPageChange={ ( page ) => {
            setPaginationCurrentProjectPage( page )
            setCurrentPage( page )
            getProjects( page )
          } }
        />
        <span className='mb-3'>Всего проектов: <strong>{ totalResults }</strong></span>
      </div>
      <Table hover responsive='md'>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Создан</th>
            <th>Изменён</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          { projects.map( ( project: IProject, index ) => (
            <tr key={ project.id }>
              <td>{ index + 1 }</td>
              <td>{ project.title }</td>
              <td>{ project.category }</td>
              <td>{ formatDate( project.createdAt ) }</td>
              <td>{ formatDate( project.createdAt ) === formatDate( project.updatedAt ) ? '' : formatDate( project.updatedAt ) }</td>
              <td className='d-flex'>
                <Preview
                  data={ project }
                />
                { authUser?.role !== 'user' &&
                  <>
                    <Edit data={ project } onUpdated={ getProjects } />
                    <Delete
                      onDelete={ deleteProject }
                      data={ project }
                    />
                  </>
                }
              </td>
            </tr>
          ) ) }
        </tbody>
      </Table>
    </section>
  )
}

export default ListProjects
