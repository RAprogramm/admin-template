import { API } from "@api/index"

const upload = (
  file: File,
  uploadUrl: string,
  onUploadProgress: any
): Promise<any> => {
  let formData = new FormData()
  formData.append( 'file', file )

  const resp = API.post( `/files/${ uploadUrl }`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  } )

  return resp
}

const getImageFn = async ( file_path: string ) => {
  const response = await API.get( `/files/${ file_path }`, { responseType: 'blob' } )
  return response.data
}

const deleteImageFn = async ( file_path: string ) => {
  return API.delete<null>( `/files/${ file_path }` )
}

const FileService = {
  upload,
  getImageFn,
  deleteImageFn
}

export default FileService
