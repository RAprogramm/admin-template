import { z } from 'zod'
//
// const MAX_FILE_SIZE = 40000000
// const ACCEPTED_IMAGE_TYPES = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp'
// ]
//
// const imageSchema = z
//   .any()
//   .optional()
//   .refine((file) => file?.length === 0, 'Добавьте обложку')
//   .refine(
//     (file) =>
//       file?.length == 1
//         ? ACCEPTED_IMAGE_TYPES.includes(file?.[ 0 ]?.type)
//           ? true
//           : false
//         : true,
//     'Неверный тип файла. Выберите JPEG или PNG изображение'
//   )
//   .refine(
//     (file) =>
//       file?.length == 1
//         ? file[ 0 ]?.size <= MAX_FILE_SIZE
//           ? true
//           : false
//         : true,
//     'Максимальный размер файла 4MB.'
//   )
//
// export default imageSchema

const ACCEPTED_IMAGE_TYPES = [ "image/png", "image/jpg", "image/jpeg", 'image/webp' ]
const MAX_IMAGE_SIZE = 4 //In MegaBytes

const sizeInMB = ( sizeInBytes: number, decimalsNum = 2 ) => {
  const result = sizeInBytes / ( 1024 * 1024 )
  return +result.toFixed( decimalsNum )
}

const imageSchema = z.object( {
  cover: z
    .custom<FileList>()
    .refine( ( files ) => {
      return Array.from( files ?? [] ).length !== 0
    }, "Image is required" )
    .refine( ( files ) => {
      return Array.from( files ?? [] ).every(
        ( file ) => sizeInMB( file.size ) <= MAX_IMAGE_SIZE
      )
    }, `The maximum image size is ${ MAX_IMAGE_SIZE }MB` )
    .refine( ( files ) => {
      return Array.from( files ?? [] ).every( ( file ) =>
        ACCEPTED_IMAGE_TYPES.includes( file.type )
      )
    }, "File type is not supported" ),
} )

export default imageSchema
