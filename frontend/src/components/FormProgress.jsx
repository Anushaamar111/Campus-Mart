import React from 'react'
import { FiCheck } from 'react-icons/fi'

const FormProgress = ({ steps, currentStep, completedSteps = [] }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = completedSteps.includes(stepNumber)
          const isClickable = stepNumber <= currentStep || isCompleted

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-primary-500 border-primary-500 text-white' 
                        : isClickable
                          ? 'border-gray-300 text-gray-500 hover:border-primary-300'
                          : 'border-gray-200 text-gray-300'
                    }
                  `}
                >
                  {isCompleted ? (
                    <FiCheck size={16} />
                  ) : (
                    stepNumber
                  )}
                </div>
                
                {/* Step Label */}
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-primary-600' : 
                    isCompleted ? 'text-green-600' : 
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-400">{step.description}</p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className={`h-0.5 ${
                    completedSteps.includes(stepNumber + 1) || stepNumber < currentStep
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden mt-4">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormProgress