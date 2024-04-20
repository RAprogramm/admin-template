import React from 'react'
import { Button } from 'react-bootstrap'

import MySpinner from '@components/Spinner'

type LoadingButtonProps = {
  loading: boolean
  btnColor?: string
  bigSize?: boolean
  textColor?: string
  children: React.ReactNode
  style?: any
}

export const LoadingButton: React.FC<LoadingButtonProps> = ( {
  textColor = 'text-white',
  btnColor = 'primary',
  bigSize,
  children,
  loading = false,
  style
} ) => {
  return (
    <Button
      type='submit'
      variant={ bigSize ? `${ btnColor } lg` : `${ btnColor }` }
      style={ style }
    >
      { loading ? (
        <div className='flex items-center gap-3'>
          <MySpinner
            animation='border'
            size='sm'
          />
          <span className='text-white inline-block'> Загрузка...</span>
        </div>
      ) : (
        <span className={ `text-lg font-normal ${ textColor }` }>{ children }</span>
      ) }
    </Button>
  )
}
