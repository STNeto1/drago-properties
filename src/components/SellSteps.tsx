'use client'

import { useCreatePropertyStore } from '~/lib/create-property-store'
import { cn } from '~/lib/utils'

const steps = [
  { id: 1, name: 'Details' },
  { id: 2, name: 'Pricing' },
  { id: 3, name: 'Medias' }
] as const

export const SellSteps = () => {
  const currentStep = useCreatePropertyStore((state) => state.step)

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div
              className={cn(
                'group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4',
                {
                  'border-gray-200 hover:border-gray-300 ':
                    step.id !== currentStep,
                  'border-gray-600 hover:border-gray-800':
                    step.id === currentStep
                }
              )}
            >
              <span
                className={cn(
                  'text-xs  font-semibold tracking-wide uppercase ',
                  {
                    'text-gray-500 group-hover:text-gray-700':
                      step.id !== currentStep,
                    'text-gray-600 group-hover:text-gray-800':
                      step.id === currentStep
                  }
                )}
              >
                {step.id}
              </span>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
