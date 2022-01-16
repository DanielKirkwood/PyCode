import React, { ChangeEvent } from 'react'

interface Props {
  text: string
  value: boolean
  handleCheckboxToggle: (e: ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ text, value, handleCheckboxToggle }: Props) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => handleCheckboxToggle(e)}
        id="isVerified"
        className="h-4 w-4 rounded-full checked:bg-blue-600 checked:border-blue-600 focus:outline-none mt-1 float-left mr-2 cursor-pointer"
      />
      <label htmlFor="isVerified" className="inline-block text-gray-800">
        {text}
      </label>
    </div>
  )
}

export default Checkbox
