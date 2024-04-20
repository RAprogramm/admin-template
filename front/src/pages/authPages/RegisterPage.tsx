import { TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import FormInput from '@components/FormInput'
import { LoadingButton } from '@components/LoadingButton'
import { API } from '@api/index'
import { GenericResponse } from '@api/types/response'
import useStore from '@store/index'
import { registerSchema } from '@schemas/registerSchema'

export type RegisterInput = TypeOf<typeof registerSchema>

const RegisterPage = () => {
  const store = useStore()
  const navigate = useNavigate()
  const methods = useForm<RegisterInput>( {
    resolver: zodResolver( registerSchema )
  } )

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful }
  } = methods

  useEffect( () => {
    if ( isSubmitSuccessful ) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isSubmitSuccessful ] )

  const registerUser = async ( data: RegisterInput ) => {
    try {
      store.setRequestLoading( true )
      const response = await API.post<GenericResponse>(
        '/auth/register',
        data
      )
      store.setRequestLoading( false )
      toast.success( response.data.message as string )
      toast.success( 'Success' )
      // TODO: if 'user' go to information page 
      navigate( '/login' )
    } catch ( error: any ) {
      store.setRequestLoading( false )
      const resMessage =
        ( error.response &&
          error.response.data &&
          error.response.data.message ) ||
        error.message ||
        error.toString()
      toast.error( resMessage )
    }
  }

  return (
    <section className='mt-auto'>
      <div className='container'>
        <h4>Добро пожаловать! Давайте начнём</h4>
        <h6 className='fw-light'>Зарегистрируйтесь, чтобы начать.</h6>
        <FormProvider { ...methods }>
          <Form
            className='pt-3'
            onSubmit={ handleSubmit( registerUser ) }
          >
            <div className='form-group'>
              <FormInput
                label='Полное имя'
                name='name'
              />
            </div>
            <div className='form-group'>
              <FormInput
                label='Адрес электронной почты'
                name='email'
                type='email'
              />
            </div>
            <div className='form-group'>
              <FormInput
                label='Пароль'
                name='password'
                type='password'
              />
            </div>
            <div className='form-group'>
              <FormInput
                label='Повторите пароль'
                name='passwordConfirm'
                type='password'
              />
            </div>
            <div className='mt-3'>
              <LoadingButton
                loading={ store.requestLoading }
                bigSize
              >
                Регистрация
              </LoadingButton>
            </div>

            <div className='text-center mt-4 fw-light'>
              Уже зарегистрированы?
              <Link to='/login'> Нажмите, чтобы войти</Link>
            </div>
          </Form>
        </FormProvider>
      </div>
    </section>
  )
}

export default RegisterPage
