import { IProjectResponse, IProjectsResponse } from '@api/types/project'
import { API } from '@/api'

export const createProjectFn = async ( project: FormData ) => {
  const response = await API.post<IProjectResponse>( 'projects/', project )
  return response.data
}

export const updateProjectFn = async ( projectId: string, project: FormData ) => {
  const response = await API.patch<IProjectResponse>( `projects/${ projectId }`, project )
  return response.data
}

export const deleteProjectFn = async ( projectId: string ) => {
  return API.delete<null>( `projects/${ projectId }` )
}

export const getSingleProjectFn = async ( projectId: string ) => {
  const response = await API.get<IProjectResponse>(
    `projects/${ projectId }`
  )
  return response.data
}

export const getProjectsFn = async ( page = 1, limit = 10 ) => {
  const response = await API.get<IProjectsResponse>(
    `projects?page=${ page }&limit=${ limit }`
  )
  return {
    projects: response.data.projects,
    results: response.data.results,
    total_results: response.data.total_results,
    total_pages: response.data.total_pages
  }
}

export const searchProjectsByTagsFn = async ( tags: string ) => {
  const response = await API.get<IProjectsResponse>(
    `projects?tags=${ tags }`
  )
  return {
    projects: response.data.projects,
    results: response.data.results,
    total_results: response.data.total_results,
    total_pages: response.data.total_pages
  }
}
