import { create } from 'zustand'
import { CreateProperty } from '~/db/schema'

type StoreState = {
  step: number
  nextStep: () => void
  previousStep: () => void

  data: Partial<CreateProperty>
  setData: (data: Partial<CreateProperty>) => void
}

export const useCreatePropertyStore = create<StoreState>((set, get) => ({
  step: 1,
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  previousStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  data: {},
  setData: (data) => set((state) => ({ data: { ...state.data, ...data } }))
}))
