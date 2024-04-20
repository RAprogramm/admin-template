import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

type SpinnerProps = {
  color?: string
  animation?: 'border' | 'grow'
  size?: 'sm' | undefined
  className?: string | undefined
  style?: React.CSSProperties
}

const MySpinner: React.FC<SpinnerProps> = ( { color, animation, size, className, style } ) => {
  return (
    <Spinner
      animation={ animation }
      role='status'
      variant={ color }
      size={ size }
      className={ className }
      style={ style }
    >
      <span className='visually-hidden'> Загрузка...</span>
    </Spinner>
  )
}

export default MySpinner
