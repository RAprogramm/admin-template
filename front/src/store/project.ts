import { StateCreator } from 'zustand'

export interface ProjectsStore {
  projectsLimit: number
  setProjectsLimit: ( limit: number ) => void
  paginationCurrentProjectPage: number
  setPaginationCurrentProjectPage: ( page: number ) => void
}

export const useProjectStore: StateCreator<ProjectsStore, [], [], ProjectsStore> = ( set ) => ( {
  projectsLimit: 5,
  setProjectsLimit: ( limit ) => set( { projectsLimit: limit } ),
  paginationCurrentProjectPage: parseInt( localStorage.getItem( 'paginationCurrentProjectPage' ) || '1', 10 ),
  setPaginationCurrentProjectPage: ( page ) => {
    localStorage.setItem( 'paginationCurrentProjectPage', page.toString() )
    set( { paginationCurrentProjectPage: page } )
  },
} )

