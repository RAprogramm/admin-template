import { IArticleResponse, IArticlesResponse } from '@api/types/article'
import { API } from '@/api'

export const createArticleFn = async ( article: FormData ) => {
  const response = await API.post<IArticleResponse>( 'articles/', article )
  return response.data
}

export const updateArticleFn = async ( articleId: string, article: FormData ) => {
  const response = await API.patch<IArticleResponse>( `articles/${ articleId }`, article )
  return response.data
}

export const deleteArticleFn = async ( articleId: string ) => {
  return API.delete<null>( `articles/${ articleId }` )
}

export const getSingleArticleFn = async ( articleId: string ) => {
  const response = await API.get<IArticleResponse>(
    `articles/${ articleId }`
  )
  return response.data
}

export const getArticlesFn = async ( page: number, limit: number ) => {
  const response = await API.get<IArticlesResponse>(
    `articles?page=${ page }&limit=${ limit }`
  )
  return {
    articles: response.data.articles,
    results: response.data.results,
    total_results: response.data.total_results,
    total_pages: response.data.total_pages
  }
}

export const searchArticlesByTagsFn = async ( tags: string ) => {
  const response = await API.get<IArticlesResponse>(
    `articles?tags=${ tags }`
  )
  return {
    articles: response.data.articles,
    results: response.data.results,
    total_results: response.data.total_results,
    total_pages: response.data.total_pages
  }
}
