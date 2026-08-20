import { create } from 'zustand'

/** App-shell UI state (modals, drawers, etc.) — expand as needed. */
export const useUiStore = create((set) => ({
  isSidebarOpen: false,
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}))
