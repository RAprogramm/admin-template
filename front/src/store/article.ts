import { StateCreator } from 'zustand'

export interface ArticlesStore {
  articlesLimit: number
  setArticlesLimit: ( limit: number ) => void
  paginationCurrentArticlePage: number
  setPaginationCurrentArticlePage: ( page: number ) => void
}

export const useArticleStore: StateCreator<ArticlesStore, [], [], ArticlesStore> = ( set ) => ( {
  articlesLimit: 5,
  setArticlesLimit: ( limit ) => set( { articlesLimit: limit } ),
  paginationCurrentArticlePage: parseInt( localStorage.getItem( 'paginationCurrentArticlePage' ) || '1', 10 ),
  setPaginationCurrentArticlePage: ( page ) => {
    localStorage.setItem( 'paginationCurrentArticlePage', page.toString() )
    set( { paginationCurrentArticlePage: page } )
  },
} )

