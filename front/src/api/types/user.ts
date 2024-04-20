export interface IUser {
  name: string
  email: string
  role: string
  _id: string
  id: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  __v: number
}

export interface IUserRole {
  id: string
  name: string
  role: string
}

export interface ILoginResponse {
  status: string
  access_token: string
}

export interface IUserResponse {
  status: string
  data: {
    user: IUser
  }
}

export interface IUsersResponse {
  status: string
  results: number
  total_results: number
  total_pages: number
  users: IUser[]
}
