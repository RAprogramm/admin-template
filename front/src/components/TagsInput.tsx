import React, { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button, ButtonGroup, FloatingLabel, Form, InputGroup, Stack } from 'react-bootstrap'

type Props = {
  name: string
}

const TagsInput: React.FC<Props> = ( { name } ) => {
  const { control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray( { control, name } )
  const [ tag, setTag ] = useState( '' )


  const addTag = () => {
    if ( tag.trim() !== '' ) {
      append( { name: tag } )
      setTag( '' )
    }
  }

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    setTag( e.target.value )
  }

  return (
    <Form.Group
      controlId={ name }
      className='mb-4'
    >
      <Stack
        direction='horizontal'
        gap={ 2 }
        className='mb-2'
      >
        { fields.map( ( field, index ) => (
          <div key={ field.id }>
            <ButtonGroup>
              <Button size='sm' variant='dark'>
                {/* @ts-ignore */ }
                <strong>{ field.name }</strong>
              </Button>
              <Button
                size='sm'
                variant='outline-danger'
                onClick={ () => remove( index ) }
              >
                x
              </Button>
            </ButtonGroup>
          </div>
        ) ) }
      </Stack>
      <InputGroup className='mb-4'>
        <FloatingLabel label='Введите тег и нажмите "Добавить"'>
          <Form.Control
            type="text"
            value={ tag }
            onChange={ handleChange }
            placeholder='Введите тег и нажмите "Добавить"'
            isInvalid={ !!errors[ name ]?.message }
          />
          <Form.Control.Feedback type='invalid' style={ { textAlign: 'right', paddingRight: '0.5rem' } }>
            { errors[ name ]?.message as string }
          </Form.Control.Feedback>
        </FloatingLabel>
        <Button id="button-addon2" onClick={ addTag }>Добавить</Button>
      </InputGroup>
    </Form.Group>
  )
}

export default TagsInput
