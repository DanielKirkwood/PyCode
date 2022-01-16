import React from 'react'

interface Props {
  currentStep: number
  steps: string[]
}

const Stepper = ({ currentStep, steps }: Props) => {
  return (
    <div className={`flex mb-4`}>
      {steps.map((step, i) => {
        return (
          <p
            key={i}
            className={`flex-grow border-b-2 py-2 text-lg px-1 ${
              i + 1 <= currentStep ? 'text-indigo-500 border-indigo-500' : 'border-gray-300'
            }`}
          >
            {step}
          </p>
        )
      })}
    </div>
  )
}

export default Stepper
