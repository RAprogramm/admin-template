import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { MainStore, useMainStore } from '@store/auth'
import { ArticlesStore, useArticleStore } from '@store/article'
import { ProjectsStore, useProjectStore } from '@store/project'
import { UsersStore, useUserStore } from '@store/user'

const useStore = create<MainStore & ArticlesStore & ProjectsStore & UsersStore>()(
  devtools(
    persist(
      ( ...a ) => ( {
        ...useMainStore( ...a ),
        ...useArticleStore( ...a ),
        ...useProjectStore( ...a ),
        ...useUserStore( ...a ),
      } ),
      { name: 'haddev-admin-store' },
    )
  )
)

export default useStore
