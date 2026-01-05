import create from 'zustand'
import { persist } from 'zustand/middleware'

export type UiStoreType = {
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  hasCompletedOnboarding: boolean
  completeOnboarding: () => void
}

export const useUiStore = create(
  persist<UiStoreType, [], [], null>(
    (set) => ({
      isSidebarOpen: false,
      openSidebar: () => set(() => ({ isSidebarOpen: true })),
      closeSidebar: () => set(() => ({ isSidebarOpen: false })),
      hasCompletedOnboarding: false,
      completeOnboarding: () => set(() => ({ hasCompletedOnboarding: true }))
    }),
    { name: 'ui-store', version: 3 }
  )
)
