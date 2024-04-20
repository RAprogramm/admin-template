import { StateCreator } from 'zustand'

import { IUser } from '@api/types/user'

export interface MainStore {
  authUser: IUser | null
  requestLoading: boolean
  setAuthUser: ( user: IUser | null ) => void
  setRequestLoading: ( isLoading: boolean ) => void
}

export const useMainStore: StateCreator<MainStore, [], [], MainStore> = ( set ) => ( {
  authUser: null,
  requestLoading: false,
  setAuthUser: ( user ) => set( { authUser: user } ),
  setRequestLoading: ( isLoading ) => set( { requestLoading: isLoading } ),
} )
