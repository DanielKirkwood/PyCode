import React from 'react'

interface Props {
  text: string
  value: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ text, value, onChange }: Props) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
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
