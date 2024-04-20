export interface IProject {
  _id: string
  id: string
  category: string
  title: string
  description: string
  slug: string
  cover: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  __v: number
}

export interface IProjectResponse {
  status: string
  data: {
    project: IProject
  }
}

export interface IProjectsResponse {
  status: string
  results: number
  total_results: number
  total_pages: number
  projects: IProject[]
}
