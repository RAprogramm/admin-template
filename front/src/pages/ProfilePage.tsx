import { Form } from 'react-bootstrap'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TypeOf } from 'zod'

import FormInput from '@components/FormInput'
import useStore from '@/store'
import { passwordSchema } from '@schemas/passwordSchema'
import { toast } from 'react-toastify'
import { LoadingButton } from '@/components/LoadingButton'
import { changePassFn } from '@/api/services/userService'

export type PasswordInput = TypeOf<typeof passwordSchema>

const ProfilePage = () => {
  const store = useStore()

  const methods = useForm<PasswordInput>( {
    resolver: zodResolver( passwordSchema )
  } )
  const { handleSubmit } = methods

  const updatePassword: SubmitHandler<PasswordInput> = async () => {
    try {
      const formDataValues = methods.getValues()
      const formData = new FormData()

      formData.append( 'old_password', formDataValues.old_password )
      formData.append( 'new_password', formDataValues.new_password )

      await toast.promise( changePassFn(formData), {
        pending: 'Обновление пароля. Подождите...',
        success: 'Пароль обновлен',
        error: 'Ошибка обновления'
      } )
    } catch ( error: any ) {
      const resMessage =
        error.response?.data?.message || error.message || 'An error occurred'
      toast.error( resMessage )
    }
  }

  const user = store.authUser

  return (
    <section>
      <div>
        <div>
          <p>Profile Page</p>
          <div>
            <p>ID: { user?.id }</p>
            <p>Name: { user?.name }</p>
            <p>Email: { user?.email }</p>
            <p>Role: { user?.role }</p>
            { user?.role === 'admin' &&
              <div style={ { border: '1px solid lightgrey', padding: '2rem', borderRadius: '5px', width: '50%' } }>
                <FormProvider { ...methods }>
                  <Form
                    className='pt-2'
                    onSubmit={ handleSubmit( updatePassword ) }
                  >
                    <FormInput
                      label='Старый пароль'
                      name='old_password'
                      type='password'
                    />
                    <FormInput
                      label='Новый пароль'
                      name='new_password'
                      type='password'
                    />
                    <FormInput
                      label='Повторите новый пароль'
                      name='passwordConfirm'
                      type='password'
                    />
                    <div className='mt-3'>
                      <LoadingButton
                        loading={ store.requestLoading }
                        bigSize
                      >
                        Сменить пароль
                      </LoadingButton>
                    </div>
                  </Form>
                </FormProvider>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
