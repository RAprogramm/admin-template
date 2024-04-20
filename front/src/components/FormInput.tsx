import React from 'react'
import { Col, FloatingLabel, Form } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'

type FormInputProps = {
  label?: string
  name: string
  type?: string
  value?: string
  onChange?: any
  as?: any | undefined
  style?: React.CSSProperties
  placeholder?: string
  plaintext?: boolean
  readOnly?: boolean
  hidden?: boolean
  feedbackStyle?: React.CSSProperties
}

const FormInput: React.FC<FormInputProps> = ( {
  label,
  name,
  type = 'text',
  value,
  as: lookLike,
  style,
  feedbackStyle = { textAlign: 'right' },
  ...props
} ) => {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className='mb-4'>
      <Form.Group as={ Col } controlId={ name }>
        <FloatingLabel label={ label }>
          <Form.Control
            type={ type }
            placeholder={ props.placeholder ? label : '' }
            { ...register( name ) }
            isInvalid={ !!errors[ name ] }
            as={ lookLike }
            value={ value }
            style={ style }
            plaintext={ props.plaintext }
            readOnly={ props.readOnly }
            hidden={ props.hidden }
          />
          <Form.Control.Feedback type='invalid' style={ { ...feedbackStyle } }>
            { errors[ name ]?.message as string }
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
    </div>
  )
}

export default FormInput
