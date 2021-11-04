import React from 'react'

interface Props {
  currentStep: number
  steps: string[]
}

const Stepper = ({ currentStep, steps }: Props) => {
  return (
    <div className={`grid gap-4 w-3/4 m-auto grid-cols-${steps.length}`}>
      {steps.map((step, i) => {
        return (
          <div key={i} className={`border-t-4 pt-4 ${i + 1 <= currentStep ? 'border-blue-500' : 'border-gray-200'}`}>
            <p className={`uppercase font-bold ${i + 1 <= currentStep ? 'border-blue-500' : 'text-gray-400'}`}>{`Step ${
              i + 1
            }`}</p>
            <p className="font-semibold">{step}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
