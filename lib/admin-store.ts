"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AdminSettings {
  apiKey: string
  organizationName: string
  organizationAddress: string
  organizationPhone: string
  organizationEmail: string
  logoFile: {
    name: string
    url: string
    size: number
  } | null
  defaultDesignTemplate: string
  isConfigured: boolean
}

interface AdminStore extends AdminSettings {
  setApiKey: (apiKey: string) => void
  setOrganizationInfo: (info: {
    name: string
    address: string
    phone: string
    email: string
  }) => void
  setLogoFile: (file: AdminSettings["logoFile"]) => void
  setDefaultDesignTemplate: (template: string) => void
  updateConfiguration: () => void
  reset: () => void
}

const initialState: AdminSettings = {
  apiKey: "",
  organizationName: "",
  organizationAddress: "",
  organizationPhone: "",
  organizationEmail: "",
  logoFile: null,
  defaultDesignTemplate: "modern-business",
  isConfigured: false,
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setApiKey: (apiKey) => {
        set({ apiKey })
        get().updateConfiguration()
      },
      setOrganizationInfo: (info) => {
        set({
          organizationName: info.name,
          organizationAddress: info.address,
          organizationPhone: info.phone,
          organizationEmail: info.email,
        })
        get().updateConfiguration()
      },
      setLogoFile: (logoFile) => {
        set({ logoFile })
        get().updateConfiguration()
      },
      setDefaultDesignTemplate: (defaultDesignTemplate) => {
        set({ defaultDesignTemplate })
        get().updateConfiguration()
      },
      updateConfiguration: () => {
        const state = get()
        const isConfigured = !!(state.apiKey && state.organizationName && state.organizationEmail)
        set({ isConfigured })
      },
      reset: () => set({ ...initialState }),
    }),
    {
      name: "admin-settings",
    },
  ),
)
