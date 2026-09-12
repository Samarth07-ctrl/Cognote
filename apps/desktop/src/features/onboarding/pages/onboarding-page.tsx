import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../store/onboarding-store'
import { StepWelcome } from '../steps/step-welcome'
import { StepStoragePermission } from '../steps/step-storage-permission'
import { StepFolderConfirmation } from '../steps/step-folder-confirmation'
import { StepProcessingPreference } from '../steps/step-processing-preference'
import { StepAiLocation } from '../steps/step-ai-location'
import { StepPrivacyConfirmation } from '../steps/step-privacy-confirmation'
import { StepInitialScan } from '../steps/step-initial-scan'

const STEP_COUNT = 7

const stepIndexMap: Record<string, number> = {
  welcome: 1,
  storage_permission: 2,
  folder_confirmation: 3,
  processing_preference: 4,
  ai_location: 5,
  privacy_confirmation: 6,
  initial_scan: 7,
}

export function OnboardingPage() {
  const { currentStep, goNext, goBack } = useOnboardingStore()
  const navigate = useNavigate()

  function handleComplete() {
    navigate('/', { replace: true })
  }

  const stepIndex = stepIndexMap[currentStep] ?? 1
  const showProgress = currentStep !== 'initial_scan' && currentStep !== 'complete'

  return (
    <div className="flex h-full min-h-app items-center justify-center bg-background px-6 py-8">
      <div className="w-full max-w-lg animate-fade-in">
        {showProgress && (
          <div className="mb-8 flex items-center justify-center gap-1.5">
            {Array.from({ length: STEP_COUNT }).map((_, i) => (
              <div
                key={i}
                className={
                  i + 1 === stepIndex
                    ? 'h-1.5 w-6 rounded-full bg-primary transition-all'
                    : i + 1 < stepIndex
                      ? 'h-1.5 w-1.5 rounded-full bg-primary/60'
                      : 'h-1.5 w-1.5 rounded-full bg-muted'
                }
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {currentStep === 'welcome' && <StepWelcome onNext={goNext} />}
        {currentStep === 'sign_in' && <StepWelcome onNext={goNext} />}
        {currentStep === 'storage_permission' && <StepStoragePermission onNext={goNext} onBack={goBack} />}
        {currentStep === 'folder_confirmation' && <StepFolderConfirmation onNext={goNext} onBack={goBack} />}
        {currentStep === 'processing_preference' && <StepProcessingPreference onNext={goNext} onBack={goBack} />}
        {currentStep === 'ai_location' && <StepAiLocation onNext={goNext} onBack={goBack} />}
        {currentStep === 'privacy_confirmation' && <StepPrivacyConfirmation onNext={goNext} onBack={goBack} />}
        {currentStep === 'initial_scan' && <StepInitialScan onComplete={handleComplete} />}
      </div>
    </div>
  )
}
