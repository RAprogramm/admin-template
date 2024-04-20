import { TypeOf } from 'zod'
import { useEffect } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import { LoadingButton } from '@components/LoadingButton'
import useStore from '@/store'
import { ILoginResponse } from '@api/types/user'
import { API } from '@api/index'
import FormInput from '@components/FormInput'
import { loginSchema } from '@schemas/loginSchema'

export type LoginInput = TypeOf<typeof loginSchema>

const LoginPage = () => {
  const store = useStore()
  const navigate = useNavigate()

  const methods = useForm<LoginInput>( {
    resolver: zodResolver( loginSchema )
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

  const loginUser = async ( data: LoginInput ) => {
    try {
      store.setRequestLoading( true )
      const response = API.post<ILoginResponse>( '/auth/login', data )
      await toast.promise( response, {
        pending: 'Проверка данных. Подождите...',
        success: 'Вы вошли в систему',
        error: 'Отказано в доступе'
      } )
      store.setRequestLoading( false )
      navigate( '/admin/profile' )
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

  const onSubmitHandler: SubmitHandler<LoginInput> = ( values ) => {
    loginUser( values )
  }
  return (
    <section className='mt-auto'>
      <div className='container'>
        <h4>Приветствую! Давайте начнём</h4>
        <h6 className='fw-light'>Войдите, чтобы продолжить.</h6>
        <FormProvider { ...methods }>
          <Form
            className='pt-3'
            onSubmit={ handleSubmit( onSubmitHandler ) }
          >
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

            <div className='mt-3'>
              <LoadingButton loading={ store.requestLoading } bigSize >
                Войти
              </LoadingButton>
            </div>

            <div className='my-2 d-flex justify-content-between align-items-center'>
              <div className='form-check'>
                <label className='form-check-label text-muted'>
                  <input
                    type='checkbox'
                    className='form-check-input'
                  />
                  Не выходить из системы
                </label>
              </div>
              <Link
                to=''
                className='auth-link text-black'
              >
                Забыли пароль?
              </Link>
            </div>
            <div className='text-center mt-4 fw-light'>
              { 'Нет личного кабинета? ' }
              <Link to='/register'>Создать</Link>
            </div>
          </Form>
        </FormProvider>
      </div>
    </section>
  )
}

export default LoginPage
