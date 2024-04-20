import { object, string } from 'zod'

export const passwordSchema = object( {
  old_password: string().min( 1, 'Введите старый пароль' ),
  new_password: string()
    .min( 1, 'Введите новый пароль' )
    .min( 8, 'Пароль должен состоять минимум из 8 символов' )
    .max( 32, 'Пароль должен состоять максимум из 32 символов' ),
  passwordConfirm: string().min( 1, 'Повторите пароль' )
} ).refine( ( data ) => data.new_password === data.passwordConfirm, {
  path: [ 'passwordConfirm' ],
  message: 'Пароли не совпадают'
} )
