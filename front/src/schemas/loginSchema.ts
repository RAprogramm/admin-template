import { object, string } from 'zod'

export const loginSchema = object( {
  email: string()
    .min( 1, 'Введите адрес электронной почты' )
    .email( 'Неверный формат адреса электронной почты' ),
  password: string()
    .min( 1, 'Введите пароль' )
    .min( 8, 'Пароль должен состоять минимум из 8 символов' )
    .max( 32, 'Пароль должен состоять максимум из 32 символов' )
} )
