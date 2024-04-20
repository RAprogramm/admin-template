import { API } from '@/api'
import { IUserResponse, IUsersResponse } from '@api/types/user'

export const getMyself = async () => {
  const response = await API.get<IUserResponse>( '/users/me' )
  return response.data.data.user
}

export const getUserFn = async ( user_id: string ) => {
  const response = await API.get<IUserResponse>( `users/${ user_id }` )
  return response.data.data.user
}

export const getUsersFn = async ( page: number, limit: number ) => {
  const response = await API.get<IUsersResponse>(
    `users?page=${ page }&limit=${ limit }`
  )
  return {
    users: response.data.users,
    results: response.data.results,
    total_results: response.data.total_results,
    total_pages: response.data.total_pages
  }
}

export const updateUserRoleFn = async ( user_id: string, user_role: string ) => {
  const response = await API.patch<IUserResponse>( `users/${ user_id }`, { role: user_role } )
  return {
    status: response.status,
    // @ts-ignore
    user: response.data.user,
  }
}

export const deleteUserFn = async ( userId: string ) => {
  return API.delete<null>( `users/${ userId }` )
}

export const changePassFn = async ( password: FormData ) => {
  const response = await API.patch<IUserResponse>( `users/pass`, password )
  return {
    status: response.status,
    // @ts-ignore
    user: response.data.user,
  }
}
