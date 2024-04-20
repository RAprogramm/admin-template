import { object, string, array } from 'zod'

export const projectSchema = object( {
  title: string().min( 1, 'Введите название проекта' ).max( 150 ),
  cover: string().min( 1, 'Обложка должна быть загружена' ),
  description: string().min( 1, 'Введите описание проекта' ),
  category: string().min( 1, 'Введите категорию проекта' ),
  tags: array( object( { name: string().min( 1, 'Тег не может быть пустым' ) } ) ).min( 2, 'Укажите не менее двух тегов' ),
} )
