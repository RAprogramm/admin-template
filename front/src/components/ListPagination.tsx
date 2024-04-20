import React from 'react'
import { Form } from 'react-bootstrap'
import Pagination from 'react-bootstrap/Pagination'

interface ListPaginationProps {
  currentPage: number
  totalPages: number
  limit: number
  onPageChange: ( page: number ) => void
  onLimitChange: ( limit: number ) => void
}

const ListPagination: React.FC<ListPaginationProps> = ( { currentPage, totalPages, limit, onLimitChange, onPageChange } ) => {
  let items = []
  for ( let number = 1; number <= totalPages; number++ ) {
    items.push(
      <Pagination.Item key={ number } active={ number === currentPage } onClick={ () => onPageChange( number ) }>
        { number }
      </Pagination.Item>,
    )
  }

  return (
    <div className='d-flex m-auto justify-content-center align-self-start mb-3'>
      <div className='flex-shrink-0'>
        <Pagination className='m-auto'>
          <Pagination.First
            onClick={ () => onPageChange( 1 ) } disabled={ currentPage === 1 }
          />
          <Pagination.Prev
            onClick={ () => onPageChange( currentPage - 1 ) } disabled={ currentPage === 1 }
          />
          { items }
          <Pagination.Next
            onClick={ () => onPageChange( currentPage + 1 ) } disabled={ currentPage === totalPages }
          />
          <Pagination.Last
            onClick={ () => onPageChange( totalPages ) } disabled={ currentPage === totalPages }
          />
        </Pagination>
      </div>
      <Form.Select
        className='ms-1'
        aria-label="Select articles limit"
        value={ limit.toString() }
        onChange={ ( e ) => onLimitChange( parseInt( e.target.value, 10 ) ) }
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </Form.Select>
    </div>
  )
}

export default ListPagination
