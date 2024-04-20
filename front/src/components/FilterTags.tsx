import React, { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

type Props = {
  searchingTags: string
  onSearch: ( tags: string ) => void
  onClear: () => void
}

const FilterTags: React.FC<Props> = ( { searchingTags, onSearch, onClear } ) => {
  const [ tags, setTags ] = useState( searchingTags )

  const handleSearch = () => {
    onSearch( tags || '' )
  }

  const handleClear = () => {
    setTags( '' )
    onClear()
    onSearch( '' )
  }

  return (
    <div className="d-flex align-items-end justify-content-center align-items-center mb-3">
      <Form.Group controlId="filterTags">
        <InputGroup size='sm'>
          <Form.Control
            type="text"
            placeholder='Введите тег/теги'
            value={ tags }
            onChange={ ( e ) => {
              setTags( e.target.value )
            } }
          />
          <Button variant='outline-primary' onClick={ handleSearch }>Поиск</Button>
          { tags && (
            <Button variant="outline-secondary" onClick={ handleClear }>Очистить</Button>
          ) }
        </InputGroup>
      </Form.Group>
    </div>
  )
}

export default FilterTags
