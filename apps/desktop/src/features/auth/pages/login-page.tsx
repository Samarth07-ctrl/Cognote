import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/features/auth/store/auth-store'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  React.useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    const ok = await login(email, password)
    if (ok) navigate('/', { replace: true })
  }

  return (
    <div className="flex h-full min-h-app items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" fill="none" className="size-7 text-white" aria-hidden="true">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Welcome to Cognote
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to access your organization's knowledge
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Work Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail />}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="pointer-events-auto flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={isLoading}>
            Sign In
          </Button>

          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
            Continue with SSO
          </Button>
        </form>

        <p className="text-center text-2xs text-muted-foreground/60">
          Enterprise authentication — contact your IT administrator for access issues.
        </p>
      </div>
    </div>
  )
}
