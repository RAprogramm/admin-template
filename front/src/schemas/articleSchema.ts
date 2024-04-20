import { object, string, array } from 'zod'

export const articleSchema = object( {
  title: string().min( 1, 'Введите название статьи' ),
  cover: string().min( 1, 'Обложка должна быть загружена' ),
  content: string().min( 1, 'Введите содержание статьи' ),
  tags: array( object( { name: string().min( 1, 'Тег не может быть пустым' ) } ) ).min( 2, 'Укажите не менее двух тегов' ),
} )
