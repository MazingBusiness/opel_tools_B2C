import { create } from 'zustand'

/** App-shell UI state (modals, drawers, etc.) — expand as needed. */
export const useUiStore = create((set) => ({
  isSidebarOpen: false,
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  isCartOpen: false,
  openCart: () => set({ isCartOpen: true, isWishlistOpen: false }),
  closeCart: () => set({ isCartOpen: false }),

  isWishlistOpen: false,
  openWishlist: () => set({ isWishlistOpen: true, isCartOpen: false }),
  closeWishlist: () => set({ isWishlistOpen: false }),

  isLocationDialogOpen: false,
  openLocationDialog: () => set({ isLocationDialogOpen: true }),
  closeLocationDialog: () => set({ isLocationDialogOpen: false }),
}))
