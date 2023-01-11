import create from 'zustand'
import { persist } from 'zustand/middleware'

export type UiStoreType = {
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
}

export const useUiStore = create(
  persist<UiStoreType, [], [], null>(
    (set) => ({
      isSidebarOpen: false,
      openSidebar: () => set(() => ({ isSidebarOpen: true })),
      closeSidebar: () => set(() => ({ isSidebarOpen: false }))
    }),
    { name: 'ui-store', version: 1 }
  )
)
