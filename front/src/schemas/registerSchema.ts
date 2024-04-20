import { object, string } from 'zod'

export const registerSchema = object( {
  name: string().min( 1, 'Введите полное имя' ).max( 100 ),
  email: string()
    .min( 1, 'Введите адрес электронной почты' )
    .email( 'Неверный формат адреса электронной почты' ),
  password: string()
    .min( 1, 'Введите пароль' )
    .min( 8, 'Пароль должен состоять минимум из 8 символов' )
    .max( 32, 'Пароль должен состоять максимум из 32 символов' ),
  passwordConfirm: string().min( 1, 'Повторите пароль' )
} ).refine( ( data ) => data.password === data.passwordConfirm, {
  path: [ 'passwordConfirm' ],
  message: 'Пароли не совпадают'
} )
