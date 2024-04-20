export interface IArticle {
  _id: string
  id: string
  author_id: string
  title: string
  content: string
  cover: string
  slug: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  __v: number
}

export interface IArticleResponse {
  status: string
  data: {
    article: IArticle
  }
}

export interface IArticlesResponse {
  status: string
  results: number
  total_results: number
  total_pages: number
  articles: IArticle[]
}
