import { create } from 'zustand'

/** App-shell UI state (modals, drawers, etc.) — expand as needed. */
export const useUiStore = create((set) => ({
  isSidebarOpen: false,
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
}))
