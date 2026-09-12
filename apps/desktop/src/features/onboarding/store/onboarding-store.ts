import { create } from 'zustand'
import type { OnboardingStep, ProcessingMode, AIProcessingLocation } from '@cognote/types'

const STEPS: OnboardingStep[] = [
  'welcome',
  'sign_in',
  'storage_permission',
  'folder_confirmation',
  'processing_preference',
  'ai_location',
  'privacy_confirmation',
  'initial_scan',
  'complete',
]

interface SelectedFolder {
  path: string
  displayName: string
}

interface OnboardingStore {
  currentStep: OnboardingStep
  selectedFolders: SelectedFolder[]
  processingMode: ProcessingMode
  aiLocation: AIProcessingLocation

  goNext: () => void
  goBack: () => void
  goTo: (step: OnboardingStep) => void
  addFolder: (folder: SelectedFolder) => void
  removeFolder: (path: string) => void
  setProcessingMode: (mode: ProcessingMode) => void
  setAiLocation: (location: AIProcessingLocation) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingStore>()((set, get) => ({
  currentStep: 'welcome',
  selectedFolders: [],
  processingMode: 'automatic',
  aiLocation: 'company_server',

  goNext: () => {
    const idx = STEPS.indexOf(get().currentStep)
    const next = STEPS[idx + 1]
    if (next) set({ currentStep: next })
  },

  goBack: () => {
    const idx = STEPS.indexOf(get().currentStep)
    const prev = STEPS[idx - 1]
    if (prev) set({ currentStep: prev })
  },

  goTo: (step) => set({ currentStep: step }),

  addFolder: (folder) =>
    set((s) => {
      if (s.selectedFolders.some((f) => f.path === folder.path)) return s
      return { selectedFolders: [...s.selectedFolders, folder] }
    }),

  removeFolder: (path) =>
    set((s) => ({ selectedFolders: s.selectedFolders.filter((f) => f.path !== path) })),

  setProcessingMode: (mode) => set({ processingMode: mode }),
  setAiLocation: (location) => set({ aiLocation: location }),
  reset: () =>
    set({
      currentStep: 'welcome',
      selectedFolders: [],
      processingMode: 'automatic',
      aiLocation: 'company_server',
    }),
}))
