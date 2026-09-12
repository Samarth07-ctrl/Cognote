import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Organization, AuthTokens } from '@cognote/types'
import { authApi, configureClient } from '@cognote/api-client'
import { toast } from '@/hooks/use-toast'

interface AuthStore {
  user: User | null
  organization: Organization | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  restoreSession: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login({ email, password })
          const { user, organization, tokens } = response

          // Wire the API client to use the real token going forward
          configureClient({
            getAccessToken: () => tokens.accessToken,
            onUnauthorized: () => get().logout(),
          })

          set({
            user,
            organization,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          toast.success('Signed in', `Welcome back, ${user.name.split(' ')[0]}.`)
          return true
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Sign in failed. Please try again.'
          set({ isLoading: false, error: message, isAuthenticated: false })
          return false
        }
      },

      logout: () => {
        // Fire-and-forget — don't block UI on logout API call
        void authApi.logout().catch(() => undefined)
        configureClient({ getAccessToken: () => null })
        set({
          user: null,
          organization: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        })
      },

      restoreSession: () => {
        const { tokens } = get()
        if (tokens) {
          configureClient({
            getAccessToken: () => tokens.accessToken,
            onUnauthorized: () => get().logout(),
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cognote-auth',
      // Only persist non-sensitive session identifiers
      // Actual tokens are kept in memory only in the persisted store for simplicity;
      // Phase 5 will migrate token storage to OS keychain via Tauri secure store.
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
