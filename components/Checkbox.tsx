import React from 'react'

interface Props {
  text: string
  value: boolean
  onClick: React.MouseEventHandler<HTMLInputElement>
}

const Checkbox = ({ text, value, onClick }: Props) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={value}
        onClick={onClick}
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
