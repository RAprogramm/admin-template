import { StateCreator } from 'zustand'

export interface UsersStore {
  usersLimit: number
  setUsersLimit: ( limit: number ) => void
  paginationCurrentUserPage: number
  setPaginationCurrentUserPage: ( page: number ) => void
}

export const useUserStore: StateCreator<UsersStore, [], [], UsersStore> = ( set ) => ( {
  usersLimit: 5,
  setUsersLimit: ( limit ) => set( { usersLimit: limit } ),
  paginationCurrentUserPage: parseInt( localStorage.getItem( 'paginationCurrentUserPage' ) || '1', 10 ),
  setPaginationCurrentUserPage: ( page ) => {
    localStorage.setItem( 'paginationCurrentUserPage', page.toString() )
    set( { paginationCurrentUserPage: page } )
  },
} )

